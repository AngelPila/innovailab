import { useState } from 'react';
import { MessageCircle } from 'lucide-react';
import { whatsappService } from '../../services/whatsappService';
import WhatsAppConnectModal from './WhatsAppConnectModal';

type Props = {
    tramiteId: string;
    tramiteName: string;
    onToggle: (enabled: boolean) => void;
    initialValue?: boolean;
};

/**
 * Componente de opt-in para WhatsApp en fase de pago
 * 
 * PROPÓSITO: Permitir al usuario activar recordatorios de WhatsApp para este trámite
 * 
 * REGLA: Si WhatsApp no está conectado, abrir modal de conexión
 */
export default function WhatsAppOptIn({ tramiteId, tramiteName, onToggle, initialValue = false }: Props) {
    const [enabled, setEnabled] = useState(initialValue);
    const [showConnectModal, setShowConnectModal] = useState(false);

    const handleToggle = () => {
        // Si WhatsApp no está conectado, abrir modal
        if (!whatsappService.isWhatsAppConnected()) {
            setShowConnectModal(true);
            return;
        }

        // Si ya está conectado, solo toggle
        const newValue = !enabled;
        setEnabled(newValue);
        onToggle(newValue);
    };

    const handleConnectSuccess = () => {
        setShowConnectModal(false);
        setEnabled(true);
        onToggle(true);
    };

    return (
        <>
            <div className="flex items-start gap-3">
                <input
                    type="checkbox"
                    id={`whatsapp-${tramiteId}`}
                    checked={enabled}
                    onChange={handleToggle}
                    className="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500 mt-0.5 cursor-pointer"
                />
                <label
                    htmlFor={`whatsapp-${tramiteId}`}
                    className="flex-1 cursor-pointer"
                >
                    <div className="flex items-center gap-2 mb-1">
                        <MessageCircle className="w-4 h-4 text-green-600" />
                        <span className="font-semibold text-gray-900">
                            Recibir recordatorio por WhatsApp
                        </span>
                    </div>
                    {enabled && (
                        <p className="text-sm text-green-700">
                            ✓ Te enviaremos un recordatorio 1 día antes del trámite
                        </p>
                    )}
                    {!enabled && (
                        <p className="text-sm text-gray-600">
                            Recibe un recordatorio 24 horas antes de tu cita
                        </p>
                    )}
                </label>
            </div>

            {showConnectModal && (
                <WhatsAppConnectModal
                    onConnect={handleConnectSuccess}
                    onClose={() => setShowConnectModal(false)}
                />
            )}
        </>
    );
}
