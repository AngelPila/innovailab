import { useState } from 'react';
import React from 'react';
import { Eye, X, FileText, Image, AlertCircle } from 'lucide-react';

interface DocumentoPreview {
  id: string;
  nombre: string;
  tipo: 'documento' | 'archivo' | 'validacion';
  descripcion: string;
  esOpcional: boolean;
  preguntaValidacion: string;
  archivo?: {
    nombre: string;
    tamaño: string;
    tipo: string;
    url?: string;
  };
}

interface Props {
  documento: DocumentoPreview;
  cumplido: boolean;
  onAceptar?: () => void;
  onRechazar?: () => void;
  mostrarPreview?: boolean;
}

export function DocumentoConPreview({
  documento,
  cumplido,
  onAceptar,
  onRechazar,
  mostrarPreview = true,
}: Props) {
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  const getDocumentoContent = () => {
    const tipoEmoji: Record<string, string> = {
      documento: '📄',
      archivo: '🖼️',
      validacion: '✅',
    };

    const contenidoPreview: Record<string, React.ReactElement> = {
      cedula_vigente_licencia: (
        <div className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-bold text-gray-900 mb-2">Cédula de Identidad Vigente</h3>
            <p className="text-sm text-gray-700 mb-3">
              Tu documento debe estar en formato digital y ser legible
            </p>
            <div className="bg-white p-3 rounded border border-blue-200 text-center">
              <Image className="w-12 h-12 text-blue-500 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Ejemplo: Documento frente y reverso</p>
            </div>
          </div>
          <div className="space-y-2 text-sm text-gray-700">
            <p>✓ Formato: JPG, PNG</p>
            <p>✓ Tamaño: Máximo 5MB</p>
            <p>✓ Resolución: Mínimo 300 dpi</p>
          </div>
        </div>
      ),
      tipo_sangre: (
        <div className="space-y-4">
          <div className="bg-red-50 p-4 rounded-lg">
            <h3 className="font-bold text-gray-900 mb-2">Certificado de Tipo de Sangre</h3>
            <p className="text-sm text-gray-700 mb-3">
              Documento original o copia certificada de laboratorio
            </p>
            <div className="bg-white p-3 rounded border border-red-200">
              <div className="space-y-2 text-sm text-gray-600">
                <p>Tipo de Sangre: O+ (ejemplo)</p>
                <p>Laboratorio: Centro de Salud Autorizado</p>
                <p>Fecha: Vigente</p>
              </div>
            </div>
          </div>
          <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg flex gap-2">
            <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-gray-700">
              Algunos laboratorios pueden entregarla en menos de 1 hora
            </p>
          </div>
        </div>
      ),
      curso_conduccion: (
        <div className="space-y-4">
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-bold text-gray-900 mb-2">Certificado de Curso Autorizado</h3>
            <p className="text-sm text-gray-700 mb-3">
              Aprobación de escuela de conducción registrada ante ANT (Agencia Nacional de Tránsito)
            </p>
            <div className="bg-white p-3 rounded border border-green-200 space-y-2">
              <p className="text-sm text-gray-600">
                <strong>Duración:</strong> Mínimo 40 horas
              </p>
              <p className="text-sm text-gray-600">
                <strong>Temas:</strong> Seguridad, mecánica básica, leyes de tránsito
              </p>
              <p className="text-sm text-gray-600">
                <strong>Aprobación:</strong> Necesario calificación mínima 70%
              </p>
            </div>
          </div>
          <div className="text-sm text-gray-700 space-y-1">
            <p>📍 Escuelas autorizadas cerca:</p>
            <ul className="list-disc list-inside ml-2 text-gray-600">
              <li>Autoescuela Central - Centro</li>
              <li>Academia de Conducción ABC - Norte</li>
              <li>Escuela Vial Pro - Sur</li>
            </ul>
          </div>
        </div>
      ),
    };

    return contenidoPreview[documento.id] || (
      <div className="space-y-4">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-bold text-gray-900 mb-2">{documento.nombre}</h3>
          <p className="text-sm text-gray-700">{documento.descripcion}</p>
        </div>
        <div className="text-sm text-gray-700">
          <p>Documento tipo: {tipoEmoji[documento.tipo]}</p>
        </div>
      </div>
    );
  };

  return (
    <>
      <div
        className={`p-4 rounded-lg border-2 transition-all ${
          cumplido
            ? 'bg-green-50 border-green-200'
            : 'bg-gray-50 border-gray-200 hover:border-yellow-300'
        }`}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-bold text-gray-900">{documento.nombre}</h3>
            <p className="text-sm text-gray-600 mt-1">{documento.descripcion}</p>
            {documento.esOpcional && (
              <span className="inline-block mt-2 px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded">
                Opcional
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 ml-4">
            {mostrarPreview && (
              <button
                onClick={() => setShowPreviewModal(true)}
                className="p-2 hover:bg-gray-200 rounded-lg transition-colors text-gray-600 hover:text-gray-900"
                title="Ver información del documento"
              >
                <Eye className="w-5 h-5" />
              </button>
            )}

            {cumplido ? (
              <div className="px-3 py-1 bg-green-500 text-white text-xs font-medium rounded-full">
                ✓ Cumple
              </div>
            ) : (
              <div className="px-3 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full">
                ✗ Falta
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal de preview */}
      {showPreviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {documento.tipo === 'archivo' ? (
                  <Image className="w-6 h-6 text-blue-600" />
                ) : (
                  <FileText className="w-6 h-6 text-blue-600" />
                )}
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{documento.nombre}</h2>
                  <p className="text-sm text-gray-600">
                    {documento.tipo === 'validacion' ? 'Validación requerida' : 'Documento requerido'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowPreviewModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            {/* Contenido */}
            <div className="p-6">{getDocumentoContent()}</div>

            {/* Footer */}
            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-6 flex gap-3">
              <button
                onClick={() => {
                  setShowPreviewModal(false);
                  onRechazar?.();
                }}
                className="px-6 py-2 text-gray-700 font-medium border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Cerrar
              </button>
              <button
                onClick={() => {
                  setShowPreviewModal(false);
                  onAceptar?.();
                }}
                className="flex-1 px-6 py-2 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg transition-colors"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
