import { useState } from 'react';
import { CheckCircle2, AlertCircle, SkipForward, Lock } from 'lucide-react';
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

  const handleRespuesta = (prerequisitoId: string, tieneDocumento: boolean) => {
    const nuevasRespuestas = {
      ...respuestas,
      [prerequisitoId]: tieneDocumento,
    };
    setRespuestas(nuevasRespuestas);
    
    // NO llamar onValidacionCompleta automáticamente
    // Solo actualizamos el estado local, el usuario debe presionar "Continuar" explícitamente
  };

  const handleOmitir = (prerequisitoId: string) => {
    setOmitidos(prev => ({ ...prev, [prerequisitoId]: true }));
    // Marcar como "cumplido" para propósitos de continuar
    const nuevasRespuestas = { ...respuestas, [prerequisitoId]: true };
    setRespuestas(nuevasRespuestas);
  };

  const todosRespondidos = prerequisitos.every((pre) => respuestas[pre.id] !== undefined);
  const todosCumplidos = prerequisitos.every((pre) => respuestas[pre.id] === true);
  const faltantes = prerequisitos.filter((pre) => respuestas[pre.id] === false && !omitidos[pre.id]);
  const cantidadOmitidos = Object.keys(omitidos).length;
  
  // Puede continuar si todos están cumplidos O si todos los faltantes han sido omitidos
  const puedeAvanzar = todosCumplidos || (todosRespondidos && faltantes.length === 0);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Verificación de Requisitos
        </h2>
        <p className="text-gray-600 mb-6">
          Antes de continuar, verifica que tengas todos los documentos necesarios. Si te falta alguno, podemos ayudarte a obtenerlo.
        </p>

        <div className="space-y-3">
          {prerequisitos.map((prerequisito) => (
            <div key={prerequisito.id}>
              {omitidos[prerequisito.id] ? (
                <div className="bg-gray-100 border border-gray-300 rounded-lg p-4 flex items-center gap-3">
                  <SkipForward className="w-5 h-5 text-gray-500" />
                  <div className="flex-1">
                    <p className="font-medium text-gray-600 line-through">{prerequisito.preguntaValidacion}</p>
                    <p className="text-sm text-gray-500">Omitido - podrás completarlo después</p>
                  </div>
                </div>
              ) : (
                <>
                  <ValidacionDocumento
                    pregunta={prerequisito.preguntaValidacion}
                    descripcion={prerequisito.descripcion}
                    onRespuesta={(tiene) => handleRespuesta(prerequisito.id, tiene)}
                    respuestaActual={respuestas[prerequisito.id]}
                  />

                  {respuestas[prerequisito.id] === false && (
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
                  )}
                </>
              )}
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
