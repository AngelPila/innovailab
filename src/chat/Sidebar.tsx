import { Plus, X, MessageSquare } from "lucide-react";
import type { Tab } from "./types";

type Props = {
  tabs: Tab[];
  activeTabId: number;
  onSwitchTab: (id: number) => void;
  onCloseTab: (id: number) => void;
  onNewChat: () => void;
};

export default function Sidebar({ tabs, activeTabId, onSwitchTab, onCloseTab, onNewChat }: Props) {
  return (
    <div className="w-[280px] bg-gradient-to-b from-govly-primary to-gray-700 text-white flex flex-col shadow-elevated">
      {/* Header con gradiente */}
      <div className="px-6 py-6 border-b border-white/10">
        <h1 className="text-2xl font-bold mb-6">Govly Chat</h1>
        
        {/* Botón Nuevo Chat prominente */}
        <button 
          onClick={onNewChat}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-govly-secondary to-indigo-600 hover:from-indigo-600 hover:to-govly-secondary text-white rounded-lg transition-all duration-300 shadow-sm hover:shadow-md font-medium"
        >
          <Plus className="w-5 h-5" />
          <span>Nuevo Chat</span>
        </button>
      </div>

      {/* Lista de tabs con scroll */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <p className="text-xs font-semibold text-gray-300 mb-3 uppercase tracking-wide px-2">
          Conversaciones
        </p>

        <div className="space-y-2">
          {tabs.map((tab) => (
            <div
              key={tab.id}
              onClick={() => onSwitchTab(tab.id)}
              className={`group relative px-4 py-3 rounded-lg cursor-pointer transition-all duration-200 ${
                activeTabId === tab.id
                  ? "bg-white/20 shadow-sm"
                  : "hover:bg-white/10"
              }`}
            >
              <div className="flex items-center gap-3">
                <MessageSquare className="w-4 h-4 flex-shrink-0 text-gray-300" />
                <span className="flex-1 text-sm font-medium truncate">
                  {tab.title}
                </span>
                
                {/* Botón cerrar tab */}
                {tabs.length > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onCloseTab(tab.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 hover:bg-white/20 rounded transition-all"
                    aria-label="Cerrar chat"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Indicador activo */}
              {activeTabId === tab.id && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-govly-secondary rounded-r-full" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Footer con información */}
      <div className="px-6 py-4 border-t border-white/10">
        <p className="text-xs text-gray-300 text-center">
          Asistente Gubernamental IA
        </p>
      </div>
    </div>
  );
}
