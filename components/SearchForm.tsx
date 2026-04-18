"use client";

import { useState } from "react";
import { Search, MapPin, Navigation } from "lucide-react";
import { useMapsLibrary } from "@vis.gl/react-google-maps";

interface SearchFormProps {
  onSearch: (dessert: string, lat: number, lng: number) => void;
  isSearching: boolean;
}

export default function SearchForm({ onSearch, isSearching }: SearchFormProps) {
  const [dessert, setDessert] = useState("");
  const [locationType, setLocationType] = useState<"auto" | "manual">("auto");
  const [manualLocation, setManualLocation] = useState("");
  const [error, setError] = useState("");

  const geocodingLibrary = useMapsLibrary("geocoding");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!dessert.trim()) {
      setError("Please enter a dessert.");
      return;
    }

    if (locationType === "auto") {
      if (!navigator.geolocation) {
        setError("Geolocation is not supported by your browser. Please enter a location manually.");
        setLocationType("manual");
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          onSearch(dessert, position.coords.latitude, position.coords.longitude);
        },
        (err) => {
          console.error("Geolocation error:", err);
          setError("Could not get your location. Please allow location access or enter it manually.");
          setLocationType("manual");
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    } else {
      if (!manualLocation.trim()) {
        setError("Please enter a ZIP code or city/state.");
        return;
      }

      if (!geocodingLibrary) {
        setError("Maps API is still loading, please try again in a moment.");
        return;
      }

      try {
        const geocoder = new geocodingLibrary.Geocoder();
        const response = await geocoder.geocode({
          address: manualLocation,
          componentRestrictions: { country: "US" },
        });

        if (response.results.length > 0) {
          const location = response.results[0].geometry.location;
          onSearch(dessert, location.lat(), location.lng());
        } else {
          setError("Could not find that location. Please try a different ZIP or city.");
        }
      } catch (err) {
        console.error("Geocoding error:", err);
        setError("Error looking up location. Please try again.");
      }
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 max-w-2xl mx-auto w-full">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="dessert" className="block text-sm font-medium text-gray-700 mb-1">
            What dessert are you craving?
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              id="dessert"
              value={dessert}
              onChange={(e) => setDessert(e.target.value)}
              placeholder="e.g. Tiramisu, Cheesecake, Mochi..."
              className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-shadow outline-none text-gray-900"
              disabled={isSearching}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={() => {
                setLocationType("auto");
                setError("");
              }}
              className={`flex-1 py-2 px-4 rounded-xl flex items-center justify-center gap-2 border transition-colors ${
                locationType === "auto"
                  ? "bg-pink-50 border-pink-200 text-pink-700"
                  : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100"
              }`}
            >
              <Navigation className="h-4 w-4" />
              Use My Location
            </button>
            <button
              type="button"
              onClick={() => {
                setLocationType("manual");
                setError("");
              }}
              className={`flex-1 py-2 px-4 rounded-xl flex items-center justify-center gap-2 border transition-colors ${
                locationType === "manual"
                  ? "bg-pink-50 border-pink-200 text-pink-700"
                  : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100"
              }`}
            >
              <MapPin className="h-4 w-4" />
              Enter ZIP / City
            </button>
          </div>
        </div>

        {locationType === "manual" && (
          <div className="animate-in fade-in slide-in-from-top-2 duration-200">
            <input
              type="text"
              value={manualLocation}
              onChange={(e) => setManualLocation(e.target.value)}
              placeholder="e.g. 10001 or New York, NY"
              className="block w-full px-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-shadow outline-none text-gray-900"
              disabled={isSearching}
            />
          </div>
        )}

        {error && <p className="text-red-500 text-sm font-medium animate-in fade-in">{error}</p>}

        <button
          type="submit"
          disabled={isSearching}
          className="w-full bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 px-4 rounded-xl shadow-md transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
        >
          {isSearching ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
              Searching...
            </>
          ) : (
            "Find Dessert"
          )}
        </button>
      </form>
    </div>
  );
}
