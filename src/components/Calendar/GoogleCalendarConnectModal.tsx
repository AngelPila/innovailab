import { Calendar, Check, Shield, Bell, MapPin, X } from 'lucide-react';

type Props = {
    onConnect: () => void;
    onClose: () => void;
};

/**
 * Modal de conexión con Google Calendar
 * 
 * REGLA: OAuth on-demand - Solo mostrar cuando el usuario lo necesita
 * 
 * FLUJO:
 * 1. Usuario hace click en acción relacionada con Calendar
 * 2. Si no está conectado, se muestra este modal
 * 3. Usuario entiende los beneficios y permisos
 * 4. Click "Conectar con Google"
 * 5. Popup OAuth de Google
 * 6. Usuario autoriza
 * 7. Se ejecuta la acción original
 */
export default function GoogleCalendarConnectModal({ onConnect, onClose }: Props) {
    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mb-4">
                            <Calendar className="w-8 h-8 text-white" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                            Conectar Google Calendar
                        </h2>
                        <p className="text-gray-600 text-sm">
                            Organiza tu tiempo personal alrededor de tus trámites
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Beneficios */}
                <div className="space-y-3 mb-6">
                    <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Check className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900 text-sm">Recordatorios automáticos</h3>
                            <p className="text-xs text-gray-600">Recibe notificaciones de tus citas</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <MapPin className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900 text-sm">Ubicaciones incluidas</h3>
                            <p className="text-xs text-gray-600">Direcciones de las instituciones en tu calendario</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Bell className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900 text-sm">Organiza tu tiempo</h3>
                            <p className="text-xs text-gray-600">Bloquea tiempo para recolectar requisitos</p>
                        </div>
                    </div>
                </div>

                {/* Permisos */}
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <div className="flex items-start gap-2">
                        <Shield className="w-5 h-5 text-gray-500 flex-shrink-0 mt-0.5" />
                        <div>
                            <h4 className="font-semibold text-gray-900 text-sm mb-1">Permisos necesarios</h4>
                            <ul className="text-xs text-gray-600 space-y-1">
                                <li>• Ver tu calendario de Google</li>
                                <li>• Crear eventos en tu calendario</li>
                                <li>• Actualizar eventos creados por Govly</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Nota importante */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-6">
                    <p className="text-xs text-yellow-800">
                        <strong>Nota:</strong> Govly NO agenda turnos oficiales. Solo te ayuda a organizar tu tiempo personal.
                        Los turnos deben obtenerse en las instituciones correspondientes.
                    </p>
                </div>

                {/* Botones */}
                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={onConnect}
                        className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                            <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                        Conectar con Google
                    </button>
                </div>

                {/* Privacidad */}
                <p className="text-xs text-gray-500 text-center mt-4">
                    Govly no compartirá tu información con terceros.
                </p>
            </div>
        </div>
    );
}
