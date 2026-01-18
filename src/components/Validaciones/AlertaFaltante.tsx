import { AlertTriangle, ArrowRight } from 'lucide-react';
import type { Prerequisito } from '../../types/tramite.types';

interface Props {
  prerequisito: Prerequisito;
  onIniciarTramite: () => void;
}

export function AlertaFaltante({ prerequisito, onIniciarTramite }: Props) {
  return (
    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg mt-2 mb-4">
      <div className="flex items-start gap-3">
        <AlertTriangle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
        
        <div className="flex-1">
          <h4 className="text-base font-semibold text-yellow-800 mb-1">
            Te falta: {prerequisito.nombre}
          </h4>
          <p className="text-sm text-yellow-700 mb-3">
            {prerequisito.descripcion || 'Este documento es necesario para continuar con tu trámite.'}
          </p>

          {prerequisito.tramiteRelacionado && (
            <button
              onClick={onIniciarTramite}
              className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg font-medium text-sm transition-colors"
            >
              Iniciar trámite para obtenerlo
              <ArrowRight className="w-4 h-4" />
            </button>
          )}

          {!prerequisito.tramiteRelacionado && (
            <p className="text-sm text-yellow-700 italic">
              Deberás obtener este documento por tu cuenta antes de continuar.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
