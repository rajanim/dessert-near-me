"use client";

import { useEffect, useState } from "react";
import { Map, AdvancedMarker, Pin, InfoWindow, useMap } from "@vis.gl/react-google-maps";
import { Coordinates, PlaceResult } from "../lib/types";

interface MapViewProps {
  userLocation: Coordinates | null;
  results: PlaceResult[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

// A helper component to manage map bounds
function MapBoundsUpdater({ userLocation, results }: { userLocation: Coordinates | null; results: PlaceResult[] }) {
  const map = useMap();

  useEffect(() => {
    if (!map || (!userLocation && results.length === 0)) return;

    const bounds = new window.google.maps.LatLngBounds();
    
    if (userLocation) {
      bounds.extend(new window.google.maps.LatLng(userLocation.lat, userLocation.lng));
    }
    
    results.forEach((place) => {
      bounds.extend(new window.google.maps.LatLng(place.lat, place.lng));
    });

    map.fitBounds(bounds, { top: 40, right: 40, bottom: 40, left: 40 });
  }, [map, userLocation, results]);

  return null;
}

export default function MapView({ userLocation, results, selectedId, onSelect }: MapViewProps) {
  const [infoWindowOpen, setInfoWindowOpen] = useState(false);

  // When selectedId changes, make sure we show the info window for it
  useEffect(() => {
    if (selectedId) {
      setInfoWindowOpen(true);
    } else {
      setInfoWindowOpen(false);
    }
  }, [selectedId]);

  const selectedPlace = results.find((p) => p.id === selectedId);

  // Default center if no location is available (center of US)
  const defaultCenter = { lat: 39.8283, lng: -98.5795 };
  const center = userLocation || defaultCenter;
  const zoom = userLocation && results.length === 0 ? 12 : 4;

  return (
    <div className="w-full h-full min-h-[400px] rounded-2xl overflow-hidden shadow-md border border-gray-200">
      <Map
        defaultCenter={center}
        defaultZoom={zoom}
        mapId="DEMO_MAP_ID"
        disableDefaultUI={true}
        zoomControl={true}
        fullscreenControl={true}
      >
        <MapBoundsUpdater userLocation={userLocation} results={results} />

        {/* User Location Marker */}
        {userLocation && (
          <AdvancedMarker position={userLocation} zIndex={1}>
            <div className="h-4 w-4 bg-blue-500 rounded-full border-2 border-white shadow-md ring-2 ring-blue-500/20" />
          </AdvancedMarker>
        )}

        {/* Result Markers */}
        {results.map((place) => (
          <AdvancedMarker
            key={place.id}
            position={{ lat: place.lat, lng: place.lng }}
            onClick={() => onSelect(place.id)}
            zIndex={selectedId === place.id ? 10 : 2}
          >
            <Pin
              background={selectedId === place.id ? "#db2777" : "#fbcfe8"}
              borderColor={selectedId === place.id ? "#9d174d" : "#db2777"}
              glyphColor={selectedId === place.id ? "#fff" : "#db2777"}
            />
          </AdvancedMarker>
        ))}

        {/* Info Window for Selected Place */}
        {infoWindowOpen && selectedPlace && (
          <InfoWindow
            position={{ lat: selectedPlace.lat, lng: selectedPlace.lng }}
            onCloseClick={() => {
              setInfoWindowOpen(false);
              onSelect(""); // Clear selection
            }}
            pixelOffset={[0, -30]}
          >
            <div className="p-1 max-w-[200px]">
              <h3 className="font-bold text-sm text-gray-900">{selectedPlace.name}</h3>
              <p className="text-xs text-gray-600 mt-1">{selectedPlace.address}</p>
              {selectedPlace.mapsUrl && (
                <a
                  href={selectedPlace.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-pink-600 text-xs font-medium mt-2 inline-block hover:underline"
                >
                  Get Directions →
                </a>
              )}
            </div>
          </InfoWindow>
        )}
      </Map>
    </div>
  );
}
