import { useState } from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';
import type { Prerequisito } from '../../types/tramite.types';

interface Props {
  prerequisitos: Prerequisito[];
  prerequisitosCumplidos: Record<string, boolean>;
  onValidacionCompleta: (cumplidos: Record<string, boolean>) => void;
}

/**
 * Versión simplificada de PrerequisitosCheck para adultos mayores
 * - Botones GIGANTES Sí/No
 * - Una pregunta a la vez
 * - Texto grande y claro
 * - Sin complejidad de "omitir"
 */
export function PrerequisitosCheckBasic({
  prerequisitos,
  prerequisitosCumplidos,
  onValidacionCompleta,
}: Props) {
  const [respuestas, setRespuestas] = useState<Record<string, boolean>>(prerequisitosCumplidos);
  const [indiceActual, setIndiceActual] = useState<number>(0);

  const requisitoActual = prerequisitos[indiceActual];
  const todosRespondidos = prerequisitos.every((pre) => respuestas[pre.id] !== undefined);

  const handleRespuesta = (tieneDocumento: boolean) => {
    const nuevasRespuestas = {
      ...respuestas,
      [requisitoActual.id]: tieneDocumento,
    };
    setRespuestas(nuevasRespuestas);

    // Si no es el último, avanzar al siguiente
    if (indiceActual < prerequisitos.length - 1) {
      setTimeout(() => setIndiceActual(indiceActual + 1), 300);
    } else {
      // Si es el último y respondió, mostrar resumen
      setTimeout(() => {
        onValidacionCompleta(nuevasRespuestas);
      }, 300);
    }
  };

  const requisitosCumplidos = prerequisitos.filter((p) => respuestas[p.id] === true).length;

  if (!requisitoActual) {
    return null;
  }

  return (
    <div className="flex flex-col min-h-0 overflow-hidden">
      {/* Encabezado */}
      <div className="mb-6 md:mb-12 flex-shrink-0">
        <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-4 md:mb-6">
          Verifica tus documentos
        </h2>
        <p className="text-lg md:text-2xl lg:text-3xl text-gray-700 font-bold">
          Pregunta {indiceActual + 1} de {prerequisitos.length}
        </p>
      </div>

      {/* Barra de progreso visual GRANDE */}
      <div className="mb-6 md:mb-16 flex-shrink-0">
        <div className="w-full h-4 md:h-6 bg-gray-200 rounded-full overflow-hidden shadow-lg">
          <div
            className="h-full bg-gradient-to-r from-yellow-400 to-amber-500 transition-all duration-300"
            style={{
              width: `${((indiceActual + 1) / prerequisitos.length) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* Pregunta actual - GIGANTE */}
      <div className="flex-1 flex flex-col items-center justify-center mb-8 md:mb-16 overflow-y-auto min-h-0">
        <div className="text-center max-w-3xl px-2">
          <p className="text-2xl md:text-4xl lg:text-5xl font-black text-gray-900 mb-6 md:mb-8 leading-relaxed">
            {requisitoActual.preguntaValidacion}
          </p>

          {requisitoActual.descripcion && (
            <p className="text-lg md:text-2xl lg:text-3xl text-gray-600 mb-6 md:mb-10 font-semibold">
              {requisitoActual.descripcion}
            </p>
          )}
        </div>
      </div>

      {/* Botones Sí/No GIGANTES */}
      <div className="flex flex-col sm:flex-row gap-4 md:gap-6 mb-4 md:mb-8 flex-shrink-0">
        <button
          onClick={() => handleRespuesta(true)}
          className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-black py-6 md:py-10 px-6 md:px-8 rounded-2xl md:rounded-3xl transition-all transform hover:scale-105 active:scale-95 shadow-2xl text-xl md:text-3xl flex items-center justify-center gap-3 md:gap-4"
        >
          <CheckCircle2 className="w-8 h-8 md:w-10 md:h-10 flex-shrink-0" />
          <span>Sí, tengo</span>
        </button>

        <button
          onClick={() => handleRespuesta(false)}
          className="flex-1 bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700 text-white font-black py-6 md:py-10 px-6 md:px-8 rounded-2xl md:rounded-3xl transition-all transform hover:scale-105 active:scale-95 shadow-2xl text-xl md:text-3xl flex items-center justify-center gap-3 md:gap-4"
        >
          <XCircle className="w-8 h-8 md:w-10 md:h-10 flex-shrink-0" />
          <span>No tengo</span>
        </button>
      </div>

      {/* Resumen de progreso */}
      <div className="text-center text-gray-600 flex-shrink-0">
        <p className="text-base md:text-lg">
          {requisitosCumplidos} de {prerequisitos.length} documentos confirmados
        </p>
      </div>
    </div>
  );
}
