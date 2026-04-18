export interface Coordinates {
  lat: number;
  lng: number;
}

export interface PlaceResult {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  distanceMiles: number;
  rating?: number;
  openNow?: boolean;
  mapsUrl?: string;
}

export interface SearchResponse {
  query: string;
  userLocation: Coordinates;
  results: PlaceResult[];
}
