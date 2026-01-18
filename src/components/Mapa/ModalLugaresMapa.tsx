import { useState, useEffect } from 'react';
import { X, MapPin, Navigation, Clock, Building2, Loader2, ExternalLink, ChevronRight } from 'lucide-react';
import { ubicacionesService, type LugarTramite } from '../../services/ubicacionesService';
import { MapaRuta } from './MapaRuta';

interface Props {
  tramiteId: string;
  nombreTramite: string;
  onClose: () => void;
}

export function ModalLugaresMapa({ tramiteId, nombreTramite, onClose }: Props) {
  const [lugares, setLugares] = useState<LugarTramite[]>([]);
  const [lugaresOptimizados, setLugaresOptimizados] = useState<LugarTramite[]>([]);
  const [ubicacionUsuario, setUbicacionUsuario] = useState<{ lat: number; lng: number } | null>(null);
  const [cargando, setCargando] = useState(true);
  const [mostrarMapa, setMostrarMapa] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    cargarLugares();
  }, [tramiteId]);

  const cargarLugares = async () => {
    setCargando(true);
    setError(null);
    
    try {
      const ubicacion = await ubicacionesService.obtenerUbicacionActual();
      setUbicacionUsuario(ubicacion);
      
      const lugaresNecesarios = await ubicacionesService.obtenerLugaresTramite(tramiteId);
      setLugares(lugaresNecesarios);
      
      const rutaOptima = ubicacionesService.calcularRutaOptima(lugaresNecesarios, ubicacion);
      setLugaresOptimizados(rutaOptima);
      
    } catch (err) {
      console.error('Error cargando lugares:', err);
      setError('No pudimos cargar los lugares. Intenta de nuevo.');
    } finally {
      setCargando(false);
    }
  };

  const distanciaTotal = lugaresOptimizados.reduce((sum, l) => sum + (l.distancia || 0), 0);

  // Si se está mostrando el mapa completo
  if (mostrarMapa && ubicacionUsuario) {
    return (
      <MapaRuta
        lugares={lugaresOptimizados}
        ubicacionUsuario={ubicacionUsuario}
        onClose={() => setMostrarMapa(false)}
      />
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden animate-fadeInUp">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-5 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Lugares para tu trámite</h2>
                <p className="text-blue-100 text-sm">{nombreTramite}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Contenido */}
        <div className="flex-1 overflow-y-auto p-6">
          {cargando ? (
            <div className="flex items-center justify-center gap-3 py-12 text-gray-600">
              <Loader2 className="w-6 h-6 animate-spin" />
              <span>Buscando lugares cercanos a tu ubicación...</span>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={cargarLugares}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Reintentar
              </button>
            </div>
          ) : lugaresOptimizados.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <MapPin className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>No hay lugares específicos para este trámite.</p>
            </div>
          ) : (
            <>
              {/* Info de ubicación */}
              <div className="bg-blue-50 rounded-lg px-4 py-3 mb-6 flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-blue-700">
                  <Navigation className="w-4 h-4" />
                  <span>Lugares más cercanos a tu ubicación</span>
                </div>
                <span className="text-sm font-medium text-blue-800">
                  {lugaresOptimizados.length} lugares • ~{distanciaTotal.toFixed(1)} km
                </span>
              </div>

              {/* Lista de lugares */}
              <div className="space-y-4">
                {lugaresOptimizados.map((lugar, index) => (
                  <div
                    key={lugar.tipo + index}
                    className="bg-gray-50 rounded-xl p-4 border border-gray-200"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg flex-shrink-0">
                        {index + 1}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h4 className="font-bold text-gray-900 flex items-center gap-2">
                              <Building2 className="w-4 h-4 text-blue-600" />
                              {lugar.nombre}
                            </h4>
                            <p className="text-sm text-gray-600">{lugar.descripcion}</p>
                          </div>
                          {lugar.distancia !== undefined && (
                            <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium whitespace-nowrap">
                              {lugar.distancia} km
                            </span>
                          )}
                        </div>

                        {lugar.ubicacionMasCercana && (
                          <div className="mt-3 bg-white rounded-lg p-3 border border-gray-200">
                            <p className="font-medium text-gray-800 text-sm">
                              📍 {lugar.ubicacionMasCercana.nombre}
                            </p>
                            <p className="text-xs text-gray-600 mt-1">
                              {lugar.ubicacionMasCercana.direccion}, {lugar.ubicacionMasCercana.ciudad}
                            </p>
                            {lugar.ubicacionMasCercana.horario && (
                              <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {lugar.ubicacionMasCercana.horario}
                              </p>
                            )}
                            <a
                              href={`https://www.google.com/maps/dir/?api=1&destination=${lugar.ubicacionMasCercana.lat},${lugar.ubicacionMasCercana.lng}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="mt-2 inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800"
                            >
                              <ExternalLink className="w-3 h-3" />
                              Cómo llegar
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Footer con botón de mapa */}
        {!cargando && !error && lugaresOptimizados.length > 0 && (
          <div className="flex-shrink-0 p-4 bg-gray-50 border-t">
            <button
              onClick={() => setMostrarMapa(true)}
              className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl"
            >
              <Navigation className="w-5 h-5" />
              Ver ruta completa en el mapa
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
