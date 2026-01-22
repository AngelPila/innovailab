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
    <div className="flex flex-col h-full bg-gradient-to-br from-yellow-50 to-amber-50 p-6">
      {/* Encabezado */}
      <div className="mb-8">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          Verifica tus documentos
        </h2>
        <p className="text-xl text-gray-600">
          Pregunta {indiceActual + 1} de {prerequisitos.length}
        </p>
      </div>

      {/* Barra de progreso visual */}
      <div className="mb-12">
        <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-yellow-400 to-amber-500 transition-all duration-300"
            style={{
              width: `${((indiceActual + 1) / prerequisitos.length) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* Pregunta actual - GRANDE */}
      <div className="flex-1 flex flex-col items-center justify-center mb-12">
        <div className="text-center max-w-2xl">
          <p className="text-3xl font-bold text-gray-900 mb-6 leading-relaxed">
            {requisitoActual.preguntaValidacion}
          </p>

          {requisitoActual.descripcion && (
            <p className="text-xl text-gray-600 mb-8">
              {requisitoActual.descripcion}
            </p>
          )}
        </div>
      </div>

      {/* Botones Sí/No GIGANTES */}
      <div className="flex gap-6 mb-8">
        <button
          onClick={() => handleRespuesta(true)}
          className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-8 px-6 rounded-3xl transition-all transform hover:scale-105 active:scale-95 shadow-xl text-2xl flex items-center justify-center gap-4"
        >
          <CheckCircle2 className="w-8 h-8" />
          Sí, tengo
        </button>

        <button
          onClick={() => handleRespuesta(false)}
          className="flex-1 bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700 text-white font-bold py-8 px-6 rounded-3xl transition-all transform hover:scale-105 active:scale-95 shadow-xl text-2xl flex items-center justify-center gap-4"
        >
          <XCircle className="w-8 h-8" />
          No tengo
        </button>
      </div>

      {/* Resumen de progreso */}
      <div className="text-center text-gray-600">
        <p className="text-lg">
          {requisitosCumplidos} de {prerequisitos.length} documentos confirmados
        </p>
      </div>
    </div>
  );
}
