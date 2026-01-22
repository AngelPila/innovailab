import { AlertCircle, CheckCircle2 } from 'lucide-react';
import type { ProgresoUsuario } from '../../types/tramite.types';

interface SummaryReviewProps {
  tramiteNombre: string;
  progreso: ProgresoUsuario;
  prerequisitosInfo: Array<{ id: string; nombre: string }>;
  onConfirm: () => void;
  onEdit: (step: string) => void;
}

export function SummaryReview({
  tramiteNombre,
  progreso,
  prerequisitosInfo,
  onConfirm,
  onEdit,
}: SummaryReviewProps) {
  const cumplidos = Object.entries(progreso.prerequisitosCumplidos)
    .filter(([_, cumplido]) => cumplido)
    .length;

  const documentosSubidos = Object.entries(progreso.documentosSubidos)
    .filter(([_, subido]) => subido)
    .length;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-yellow-50 to-amber-50 border-b border-yellow-100 px-8 py-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Resumen de tu {tramiteNombre}
          </h2>
          <p className="text-gray-600">
            Verifica que todo esté correcto antes de finalizar
          </p>
        </div>

        {/* Contenido */}
        <div className="p-8 space-y-6">
          {/* Sección 1: Requisitos */}
          <div className="border border-gray-200 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">Requisitos Verificados</h3>
              <button
                onClick={() => onEdit('requisitos')}
                className="text-yellow-600 hover:text-yellow-700 font-medium text-sm hover:underline"
              >
                Editar
              </button>
            </div>

            <div className="space-y-2">
              {prerequisitosInfo.map((pre) => {
                const cumplido = progreso.prerequisitosCumplidos[pre.id];
                return (
                  <div
                    key={pre.id}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                  >
                    <div
                      className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${
                        cumplido
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-300 text-gray-600'
                      }`}
                    >
                      {cumplido ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : (
                        <span className="text-xs">!</span>
                      )}
                    </div>
                    <span
                      className={`font-medium ${
                        cumplido ? 'text-gray-900' : 'text-gray-600'
                      }`}
                    >
                      {pre.nombre}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200 flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-blue-700">
                {cumplidos} de {prerequisitosInfo.length} requisitos verificados
              </p>
            </div>
          </div>

          {/* Sección 2: Documentos */}
          {documentosSubidos > 0 && (
            <div className="border border-gray-200 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900">Documentos Cargados</h3>
                <button
                  onClick={() => onEdit('documentacion')}
                  className="text-yellow-600 hover:text-yellow-700 font-medium text-sm hover:underline"
                >
                  Editar
                </button>
              </div>

              <div className="p-3 bg-green-50 rounded-lg border border-green-200 flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-green-700">
                  {documentosSubidos} documento(s) cargado(s)
                </p>
              </div>
            </div>
          )}

          {/* Sección 3: Información de Pago */}
          <div className="border border-gray-200 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">Información de Pago</h3>
              <button
                onClick={() => onEdit('pago')}
                className="text-yellow-600 hover:text-yellow-700 font-medium text-sm hover:underline"
              >
                Editar
              </button>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="font-medium text-gray-700">Tarifa del trámite:</span>
                <span className="font-bold text-gray-900">$95.00</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="font-medium text-gray-700">Método de pago:</span>
                <span className="font-medium text-gray-900">Será indicado al finalizar</span>
              </div>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex flex-col-reverse md:flex-row gap-4 pt-6 border-t border-gray-200">
            <button
              onClick={() => onEdit('informacion')}
              className="flex-1 px-6 py-4 border-2 border-gray-300 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-colors text-lg"
            >
              Atrás
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 px-6 py-4 bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 text-white font-bold rounded-xl transition-all transform hover:scale-105 shadow-lg text-lg"
            >
              Confirmar y Finalizar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
