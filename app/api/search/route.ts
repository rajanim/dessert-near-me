import { NextRequest, NextResponse } from "next/server";
import { calculateDistanceMiles } from "../../../lib/distance";
import { PlaceResult, SearchResponse } from "../../../lib/types";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const dessert = searchParams.get("dessert");
  const latStr = searchParams.get("lat");
  const lngStr = searchParams.get("lng");

  if (!dessert || !latStr || !lngStr) {
    return NextResponse.json(
      { error: "Missing required parameters: dessert, lat, lng" },
      { status: 400 }
    );
  }

  const lat = parseFloat(latStr);
  const lng = parseFloat(lngStr);

  if (isNaN(lat) || isNaN(lng)) {
    return NextResponse.json(
      { error: "Invalid coordinates" },
      { status: 400 }
    );
  }

  const apiKey = process.env.GOOGLE_PLACES_SERVER_API_KEY;
  if (!apiKey || apiKey === "replace_me") {
    console.error("Missing GOOGLE_PLACES_SERVER_API_KEY");
    return NextResponse.json(
      { error: "Server configuration error." },
      { status: 500 }
    );
  }

  try {
    const textQuery = `${dessert} near me`;
    
    const requestBody = {
      textQuery,
      locationBias: {
        circle: {
          center: {
            latitude: lat,
            longitude: lng,
          },
          radius: 10000.0, // 10km bias
        },
      },
      languageCode: "en",
      maxResultCount: 10,
    };

    const fields = [
      "places.id",
      "places.displayName",
      "places.formattedAddress",
      "places.location",
      "places.rating",
      "places.currentOpeningHours.openNow",
      "places.googleMapsUri",
    ].join(",");

    const response = await fetch(
      "https://places.googleapis.com/v1/places:searchText",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": apiKey,
          "X-Goog-FieldMask": fields,
        },
        body: JSON.stringify(requestBody),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Places API Error:", response.status, errorText);
      return NextResponse.json(
        { error: "Failed to fetch places" },
        { status: 502 }
      );
    }

    const data = await response.json();
    const places = data.places || [];

    // Normalize response and calculate distances
    const normalizedResults: PlaceResult[] = places.map((place: any) => {
      const placeLat = place.location?.latitude || 0;
      const placeLng = place.location?.longitude || 0;
      const distanceMiles = calculateDistanceMiles(lat, lng, placeLat, placeLng);

      return {
        id: place.id,
        name: place.displayName?.text || "Unknown Place",
        address: place.formattedAddress || "",
        lat: placeLat,
        lng: placeLng,
        distanceMiles,
        rating: place.rating,
        openNow: place.currentOpeningHours?.openNow,
        mapsUrl: place.googleMapsUri,
      };
    });

    // Sort by distance nearest first
    normalizedResults.sort((a, b) => a.distanceMiles - b.distanceMiles);

    const result: SearchResponse = {
      query: dessert,
      userLocation: { lat, lng },
      results: normalizedResults,
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error in search endpoint:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
