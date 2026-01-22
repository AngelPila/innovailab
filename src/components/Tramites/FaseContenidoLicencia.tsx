import { useState } from 'react';
import { useTramiteStore } from '../../store/tramiteStore';
import { tramitesService } from '../../services/tramitesService';
import { ChevronRight, Info } from 'lucide-react';

interface Props {
  onCompletar: () => void;
}

export function FaseContenidoLicencia({ onCompletar }: Props) {
  const [paso, setPaso] = useState<1 | 2 | 3>(1);
  const [tipoLicencia, setTipoLicencia] = useState<string>('b');
  const [esRenovacion, setEsRenovacion] = useState(false);
  const [esProfesional, setEsProfesional] = useState(false);
  const [completando, setCompletando] = useState(false);

  const { setSegmentacion } = useTramiteStore();

  const handleCompletar = async () => {
    setCompletando(true);

    // Guardar segmentación
    setSegmentacion({
      esTramiteUrgente: false,
    });

    // Generar requisitos dinámicos basados en la información
    const requisitosDinamicos = tramitesService.getRequisitosDinamicosLicencia(
      tipoLicencia,
      esRenovacion,
      esProfesional
    );

    console.log('Requisitos generados:', requisitosDinamicos);

    // Simular procesamiento
    setTimeout(() => {
      setCompletando(false);
      onCompletar();
    }, 600);
  };

  const getTipoLicenciaLabel = () => {
    const tipos: Record<string, string> = {
      a: 'Tipo A - Motocicleta',
      b: 'Tipo B - Vehículo Particular',
      c: 'Tipo C - Transporte de carga',
      d: 'Tipo D - Transporte pesado',
      e: 'Tipo E - Transporte de pasajeros',
    };
    return tipos[tipoLicencia] || 'Seleccionar tipo';
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Paso 1: Tipo de Licencia */}
      {paso === 1 && (
        <>
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">¿Qué tipo de licencia necesitas?</h3>
            <p className="text-gray-600">Selecciona el tipo de vehículo que conducirás</p>
          </div>

          <div className="space-y-3">
            {[
              { id: 'a', label: '🏍️ Tipo A', desc: 'Motocicleta' },
              { id: 'b', label: '🚗 Tipo B', desc: 'Vehículos particulares (autos, camionetas)' },
              { id: 'c', label: '🚚 Tipo C', desc: 'Transporte de carga liviana' },
              { id: 'd', label: '🚛 Tipo D', desc: 'Transporte pesado' },
              { id: 'e', label: '🚌 Tipo E', desc: 'Transporte de pasajeros' },
            ].map((tipo) => (
              <button
                key={tipo.id}
                onClick={() => setTipoLicencia(tipo.id)}
                className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                  tipoLicencia === tipo.id
                    ? 'border-yellow-400 bg-yellow-50'
                    : 'border-gray-200 bg-white hover:border-yellow-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-gray-900">{tipo.label}</h4>
                    <p className="text-sm text-gray-600">{tipo.desc}</p>
                  </div>
                  <ChevronRight
                    className={`w-5 h-5 transition-all ${
                      tipoLicencia === tipo.id ? 'text-yellow-500' : 'text-gray-400'
                    }`}
                  />
                </div>
              </button>
            ))}
          </div>

          <button
            onClick={() => setPaso(2)}
            className="w-full bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 text-white font-bold py-3 px-6 rounded-lg transition-all"
          >
            Siguiente
          </button>
        </>
      )}

      {/* Paso 2: ¿Renovación o Primera Vez? */}
      {paso === 2 && (
        <>
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">¿Es tu primera licencia?</h3>
            <p className="text-gray-600">Esto nos ayuda a personalizar los requisitos</p>
          </div>

          <div className="space-y-3">
            {[
              {
                id: 'primera',
                label: '🆕 Primera Licencia',
                desc: 'Quiero sacar mi primer licencia',
                valor: false,
              },
              {
                id: 'renovacion',
                label: '🔄 Renovación',
                desc: 'Voy a renovar una licencia existente',
                valor: true,
              },
            ].map((opcion) => (
              <button
                key={opcion.id}
                onClick={() => setEsRenovacion(opcion.valor)}
                className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                  esRenovacion === opcion.valor
                    ? 'border-yellow-400 bg-yellow-50'
                    : 'border-gray-200 bg-white hover:border-yellow-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-gray-900">{opcion.label}</h4>
                    <p className="text-sm text-gray-600">{opcion.desc}</p>
                  </div>
                  <ChevronRight
                    className={`w-5 h-5 transition-all ${
                      esRenovacion === opcion.valor ? 'text-yellow-500' : 'text-gray-400'
                    }`}
                  />
                </div>
              </button>
            ))}
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setPaso(1)}
              className="flex-1 px-4 py-3 text-gray-700 font-medium hover:bg-gray-100 rounded-lg transition-colors"
            >
              Atrás
            </button>
            <button
              onClick={() => setPaso(3)}
              className="flex-1 bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 text-white font-bold py-3 px-6 rounded-lg transition-all"
            >
              Siguiente
            </button>
          </div>
        </>
      )}

      {/* Paso 3: ¿Uso Profesional? */}
      {paso === 3 && (
        <>
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">¿Usarás el vehículo profesionalmente?</h3>
            <p className="text-gray-600">
              {esProfesional
                ? 'Como taxi, transporte o distribución'
                : 'Solo para uso particular'}
            </p>
          </div>

          <div className="space-y-3">
            {[
              {
                id: 'particular',
                label: '🏠 Uso Particular',
                desc: 'Solo para mi uso personal',
                valor: false,
              },
              {
                id: 'profesional',
                label: '💼 Uso Profesional',
                desc: 'Para trabajo, taxi, transporte o distribución',
                valor: true,
              },
            ].map((opcion) => (
              <button
                key={opcion.id}
                onClick={() => setEsProfesional(opcion.valor)}
                className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                  esProfesional === opcion.valor
                    ? 'border-yellow-400 bg-yellow-50'
                    : 'border-gray-200 bg-white hover:border-yellow-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-gray-900">{opcion.label}</h4>
                    <p className="text-sm text-gray-600">{opcion.desc}</p>
                  </div>
                  <ChevronRight
                    className={`w-5 h-5 transition-all ${
                      esProfesional === opcion.valor ? 'text-yellow-500' : 'text-gray-400'
                    }`}
                  />
                </div>
              </button>
            ))}
          </div>

          {/* Resumen */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
            <div className="flex gap-2">
              <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-gray-700">
                <p className="font-bold mb-1">Resumen de tu información:</p>
                <p>• {getTipoLicenciaLabel()}</p>
                <p>• {esRenovacion ? 'Renovación' : 'Primera vez'}</p>
                <p>• Uso {esProfesional ? 'Profesional' : 'Particular'}</p>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setPaso(2)}
              className="flex-1 px-4 py-3 text-gray-700 font-medium hover:bg-gray-100 rounded-lg transition-colors"
            >
              Atrás
            </button>
            <button
              onClick={handleCompletar}
              disabled={completando}
              className="flex-1 bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg transition-all"
            >
              {completando ? 'Procesando...' : 'Continuar'}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
