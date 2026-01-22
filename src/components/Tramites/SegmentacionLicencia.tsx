import { useState } from 'react';
import { useTramiteStore } from '../../store/tramiteStore';
import { ChevronRight } from 'lucide-react';

interface Props {
  onConfirm?: () => void;
}

export function SegmentacionLicencia({ onConfirm }: Props) {
  const { setSegmentacion } = useTramiteStore();
  const [paso, setPaso] = useState<1 | 2>(1);
  const [tipoLicencia, setTipoLicencia] = useState<'primera_vez' | 'renovacion' | ''>('');
  const [tipoVehiculo, setTipoVehiculo] = useState<'particular' | 'profesional' | ''>('');

  const handleNext = () => {
    if (paso === 1) {
      setPaso(2);
    } else {
      // Guardar segmentación si es necesario
      setSegmentacion({
        esTramiteUrgente: false,
      });
      onConfirm?.();
    }
  };

  const handleBack = () => {
    if (paso > 1) {
      setPaso((paso - 1) as 1 | 2);
    }
  };

  const isCurrentStepValid = () => {
    if (paso === 1) return tipoLicencia !== '';
    if (paso === 2) return tipoVehiculo !== '';
    return false;
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Paso 1: Tipo de trámite */}
      {paso === 1 && (
        <>
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">¿Es tu primera licencia?</h3>
            <p className="text-gray-600">Esto nos ayuda a personalizar el trámite</p>
          </div>

          <div className="space-y-3">
            {[
              { id: 'primera_vez', label: '🆕 Primera vez', desc: 'Quiero sacar mi primera licencia' },
              { id: 'renovacion', label: '🔄 Renovación', desc: 'Voy a renovar una licencia existente' },
            ].map((opcion) => (
              <button
                key={opcion.id}
                onClick={() => setTipoLicencia(opcion.id as 'primera_vez' | 'renovacion')}
                className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                  tipoLicencia === opcion.id
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
                      tipoLicencia === opcion.id ? 'text-yellow-500' : 'text-gray-400'
                    }`}
                  />
                </div>
              </button>
            ))}
          </div>
        </>
      )}

      {/* Paso 2: Tipo de vehículo */}
      {paso === 2 && (
        <>
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">¿Qué tipo de vehículo conducirás?</h3>
            <p className="text-gray-600">Selecciona la opción que se ajuste a tus necesidades</p>
          </div>

          <div className="space-y-3">
            {[
              { id: 'particular', label: '🚗 Vehículo Particular', desc: 'Auto, camioneta, SUV' },
              { id: 'profesional', label: '🚕 Vehículo Profesional', desc: 'Taxi, transporte de pasajeros' },
            ].map((opcion) => (
              <button
                key={opcion.id}
                onClick={() => setTipoVehiculo(opcion.id as 'particular' | 'profesional')}
                className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                  tipoVehiculo === opcion.id
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
                      tipoVehiculo === opcion.id ? 'text-yellow-500' : 'text-gray-400'
                    }`}
                  />
                </div>
              </button>
            ))}
          </div>
        </>
      )}

      {/* Botones de navegación */}
      <div className="flex gap-3 pt-4">
        {paso > 1 && (
          <button
            onClick={handleBack}
            className="flex-1 px-4 py-3 text-gray-700 font-medium hover:bg-gray-100 rounded-lg transition-colors"
          >
            Atrás
          </button>
        )}
        <button
          onClick={handleNext}
          disabled={!isCurrentStepValid()}
          className="flex-1 bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg transition-all"
        >
          {paso === 2 ? 'Continuar' : 'Siguiente'}
        </button>
      </div>
    </div>
  );
}
