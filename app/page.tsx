"use client";

import { useState } from "react";
import { APIProvider } from "@vis.gl/react-google-maps";
import { IceCream } from "lucide-react";
import SearchForm from "../components/SearchForm";
import MapView from "../components/MapView";
import ResultsList from "../components/ResultsList";
import { Coordinates, PlaceResult, SearchResponse } from "../lib/types";

export default function Home() {
  const [results, setResults] = useState<PlaceResult[]>([]);
  const [userLocation, setUserLocation] = useState<Coordinates | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  // We read the Maps key from the environment.
  // It's available on the client because of the NEXT_PUBLIC_ prefix.
  const mapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";

  const handleSearch = async (dessert: string, lat: number, lng: number) => {
    setIsSearching(true);
    setUserLocation({ lat, lng });
    setSelectedId(null);

    try {
      const response = await fetch(
        `/api/search?dessert=${encodeURIComponent(dessert)}&lat=${lat}&lng=${lng}`
      );
      
      if (!response.ok) {
        throw new Error("Search failed");
      }
      
      const data: SearchResponse = await response.json();
      setResults(data.results);
      setHasSearched(true);
    } catch (error) {
      console.error("Error fetching places:", error);
      // In a real app we'd show a toast here, but we keep it simple for MVP
      alert("Something went wrong while searching. Please try again.");
    } finally {
      setIsSearching(false);
    }
  };

  return (
    // Wrap the app in APIProvider so the Map and Geocoder have access to the Maps API
    <APIProvider apiKey={mapsApiKey} libraries={["geocoding", "places"]}>
      <div className="min-h-screen bg-[#fafafa] text-gray-900 font-sans selection:bg-pink-200">
        
        {/* Header section */}
        <header className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex items-center justify-center sm:justify-start gap-2">
            <div className="bg-pink-100 p-2 rounded-xl text-pink-600">
              <IceCream className="h-6 w-6" />
            </div>
            <h1 className="text-2xl font-black tracking-tight text-gray-900">
              Dessert Near Me
            </h1>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          
          {/* Hero / Search Section */}
          <section className="text-center space-y-6 pt-4 pb-2">
            <div className="space-y-2">
              <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-gray-900">
                Craving something sweet?
              </h2>
              <p className="text-lg text-gray-500 max-w-2xl mx-auto">
                Type a dessert and find nearby places that likely have it. We search local bakeries, cafes, and shops.
              </p>
            </div>
            
            <SearchForm onSearch={handleSearch} isSearching={isSearching} />
          </section>

          {/* Results Section */}
          {hasSearched && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              
              {/* Map Column (takes 2 cols on lg) */}
              <div className="lg:col-span-2 order-1 lg:order-2">
                <div className="sticky top-24">
                  <div className="h-[400px] lg:h-[calc(100vh-160px)] w-full rounded-2xl shadow-lg border border-gray-200 overflow-hidden bg-gray-50">
                    <MapView
                      userLocation={userLocation}
                      results={results}
                      selectedId={selectedId}
                      onSelect={setSelectedId}
                    />
                  </div>
                </div>
              </div>

              {/* List Column (takes 1 col on lg) */}
              <div className="lg:col-span-1 order-2 lg:order-1">
                <p className="text-sm text-gray-500 bg-gray-100 p-3 rounded-lg mb-4 text-center">
                  Results show places likely to have this dessert based on related categories.
                </p>
                <ResultsList
                  results={results}
                  selectedId={selectedId}
                  onSelect={setSelectedId}
                />
              </div>

            </div>
          )}

        </main>

        {/* Footer section */}
        <footer className="bg-white border-t border-gray-100 py-8 mt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center gap-2">
            <h3 className="text-lg font-bold text-gray-900">About Me</h3>
            <p className="text-gray-600 font-medium">Rajani Maski</p>
            <p className="text-gray-500 text-sm">Passionate AI engineer</p>
            <a 
              href="https://www.linkedin.com/in/rajanimaski" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-pink-600 hover:text-pink-700 font-medium mt-2 transition-colors"
            >
              Connect on LinkedIn
            </a>
          </div>
        </footer>
      </div>
    </APIProvider>
  );
}
