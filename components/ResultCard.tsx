import { PlaceResult } from "../lib/types";
import { Star, Navigation2, Clock } from "lucide-react";

interface ResultCardProps {
  place: PlaceResult;
  onClick: () => void;
  isSelected?: boolean;
}

export default function ResultCard({ place, onClick, isSelected }: ResultCardProps) {
  return (
    <div
      onClick={onClick}
      className={`p-4 rounded-xl cursor-pointer transition-all border ${
        isSelected
          ? "bg-pink-50 border-pink-300 shadow-md ring-1 ring-pink-300"
          : "bg-white border-gray-100 shadow-sm hover:shadow-md hover:border-pink-200"
      }`}
    >
      <div className="flex justify-between items-start gap-2">
        <div>
          <h3 className="font-bold text-lg text-gray-900 leading-tight">{place.name}</h3>
          <p className="text-sm text-gray-500 mt-1 line-clamp-2">{place.address}</p>
        </div>
        <div className="flex flex-col items-end shrink-0">
          <span className="font-semibold text-pink-600 bg-pink-100 px-2 py-1 rounded-lg text-sm">
            {place.distanceMiles} mi
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4 mt-3 text-sm">
        {place.rating !== undefined && (
          <div className="flex items-center gap-1 text-amber-500 font-medium">
            <Star className="h-4 w-4 fill-current" />
            <span>{place.rating}</span>
          </div>
        )}
        
        {place.openNow !== undefined && (
          <div className={`flex items-center gap-1 ${place.openNow ? "text-emerald-600" : "text-red-500"}`}>
            <Clock className="h-4 w-4" />
            <span className="font-medium">{place.openNow ? "Open Now" : "Closed"}</span>
          </div>
        )}
      </div>

      {place.mapsUrl && (
        <a
          href={place.mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="mt-4 flex items-center justify-center gap-2 w-full py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg font-medium transition-colors text-sm border border-gray-200"
        >
          <Navigation2 className="h-4 w-4" />
          Directions
        </a>
      )}
    </div>
  );
}
