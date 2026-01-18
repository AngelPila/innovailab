import { Map, Send } from "lucide-react";
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
    <div className="p-6 bg-gradient-to-b from-gray-50 to-white border-t border-gray-200">
      <div className="max-w-4xl mx-auto flex items-center gap-3">
        <button
          onClick={onGenerateRoute}
          className="p-3 bg-gradient-to-r from-govly-secondary to-indigo-600 hover:from-indigo-600 hover:to-govly-secondary text-white rounded-full transition-all duration-300 shadow-sm hover:shadow-md flex-shrink-0"
          title="Generar ruta óptima"
        >
          <Map className="w-5 h-5" />
        </button>

        <div className="flex-1 flex items-center gap-3 bg-white border-2 border-gray-200 rounded-full px-5 py-3 shadow-elevated hover:border-govly-secondary/50 transition-all duration-300 focus-within:border-govly-secondary focus-within:shadow-lg">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Escribe tu mensaje o usa el micrófono..."
            className="flex-1 bg-transparent outline-none text-gray-800 placeholder-gray-400 text-base"
          />

          <VoiceButton onResult={handleVoiceResult} />

          <button
            onClick={onSend}
            disabled={!inputValue.trim()}
            className="p-2.5 bg-gradient-to-r from-govly-secondary to-indigo-600 text-white rounded-full hover:from-indigo-600 hover:to-govly-secondary transition-all duration-300 shadow-sm hover:shadow-md disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:shadow-sm"
            aria-label="Enviar"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
