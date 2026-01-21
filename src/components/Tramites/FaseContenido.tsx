import type { PasoTramite } from '../../types/tramite.types';
import { CheckCircle2, Clock, DollarSign, FileText, Info, MapPin } from 'lucide-react';

interface Props {
  paso: PasoTramite;
  estaCompletado: boolean;
  onCompletar: () => void;
}

const ICONOS_FASE = {
  informacion: Info,
  requisitos: FileText,
  documentacion: FileText,
  pago: DollarSign,
  seguimiento: MapPin,
};

export function FaseContenido({ paso, estaCompletado, onCompletar }: Props) {
  const IconoFase = ICONOS_FASE[paso.fase];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex items-start gap-4 mb-6">
          <div className={`p-3 rounded-lg ${estaCompletado ? 'bg-green-100' : 'bg-yellow-100'}`}>
            <IconoFase className={`w-8 h-8 ${estaCompletado ? 'text-green-600' : 'text-yellow-600'}`} />
          </div>
          
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">{paso.titulo}</h2>
            <p className="text-lg text-gray-600">{paso.descripcion}</p>
          </div>

          {estaCompletado && (
            <div className="flex items-center gap-2 bg-green-50 px-4 py-2 rounded-lg">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              <span className="text-green-700 font-semibold">Completado</span>
            </div>
          )}
        </div>

        {paso.contenido && (
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <pre className="whitespace-pre-wrap font-sans text-gray-700 text-base leading-relaxed">
              {paso.contenido}
            </pre>
          </div>
        )}

        {paso.validaciones && paso.validaciones.length > 0 && (
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">Documentos requeridos:</h3>
            <ul className="space-y-2">
              {paso.validaciones.map((validacion, idx) => (
                <li key={idx} className="flex items-center gap-2 text-gray-700">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                  {validacion}
                </li>
              ))}
            </ul>
          </div>
        )}

        {!estaCompletado && (
          <button
            onClick={onCompletar}
            className="w-full py-4 bg-yellow-400 hover:bg-yellow-500 text-gray-900 rounded-lg font-bold text-lg transition-colors"
          >
            Marcar como completado
          </button>
        )}
      </div>
    </div>
  );
}
