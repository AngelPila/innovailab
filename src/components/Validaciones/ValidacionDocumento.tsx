import { CheckCircle2, XCircle } from 'lucide-react';
import type { ValidacionRespuesta } from '../../types/tramite.types';

interface Props {
  pregunta: string;
  descripcion?: string;
  onRespuesta: (tieneDocumento: boolean) => void;
  respuestaActual?: boolean | null;
  deshabilitado?: boolean;
}

export function ValidacionDocumento({ pregunta, descripcion, onRespuesta, respuestaActual, deshabilitado = false }: Props) {
  return (
    <div className={`bg-gradient-to-r from-gray-50 to-gray-100 border-2 border-gray-200 rounded-xl p-4 mb-3 transition-colors ${
      deshabilitado ? 'opacity-60' : 'hover:border-gray-300'
    }`}>
      <div className="flex flex-col gap-3">
        <div className="flex-1">
          <p className="text-lg font-semibold text-gray-900 mb-1">{pregunta}</p>
          {descripcion && <p className="text-sm text-gray-600 italic">{descripcion}</p>}
        </div>

        <div className="flex gap-3 w-full md:w-auto">
          <button
            onClick={() => !deshabilitado && onRespuesta(true)}
            disabled={deshabilitado}
            className={`flex-1 md:flex-none px-6 py-3 rounded-lg font-bold text-base transition-all duration-200 flex items-center justify-center gap-2 ${
              respuestaActual === true
                ? 'bg-green-500 text-white shadow-lg scale-105'
                : deshabilitado
                ? 'bg-gray-200 text-gray-500 border-2 border-gray-300 cursor-not-allowed'
                : 'bg-white text-gray-700 border-2 border-gray-300 hover:bg-green-50 hover:border-green-400'
            }`}
            aria-label="Sí tengo este documento"
          >
            {respuestaActual === true && <CheckCircle2 className="w-5 h-5" />}
            Sí tengo
          </button>

          <button
            onClick={() => !deshabilitado && onRespuesta(false)}
            disabled={deshabilitado}
            className={`flex-1 md:flex-none px-6 py-3 rounded-lg font-bold text-base transition-all duration-200 flex items-center justify-center gap-2 ${
              respuestaActual === false
                ? 'bg-red-500 text-white shadow-lg scale-105'
                : deshabilitado
                ? 'bg-gray-200 text-gray-500 border-2 border-gray-300 cursor-not-allowed'
                : 'bg-white text-gray-700 border-2 border-gray-300 hover:bg-red-50 hover:border-red-400'
            }`}
            aria-label="No tengo este documento"
          >
            {respuestaActual === false && <XCircle className="w-5 h-5" />}
            No tengo
          </button>
        </div>
      </div>
    </div>
  );
}
