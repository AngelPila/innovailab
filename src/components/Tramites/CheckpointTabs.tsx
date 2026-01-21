import { CheckCircle2 } from 'lucide-react';
import type { FaseTramite } from '../../types/tramite.types';

interface Props {
  faseActual: FaseTramite;
  onCambiarFase: (fase: FaseTramite) => void;
  fasesCompletadas: FaseTramite[];
}

// MVP: Fases principales - Información, Requisitos, Pago, Seguimiento
const FASES: { id: FaseTramite; nombre: string }[] = [
  { id: 'informacion', nombre: '📋 Información' },
  { id: 'requisitos', nombre: '✓ Requisitos' },
  { id: 'pago', nombre: '💳 Pago' },
  { id: 'seguimiento', nombre: '📍 Seguimiento' },
];

export function CheckpointTabs({ faseActual, onCambiarFase, fasesCompletadas }: Props) {
  return (
    <div className="bg-yellow-400 border-b border-yellow-500">
      <div className="px-6 py-3">
        <div className="flex gap-2 overflow-x-auto">
          {FASES.map((fase, idx) => {
            const estaActiva = faseActual === fase.id;
            const estaCompletada = fasesCompletadas.includes(fase.id);
            const estaDeshabilitada = !estaCompletada && fase.id !== faseActual && idx > FASES.findIndex(f => f.id === faseActual);

            return (
              <button
                key={fase.id}
                onClick={() => !estaDeshabilitada && onCambiarFase(fase.id)}
                disabled={estaDeshabilitada}
                className={`
                  relative px-6 py-3 rounded-lg font-semibold text-base transition-all flex items-center gap-2 whitespace-nowrap
                  ${estaActiva 
                    ? 'bg-white text-gray-900 shadow-lg' 
                    : estaCompletada
                    ? 'bg-green-500 text-white hover:bg-green-600'
                    : estaDeshabilitada
                    ? 'bg-yellow-300 text-gray-400 cursor-not-allowed opacity-60'
                    : 'bg-yellow-500 text-gray-700 hover:bg-yellow-300'
                  }
                `}
              >
                {estaCompletada && <CheckCircle2 className="w-5 h-5" />}
                <span>{fase.nombre}</span>
                
                {estaActiva && (
                  <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-white rotate-45"></span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
