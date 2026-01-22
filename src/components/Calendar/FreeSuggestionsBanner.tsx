import { useState, useEffect } from 'react';
import { Calendar, Clock, X, Lightbulb } from 'lucide-react';
import { reminderService } from '../../services/reminderService';
import { calendarService } from '../../services/calendarService';
import type { TimeSuggestion } from '../../types/calendar';

type Props = {
    tramiteId: string;
    officialUrl?: string;
    onBlockTime?: (suggestion: TimeSuggestion) => void;
};

/**
 * Banner de sugerencias de horarios libres
 * 
 * PROPÓSITO: Asesorar al usuario sobre cuándo tiene tiempo libre
 * REGLA: Govly aconseja, NO agenda automáticamente
 */
export default function FreeSuggestionsBanner({ tramiteId, officialUrl, onBlockTime }: Props) {
    const [suggestions, setSuggestions] = useState<TimeSuggestion[]>([]);
    const [loading, setLoading] = useState(false);
    const [dismissed, setDismissed] = useState(false);

    useEffect(() => {
        loadSuggestions();
    }, []);

    const loadSuggestions = async () => {
        if (!calendarService.isCalendarConnected()) {
            return;
        }

        setLoading(true);
        try {
            const startDate = new Date();
            const endDate = new Date();
            endDate.setDate(endDate.getDate() + 7); // Próximos 7 días

            const results = await reminderService.suggestFreeSlots(startDate, endDate, 120);
            setSuggestions(results);
        } catch (error) {
            console.error('Error cargando sugerencias:', error);
        } finally {
            setLoading(false);
        }
    };

    if (dismissed || !calendarService.isCalendarConnected() || suggestions.length === 0) {
        return null;
    }

    const topSuggestion = suggestions[0];

    return (
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-purple-200 rounded-xl p-4 mb-4">
            <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <Lightbulb className="w-5 h-5 text-white" />
                </div>

                <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                        <div>
                            <h4 className="font-bold text-purple-900 text-sm mb-1">
                                💡 Sugerencia de horario
                            </h4>
                            <p className="text-xs text-purple-700">
                                Tienes tiempo libre {topSuggestion.reason}
                            </p>
                        </div>
                        <button
                            onClick={() => setDismissed(true)}
                            className="text-purple-400 hover:text-purple-600"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="bg-white rounded-lg p-3 mb-3">
                        <div className="flex items-center gap-2 mb-1">
                            <Clock className="w-4 h-4 text-purple-600" />
                            <span className="font-semibold text-gray-900 text-sm">
                                {topSuggestion.slot.start.toLocaleDateString('es-ES', {
                                    weekday: 'long',
                                    day: 'numeric',
                                    month: 'long'
                                })}
                            </span>
                        </div>
                        <p className="text-xs text-gray-600 ml-6">
                            {topSuggestion.slot.start.toLocaleTimeString('es-ES', {
                                hour: '2-digit',
                                minute: '2-digit'
                            })} - {topSuggestion.slot.end.toLocaleTimeString('es-ES', {
                                hour: '2-digit',
                                minute: '2-digit'
                            })}
                        </p>
                    </div>

                    <p className="text-xs text-purple-600 bg-purple-100 rounded p-2 mb-3">
                        <strong>Recomendación:</strong> Este podría ser un buen momento para ir a la institución y obtener tu turno oficial.
                    </p>

                    <div className="flex gap-2">
                        <a
                            href={officialUrl || 'https://www.registrocivil.gob.ec/'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 text-center px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold rounded-lg transition-colors"
                        >
                            Ir al sitio oficial
                        </a>
                        <button
                            onClick={() => setDismissed(true)}
                            className="px-3 py-2 border border-purple-300 text-purple-700 text-xs font-semibold rounded-lg hover:bg-purple-50 transition-colors"
                        >
                            Entendido
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
