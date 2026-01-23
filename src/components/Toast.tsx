import { CheckCircle, X } from 'lucide-react';
import { useEffect, useState } from 'react';

interface Props {
    message: string;
    onClose: () => void;
    duration?: number;
}

/**
 * Toast de notificación para feedback visual
 * Se muestra en la esquina superior derecha
 */
export function Toast({ message, onClose, duration = 5000 }: Props) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Animación de entrada
        setTimeout(() => setIsVisible(true), 10);

        // Auto-cerrar después de la duración
        const timer = setTimeout(() => {
            setIsVisible(false);
            setTimeout(onClose, 300); // Esperar a que termine la animación
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    return (
        <div
            className={`fixed top-4 right-4 z-50 max-w-md transition-all duration-300 transform ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
                }`}
        >
            <div className="bg-white rounded-xl shadow-2xl border-2 border-green-200 p-4 flex items-start gap-3">
                <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                </div>

                <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-gray-900 mb-1">✅ Google Calendar conectado</h4>
                    <div className="text-sm text-gray-700 space-y-1">
                        <p>Ahora puedes:</p>
                        <ul className="list-disc list-inside space-y-0.5 text-xs">
                            <li>Guardar turnos que ya obtuviste</li>
                            <li>Recibir recordatorios automáticos</li>
                            <li>Ver sugerencias de horarios libres</li>
                        </ul>
                    </div>
                </div>

                <button
                    onClick={() => {
                        setIsVisible(false);
                        setTimeout(onClose, 300);
                    }}
                    className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
}
