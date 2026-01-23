import { Check, Circle } from 'lucide-react';

interface Props {
    pasos: Array<{
        id: string;
        titulo: string;
        completado: boolean;
    }>;
    pasoActual: number;
    onPasoClick: (index: number) => void;
}

/**
 * Navegador de pasos interactivo
 * Permite saltar directamente a cualquier paso del trámite
 */
export function StepNavigator({ pasos, pasoActual, onPasoClick }: Props) {
    return (
        <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
            <div className="max-w-4xl mx-auto px-6 py-4">
                <div className="flex items-center justify-between gap-2 overflow-x-auto">
                    {pasos.map((paso, index) => {
                        const isActive = index === pasoActual;
                        const isCompleted = paso.completado;
                        const isAccessible = index <= pasoActual || isCompleted;

                        return (
                            <div key={paso.id} className="flex items-center flex-shrink-0">
                                <button
                                    onClick={() => isAccessible && onPasoClick(index)}
                                    disabled={!isAccessible}
                                    className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 ${isActive
                                            ? 'bg-yellow-50 border-2 border-yellow-400'
                                            : isCompleted
                                                ? 'bg-green-50 border border-green-200 hover:bg-green-100'
                                                : isAccessible
                                                    ? 'border border-gray-200 hover:bg-gray-50'
                                                    : 'border border-gray-100 opacity-50 cursor-not-allowed'
                                        }`}
                                    title={paso.titulo}
                                >
                                    <div
                                        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${isCompleted
                                                ? 'bg-green-500'
                                                : isActive
                                                    ? 'bg-yellow-400'
                                                    : 'bg-gray-200'
                                            }`}
                                    >
                                        {isCompleted ? (
                                            <Check className="w-5 h-5 text-white" />
                                        ) : (
                                            <span
                                                className={`text-sm font-bold ${isActive ? 'text-gray-900' : 'text-gray-600'
                                                    }`}
                                            >
                                                {index + 1}
                                            </span>
                                        )}
                                    </div>
                                    <span
                                        className={`text-sm font-medium hidden md:inline ${isActive
                                                ? 'text-gray-900'
                                                : isCompleted
                                                    ? 'text-green-700'
                                                    : 'text-gray-600'
                                            }`}
                                    >
                                        {paso.titulo}
                                    </span>
                                </button>

                                {/* Conector entre pasos */}
                                {index < pasos.length - 1 && (
                                    <div
                                        className={`w-8 h-0.5 mx-1 ${paso.completado ? 'bg-green-500' : 'bg-gray-200'
                                            }`}
                                    />
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
