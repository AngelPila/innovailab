import { X, Plus } from "lucide-react";
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
    <div className="flex items-center gap-2 px-6 py-3 border-b border-yellow-500">
      {tabs.map((tab) => (
        <div
          key={tab.id}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-md cursor-pointer text-sm transition-colors ${
            activeTabId === tab.id
              ? "bg-yellow-400 text-gray-900 font-medium"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
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
              className="hover:bg-black/10 rounded p-0.5"
              aria-label="Cerrar tab"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      ))}

      <button onClick={onAdd} className="p-1.5 hover:bg-gray-100 rounded-md" aria-label="Nuevo tab">
        <Plus className="w-4 h-4 text-gray-600" />
      </button>
    </div>
  );
}
