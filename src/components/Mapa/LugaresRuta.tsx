import { useState, useEffect } from 'react';
import { MapPin, Navigation, Clock, Building2, ChevronRight, Loader2, ExternalLink } from 'lucide-react';
import { ubicacionesService, type LugarTramite } from '../../services/ubicacionesService';
import { MapaRuta } from './MapaRuta';

interface Props {
  tramiteId: string;
  nombreTramite: string;
}

export function LugaresRuta({ tramiteId, nombreTramite }: Props) {
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
      // Obtener ubicación del usuario
      const ubicacion = await ubicacionesService.obtenerUbicacionActual();
      setUbicacionUsuario(ubicacion);
      
      // Obtener lugares necesarios
      const lugaresNecesarios = await ubicacionesService.obtenerLugaresTramite(tramiteId);
      setLugares(lugaresNecesarios);
      
      // Calcular ruta óptima
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

  if (cargando) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-center gap-3 text-gray-600">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Buscando lugares cercanos a tu ubicación...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6">
        <p className="text-red-700">{error}</p>
        <button
          onClick={cargarLugares}
          className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Reintentar
        </button>
      </div>
    );
  }

  if (lugares.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
        <p className="text-gray-600">No hay lugares específicos para este trámite.</p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Lugares que debes visitar</h3>
              <p className="text-blue-100 text-sm">
                Para completar: {nombreTramite}
              </p>
            </div>
          </div>
        </div>

        {/* Info de ubicación */}
        <div className="bg-blue-50 px-6 py-3 border-b border-blue-100 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-blue-700">
            <Navigation className="w-4 h-4" />
            <span>
              {ubicacionUsuario ? 
                `Basado en tu ubicación actual` : 
                `Ubicación: Quito (por defecto)`
              }
            </span>
          </div>
          <span className="text-sm font-medium text-blue-800">
            {lugaresOptimizados.length} lugares • ~{distanciaTotal.toFixed(1)} km
          </span>
        </div>

        {/* Lista de lugares */}
        <div className="p-6">
          <div className="space-y-4">
            {lugaresOptimizados.map((lugar, index) => (
              <div
                key={lugar.tipo + index}
                className="bg-gray-50 rounded-xl p-4 border border-gray-200 hover:border-blue-300 transition-colors"
              >
                <div className="flex items-start gap-4">
                  {/* Número de orden */}
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg">
                      {index + 1}
                    </div>
                    {index < lugaresOptimizados.length - 1 && (
                      <div className="w-0.5 h-8 bg-blue-200 mt-2"></div>
                    )}
                  </div>

                  {/* Contenido */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                          <Building2 className="w-5 h-5 text-blue-600" />
                          {lugar.nombre}
                        </h4>
                        <p className="text-sm text-gray-600 mt-1">{lugar.descripcion}</p>
                      </div>
                      {lugar.distancia !== undefined && (
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                          {lugar.distancia} km
                        </span>
                      )}
                    </div>

                    {lugar.ubicacionMasCercana && (
                      <div className="mt-3 bg-white rounded-lg p-3 border border-gray-200">
                        <p className="font-medium text-gray-800">
                          📍 {lugar.ubicacionMasCercana.nombre}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          {lugar.ubicacionMasCercana.direccion}, {lugar.ubicacionMasCercana.ciudad}
                        </p>
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                          {lugar.ubicacionMasCercana.horario && (
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {lugar.ubicacionMasCercana.horario}
                            </span>
                          )}
                        </div>
                        
                        {/* Link a Google Maps individual */}
                        <a
                          href={`https://www.google.com/maps/dir/?api=1&destination=${lugar.ubicacionMasCercana.lat},${lugar.ubicacionMasCercana.lng}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-2 inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
                        >
                          <ExternalLink className="w-4 h-4" />
                          Cómo llegar
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Botón para ver mapa */}
          <button
            onClick={() => setMostrarMapa(true)}
            className="mt-6 w-full flex items-center justify-center gap-3 px-6 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-lg transition-all shadow-lg hover:shadow-xl"
          >
            <Navigation className="w-6 h-6 text-white" />
            <span className="text-white">Ver ruta en el mapa</span>
            <ChevronRight className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      {/* Modal del mapa */}
      {mostrarMapa && ubicacionUsuario && (
        <MapaRuta
          lugares={lugaresOptimizados}
          ubicacionUsuario={ubicacionUsuario}
          onClose={() => setMostrarMapa(false)}
        />
      )}
    </>
  );
}
