import React from "react";
import { FileText, MapPin, Calendar, HelpCircle } from "lucide-react";
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

const suggestions = [
  { 
    icon: FileText, 
    text: "Renovar mi cédula", 
    query: "Necesito renovar mi cédula",
    gradient: "from-blue-500 to-cyan-500"
  },
  { 
    icon: MapPin, 
    text: "Obtener pasaporte", 
    query: "Quiero sacar mi pasaporte",
    gradient: "from-purple-500 to-pink-500"
  },
  { 
    icon: Calendar, 
    text: "Licencia de conducir", 
    query: "Necesito licencia de conducir",
    gradient: "from-green-500 to-emerald-500"
  },
  { 
    icon: HelpCircle, 
    text: "Visa americana", 
    query: "Cómo tramitar visa americana",
    gradient: "from-orange-500 to-red-500"
  },
];

export default function Welcome(props: Props) {
  const { setInputValue } = props;

  return (
    <div className="h-full flex flex-col items-center justify-center px-6 pb-20 animate-fadeIn">
      {/* Logo gubernamental */}
      <div className="mb-8">
        <div className="w-20 h-20 bg-gradient-to-br from-govly-secondary to-indigo-600 rounded-2xl flex items-center justify-center shadow-elevated">
          <span className="text-4xl">🏛️</span>
        </div>
      </div>

      {/* Título con gradiente */}
      <h2 className="text-5xl font-bold text-center mb-4 bg-gradient-to-r from-govly-primary to-govly-secondary bg-clip-text text-transparent animate-slideUp">
        ¿Qué trámite quieres solucionar hoy?
      </h2>
      <p className="text-lg text-gray-600 text-center max-w-2xl mb-10 animate-slideUp">
        Escribe el nombre del trámite, describe tu situación o pregúntame lo que necesites.
      </p>

      {/* Cards de sugerencias con hover effects */}
      <div className="w-full max-w-4xl mb-10 grid grid-cols-2 gap-4 animate-slideUp">
        {suggestions.map((suggestion, index) => {
          const Icon = suggestion.icon;
          return (
            <button
              key={index}
              onClick={() => setInputValue(suggestion.query)}
              className="group relative p-6 bg-white border-2 border-gray-200 rounded-2xl text-left hover:border-govly-secondary hover:shadow-lg transition-all duration-300 overflow-hidden"
            >
              {/* Efecto de gradiente al hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${suggestion.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
              
              <div className="relative flex items-center gap-4">
                <div className={`p-3 bg-gradient-to-br ${suggestion.gradient} rounded-xl text-white shadow-sm group-hover:shadow-md group-hover:scale-110 transition-all duration-300`}>
                  <Icon className="w-6 h-6" />
                </div>
                <span className="text-lg font-semibold text-gray-800 group-hover:text-govly-secondary transition-colors">
                  {suggestion.text}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Input de chat */}
      <div className="w-full max-w-3xl">
        <ChatInput {...props} />
      </div>
    </div>
  );
}
