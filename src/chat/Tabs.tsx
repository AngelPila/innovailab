import { X, Plus, MessageSquare } from "lucide-react";
import type { Tab } from "./types";


type Props = {
  tabs: Tab[];
  activeTabId: number;
  onSwitch: (id: number) => void;
  onClose: (id: number) => void;
  onAdd: () => void;
};

export default function Tabs({ tabs, activeTabId, onSwitch, onClose, onAdd }: Props) {
  return (
    <div className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-yellow-400/90 to-amber-400/90 
                    backdrop-blur-sm border-b border-yellow-500/50 shadow-sm">
      {tabs.map((tab, index) => (
        <div
          key={tab.id}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl cursor-pointer text-sm transition-all duration-300 
                      animate-fadeInUp ${
            activeTabId === tab.id
              ? "bg-white shadow-md text-gray-900 font-semibold scale-105"
              : "bg-black/10 text-gray-800 hover:bg-white/50 hover:shadow-sm"
          }`}
          style={{ animationDelay: `${index * 50}ms` }}
          onClick={() => onSwitch(tab.id)}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span className="whitespace-nowrap max-w-[120px] truncate">{tab.title}</span>

          {/* Permitir cerrar cualquier pestaña, incluso la última */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose(tab.id);
            }}
            className="hover:bg-black/10 rounded-full p-1 transition-colors ml-1"
            aria-label="Cerrar tab"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      ))}

      <button 
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onAdd();
        }} 
        className="p-2.5 bg-white/30 hover:bg-white hover:shadow-md rounded-xl transition-all duration-300 
                   hover:scale-110 active:scale-95" 
        aria-label="Nuevo tab"
      >
        <Plus className="w-4 h-4 text-gray-700" />
      </button>
    </div>
  );
}
