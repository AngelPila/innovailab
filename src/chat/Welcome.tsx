import React from "react";
import ChatInput from "./ChatInput";

type Props = {
  inputValue: string;
  setInputValue: (v: string) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onSend: () => void;
  onToggleRecording: () => void;
  isRecording: boolean;
  onGenerateRoute: () => void;
};

export default function Welcome(props: Props) {
  const { setInputValue } = props;

  return (
    <div className="h-full flex flex-col items-center justify-center px-6 pb-20">
      <h2 className="text-4xl font-bold text-gray-900 mb-3 text-center">
        ¿Qué trámite quieres solucionar hoy?
      </h2>
      <p className="text-gray-600 text-center max-w-2xl mb-6">
        Escribe el nombre del trámite, describe tu situación o pregúntame lo que necesites.
      </p>

      <div className="w-full max-w-3xl mb-6 flex gap-3 justify-center">
        <button
          onClick={() => setInputValue("Necesito renovar mi cédula")}
          className="px-5 py-2.5 bg-white border border-gray-300 rounded-full text-sm text-gray-700 hover:border-yellow-400 hover:bg-yellow-50 transition-colors"
        >
          Renovar cédula
        </button>
        <button
          onClick={() => setInputValue("Quiero sacar mi pasaporte")}
          className="px-5 py-2.5 bg-white border border-gray-300 rounded-full text-sm text-gray-700 hover:border-yellow-400 hover:bg-yellow-50 transition-colors"
        >
          Obtener pasaporte
        </button>
        <button
          onClick={() => setInputValue("Necesito licencia de conducir")}
          className="px-5 py-2.5 bg-white border border-gray-300 rounded-full text-sm text-gray-700 hover:border-yellow-400 hover:bg-yellow-50 transition-colors"
        >
          Licencia de conducir
        </button>
      </div>

      <div className="w-full max-w-3xl">
        {/* reutilizamos ChatInput para no duplicar UI */}
        <ChatInput {...props} />
      </div>
    </div>
  );
}
