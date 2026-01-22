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
  const { setInputValue, onSend, inputValue } = props;

  const handleQuickAction = (text: string) => {
    setInputValue(text);
    setTimeout(() => {
      // Simular envío automático
      const event = new KeyboardEvent('keydown', { key: 'Enter' });
      const inputElement = document.querySelector('input[placeholder*="Ej:"]') as HTMLInputElement;
      if (inputElement) {
        inputElement.dispatchEvent(event);
      }
    }, 50);
  };

  return (
    <div className="h-full flex flex-col items-center justify-center px-6 pb-20 relative overflow-hidden">
      {/* Fondo con gradiente mesh */}
      <div className="absolute inset-0 gradient-mesh opacity-50 -z-10" />
      
      {/* Elementos decorativos flotantes */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-yellow-300/20 rounded-full blur-2xl animate-float" />
      <div className="absolute bottom-32 right-16 w-32 h-32 bg-blue-400/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
      <div className="absolute top-40 right-20 w-16 h-16 bg-purple-400/15 rounded-full blur-2xl animate-float" style={{ animationDelay: '2s' }} />

      {/* Mensaje de bienvenida del chatbot */}
      <p className="text-sm text-gray-600 mb-6 animate-fadeInUp stagger-1 flex items-center gap-2 bg-blue-50/60 backdrop-blur-sm px-4 py-2 rounded-full border border-blue-100/50">
        <span>👋</span>
        <span className="font-medium">Hola, soy Gobly. Te guío en tus trámites.</span>
      </p>

      {/* Título con jerarquía visual mejorada */}
      <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 text-center animate-fadeInUp stagger-2 tracking-tight">
        ¿Qué trámite quieres{' '}
        <span className="text-yellow-500">
          solucionar
        </span>{' '}
        hoy?
      </h2>
      
      {/* Subtítulo con estructura más escaneable */}
      <div className="text-gray-600 text-center max-w-2xl mb-10 animate-fadeInUp stagger-3 space-y-2">
        <p className="text-sm font-medium text-gray-700">Puedes:</p>
        <div className="flex flex-col gap-1 text-sm">
          <span>• Escribir el nombre del trámite</span>
          <span>• Describir tu situación</span>
          <span>• Preguntarme qué necesitas</span>
        </div>
      </div>

      {/* Botones de acciones rápidas con jerarquía visual */}
      <div className="w-full max-w-3xl mb-10 flex flex-wrap gap-3 justify-center">
        {/* Botón destacado: Obtener pasaporte */}
        <button
          onClick={() => handleQuickAction("Quiero sacar mi pasaporte")}
          className="px-7 py-4 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-2xl text-sm font-bold text-white 
                     hover:from-yellow-500 hover:to-amber-600 hover:shadow-xl hover:-translate-y-1
                     transition-all duration-300 ease-out animate-fadeInUp stagger-4 btn-modern group relative"
          title="Te guío paso a paso"
        >
          <span className="text-lg mr-2">🛂</span>
          <span>Obtener pasaporte</span>
          <span className="absolute inset-0 rounded-2xl bg-white/0 group-hover:bg-white/10 transition-colors" />
        </button>

        {/* Botones secundarios */}
        <button
          onClick={() => handleQuickAction("Necesito renovar mi cédula")}
          className="px-6 py-4 bg-white/80 backdrop-blur-sm border border-gray-300 rounded-2xl text-sm font-medium text-gray-700 
                     hover:border-yellow-400 hover:bg-yellow-50/80 hover:shadow-lg hover:-translate-y-1
                     transition-all duration-300 ease-out animate-fadeInUp stagger-5 btn-modern"
          title="Renueva tu cédula fácilmente"
        >
          <span className="text-lg mr-2">🆔</span>
          <span>Renovar cédula</span>
        </button>
        
        <button
          onClick={() => handleQuickAction("Necesito licencia de conducir")}
          className="px-6 py-4 bg-white/80 backdrop-blur-sm border border-gray-300 rounded-2xl text-sm font-medium text-gray-700 
                     hover:border-blue-400 hover:bg-blue-50/80 hover:shadow-lg hover:-translate-y-1
                     transition-all duration-300 ease-out animate-fadeInUp stagger-6 btn-modern"
          title="Obtén tu licencia de conducir"
        >
          <span className="text-lg mr-2">🚗</span>
          <span>Licencia de conducir</span>
        </button>
      </div>

      {/* Input con mayor protagonismo y feedback visual */}
      <div className="w-full max-w-3xl animate-fadeInUp stagger-7">
        <div className="glass rounded-3xl p-1 border border-gray-200/50 hover:border-yellow-300/50 focus-within:border-yellow-400/70 transition-colors duration-300">
          <ChatInput {...props} />
        </div>
        {/* Microcopy de confianza */}
        <p className="mt-3 text-center text-xs text-gray-500 flex items-center justify-center gap-2">
          <span>🔒</span>
          <span>Tu información es privada y segura</span>
        </p>
      </div>
      
      {/* Indicador y branding */}
      <p className="mt-8 text-gray-500 text-xs animate-fadeInUp stagger-8 font-medium">
        <span className="inline-block mr-1">✨</span>
        Información oficial y actualizada
      </p>
    </div>
  );
}
