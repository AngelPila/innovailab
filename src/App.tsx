import Chatbot from "./components/Chatbot";
import "./App.css";


import catalog from "./catalogs/catalog.json";
import { buildStopsFromCatalogAndChat, type RouteInput } from "./planner/buildStops";

function App() {
  const input: RouteInput = {
    tramiteId: "NOTARIA_CERTIFICACION_DOC",
    requirementsStatus: {
      IDENTIFICACION_COMPARECIENTES: "HAS",
      DOCUMENTO_A_CERTIFICAR: "HAS",
      COPIA_COLOR: "UNKNOWN",
      PAGO_TARIFA_NOTARIAL: "MISSING"
    }
  };

  const { tramiteName, stops, checklist } =
    buildStopsFromCatalogAndChat(catalog as any, input);

  return (
    <>
      <Chatbot />

      <div style={{ maxWidth: 720, margin: "32px auto", padding: 16 }}>
        <h2>Planner de trámites (prueba)</h2>
        <h3>{tramiteName}</h3>

        <h4>Lugares a visitar</h4>
        <ol>
          {stops.map((s, i) => (
            <li key={i} style={{ marginBottom: 12 }}>
              <div style={{ fontWeight: 700 }}>{s.name}</div>
              <div>{s.address}</div>
              <div style={{ fontSize: 12, opacity: 0.8 }}>{s.reason}</div>
            </li>
          ))}
        </ol>

        <h4>Checklist</h4>
        <ul>
          {checklist.map((c, i) => (
            <li key={i}>
              {c.name} — <b>{c.status}</b>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default App;
