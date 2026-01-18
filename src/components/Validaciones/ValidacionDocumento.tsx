import { CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import type { ValidacionRespuesta } from '../../types/tramite.types';

interface Props {
  pregunta: string;
  descripcion?: string;
  onRespuesta: (tieneDocumento: boolean) => void;
  respuestaActual?: boolean | null;
}

export function ValidacionDocumento({ pregunta, descripcion, onRespuesta, respuestaActual }: Props) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-3">
      <div className="flex items-start gap-3">
        <div className="flex-1">
          <p className="text-base font-medium text-gray-800 mb-1">{pregunta}</p>
          {descripcion && <p className="text-sm text-gray-500">{descripcion}</p>}
        </div>

        <div className="flex gap-2 flex-shrink-0">
          <button
            onClick={() => onRespuesta(true)}
            className={`px-6 py-2 rounded-lg font-semibold text-base transition-all ${
              respuestaActual === true
                ? 'bg-green-500 text-white shadow-lg'
                : 'bg-gray-100 text-gray-700 hover:bg-green-100 hover:text-green-700'
            }`}
            aria-label="Sí tengo este documento"
          >
            <div className="flex items-center gap-2">
              {respuestaActual === true && <CheckCircle2 className="w-5 h-5" />}
              Sí
            </div>
          </button>

          <button
            onClick={() => onRespuesta(false)}
            className={`px-6 py-2 rounded-lg font-semibold text-base transition-all ${
              respuestaActual === false
                ? 'bg-red-500 text-white shadow-lg'
                : 'bg-gray-100 text-gray-700 hover:bg-red-100 hover:text-red-700'
            }`}
            aria-label="No tengo este documento"
          >
            <div className="flex items-center gap-2">
              {respuestaActual === false && <XCircle className="w-5 h-5" />}
              No
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
