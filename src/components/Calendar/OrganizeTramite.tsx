import { useState } from 'react';
import { Calendar, X, CheckCircle } from 'lucide-react';
import { reminderService } from '../../services/reminderService';
import { calendarService } from '../../services/calendarService';
import { whatsappService } from '../../services/whatsappService';
import GoogleCalendarConnectModal from './GoogleCalendarConnectModal';
import { WhatsAppConnectModal, WhatsAppOptIn } from '../WhatsApp';

type Props = {
    tramiteId: string;
    tramiteName: string;
    location?: string;
    requirements?: string[];
    officialUrl?: string;
    onClose?: () => void;
};

/**
 * Componente para organizar un trámite
 * 
 * PROPÓSITO: Ayudar al usuario a guardar turnos que ya obtuvo
 * 
 * REGLA: Nunca crear turnos automáticos, solo guardar lo que el usuario ya tiene
 */
export default function OrganizeTramite({
    tramiteId,
    tramiteName,
    location,
    requirements,
    officialUrl,
    onClose
}: Props) {
    const [showConnectModal, setShowConnectModal] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const [enableWhatsApp, setEnableWhatsApp] = useState(false);
    const [saved, setSaved] = useState(false);

    const handleSaveAppointment = () => {
        // Verificar si Calendar está conectado
        if (!calendarService.isCalendarConnected()) {
            setShowConnectModal(true);
        } else {
            setShowDatePicker(true);
        }
    };

    const handleConnectSuccess = async () => {
        setShowConnectModal(false);
        setShowDatePicker(true);
    };

    const handleSave = async () => {
        if (!selectedDate || !selectedTime) {
            alert('Por favor selecciona fecha y hora');
            return;
        }

        const dateTime = new Date(`${selectedDate}T${selectedTime}`);

        try {
            await reminderService.saveUserAppointment(
                tramiteId,
                tramiteName,
                dateTime,
                {
                    location,
                    requirements,
                    officialUrl
                },
                enableWhatsApp // Pass WhatsApp preference
            );

            setSaved(true);
            setTimeout(() => {
                onClose?.();
            }, 2000);
        } catch (error) {
            console.error('Error guardando:', error);
            alert('Error al guardar en Google Calendar');
        }
    };

    if (saved) {
        return (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-2xl max-w-md w-full p-8 text-center relative">
                    <button
                        onClick={() => {
                            setSaved(false);
                            onClose?.();
                        }}
                        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                    >
                        <X className="w-5 h-5" />
                    </button>
                    <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">¡Guardado!</h3>
                    <p className="text-gray-600 mb-4">
                        Tu cita ha sido agregada a Google Calendar con recordatorios automáticos
                    </p>
                    <button
                        onClick={() => {
                            setSaved(false);
                            onClose?.();
                        }}
                        className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
                    >
                        Entendido
                    </button>
                </div>
            </div>
        );
    }

    if (showDatePicker) {
        return (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-2xl max-w-md w-full p-6">
                    <div className="flex items-start justify-between mb-4">
                        <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-1">
                                ¿Cuándo es tu cita?
                            </h3>
                            <p className="text-sm text-gray-600">
                                Ingresa la fecha y hora de tu turno
                            </p>
                        </div>
                        <button
                            onClick={() => setShowDatePicker(false)}
                            className="text-gray-400 hover:text-gray-600"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="space-y-4 mb-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Fecha
                            </label>
                            <input
                                type="date"
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                                min={new Date().toISOString().split('T')[0]}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Hora
                            </label>
                            <input
                                type="time"
                                value={selectedTime}
                                onChange={(e) => setSelectedTime(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={() => setShowDatePicker(false)}
                            className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={handleSave}
                            className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg"
                        >
                            Guardar
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
                <div className="mb-6">
                    <h3 className="text-xl font-bold text-blue-900 mb-2 flex items-center gap-2">
                        <Calendar className="w-6 h-6" />
                        Organiza tu trámite
                    </h3>
                    <p className="text-sm text-blue-700 mb-4">
                        Guarda tu cita y recibe recordatorios automáticos
                    </p>

                    {/* Checkboxes para Calendar y WhatsApp */}
                    <div className="space-y-3 mb-4">
                        {/* Checkbox Google Calendar */}
                        <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-blue-200 hover:border-blue-300 transition-colors">
                            <input
                                type="checkbox"
                                id="enable-calendar"
                                checked={true}
                                readOnly
                                className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-0.5 cursor-pointer"
                            />
                            <label htmlFor="enable-calendar" className="flex-1 cursor-pointer">
                                <div className="flex items-center gap-2 mb-1">
                                    <Calendar className="w-4 h-4 text-blue-600" />
                                    <span className="font-semibold text-gray-900">
                                        Guardar en Google Calendar
                                    </span>
                                </div>
                                <p className="text-sm text-gray-600">
                                    Agrega la cita a tu calendario con recordatorios
                                </p>
                            </label>
                        </div>

                        {/* Checkbox WhatsApp */}
                        <div className="p-3 bg-white rounded-lg border border-blue-200 hover:border-blue-300 transition-colors">
                            <WhatsAppOptIn
                                tramiteId={tramiteId}
                                tramiteName={tramiteName}
                                onToggle={setEnableWhatsApp}
                                initialValue={enableWhatsApp}
                            />
                        </div>
                    </div>

                    <button
                        onClick={handleSaveAppointment}
                        className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                        <Calendar className="w-5 h-5" />
                        Continuar
                    </button>
                </div>

                <p className="text-xs text-blue-600 bg-blue-100 rounded p-2">
                    💡 <strong>Nota:</strong> Govly te ayuda a organizar tu tiempo. Los turnos oficiales deben obtenerse en las instituciones correspondientes.
                </p>
            </div>

            {showConnectModal && (
                <GoogleCalendarConnectModal
                    onConnect={handleConnectSuccess}
                    onClose={() => setShowConnectModal(false)}
                />
            )}
        </>
    );
}
