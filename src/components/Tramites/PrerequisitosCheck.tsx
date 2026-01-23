import { useState } from 'react';
import { CheckCircle2, AlertCircle, SkipForward, Lock, ChevronLeft } from 'lucide-react';
import type { Prerequisito } from '../../types/tramite.types';
import { ValidacionDocumento, AlertaFaltante } from '../Validaciones';

interface Props {
  prerequisitos: Prerequisito[];
  prerequisitosCumplidos: Record<string, boolean>;
  onValidacionCompleta: (cumplidos: Record<string, boolean>) => void;
  onAbrirRamaEnPestaña?: (tramiteId: string, nombreTramite: string, prerequisitoId: string) => void;
}

export function PrerequisitosCheck({
  prerequisitos,
  prerequisitosCumplidos,
  onValidacionCompleta,
  onAbrirRamaEnPestaña
}: Props) {
  const [respuestas, setRespuestas] = useState<Record<string, boolean>>(prerequisitosCumplidos);
  const [omitidos, setOmitidos] = useState<Record<string, boolean>>({});
  const [indiceActual, setIndiceActual] = useState<number>(0);

  const handleRespuesta = (prerequisitoId: string, tieneDocumento: boolean) => {
    const nuevasRespuestas = {
      ...respuestas,
      [prerequisitoId]: tieneDocumento,
    };
    setRespuestas(nuevasRespuestas);

    // Siempre avanzar automáticamente al siguiente
    if (indiceActual < prerequisitos.length - 1) {
      setTimeout(() => setIndiceActual(indiceActual + 1), 300);
    }
  };

  const handleOmitir = (prerequisitoId: string) => {
    setOmitidos(prev => ({ ...prev, [prerequisitoId]: true }));
    // Marcar como "cumplido" para propósitos de continuar
    const nuevasRespuestas = { ...respuestas, [prerequisitoId]: true };
    setRespuestas(nuevasRespuestas);

    // Avanzar automáticamente al siguiente después de omitir
    if (indiceActual < prerequisitos.length - 1) {
      setTimeout(() => setIndiceActual(indiceActual + 1), 300);
    }
  };

  const handleRetroceder = () => {
    if (indiceActual > 0) {
      // Simplemente retroceder un índice
      // Esto permitirá revisar requisitos anteriores sin eliminar las respuestas
      setIndiceActual(indiceActual - 1);
    }
  };

  // Calcular cuántos requisitos se han procesado (para mostrar progreso)
  const maxIndiceVisto = indiceActual;

  // Separar requisitos en categorías para renderizado
  const requisitoActual = prerequisitos[indiceActual];
  const respuestaActual = respuestas[requisitoActual?.id];

  // Requisitos con "No tengo" que se apilan abajo (solo los anteriores al actual)
  const requisitosNoTengo = prerequisitos
    .slice(0, indiceActual)
    .filter((pre) => respuestas[pre.id] === false && !omitidos[pre.id]);

  // Requisitos omitidos que también se apilan abajo (solo los anteriores al actual)
  const requisitosOmitidos = prerequisitos
    .slice(0, indiceActual)
    .filter((pre) => omitidos[pre.id]);

  const todosRespondidos = prerequisitos.every((pre) => respuestas[pre.id] !== undefined);
  const todosCumplidos = prerequisitos.every((pre) => respuestas[pre.id] === true);
  const faltantes = prerequisitos.filter((pre) => respuestas[pre.id] === false && !omitidos[pre.id]);
  const cantidadOmitidos = Object.keys(omitidos).length;

  // Puede continuar si todos están cumplidos O si todos los faltantes han sido omitidos
  const puedeAvanzar = todosCumplidos || (todosRespondidos && faltantes.length === 0);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Verificación de Requisitos
            </h2>
            <p className="text-gray-600">
              Antes de continuar, verifica que tengas todos los documentos necesarios. Si te falta alguno, podemos ayudarte a obtenerlo.
            </p>
          </div>
          <div className="flex items-center gap-2">
            {/* Selector de pasos para navegación directa */}
            {prerequisitos.length > 1 && (
              <select
                value={indiceActual}
                onChange={(e) => setIndiceActual(Number(e.target.value))}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                title="Ir a requisito específico"
              >
                {prerequisitos.map((pre, idx) => (
                  <option key={pre.id} value={idx}>
                    {idx + 1}. {pre.nombre.substring(0, 30)}{pre.nombre.length > 30 ? '...' : ''}
                  </option>
                ))}
              </select>
            )}
            {indiceActual > 0 && (
              <button
                onClick={handleRetroceder}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
                <span className="font-medium">Anterior</span>
              </button>
            )}
          </div>
        </div>

        {/* Indicador de progreso */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">
              Requisito {indiceActual + 1} de {prerequisitos.length}
            </span>
            <span className="text-sm text-gray-500">
              {Math.round(((indiceActual + 1) / prerequisitos.length) * 100)}% completado
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((indiceActual + 1) / prerequisitos.length) * 100}%` }}
            />
          </div>
        </div>

        <div className="space-y-4">
          {/* Requisito actual - siempre arriba */}
          {requisitoActual && (
            <div
              key={`actual-${requisitoActual.id}`}
              className="animate-slide-in-top"
            >
              {omitidos[requisitoActual.id] ? (
                <div className="bg-gray-100 border-2 border-blue-400 rounded-lg p-4 flex items-center gap-3">
                  <SkipForward className="w-5 h-5 text-gray-500" />
                  <div className="flex-1">
                    <p className="font-medium text-gray-600 line-through">{requisitoActual.preguntaValidacion}</p>
                    <p className="text-sm text-gray-500">Omitido - podrás completarlo después</p>
                  </div>
                </div>
              ) : respuestaActual === true ? (
                <div className="ring-2 ring-green-400 ring-offset-2 rounded-xl">
                  <ValidacionDocumento
                    pregunta={requisitoActual.preguntaValidacion}
                    descripcion={requisitoActual.descripcion}
                    onRespuesta={(tiene) => handleRespuesta(requisitoActual.id, tiene)}
                    respuestaActual={respuestas[requisitoActual.id]}
                    deshabilitado={false}
                  />
                </div>
              ) : (
                <>
                  <div className="ring-2 ring-blue-400 ring-offset-2 rounded-xl">
                    <ValidacionDocumento
                      pregunta={requisitoActual.preguntaValidacion}
                      descripcion={requisitoActual.descripcion}
                      onRespuesta={(tiene) => handleRespuesta(requisitoActual.id, tiene)}
                      respuestaActual={respuestas[requisitoActual.id]}
                      deshabilitado={false}
                    />
                  </div>

                  {respuestas[requisitoActual.id] === false && (
                    <div className="mt-2 animate-fade-in">
                      <AlertaFaltante
                        prerequisito={requisitoActual}
                        onAbrirRama={() => {
                          if (requisitoActual.tramiteRelacionado && onAbrirRamaEnPestaña) {
                            onAbrirRamaEnPestaña(
                              requisitoActual.tramiteRelacionado,
                              requisitoActual.nombre,
                              requisitoActual.id
                            );
                          }
                        }}
                        onOmitir={() => handleOmitir(requisitoActual.id)}
                      />
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* Separador visual si hay requisitos pendientes abajo */}
          {(requisitosNoTengo.length > 0 || requisitosOmitidos.length > 0) && (
            <div className="flex items-center gap-3 py-2 animate-fade-in">
              <div className="flex-1 border-t-2 border-dashed border-gray-300"></div>
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                Requisitos pendientes ({requisitosNoTengo.length + requisitosOmitidos.length})
              </span>
              <div className="flex-1 border-t-2 border-dashed border-gray-300"></div>
            </div>
          )}

          {/* Requisitos con "No tengo" apilados abajo */}
          {requisitosNoTengo.map((prerequisito) => (
            <div
              key={`notengo-${prerequisito.id}`}
              className="animate-slide-in-bottom opacity-75 scale-95 transition-all duration-300"
            >
              <ValidacionDocumento
                pregunta={prerequisito.preguntaValidacion}
                descripcion={prerequisito.descripcion}
                onRespuesta={(tiene) => handleRespuesta(prerequisito.id, tiene)}
                respuestaActual={respuestas[prerequisito.id]}
                deshabilitado={true}
              />

              <div className="mt-2">
                <AlertaFaltante
                  prerequisito={prerequisito}
                  onAbrirRama={() => {
                    if (prerequisito.tramiteRelacionado && onAbrirRamaEnPestaña) {
                      onAbrirRamaEnPestaña(
                        prerequisito.tramiteRelacionado,
                        prerequisito.nombre,
                        prerequisito.id
                      );
                    }
                  }}
                  onOmitir={() => handleOmitir(prerequisito.id)}
                />
              </div>
            </div>
          ))}

          {/* Requisitos omitidos apilados abajo */}
          {requisitosOmitidos.map((prerequisito) => (
            <div
              key={`omitido-${prerequisito.id}`}
              className="animate-slide-in-bottom opacity-75 scale-95 transition-all duration-300"
            >
              <div className="bg-gray-100 border border-gray-300 rounded-lg p-4 flex items-center gap-3">
                <SkipForward className="w-5 h-5 text-gray-500" />
                <div className="flex-1">
                  <p className="font-medium text-gray-600 line-through">{prerequisito.preguntaValidacion}</p>
                  <p className="text-sm text-gray-500">Omitido - podrás completarlo después</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {todosRespondidos && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            {puedeAvanzar ? (
              <>
                {todosCumplidos && cantidadOmitidos === 0 ? (
                  <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                    <CheckCircle2 className="w-6 h-6 text-green-600" />
                    <div>
                      <p className="font-semibold text-green-800">¡Perfecto!</p>
                      <p className="text-sm text-green-600">Tienes todos los requisitos necesarios ✓</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                    <SkipForward className="w-6 h-6 text-yellow-600" />
                    <div>
                      <p className="font-semibold text-yellow-800">Continuando con omisiones</p>
                      <p className="text-sm text-yellow-600">Has omitido {cantidadOmitidos} requisito(s). Podrás completarlos después.</p>
                    </div>
                  </div>
                )}

                <button
                  onClick={() => onValidacionCompleta(respuestas)}
                  className="w-full px-6 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-lg transition-colors"
                >
                  → Continuar a Pago
                </button>
              </>
            ) : (
              <>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3 mb-4">
                  <Lock className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-red-900 font-medium mb-2">
                      No puedes continuar - Te faltan {faltantes.length} requisito{faltantes.length !== 1 ? 's' : ''}
                    </p>
                    <p className="text-sm text-red-700">
                      Completa los requisitos faltantes o usa el botón "Omitir" en cada uno para continuar sin ellos.
                    </p>
                  </div>
                </div>

                <button
                  disabled
                  className="w-full px-6 py-4 bg-gray-200 text-gray-600 rounded-lg font-semibold text-lg cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Lock className="w-5 h-5" />
                  Completa o omite los requisitos faltantes
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
