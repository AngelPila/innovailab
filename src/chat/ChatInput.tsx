import { Map, Send, Sparkles } from "lucide-react";
import type { KeyboardEvent } from "react";
import { VoiceButton } from "../components/Voice";

type Props = {
  inputValue: string;
  setInputValue: (v: string) => void;
  onKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void;
  onSend: () => void;
  onToggleRecording: () => void;
  isRecording: boolean;
  onGenerateRoute: () => void;
};

export default function ChatInput({
  inputValue,
  setInputValue,
  onKeyDown,
  onSend,
  onToggleRecording,
  isRecording,
  onGenerateRoute,
}: Props) {
  // Handler para cuando el reconocimiento de voz termina
  const handleVoiceResult = (text: string) => {
    // Insertar el texto reconocido en el input
    setInputValue(text);
  };

  return (
    <div className="p-4 bg-transparent">
      <div className="max-w-4xl mx-auto flex items-center gap-3">
        {/* Botón de mapa con estilo moderno */}
        <button
          onClick={onGenerateRoute}
          className="p-3.5 bg-white/80 backdrop-blur-sm hover:bg-white text-gray-600 hover:text-blue-600 
                     rounded-2xl transition-all duration-300 flex-shrink-0 shadow-md hover:shadow-lg 
                     hover:-translate-y-0.5 border border-gray-100"
          title="Generar ruta óptima"
        >
          <Map className="w-5 h-5" />
        </button>

        {/* Input container con estilo glass moderno y focus amarillo */}
        <div className="flex-1 flex items-center gap-3 bg-white/90 backdrop-blur-sm border border-gray-200 
                        rounded-2xl px-5 py-4 shadow-lg hover:shadow-xl transition-all duration-300
                        focus-within:border-yellow-400 focus-within:ring-4 focus-within:ring-yellow-100/70 focus-within:shadow-yellow-200/30">
          <Sparkles className="w-5 h-5 text-yellow-500 flex-shrink-0" />
          
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Ej: Quiero sacar mi pasaporte por primera vez"
            className="flex-1 bg-transparent outline-none text-gray-800 placeholder-gray-400 text-base font-medium"
          />

          <VoiceButton onResult={handleVoiceResult} />

          {/* Botón enviar con gradiente y glow */}
          <button
            onClick={onSend}
            disabled={!inputValue.trim()}
            className="p-2.5 bg-gradient-to-r from-yellow-400 to-amber-500 text-gray-900 rounded-xl 
                       hover:from-yellow-500 hover:to-amber-600 transition-all duration-300 
                       disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:from-yellow-400 
                       disabled:hover:to-amber-500 shadow-md hover:shadow-lg hover:shadow-yellow-300/50
                       hover:-translate-y-0.5 active:translate-y-0"
            aria-label="Enviar"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
