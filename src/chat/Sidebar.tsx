import { Settings, Calendar, Mail, MessageCircle, Check, Clock, Zap } from "lucide-react";
import type { Connections, HistoryItem } from "./types";

type Props = {
  connections: Connections;
  toggleConnection: (service: keyof Connections) => void;
  history: HistoryItem[];
};

export default function Sidebar({ connections, toggleConnection, history }: Props) {
  return (
    <div className="w-[30%] bg-gradient-to-b from-gray-50 to-white border-r border-gray-100 flex flex-col">
      {/* Header con gradiente moderno */}
      <div className="bg-gradient-to-br from-yellow-400 via-yellow-400 to-amber-500 px-6 py-5 relative overflow-hidden">
        {/* Elemento decorativo */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-20 h-20 bg-black/5 rounded-full translate-y-1/2 -translate-x-1/2" />
        
        <div className="relative">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-7 h-7 text-gray-900" />
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Govly</h1>
          </div>
          
          <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-900 bg-black/10 hover:bg-black/20 
                           rounded-xl transition-all duration-300 backdrop-blur-sm">
            <Settings className="w-5 h-5" />
            <span className="font-semibold">Mi Perfil</span>
          </button>
        </div>
      </div>

      {/* Servicios con estilo moderno */}
      <div className="px-4 py-4 border-b border-gray-100">
        <p className="text-xs font-bold text-gray-400 mb-3 uppercase tracking-wider flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full" />
          Conectar servicios
        </p>

        <div className="space-y-2">
          <button
            onClick={() => toggleConnection("whatsapp")}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm transition-all duration-300 ${
              connections.whatsapp 
                ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/25" 
                : "text-gray-700 bg-white hover:bg-gray-50 border border-gray-100 hover:border-green-200 hover:shadow-md"
            }`}
          >
            <div className="flex items-center gap-3">
              <MessageCircle className="w-5 h-5" />
              <span className="font-medium">WhatsApp</span>
            </div>
            {connections.whatsapp && <Check className="w-5 h-5" />}
          </button>

          <button
            onClick={() => toggleConnection("calendar")}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm transition-all duration-300 ${
              connections.calendar 
                ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/25" 
                : "text-gray-700 bg-white hover:bg-gray-50 border border-gray-100 hover:border-blue-200 hover:shadow-md"
            }`}
          >
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5" />
              <span className="font-medium">Google Calendar</span>
            </div>
            {connections.calendar && <Check className="w-5 h-5" />}
          </button>

          <button
            onClick={() => toggleConnection("gmail")}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm transition-all duration-300 ${
              connections.gmail 
                ? "bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-lg shadow-red-500/25" 
                : "text-gray-700 bg-white hover:bg-gray-50 border border-gray-100 hover:border-red-200 hover:shadow-md"
            }`}
          >
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5" />
              <span className="font-medium">Gmail</span>
            </div>
            {connections.gmail && <Check className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Historial con scroll moderno */}
      <div className="flex-1 overflow-y-auto px-4 py-4 scrollbar-modern">
        <p className="text-xs font-bold text-gray-400 mb-3 uppercase tracking-wider flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
          Historial
        </p>

        <div className="space-y-2">
          {history.map((item, index) => (
            <div
              key={item.id}
              className="px-4 py-3 bg-white hover:bg-gray-50 rounded-xl cursor-pointer transition-all duration-300 
                         border border-gray-100 hover:border-yellow-200 hover:shadow-md group animate-fadeInUp"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-start justify-between mb-1">
                <h4 className="text-sm font-semibold text-gray-800 leading-tight group-hover:text-yellow-600 transition-colors">
                  {item.title}
                </h4>
                {item.status === "completed" ? (
                  <span className="p-1 bg-green-100 rounded-full">
                    <Check className="w-3 h-3 text-green-600" />
                  </span>
                ) : (
                  <span className="p-1 bg-yellow-100 rounded-full">
                    <Clock className="w-3 h-3 text-yellow-600" />
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-400 font-medium">{item.date}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
