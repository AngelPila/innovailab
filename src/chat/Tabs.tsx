import { X } from "lucide-react";
import type { Tab } from "./types";

type Props = {
  tabs: Tab[];
  activeTabId: number;
  onSwitch: (id: number) => void;
  onClose: (id: number) => void;
  onAdd: () => void;
};

export default function Tabs({ tabs, activeTabId, onSwitch, onClose }: Props) {
  return (
    <div className="flex items-center gap-1 px-6 py-3 bg-gradient-to-r from-govly-primary to-gray-700 border-b border-white/10">
      {tabs.map((tab) => (
        <div
          key={tab.id}
          className={`relative flex items-center gap-2 px-4 py-2.5 cursor-pointer text-sm transition-all duration-300 rounded-t-lg ${
            activeTabId === tab.id
              ? "bg-white text-gray-900 font-semibold shadow-md"
              : "text-gray-300 hover:bg-white/10 hover:text-white"
          }`}
          onClick={() => onSwitch(tab.id)}
        >
          <span className="whitespace-nowrap">{tab.title}</span>

          {tabs.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClose(tab.id);
              }}
              className={`hover:bg-black/10 rounded p-0.5 transition-colors ${
                activeTabId === tab.id ? "text-gray-600 hover:text-gray-900" : "text-gray-400 hover:text-white"
              }`}
              aria-label="Cerrar tab"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Línea azul inferior para tab activo */}
          {activeTabId === tab.id && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-govly-secondary to-indigo-600 rounded-t-sm" />
          )}
        </div>
      ))}
    </div>
  );
}
