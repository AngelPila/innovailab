import { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import type { Prerequisito } from '../../types/tramite.types';
import { ValidacionDocumento, AlertaFaltante } from '../Validaciones';

interface Props {
  prerequisitos: Prerequisito[];
  prerequisitosCumplidos: Record<string, boolean>;
  onValidacionCompleta: (cumplidos: Record<string, boolean>) => void;
  onIniciarRama: (tramiteId: string, prerequisitoId: string) => void;
}

export function PrerequisitosCheck({ 
  prerequisitos, 
  prerequisitosCumplidos, 
  onValidacionCompleta,
  onIniciarRama 
}: Props) {
  const [respuestas, setRespuestas] = useState<Record<string, boolean>>(prerequisitosCumplidos);

  const handleRespuesta = (prerequisitoId: string, tieneDocumento: boolean) => {
    const nuevasRespuestas = {
      ...respuestas,
      [prerequisitoId]: tieneDocumento,
    };
    setRespuestas(nuevasRespuestas);
  };

  const todosRespondidos = prerequisitos.every((pre) => respuestas[pre.id] !== undefined);
  const todosCumplidos = prerequisitos.every((pre) => respuestas[pre.id] === true);

  const handleContinuar = () => {
    onValidacionCompleta(respuestas);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Verificación de Requisitos
        </h2>
        <p className="text-gray-600 mb-6">
          Antes de continuar, verifica que tengas todos los documentos necesarios.
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
                  onIniciarTramite={() => {
                    if (prerequisito.tramiteRelacionado) {
                      onIniciarRama(prerequisito.tramiteRelacionado, prerequisito.id);
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
              <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                  <div>
                    <p className="font-semibold text-green-800">¡Excelente!</p>
                    <p className="text-sm text-green-600">Tienes todos los requisitos necesarios</p>
                  </div>
                </div>
                <button
                  onClick={handleContinuar}
                  className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold text-base transition-colors"
                >
                  Continuar con el trámite
                </button>
              </div>
            ) : (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-yellow-800 font-medium mb-2">
                  Aún te faltan algunos requisitos
                </p>
                <p className="text-sm text-yellow-700">
                  Completa los trámites necesarios antes de continuar, o marca "Sí" si ya los tienes.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
