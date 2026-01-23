import { CheckCircle2, Download, Share2, Calendar, Home } from 'lucide-react';

interface Props {
    tramiteNombre: string;
    onVolverInicio: () => void;
    onDescargarResumen?: () => void;
}

/**
 * Pantalla de cierre del flujo de trámite
 * Se muestra cuando el usuario completa todos los pasos
 */
export function FlowCompletion({ tramiteNombre, onVolverInicio, onDescargarResumen }: Props) {
    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="bg-white rounded-2xl shadow-lg p-8">
                {/* Icono de éxito */}
                <div className="flex justify-center mb-6">
                    <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center animate-bounce">
                        <CheckCircle2 className="w-16 h-16 text-green-600" />
                    </div>
                </div>

                {/* Mensaje principal */}
                <div className="text-center mb-8">
                    <h2 className="text-4xl font-bold text-gray-900 mb-3">
                        ¡Felicitaciones! 🎉
                    </h2>
                    <p className="text-xl text-gray-700 mb-2">
                        Has completado todos los pasos para:
                    </p>
                    <p className="text-2xl font-bold text-yellow-600">
                        {tramiteNombre}
                    </p>
                </div>

                {/* Resumen de lo completado */}
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-6 mb-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">✅ Lo que has logrado:</h3>
                    <div className="space-y-3">
                        <div className="flex items-start gap-3">
                            <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                            <p className="text-gray-700">Revisaste toda la información necesaria</p>
                        </div>
                        <div className="flex items-start gap-3">
                            <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                            <p className="text-gray-700">Conoces los requisitos y documentos que necesitas</p>
                        </div>
                        <div className="flex items-start gap-3">
                            <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                            <p className="text-gray-700">Tienes la información de pago y costos</p>
                        </div>
                        <div className="flex items-start gap-3">
                            <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                            <p className="text-gray-700">Sabes dónde realizar el trámite</p>
                        </div>
                    </div>
                </div>

                {/* Próximos pasos recomendados */}
                <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-6 mb-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">📋 Recomendaciones finales:</h3>
                    <ol className="space-y-3">
                        <li className="flex gap-3">
                            <span className="flex-shrink-0 w-7 h-7 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-sm">1</span>
                            <div>
                                <p className="font-semibold text-gray-900">Prepara tus documentos</p>
                                <p className="text-sm text-gray-600 mt-1">Asegúrate de tener todo lo necesario antes de ir</p>
                            </div>
                        </li>
                        <li className="flex gap-3">
                            <span className="flex-shrink-0 w-7 h-7 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-sm">2</span>
                            <div>
                                <p className="font-semibold text-gray-900">Organiza tu tiempo</p>
                                <p className="text-sm text-gray-600 mt-1">Usa tu calendario para planificar la visita</p>
                            </div>
                        </li>
                        <li className="flex gap-3">
                            <span className="flex-shrink-0 w-7 h-7 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-sm">3</span>
                            <div>
                                <p className="font-semibold text-gray-900">Llega temprano</p>
                                <p className="text-sm text-gray-600 mt-1">Las oficinas suelen tener menos gente en las primeras horas</p>
                            </div>
                        </li>
                        <li className="flex gap-3">
                            <span className="flex-shrink-0 w-7 h-7 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-sm">4</span>
                            <div>
                                <p className="font-semibold text-gray-900">Lleva efectivo</p>
                                <p className="text-sm text-gray-600 mt-1">Algunos lugares no aceptan tarjetas</p>
                            </div>
                        </li>
                    </ol>
                </div>

                {/* Acciones */}
                <div className="space-y-3">
                    {onDescargarResumen && (
                        <button
                            onClick={onDescargarResumen}
                            className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-lg transition-all shadow-lg hover:shadow-xl"
                        >
                            <Download className="w-6 h-6" />
                            Descargar resumen del trámite
                        </button>
                    )}

                    <button
                        onClick={onVolverInicio}
                        className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-yellow-400 hover:bg-yellow-500 text-gray-900 rounded-xl font-semibold text-lg transition-all shadow-lg hover:shadow-xl"
                    >
                        <Home className="w-6 h-6" />
                        Volver al inicio
                    </button>
                </div>

                {/* Mensaje de apoyo */}
                <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-sm text-gray-700 text-center">
                        <strong>💬 ¿Necesitas ayuda con otro trámite?</strong>
                        <br />
                        Estoy aquí para guiarte en cualquier proceso que necesites
                    </p>
                </div>

                {/* Footer */}
                <p className="mt-6 text-center text-xs text-gray-500">
                    Govly - Tu asistente para trámites gubernamentales
                </p>
            </div>
        </div>
    );
}
