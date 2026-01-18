import { CheckCircle2, Circle } from 'lucide-react';
import type { FaseTramite } from '../../types/tramite.types';

interface Props {
  faseActual: FaseTramite;
  fasesCompletadas: FaseTramite[];
}

const FASES_ORDEN: FaseTramite[] = ['informacion', 'requisitos', 'documentacion', 'pago', 'seguimiento'];

const NOMBRES_FASES: Record<FaseTramite, string> = {
  informacion: 'Información',
  requisitos: 'Requisitos',
  documentacion: 'Documentación',
  pago: 'Pago',
  seguimiento: 'Seguimiento',
};

export function ProgresoIndicator({ faseActual, fasesCompletadas }: Props) {
  const indiceActual = FASES_ORDEN.indexOf(faseActual);
  const progresoPorcentaje = ((indiceActual + 1) / FASES_ORDEN.length) * 100;

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold text-gray-600">Progreso del Trámite</h3>
          <span className="text-sm font-bold text-yellow-600">{Math.round(progresoPorcentaje)}%</span>
        </div>

        <div className="relative">
          {/* Barra de progreso */}
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-yellow-400 transition-all duration-500"
              style={{ width: `${progresoPorcentaje}%` }}
            ></div>
          </div>

          {/* Indicadores de fases */}
          <div className="flex justify-between mt-3">
            {FASES_ORDEN.map((fase, idx) => {
              const estaCompletada = fasesCompletadas.includes(fase);
              const estaActiva = fase === faseActual;

              return (
                <div key={fase} className="flex flex-col items-center">
                  <div className={`
                    w-8 h-8 rounded-full flex items-center justify-center mb-1 transition-all
                    ${estaCompletada 
                      ? 'bg-green-500 text-white' 
                      : estaActiva 
                      ? 'bg-yellow-400 text-gray-900 ring-4 ring-yellow-100' 
                      : 'bg-gray-200 text-gray-400'
                    }
                  `}>
                    {estaCompletada ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : (
                      <Circle className="w-4 h-4" />
                    )}
                  </div>
                  <span className={`text-xs font-medium ${estaActiva ? 'text-gray-900' : 'text-gray-500'}`}>
                    {NOMBRES_FASES[fase]}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
