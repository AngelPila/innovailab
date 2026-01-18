import { AlertTriangle, Plus } from 'lucide-react';
import type { Prerequisito } from '../../types/tramite.types';

interface Props {
  prerequisito: Prerequisito;
  onAbrirRama: () => void;
}

export function AlertaFaltante({ prerequisito, onAbrirRama }: Props) {
  return (
    <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-r-lg mt-2 mb-4">
      <div className="flex items-start gap-3">
        <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
        
        <div className="flex-1">
          <h4 className="text-base font-semibold text-red-800 mb-1">
            ⚠️ {prerequisito.nombre}
          </h4>
          <p className="text-sm text-red-700 mb-3">
            {prerequisito.descripcion || 'Este documento es necesario para continuar con tu trámite.'}
          </p>

          {prerequisito.tramiteRelacionado && (
            <div className="bg-white border border-red-200 rounded-lg p-3">
              <p className="text-xs text-gray-600 mb-3 flex items-center gap-1">
                <span className="text-red-600 font-bold">→</span>
                Se abrirá una nueva pestaña para que completes este requisito
              </p>
              <button
                onClick={onAbrirRama}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold text-sm transition-colors"
              >
                <Plus className="w-4 h-4" />
                Abrir en nueva pestaña
              </button>
            </div>
          )}

          {!prerequisito.tramiteRelacionado && (
            <div className="bg-gray-100 border border-gray-300 rounded-lg p-3">
              <p className="text-sm text-gray-700 italic">
                📌 Deberás obtener este documento por tu cuenta. Una vez lo tengas, marca la opción "Sí" arriba.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
