import { useState } from 'react';
import { CheckCircle2, AlertCircle } from 'lucide-react';
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

  const handleRespuesta = (prerequisitoId: string, tieneDocumento: boolean) => {
    const nuevasRespuestas = {
      ...respuestas,
      [prerequisitoId]: tieneDocumento,
    };
    setRespuestas(nuevasRespuestas);
    
    // Si marca que NO tiene, automáticamente actualizar el estado global
    if (!tieneDocumento) {
      onValidacionCompleta(nuevasRespuestas);
    }
  };

  const todosRespondidos = prerequisitos.every((pre) => respuestas[pre.id] !== undefined);
  const todosCumplidos = prerequisitos.every((pre) => respuestas[pre.id] === true);
  const faltantes = prerequisitos.filter((pre) => respuestas[pre.id] === false);

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
              <ValidacionDocumento
                pregunta={prerequisito.preguntaValidacion}
                descripcion={prerequisito.descripcion}
                onRespuesta={(tiene) => handleRespuesta(prerequisito.id, tiene)}
                respuestaActual={respuestas[prerequisito.id]}
              />

              {respuestas[prerequisito.id] === false && (
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
                />
              )}
            </div>
          ))}
        </div>

        {todosRespondidos && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            {todosCumplidos ? (
              <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-lg p-4 mb-3">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
                <div>
                  <p className="font-semibold text-green-800">¡Perfecto!</p>
                  <p className="text-sm text-green-600">Tienes todos los requisitos necesarios ✓</p>
                </div>
              </div>
            ) : (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3 mb-3">
                <AlertCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-blue-900 font-medium mb-2">
                    Te faltan {faltantes.length} requisito{faltantes.length !== 1 ? 's' : ''}
                  </p>
                  <p className="text-sm text-blue-700">
                    Puedes continuar abriendo los trámites necesarios en las pestañas de arriba, o proceder al pago.
                  </p>
                </div>
              </div>
            )}
            
            {/* Botón para continuar a PAGO */}
            <button
              onClick={() => onValidacionCompleta(respuestas)}
              className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-base transition-colors"
            >
              → Continuar a Pago
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
