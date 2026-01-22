import { CheckCircle2, ClipboardList, Clock } from 'lucide-react';
import type { Tramite } from '../../types/tramite.types';

interface Props {
  tramite: Tramite;
}

/**
 * Versión simplificada de FaseSeguimiento para adultos mayores
 * - Resumen claro de lo que se hizo
 * - Próximos pasos simples
 * - Número de seguimiento (simulado)
 */
export function FaseSeguimientoBasic({ tramite }: Props) {
  const numeroSeguimiento = `ECU-${Math.floor(Math.random() * 1000000)
    .toString()
    .padStart(6, '0')}`;
  const fechaRetiro = new Date();
  fechaRetiro.setDate(fechaRetiro.getDate() + tramite.estimadoDias);

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-blue-50 to-cyan-50 p-4 md:p-6 overflow-y-auto">
      {/* Encabezado */}
      <div className="mb-8 text-center flex-shrink-0">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
          ¡Tu solicitud fue enviada!
        </h2>
        <p className="text-lg md:text-xl text-green-600 font-bold">
          Tu {tramite.nombre.toLowerCase()} está en proceso
        </p>
      </div>

      {/* Número de seguimiento */}
      <div className="bg-white rounded-2xl md:rounded-3xl p-5 md:p-6 mb-6 shadow-lg flex-shrink-0">
        <p className="text-center text-gray-600 text-sm md:text-base mb-3">Tu número de seguimiento:</p>
        <p className="text-center text-2xl md:text-3xl font-bold text-blue-600 font-mono mb-3">
          {numeroSeguimiento}
        </p>
        <p className="text-center text-gray-600 text-xs md:text-sm">
          Guarda este número para consultar el estado de tu trámite
        </p>
      </div>

      {/* Información clave */}
      <div className="space-y-2 md:space-y-3 mb-6 flex-1 overflow-y-auto">
        {/* Costo */}
        <div className="bg-white p-4 md:p-5 rounded-xl md:rounded-2xl border-2 border-green-200 flex items-center gap-3">
          <div className="bg-green-100 p-3 rounded-full flex-shrink-0">
            <CheckCircle2 className="w-5 md:w-6 h-5 md:h-6 text-green-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs md:text-sm text-gray-600">Costo pagado:</p>
            <p className="text-lg md:text-xl font-bold text-gray-900">${tramite.costo?.toFixed(2)}</p>
          </div>
        </div>

        {/* Tiempo estimado */}
        <div className="bg-white p-4 md:p-5 rounded-xl md:rounded-2xl border-2 border-blue-200 flex items-center gap-3">
          <div className="bg-blue-100 p-3 rounded-full flex-shrink-0">
            <Clock className="w-5 md:w-6 h-5 md:h-6 text-blue-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs md:text-sm text-gray-600">Tiempo estimado:</p>
            <p className="text-lg md:text-xl font-bold text-gray-900">
              {tramite.estimadoDias} días hábiles
            </p>
          </div>
        </div>

        {/* Fecha de retiro */}
        <div className="bg-white p-4 md:p-5 rounded-xl md:rounded-2xl border-2 border-purple-200 flex items-center gap-3">
          <div className="bg-purple-100 p-3 rounded-full flex-shrink-0">
            <ClipboardList className="w-5 md:w-6 h-5 md:h-6 text-purple-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs md:text-sm text-gray-600">Retira tu documento:</p>
            <p className="text-lg md:text-xl font-bold text-gray-900">
              {fechaRetiro.toLocaleDateString('es-EC')}
            </p>
          </div>
        </div>
      </div>

      {/* Próximos pasos */}
      <div className="bg-white rounded-2xl md:rounded-3xl p-5 md:p-6 mb-4 flex-shrink-0">
        <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-4">Próximos pasos:</h3>
        <ol className="space-y-2 md:space-y-3">
          <li className="flex gap-3 text-sm md:text-base">
            <span className="bg-blue-600 text-white rounded-full w-8 md:w-10 h-8 md:h-10 flex items-center justify-center flex-shrink-0 font-bold text-sm">
              1
            </span>
            <span className="text-gray-700 pt-1">Espera {tramite.estimadoDias} días hábiles</span>
          </li>
          <li className="flex gap-3 text-sm md:text-base">
            <span className="bg-blue-600 text-white rounded-full w-8 md:w-10 h-8 md:h-10 flex items-center justify-center flex-shrink-0 font-bold text-sm">
              2
            </span>
            <span className="text-gray-700 pt-1">Ve a la oficina y lleva tu cédula</span>
          </li>
          <li className="flex gap-3 text-sm md:text-base">
            <span className="bg-blue-600 text-white rounded-full w-8 md:w-10 h-8 md:h-10 flex items-center justify-center flex-shrink-0 font-bold text-sm">
              3
            </span>
            <span className="text-gray-700 pt-1">Recibe tu {tramite.nombre.toLowerCase()}</span>
          </li>
        </ol>
      </div>

      {/* Botón final */}
      <button
        onClick={() => window.location.reload()}
        className="w-full bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white font-bold py-5 md:py-6 px-4 md:px-6 rounded-2xl md:rounded-3xl transition-all transform hover:scale-105 active:scale-95 shadow-lg md:shadow-xl text-base md:text-lg flex-shrink-0"
      >
        Volver al inicio
      </button>
    </div>
  );
}
