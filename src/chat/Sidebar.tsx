import { Settings, Calendar, Mail, MessageCircle, Check, Clock } from "lucide-react";
import type { Connections, HistoryItem } from "./types";

type Props = {
  connections: Connections;
  toggleConnection: (service: keyof Connections) => void;
  history: HistoryItem[];
};

export default function Sidebar({ connections, toggleConnection, history }: Props) {
  return (
    <div className="w-[30%] bg-white border-r border-gray-200 flex flex-col">
      <div className="bg-yellow-400 px-6 py-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Govly</h1>
        
        <button className="w-full flex items-center gap-3 px-4 py-2.5 text-gray-900 hover:bg-yellow-500 rounded-lg transition-colors">
          <Settings className="w-5 h-5" />
          <span className="font-medium">Perfil</span>
        </button>
      </div>

      <div className="px-4 py-3 border-b border-gray-200">
        <p className="text-xs font-semibold text-gray-500 mb-2.5 uppercase tracking-wide">
          Conectar servicios
        </p>

        <div className="space-y-1.5">
          <button
            onClick={() => toggleConnection("whatsapp")}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-sm transition-colors ${
              connections.whatsapp ? "bg-green-500 text-white" : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <div className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4" />
              <span className="font-medium">WhatsApp</span>
            </div>
            {connections.whatsapp && <Check className="w-4 h-4" />}
          </button>

          <button
            onClick={() => toggleConnection("calendar")}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-sm transition-colors ${
              connections.calendar ? "bg-blue-500 text-white" : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span className="font-medium">Google Calendar</span>
            </div>
            {connections.calendar && <Check className="w-4 h-4" />}
          </button>

          <button
            onClick={() => toggleConnection("gmail")}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-sm transition-colors ${
              connections.gmail ? "bg-red-500 text-white" : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              <span className="font-medium">Gmail</span>
            </div>
            {connections.gmail && <Check className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-3">
        <p className="text-xs font-semibold text-gray-500 mb-2.5 uppercase tracking-wide">Historial</p>

        <div className="space-y-1.5">
          {history.map((item) => (
            <div
              key={item.id}
              className="px-3 py-2.5 hover:bg-gray-50 rounded-md cursor-pointer transition-colors border border-transparent hover:border-gray-200"
            >
              <div className="flex items-start justify-between mb-0.5">
                <h4 className="text-sm font-medium text-gray-800 leading-tight">{item.title}</h4>
                {item.status === "completed" ? (
                  <Check className="w-3.5 h-3.5 text-green-600 flex-shrink-0" />
                ) : (
                  <Clock className="w-3.5 h-3.5 text-yellow-600 flex-shrink-0" />
                )}
              </div>
              <p className="text-xs text-gray-500">{item.date}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
