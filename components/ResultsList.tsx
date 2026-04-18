import { PlaceResult } from "../lib/types";
import ResultCard from "./ResultCard";

interface ResultsListProps {
  results: PlaceResult[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export default function ResultsList({ results, selectedId, onSelect }: ResultsListProps) {
  if (results.length === 0) {
    return (
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center">
        <p className="text-gray-500">No places found. Try searching for a different dessert or a wider area.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-900 mb-4 px-1">Nearest Places</h2>
      <div className="flex flex-col gap-4">
        {results.map((place) => (
          <ResultCard
            key={place.id}
            place={place}
            isSelected={selectedId === place.id}
            onClick={() => onSelect(place.id)}
          />
        ))}
      </div>
    </div>
  );
}
