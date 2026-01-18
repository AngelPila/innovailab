import { AlertCircle, X } from 'lucide-react';
import type { RamaSecundaria, Tramite } from '../../types/tramite.types';
import { TramiteFlow } from './TramiteFlow';

interface Props {
  rama: RamaSecundaria;
  tramite: Tramite;
  onCompletar: () => void;
  onCancelar: () => void;
}

export function RamaSecundaria({ rama, tramite, onCompletar, onCancelar }: Props) {
  return (
    <div className="bg-blue-50 border-l-4 border-blue-500 rounded-r-lg mb-6">
      <div className="p-4 bg-blue-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <AlertCircle className="w-6 h-6 text-blue-600" />
          <div>
            <h4 className="font-bold text-blue-900 text-lg">Trámite Secundario</h4>
            <p className="text-sm text-blue-700">{rama.contexto}</p>
          </div>
        </div>
        
        <button
          onClick={onCancelar}
          className="p-2 hover:bg-blue-200 rounded-lg transition-colors"
          title="Cancelar este trámite"
        >
          <X className="w-5 h-5 text-blue-700" />
        </button>
      </div>

      <div className="bg-white p-6 border-t border-blue-200">
        <TramiteFlow 
          tramiteId={tramite.id} 
          esRama={true}
          onCompletarRama={onCompletar}
        />
      </div>
    </div>
  );
}
