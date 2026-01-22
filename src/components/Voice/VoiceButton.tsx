import { Mic, MicOff } from 'lucide-react';
import { useEffect } from 'react';
import { useVoiceRecognition } from '../../hooks/useVoiceRecognition';

interface VoiceButtonProps {
  onResult: (text: string) => void;
  className?: string;
}

export const VoiceButton = ({ onResult, className = '' }: VoiceButtonProps) => {
  const {
    isListening,
    transcript,
    isSupported,
    startListening,
    stopListening,
    resetTranscript,
    error,
  } = useVoiceRecognition();

  // Cuando se actualiza el transcript y termina de escuchar, enviar el resultado
  useEffect(() => {
    if (transcript && !isListening) {
      onResult(transcript);
      resetTranscript();
    }
  }, [transcript, isListening, onResult, resetTranscript]);

  const handleClick = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  // Si no está soportado, mostrar botón deshabilitado
  if (!isSupported) {
    return (
      <button
        disabled
        className={`p-2 rounded-full bg-gray-100 text-gray-500 cursor-not-allowed ${className}`}
        title="Tu navegador no soporta reconocimiento de voz"
        aria-label="Reconocimiento de voz no disponible"
      >
        <MicOff className="w-4 h-4" />
      </button>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={handleClick}
        className={`
          rounded-full transition-all duration-300 font-bold flex items-center justify-center
          ${isListening 
            ? 'p-4 bg-gradient-to-r from-red-500 to-red-600 text-white shadow-2xl shadow-red-500/50 scale-125 animate-pulse ring-4 ring-red-300' 
            : 'p-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 shadow-lg hover:shadow-xl hover:scale-110'
          }
          ${className}
        `}
        title={isListening ? '🎙️ Escuchando... Toca para detener' : '🎙️ Haz clic para hablar'}
        aria-label={isListening ? 'Detener grabación' : 'Iniciar grabación de voz'}
        aria-pressed={isListening}
      >
        {isListening ? (
          <Mic className="w-6 h-6 animate-pulse" />
        ) : (
          <Mic className="w-6 h-6" />
        )}
      </button>
      
      {/* Indicador visual para adultos mayores */}
      {isListening && (
        <div className="absolute -top-1 -right-1">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
          </span>
        </div>
      )}
      
      {/* Mensaje de error temporal */}
      {error && (
        <div className="absolute top-full mt-2 right-0 bg-red-100 text-red-700 text-xs px-3 py-2 rounded-lg shadow-lg whitespace-nowrap z-10">
          {error}
        </div>
      )}
      
      {/* Indicador de transcripción en progreso */}
      {isListening && transcript && (
        <div className="absolute top-full mt-2 right-0 bg-blue-100 text-blue-700 text-xs px-3 py-2 rounded-lg shadow-lg max-w-xs z-10">
          <p className="font-semibold mb-1">Escuchando...</p>
          <p className="italic">"{transcript}"</p>
        </div>
      )}
    </div>
  );
};

export default VoiceButton;
