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
    <div className="h-full flex flex-col items-center justify-center px-6 pb-20 relative overflow-hidden">
      {/* Fondo con gradiente mesh */}
      <div className="absolute inset-0 gradient-mesh opacity-50 -z-10" />
      
      {/* Elementos decorativos flotantes */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-yellow-300/20 rounded-full blur-2xl animate-float" />
      <div className="absolute bottom-32 right-16 w-32 h-32 bg-blue-400/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
      <div className="absolute top-40 right-20 w-16 h-16 bg-purple-400/15 rounded-full blur-2xl animate-float" style={{ animationDelay: '2s' }} />

      {/* Título con animación más dramática */}
      <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 text-center animate-fadeInUp stagger-1 tracking-tight">
        ¿Qué trámite quieres{' '}
        <span className="text-yellow-500">
          solucionar
        </span>{' '}
        hoy?
      </h2>
      
      {/* Subtítulo con delay */}
      <p className="text-gray-600 text-center max-w-2xl mb-8 text-lg animate-fadeInUp stagger-2">
        Escribe el nombre del trámite, describe tu situación o pregúntame lo que necesites.
      </p>

      {/* Botones con animación escalonada y estilo moderno */}
      <div className="w-full max-w-3xl mb-8 flex flex-wrap gap-3 justify-center">
        <button
          onClick={() => setInputValue("Necesito renovar mi cédula")}
          className="px-6 py-3 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl text-sm font-medium text-gray-700 
                     hover:border-yellow-400 hover:bg-yellow-50 hover:shadow-lg hover:-translate-y-1
                     transition-all duration-300 ease-out animate-fadeInUp stagger-3 btn-modern"
        >
          <span className="mr-2">🆔</span>
          Renovar cédula
        </button>
        <button
          onClick={() => setInputValue("Quiero sacar mi pasaporte")}
          className="px-6 py-3 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl text-sm font-medium text-gray-700 
                     hover:border-blue-400 hover:bg-blue-50 hover:shadow-lg hover:-translate-y-1
                     transition-all duration-300 ease-out animate-fadeInUp stagger-4 btn-modern"
        >
          <span className="mr-2">🛂</span>
          Obtener pasaporte
        </button>
        <button
          onClick={() => setInputValue("Necesito licencia de conducir")}
          className="px-6 py-3 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl text-sm font-medium text-gray-700 
                     hover:border-green-400 hover:bg-green-50 hover:shadow-lg hover:-translate-y-1
                     transition-all duration-300 ease-out animate-fadeInUp stagger-5 btn-modern"
        >
          <span className="mr-2">🚗</span>
          Licencia de conducir
        </button>
      </div>

      {/* Input con animación y estilo glass */}
      <div className="w-full max-w-3xl animate-fadeInUp stagger-6">
        <div className="glass rounded-3xl p-1">
          <ChatInput {...props} />
        </div>
      </div>
      
      {/* Indicador de scroll o tip */}
      <p className="mt-8 text-gray-400 text-sm animate-fadeInUp stagger-7 flex items-center gap-2">
        <span className="animate-pulse-soft">✨</span>
        Powered by AI para ayudarte con tus trámites
      </p>
    </div>
  );
}
