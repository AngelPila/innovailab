import { useState } from 'react';
import { MessageCircle, X, CheckCircle, AlertCircle } from 'lucide-react';
import { whatsappService } from '../../services/whatsappService';

type Props = {
    onConnect: () => void;
    onClose: () => void;
};

/**
 * Modal para conectar WhatsApp
 * 
 * PROPÓSITO: Explicar al usuario qué mensajes recibirá y obtener opt-in
 * 
 * REGLA: Ser transparente sobre qué se enviará y qué no
 */
export default function WhatsAppConnectModal({ onConnect, onClose }: Props) {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [isConnecting, setIsConnecting] = useState(false);
    const [error, setError] = useState('');

    const handleConnect = async () => {
        setError('');

        // Validar que el número no esté vacío
        if (!phoneNumber.trim()) {
            setError('Por favor ingresa tu número de WhatsApp');
            return;
        }

        // Formatear número (agregar + si no lo tiene)
        let formattedNumber = phoneNumber.trim();
        if (!formattedNumber.startsWith('+')) {
            formattedNumber = '+' + formattedNumber;
        }

        setIsConnecting(true);

        try {
            await whatsappService.connectWhatsApp(formattedNumber);
            onConnect();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al conectar WhatsApp');
            setIsConnecting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 relative">
                {/* Botón cerrar */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                {/* Header */}
                <div className="flex items-start gap-4 mb-6">
                    <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <MessageCircle className="w-7 h-7 text-white" />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">
                            Vincular WhatsApp
                        </h3>
                        <p className="text-sm text-gray-600">
                            Recibe recordatorios importantes sobre tus trámites
                        </p>
                    </div>
                </div>

                {/* Explicación de qué recibirá */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <h4 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
                        <CheckCircle className="w-5 h-5" />
                        ¿Qué mensajes recibirás?
                    </h4>
                    <ul className="space-y-2 text-sm text-blue-800">
                        <li className="flex gap-2">
                            <span className="text-green-600 font-bold">✓</span>
                            <span>Confirmación cuando guardes un trámite</span>
                        </li>
                        <li className="flex gap-2">
                            <span className="text-green-600 font-bold">✓</span>
                            <span>Recordatorio 24 horas antes de tu cita</span>
                        </li>
                    </ul>
                </div>

                {/* Explicación de qué NO recibirá */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                    <h4 className="font-bold text-yellow-900 mb-3 flex items-center gap-2">
                        <AlertCircle className="w-5 h-5" />
                        Importante
                    </h4>
                    <ul className="space-y-2 text-sm text-yellow-800">
                        <li className="flex gap-2">
                            <span className="text-red-600 font-bold">✗</span>
                            <span>No es un chat - no podrás responder mensajes</span>
                        </li>
                        <li className="flex gap-2">
                            <span className="text-red-600 font-bold">✗</span>
                            <span>No recibirás múltiples mensajes</span>
                        </li>
                        <li className="flex gap-2">
                            <span className="text-red-600 font-bold">✗</span>
                            <span>Govly no agenda turnos oficiales</span>
                        </li>
                    </ul>
                </div>

                {/* Input de número */}
                <div className="mb-6">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Número de WhatsApp
                    </label>
                    <input
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="+593 99 123 4567"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        disabled={isConnecting}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                        Usa formato internacional con código de país
                    </p>
                    {error && (
                        <p className="text-sm text-red-600 mt-2 flex items-center gap-1">
                            <AlertCircle className="w-4 h-4" />
                            {error}
                        </p>
                    )}
                </div>

                {/* Botones */}
                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                        disabled={isConnecting}
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleConnect}
                        className="flex-1 px-4 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={isConnecting}
                    >
                        {isConnecting ? 'Conectando...' : 'Vincular WhatsApp'}
                    </button>
                </div>

                {/* Nota de privacidad */}
                <p className="text-xs text-gray-500 text-center mt-4">
                    🔒 Tu número solo se usa para recordatorios. Puedes desvincularlo en cualquier momento.
                </p>
            </div>
        </div>
    );
}
