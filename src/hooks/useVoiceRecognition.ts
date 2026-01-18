import { useState, useEffect, useRef, useCallback } from 'react';

// Extensión de Window para incluir SpeechRecognition
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
}

interface UseVoiceRecognitionReturn {
  isListening: boolean;
  transcript: string;
  isSupported: boolean;
  startListening: () => void;
  stopListening: () => void;
  resetTranscript: () => void;
  error: string | null;
}

export const useVoiceRecognition = (): UseVoiceRecognitionReturn => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  
  // Verificar si el navegador soporta la API
  const isSupported = typeof window !== 'undefined' && 
    ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);

  // Inicializar el reconocimiento de voz
  useEffect(() => {
    if (!isSupported) {
      setError('Tu navegador no soporta reconocimiento de voz. Intenta usar Chrome o Edge.');
      return;
    }

    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognitionAPI();

    // Configuración del reconocimiento
    recognition.lang = 'es-EC'; // Español de Ecuador
    recognition.continuous = false; // Se detiene automáticamente después de una pausa
    recognition.interimResults = true; // Mostrar resultados intermedios mientras habla
    recognition.maxAlternatives = 1;

    // Evento cuando se recibe un resultado
    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const current = event.resultIndex;
      const transcriptResult = event.results[current][0].transcript;
      
      // Actualizar el transcript con resultados intermedios
      setTranscript(transcriptResult);
    };

    // Evento cuando el reconocimiento se detiene
    recognition.onend = () => {
      setIsListening(false);
    };

    // Manejo de errores
    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error('Error en reconocimiento de voz:', event.error);
      setIsListening(false);
      
      switch (event.error) {
        case 'no-speech':
          setError('No se detectó voz. Por favor, intenta de nuevo.');
          break;
        case 'audio-capture':
          setError('No se pudo acceder al micrófono. Verifica los permisos.');
          break;
        case 'not-allowed':
          setError('Permiso de micrófono denegado. Permite el acceso al micrófono.');
          break;
        case 'network':
          setError('Error de red. Verifica tu conexión a internet.');
          break;
        default:
          setError(`Error: ${event.error}`);
      }
    };

    // Guardar la referencia
    recognitionRef.current = recognition;

    // Cleanup
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [isSupported]);

  // Iniciar el reconocimiento
  const startListening = useCallback(() => {
    if (!recognitionRef.current || isListening) return;
    
    setError(null);
    setTranscript('');
    
    try {
      recognitionRef.current.start();
      setIsListening(true);
    } catch (error) {
      console.error('Error al iniciar reconocimiento:', error);
      setError('No se pudo iniciar el reconocimiento de voz.');
    }
  }, [isListening]);

  // Detener el reconocimiento
  const stopListening = useCallback(() => {
    if (!recognitionRef.current || !isListening) return;
    
    try {
      recognitionRef.current.stop();
      setIsListening(false);
    } catch (error) {
      console.error('Error al detener reconocimiento:', error);
    }
  }, [isListening]);

  // Resetear el transcript
  const resetTranscript = useCallback(() => {
    setTranscript('');
    setError(null);
  }, []);

  return {
    isListening,
    transcript,
    isSupported,
    startListening,
    stopListening,
    resetTranscript,
    error,
  };
};
