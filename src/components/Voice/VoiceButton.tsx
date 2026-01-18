import { Mic, MicOff, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useVoiceRecognition } from '../../hooks/useVoiceRecognition';

interface VoiceButtonProps {
  onResult: (text: string) => void;
  className?: string;
}

type VoiceState = 'inactive' | 'requesting' | 'recording';

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

  const [voiceState, setVoiceState] = useState<VoiceState>('inactive');

  // Actualizar estado visual basado en isListening
  useEffect(() => {
    if (isListening) {
      setVoiceState('recording');
    } else if (voiceState === 'requesting') {
      // Mantener requesting hasta que efectivamente inicie
      setTimeout(() => setVoiceState('inactive'), 500);
    } else {
      setVoiceState('inactive');
    }
  }, [isListening]);

  // Cuando se actualiza el transcript y termina de escuchar, enviar el resultado
  useEffect(() => {
    if (transcript && !isListening) {
      onResult(transcript);
      resetTranscript();
      setVoiceState('inactive');
    }
  }, [transcript, isListening, onResult, resetTranscript]);

  const handleClick = () => {
    if (isListening) {
      stopListening();
      setVoiceState('inactive');
    } else {
      setVoiceState('requesting');
      startListening();
    }
  };

  // Si no está soportado, mostrar botón deshabilitado
  if (!isSupported) {
    return (
      <div className="relative group">
        <button
          disabled
          className={`p-2 rounded-full bg-gray-200 text-gray-400 cursor-not-allowed ${className}`}
          aria-label="Reconocimiento de voz no disponible"
        >
          <MicOff className="w-4 h-4" />
        </button>
        <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 hidden group-hover:block">
          <div className="bg-gray-900 text-white text-xs px-3 py-2 rounded-lg shadow-lg whitespace-nowrap">
            Tu navegador no soporta reconocimiento de voz
          </div>
        </div>
      </div>
    );
  }

  // Estado 1: SOLICITANDO PERMISO - Azul con spinner
  if (voiceState === 'requesting') {
    return (
      <div className="relative group">
        <button
          onClick={handleClick}
          className={`p-2 rounded-full bg-gradient-to-r from-govly-secondary to-indigo-600 text-white shadow-sm transition-all duration-300 ${className}`}
          aria-label="Solicitando permiso..."
          aria-pressed={true}
        >
          <Loader2 className="w-4 h-4 animate-spin" />
        </button>
        <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 hidden group-hover:block">
          <div className="bg-govly-secondary text-white text-xs px-3 py-2 rounded-lg shadow-lg whitespace-nowrap">
            Solicitando permiso de micrófono...
          </div>
        </div>
      </div>
    );
  }

  // Estado 2: GRABANDO - Rojo con pulso y transcripción
  if (voiceState === 'recording') {
    return (
      <div className="relative">
        <button
          onClick={handleClick}
          className={`p-2 rounded-full bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg animate-pulse-soft ${className}`}
          aria-label="Click para detener la grabación"
          aria-pressed={true}
        >
          <Mic className="w-4 h-4" />
        </button>
        
        {/* Indicadores visuales - puntos pulsantes */}
        <div className="absolute -top-1 -right-1">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
          </span>
        </div>
        
        {/* Transcripción en vivo */}
        {transcript && (
          <div className="absolute top-full mt-3 right-0 bg-gradient-to-br from-red-50 to-pink-50 border-2 border-red-200 text-red-900 text-xs px-4 py-3 rounded-xl shadow-lg max-w-xs z-50 animate-slideUp">
            <p className="font-bold mb-1 flex items-center gap-1">
              <span className="inline-block w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
              Escuchando...
            </p>
            <p className="italic">"{transcript}"</p>
          </div>
        )}
      </div>
    );
  }

  // Estado 3: INACTIVO - Gris normal
  return (
    <div className="relative group">
      <button
        onClick={handleClick}
        className={`p-2 rounded-full hover:bg-gray-100 text-gray-600 hover:shadow-md transition-all duration-300 ${className}`}
        aria-label="Click para hablar"
        aria-pressed={false}
      >
        <Mic className="w-4 h-4" />
      </button>
      
      {/* Tooltip */}
      <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 hidden group-hover:block">
        <div className="bg-gray-900 text-white text-xs px-3 py-2 rounded-lg shadow-lg whitespace-nowrap">
          Habla para dictar tu mensaje
        </div>
      </div>
      
      {/* Mensaje de error contextual */}
      {error && (
        <div className="absolute top-full mt-3 right-0 bg-red-100 text-red-700 text-xs px-3 py-2 rounded-lg shadow-lg whitespace-nowrap z-50 max-w-xs">
          {error}
        </div>
      )}
    </div>
  );
};

export default VoiceButton;
