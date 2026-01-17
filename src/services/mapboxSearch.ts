/* =========================================================
   Servicio Mapbox Search (Guayaquil)
   - Forward Geocoding v6
   - Búsqueda por texto + proximidad
   - Pensado para reemplazar placeholders del planner
   ========================================================= */

/* ---------- Tipos internos de Mapbox ---------- */
type MapboxFeature = {
  geometry?: {
    coordinates?: [number, number]; // [lng, lat]
  };
  properties?: {
    name?: string;
    full_address?: string;
    place_formatted?: string;
  };
};

/* ---------- Tipo que usará tu app ---------- */
export type PlaceResult = {
  name: string;
  address: string;
  lat: number;
  lng: number;
};

/* ---------- Configuración fija ---------- */
// Centro aproximado de Guayaquil (sesgo de búsqueda)
const GUAYAQUIL_CENTER = {
  lat: -2.1700,
  lng: -79.8891
};

// País fijo (Ecuador)
const COUNTRY_CODE = "ec";

// Endpoint oficial Mapbox Geocoding v6
const MAPBOX_FORWARD_URL =
  "https://api.mapbox.com/search/geocode/v6/forward";

/* ---------- Función principal ---------- */
/**
 * Busca lugares cercanos en Guayaquil según un texto.
 *
 * @param query Texto de búsqueda (ej: "Notaría", "Banco", "Centro de copias")
 * @param options Opciones de búsqueda
 * @returns Lista normalizada de lugares
 */
export async function searchNearby(
  query: string,
  options?: {
    limit?: number;
    proximity?: { lat: number; lng: number };
  }
): Promise<PlaceResult[]> {
  const token = import.meta.env.VITE_MAPBOX_TOKEN as string | undefined;

  if (!token) {
    throw new Error("VITE_MAPBOX_TOKEN no está definido en el archivo .env");
  }

  const limit = options?.limit ?? 5;

  // Si no mandan proximity, usa Guayaquil por defecto
  const proximity = options?.proximity ?? GUAYAQUIL_CENTER;

  const url = new URL(MAPBOX_FORWARD_URL);
  url.searchParams.set("q", query);
  url.searchParams.set("access_token", token);
  url.searchParams.set("limit", String(limit));
  url.searchParams.set("proximity", `${proximity.lng},${proximity.lat}`);
  url.searchParams.set("country", COUNTRY_CODE);

  const response = await fetch(url.toString());

  if (!response.ok) {
    throw new Error(`Error Mapbox (${response.status}): ${response.statusText}`);
  }

  const data = await response.json();
  const features: MapboxFeature[] = data?.features ?? [];

  return features
    .map((feature): PlaceResult | null => {
      const coords = feature.geometry?.coordinates;
      if (!coords) return null;

      const [lng, lat] = coords;

      const name = feature.properties?.name?.trim() || "Lugar sin nombre";

      const address =
        feature.properties?.full_address ||
        feature.properties?.place_formatted ||
        "Dirección no disponible";

      return { name, address, lat, lng };
    })
    .filter((place): place is PlaceResult => place !== null);
}
