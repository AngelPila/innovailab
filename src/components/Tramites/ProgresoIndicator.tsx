import { CheckCircle2 } from 'lucide-react';
import type { FaseTramite } from '../../types/tramite.types';

interface Props {
  faseActual: FaseTramite;
  fasesCompletadas: FaseTramite[];
}

// MVP: Sin Documentación
const FASES_ORDEN: FaseTramite[] = ['informacion', 'requisitos', 'pago', 'seguimiento'];

const NOMBRES_FASES: Record<FaseTramite, string> = {
  informacion: 'Información',
  requisitos: 'Requisitos',
  documentacion: 'Documentación',
  pago: 'Pago',
  seguimiento: 'Seguimiento',
};

export function ProgresoIndicator({ faseActual, fasesCompletadas }: Props) {
  const indiceActual = FASES_ORDEN.indexOf(faseActual);
  const progresoPorcentaje = indiceActual >= 0 ? ((indiceActual + 1) / FASES_ORDEN.length) * 100 : 0;

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-600">Progreso</h3>
          <span className="text-sm font-bold text-yellow-600">{Math.round(progresoPorcentaje)}%</span>
        </div>

        <div className="relative">
          {/* Barra de progreso limpia */}
          <div className="h-2.5 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-yellow-400 transition-all duration-500"
              style={{ width: `${progresoPorcentaje}%` }}
            ></div>
          </div>

          {/* Solo texto de fases, sin círculos */}
          <div className="flex justify-between mt-2 text-xs">
            {FASES_ORDEN.map((fase) => {
              const estaCompletada = fasesCompletadas.includes(fase);
              const estaActiva = fase === faseActual;

              return (
                <span 
                  key={fase} 
                  className={`font-medium ${
                    estaCompletada 
                      ? 'text-green-600' 
                      : estaActiva 
                      ? 'text-yellow-600 font-bold' 
                      : 'text-gray-400'
                  }`}
                >
                  {estaCompletada ? '✓' : '○'} {NOMBRES_FASES[fase]}
                </span>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
