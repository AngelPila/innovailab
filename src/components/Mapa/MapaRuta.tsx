import { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Navigation, MapPin, Clock, Phone, X, ExternalLink } from 'lucide-react';
import type { LugarTramite } from '../../services/ubicacionesService';

// Fix para iconos de Leaflet
delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Iconos personalizados
const crearIcono = (color: string, numero?: number) => {
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        background: ${color};
        width: 32px;
        height: 32px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        display: flex;
        align-items: center;
        justify-content: center;
        border: 3px solid white;
        box-shadow: 0 2px 5px rgba(0,0,0,0.3);
      ">
        <span style="
          transform: rotate(45deg);
          color: white;
          font-weight: bold;
          font-size: 12px;
        ">${numero || '📍'}</span>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
};

const iconoUsuario = L.divIcon({
  className: 'user-marker',
  html: `
    <div style="
      background: #3B82F6;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      border: 4px solid white;
      box-shadow: 0 2px 10px rgba(59,130,246,0.5);
      animation: pulse 2s infinite;
    "></div>
    <style>
      @keyframes pulse {
        0% { box-shadow: 0 0 0 0 rgba(59,130,246,0.7); }
        70% { box-shadow: 0 0 0 15px rgba(59,130,246,0); }
        100% { box-shadow: 0 0 0 0 rgba(59,130,246,0); }
      }
    </style>
  `,
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

interface Props {
  lugares: LugarTramite[];
  ubicacionUsuario: { lat: number; lng: number };
  onClose: () => void;
}

// Componente para ajustar la vista del mapa
function FitBounds({ bounds }: { bounds: L.LatLngBounds }) {
  const map = useMap();
  useEffect(() => {
    if (bounds.isValid()) {
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [map, bounds]);
  return null;
}

export function MapaRuta({ lugares, ubicacionUsuario, onClose }: Props) {
  const mapRef = useRef<L.Map | null>(null);
  const [rutaLinea, setRutaLinea] = useState<[number, number][]>([]);

  useEffect(() => {
    // Crear línea de ruta
    const puntos: [number, number][] = [[ubicacionUsuario.lat, ubicacionUsuario.lng]];
    
    for (const lugar of lugares) {
      if (lugar.ubicacionMasCercana) {
        puntos.push([lugar.ubicacionMasCercana.lat, lugar.ubicacionMasCercana.lng]);
      }
    }
    
    setRutaLinea(puntos);
  }, [lugares, ubicacionUsuario]);

  // Calcular bounds para ajustar la vista
  const bounds = L.latLngBounds([
    [ubicacionUsuario.lat, ubicacionUsuario.lng],
    ...lugares
      .filter(l => l.ubicacionMasCercana)
      .map(l => [l.ubicacionMasCercana!.lat, l.ubicacionMasCercana!.lng] as [number, number])
  ]);

  const colores = ['#EF4444', '#F97316', '#EAB308', '#22C55E', '#3B82F6', '#8B5CF6'];
  
  const distanciaTotal = lugares.reduce((sum, l) => sum + (l.distancia || 0), 0);

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl h-[85vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Navigation className="w-6 h-6 text-white" />
            <div>
              <h2 className="text-xl font-bold text-white">Ruta de tu Trámite</h2>
              <p className="text-blue-100 text-sm">
                {lugares.length} lugares • ~{distanciaTotal.toFixed(1)} km total
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Contenido */}
        <div className="flex-1 flex">
          {/* Lista de lugares */}
          <div className="w-80 bg-gray-50 border-r overflow-y-auto">
            <div className="p-4">
              <h3 className="font-semibold text-gray-800 mb-3">Orden de visita:</h3>
              <div className="space-y-3">
                {lugares.map((lugar, index) => (
                  <div
                    key={lugar.tipo + index}
                    className="bg-white rounded-lg p-3 border shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                        style={{ background: colores[index % colores.length] }}
                      >
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 text-sm">{lugar.nombre}</h4>
                        {lugar.ubicacionMasCercana && (
                          <>
                            <p className="text-xs text-gray-600 mt-1">
                              {lugar.ubicacionMasCercana.nombre}
                            </p>
                            <p className="text-xs text-gray-500">
                              {lugar.ubicacionMasCercana.direccion}
                            </p>
                            <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                              {lugar.ubicacionMasCercana.horario && (
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {lugar.ubicacionMasCercana.horario}
                                </span>
                              )}
                            </div>
                            <div className="mt-2 flex items-center justify-between">
                              <span className="text-xs font-medium text-blue-600">
                                📍 {lugar.distancia} km
                              </span>
                              <a
                                href={`https://www.google.com/maps/dir/?api=1&destination=${lugar.ubicacionMasCercana.lat},${lugar.ubicacionMasCercana.lng}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800"
                              >
                                <ExternalLink className="w-3 h-3" />
                                Google Maps
                              </a>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Mapa */}
          <div className="flex-1 relative">
            <MapContainer
              center={[ubicacionUsuario.lat, ubicacionUsuario.lng]}
              zoom={13}
              className="h-full w-full"
              ref={mapRef}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              
              <FitBounds bounds={bounds} />

              {/* Línea de ruta */}
              {rutaLinea.length > 1 && (
                <Polyline
                  positions={rutaLinea}
                  color="#3B82F6"
                  weight={4}
                  opacity={0.7}
                  dashArray="10, 10"
                />
              )}

              {/* Marcador del usuario */}
              <Marker position={[ubicacionUsuario.lat, ubicacionUsuario.lng]} icon={iconoUsuario}>
                <Popup>
                  <div className="text-center">
                    <strong>📍 Tu ubicación</strong>
                  </div>
                </Popup>
              </Marker>

              {/* Marcadores de lugares */}
              {lugares.map((lugar, index) => {
                if (!lugar.ubicacionMasCercana) return null;
                return (
                  <Marker
                    key={lugar.tipo + index}
                    position={[lugar.ubicacionMasCercana.lat, lugar.ubicacionMasCercana.lng]}
                    icon={crearIcono(colores[index % colores.length], index + 1)}
                  >
                    <Popup>
                      <div className="min-w-[200px]">
                        <div className="flex items-center gap-2 mb-2">
                          <span
                            className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold"
                            style={{ background: colores[index % colores.length] }}
                          >
                            {index + 1}
                          </span>
                          <strong>{lugar.nombre}</strong>
                        </div>
                        <p className="text-sm font-medium">{lugar.ubicacionMasCercana.nombre}</p>
                        <p className="text-xs text-gray-600">{lugar.ubicacionMasCercana.direccion}</p>
                        {lugar.ubicacionMasCercana.horario && (
                          <p className="text-xs text-gray-500 mt-1">
                            🕐 {lugar.ubicacionMasCercana.horario}
                          </p>
                        )}
                        {lugar.ubicacionMasCercana.telefono && (
                          <p className="text-xs text-gray-500">
                            📞 {lugar.ubicacionMasCercana.telefono}
                          </p>
                        )}
                        <a
                          href={`https://www.google.com/maps/dir/?api=1&destination=${lugar.ubicacionMasCercana.lat},${lugar.ubicacionMasCercana.lng}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-2 inline-block text-xs text-blue-600 hover:underline"
                        >
                          Abrir en Google Maps →
                        </a>
                      </div>
                    </Popup>
                  </Marker>
                );
              })}
            </MapContainer>
          </div>
        </div>

        {/* Footer con leyenda */}
        <div className="bg-gray-100 px-6 py-3 flex items-center justify-between text-sm">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-full bg-blue-500 animate-pulse"></span>
              Tu ubicación
            </span>
            <span className="flex items-center gap-1">
              <span className="w-4 h-1 bg-blue-500 rounded"></span>
              Ruta sugerida
            </span>
          </div>
          <p className="text-gray-500">
            💡 Haz clic en los marcadores para más información
          </p>
        </div>
      </div>
    </div>
  );
}
