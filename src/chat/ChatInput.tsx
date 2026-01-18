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
    <div className="p-6 bg-white">
      <div className="max-w-4xl mx-auto flex items-center gap-3">
        <button
          onClick={onGenerateRoute}
          className="p-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full transition-colors flex-shrink-0"
          title="Generar ruta óptima"
        >
          <Map className="w-5 h-5" />
        </button>

        <div className="flex-1 flex items-center gap-3 bg-white border border-gray-300 rounded-full px-5 py-3 shadow-sm">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Escribe tu mensaje o usa el micrófono"
            className="flex-1 bg-transparent outline-none text-gray-800 placeholder-gray-500 text-base"
          />

          <VoiceButton onResult={handleVoiceResult} />

          <button
            onClick={onSend}
            disabled={!inputValue.trim()}
            className="p-2 bg-yellow-400 text-gray-900 rounded-full hover:bg-yellow-500 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label="Enviar"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
