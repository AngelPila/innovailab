import { useState } from "react";

import catalog from "../catalogs/catalog.json";
import { buildStopsFromCatalogAndChat, type RouteInput, type Stop } from "../planner/buildStops";
import { resolveStopsWithMapbox } from "../planner/resolveProviders";

export default function StopsPlannerPanel() {
  const [stops, setStops] = useState<Stop[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Por ahora fijo en Guayaquil (luego lo cambiamos por GPS real)
  const userLoc = { lat: -2.1700, lng: -79.8891 };

  // Simulación: esto después vendrá del Chatbot
  const input: RouteInput = {
    tramiteId: "NOTARIA_CERTIFICACION_DOC",
    requirementsStatus: {
      IDENTIFICACION_COMPARECIENTES: "HAS",
      DOCUMENTO_A_CERTIFICAR: "HAS",
      COPIA_COLOR: "UNKNOWN",
      PAGO_TARIFA_NOTARIAL: "MISSING"
    }
  };

  async function handleGenerateList() {
    try {
      setError("");
      setLoading(true);

      // 1) Construir stops desde catalogo + input (chat)
      const result = buildStopsFromCatalogAndChat(catalog as any, input);

      // 2) Reemplazar placeholders por lugares reales (Mapbox)
      const resolved = await resolveStopsWithMapbox(result.stops, userLoc);

      // 3) Guardar para renderizar
      setStops(resolved);
    } catch (e: any) {
      setError(e?.message || "Error generando listado");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 720, margin: "24px auto", padding: 16, border: "1px solid #ddd", borderRadius: 12 }}>
      <h3>Planner de paradas</h3>

      <button
        onClick={handleGenerateList}
        disabled={loading}
        style={{ padding: "10px 14px", borderRadius: 10, cursor: "pointer" }}
      >
        {loading ? "Generando..." : "Generar listado"}
      </button>

      {error && <p style={{ color: "red", marginTop: 12 }}>{error}</p>}

      {stops.length > 0 && (
        <div style={{ marginTop: 18 }}>
          <h4>Lugares a visitar</h4>
          <ol>
            {stops.map((s, i) => (
              <li key={i} style={{ marginBottom: 12 }}>
                <div style={{ fontWeight: 700 }}>{s.name}</div>
                <div style={{ fontSize: 14 }}>{s.address}</div>
                <div style={{ fontSize: 12, opacity: 0.8 }}>{s.reason}</div>
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}
