import { searchNearby, type PlaceResult } from "../services/mapboxSearch";
import type { Stop } from "./buildStops";

// Mapeo: stopCategory -> query
function queryForCategory(category: string): string {
  switch (category) {
    case "pago":
      return "Banco";
    case "copias":
      return "Centro de copias";
    case "notaria":
      return "Notaría";
    case "registro_civil":
      return "Registro Civil";
    case "ant_agencia":
      return "Agencia Nacional de Tránsito";
    case "sri_oficina":
      return "SRI";
    default:
      return category;
  }
}

function stopNeedsResolution(stop: Stop): boolean {
  // si ya tiene coords reales, no buscar
  if (stop.lat != null && stop.lng != null) return false;
  // solo resolvemos stops fisicos o destinos
  return true;
}

export async function resolveStopsWithMapbox(
  stops: Stop[],
  userLoc: { lat: number; lng: number }
): Promise<Stop[]> {
  const resolved: Stop[] = [];

  for (const stop of stops) {
    if (!stopNeedsResolution(stop)) {
      resolved.push(stop);
      continue;
    }

    const q = queryForCategory(stop.category);
    const results: PlaceResult[] = await searchNearby(q, {
      limit: 5,
      proximity: userLoc
    });

    const best = results[0];

    if (!best) {
      // si no hay resultados, deja el stop como estaba
      resolved.push(stop);
      continue;
    }

    resolved.push({
      ...stop,
      name: best.name,
      address: best.address,
      lat: best.lat,
      lng: best.lng
    });
  }

  return resolved;
}
