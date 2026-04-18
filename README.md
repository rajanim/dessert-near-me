# Dessert Near Me

A simple, fast, and polished web application to help you find nearby places that likely serve your favorite desserts.

## What the app does
Dessert Near Me asks for your desired dessert (e.g., "Tiramisu", "Cheesecake") and your location. It then uses the Google Places API (New) to find nearby businesses (bakeries, cafes, dessert shops, etc.) that likely serve it. Results are displayed on an interactive map and a ranked list sorted by distance.

## Stack Used
- Next.js (App Router)
- TypeScript
- Tailwind CSS
- `@vis.gl/react-google-maps` (Google's official React wrapper for Maps)
- Google Maps JavaScript API (Client-side rendering & Geocoding)
- Google Places API (New) (Server-side text search)

## Prerequisites
- Node.js (v18 or newer)
- A Google Cloud Platform (GCP) account with Billing enabled.

## Google Cloud Setup

1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project or select an existing one.
3. Ensure **Billing is enabled** for the project.
4. Go to **APIs & Services > Library** and enable the following APIs:
   - **Maps JavaScript API**
   - **Places API (New)**
   - *(Optional but recommended)* **Geocoding API** (used as a fallback if the user denies Geolocation and types in their ZIP/City).
5. Go to **APIs & Services > Credentials**.
6. Create **two separate API Keys** for security:
   - **Browser Key**: Use this for `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`. Restrict this key to **HTTP Referrers** (your local and production URLs) and limit it to the Maps JavaScript API and Geocoding API.
   - **Server Key**: Use this for `GOOGLE_PLACES_SERVER_API_KEY`. Restrict this key to **IP Addresses** (if known) or leave unrestricted for Vercel, but **strictly limit its API usage** to only the **Places API (New)**.

## Environment Variables
Create a `.env.local` file in the root of the project:

```env
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_browser_key_here
GOOGLE_PLACES_SERVER_API_KEY=your_server_key_here
```

> **Security Note:** Never expose your `GOOGLE_PLACES_SERVER_API_KEY` in the browser or frontend code. It is only meant to be accessed inside Next.js Route Handlers (`app/api/`).

## Local Setup & Running Locally
1. Clone the repository and navigate into the project directory:
   ```bash
   cd dessert-near-me
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up your `.env.local` as described above.
4. Run the development server:
   ```bash
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Vercel Deployment

1. Push your repository to GitHub.
2. Log in to Vercel and import your GitHub project.
3. Before clicking "Deploy", expand the **Environment Variables** section.
4. Add your two keys:
   - Name: `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`, Value: `your_browser_key`
   - Name: `GOOGLE_PLACES_SERVER_API_KEY`, Value: `your_server_key`
5. Click **Deploy**.
6. **Important:** Once deployed, grab your Vercel production domain (e.g., `https://dessert-near-me.vercel.app`) and add it to the allowed HTTP Referrers for your Browser Key in the Google Cloud Console.

## Future Improvements
- **Real-time Availability**: Integrating with inventory APIs to confirm exact dessert availability rather than probability based on place types.
- **Pagination**: Adding a "Load More" button to fetch more than 10 results.
- **Filters**: Allow filtering by minimum rating or "Open Now" specifically.
- **Photos**: Fetching and displaying place photos from the Google Places API.
