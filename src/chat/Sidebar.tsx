import { Settings, Calendar, Mail, MessageCircle, Check, Zap, ChevronLeft, ChevronRight, User, FileText, Plane, CreditCard, Car, Home } from "lucide-react";
import { useState } from "react";
import type { Connections, ActiveGuide } from "./types";

type Props = {
  connections: Connections;
  toggleConnection: (service: keyof Connections) => void;
  activeGuides: ActiveGuide[];
  onSelectGuide?: (tramiteId: string) => void;
};

// Helper function to get icon based on tramiteId
const getTramiteIcon = (tramiteId: string) => {
  const iconMap: Record<string, any> = {
    "pasaporte": Plane,
    "visa-americana": Plane,
    "cedula": FileText,
    "licencia": Car,
    "registro-civil": FileText,
    "default": FileText
  };

  const IconComponent = iconMap[tramiteId] || iconMap.default;
  return IconComponent;
};

export default function Sidebar({ connections, toggleConnection, activeGuides, onSelectGuide }: Props) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const connectedCount = Object.values(connections).filter(Boolean).length;
  const activeGuidesCount = activeGuides.filter(g => g.status === "active").length;

  return (
    <div
      className={`bg-gradient-to-b from-gray-50 to-white border-r border-gray-100 flex flex-col transition-all duration-300 ${isCollapsed ? "w-16" : "w-72"
        }`}
    >
      {/* Header compacto */}
      <div className="bg-gradient-to-br from-yellow-400 via-yellow-400 to-amber-500 px-4 py-4 relative overflow-hidden">
        {/* Elemento decorativo sutil */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />

        <div className="relative flex items-center justify-between">
          {!isCollapsed ? (
            <div className="flex items-center gap-2">
              <Zap className="w-6 h-6 text-gray-900" />
              <h1 className="text-xl font-bold text-gray-900 tracking-tight">Govly</h1>
            </div>
          ) : (
            <Zap className="w-6 h-6 text-gray-900 mx-auto" />
          )}

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 hover:bg-black/10 rounded-lg transition-colors"
            aria-label={isCollapsed ? "Expandir sidebar" : "Colapsar sidebar"}
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4 text-gray-900" />
            ) : (
              <ChevronLeft className="w-4 h-4 text-gray-900" />
            )}
          </button>
        </div>
      </div>

      {/* Perfil compacto */}
      <div className="px-3 py-3 border-b border-gray-100">
        {!isCollapsed ? (
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="w-full flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-all duration-200 group"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="w-4 h-4 text-gray-900" />
              </div>
              <div className="flex-1 text-left min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">Mi Perfil</p>
                <p className="text-xs text-gray-500">Usuario</p>
              </div>
              <Settings className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
            </button>

            {/* Dropdown menu (opcional) */}
            {showProfileMenu && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 overflow-hidden">
                <button className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                  Configuración
                </button>
                <button className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                  Cerrar sesión
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full flex items-center justify-center mx-auto">
            <User className="w-4 h-4 text-gray-900" />
          </div>
        )}
      </div>

      {/* Servicios discretos */}
      <div className="px-3 py-3 border-b border-gray-100">
        {!isCollapsed ? (
          <>
            <p className="text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider px-1">
              Servicios
            </p>
            <div className="space-y-1">
              <button
                onClick={() => toggleConnection("whatsapp")}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all duration-200 ${connections.whatsapp
                  ? "bg-green-50 text-green-700 hover:bg-green-100"
                  : "text-gray-600 hover:bg-gray-50"
                  }`}
              >
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4" />
                  <span className="font-medium">WhatsApp</span>
                </div>
                {connections.whatsapp && (
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                )}
              </button>

              <button
                onClick={() => toggleConnection("calendar")}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all duration-200 ${connections.calendar
                  ? "bg-blue-50 text-blue-700 hover:bg-blue-100"
                  : "text-gray-600 hover:bg-gray-50"
                  }`}
              >
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <div className="flex flex-col items-start">
                    <span className="font-medium">Google Calendar</span>
                    <span className="text-xs opacity-75">
                      {connections.calendar ? "✓ Vinculado" : "No vinculado"}
                    </span>
                  </div>
                </div>
                {connections.calendar && (
                  <div className="w-2 h-2 bg-blue-500 rounded-full" />
                )}
              </button>

              <button
                onClick={() => toggleConnection("gmail")}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all duration-200 ${connections.gmail
                  ? "bg-red-50 text-red-700 hover:bg-red-100"
                  : "text-gray-600 hover:bg-gray-50"
                  }`}
              >
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span className="font-medium">Gmail</span>
                </div>
                {connections.gmail && (
                  <div className="w-2 h-2 bg-red-500 rounded-full" />
                )}
              </button>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${connections.whatsapp ? "bg-green-500" : "bg-gray-300"}`} />
            <div className={`w-2 h-2 rounded-full ${connections.calendar ? "bg-blue-500" : "bg-gray-300"}`} />
            <div className={`w-2 h-2 rounded-full ${connections.gmail ? "bg-red-500" : "bg-gray-300"}`} />
          </div>
        )}
      </div>

      {/* Guías en Curso */}
      <div className="flex-1 overflow-y-auto px-3 py-3">
        {!isCollapsed ? (
          <>
            <div className="flex items-center justify-between mb-2 px-1">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Guías en Curso
              </p>
              {activeGuidesCount > 0 && (
                <span className="text-xs font-bold text-yellow-600 bg-yellow-50 px-2 py-0.5 rounded-full">
                  {activeGuidesCount}
                </span>
              )}
            </div>

            <div className="space-y-2">
              {activeGuides.length === 0 ? (
                <p className="text-xs text-gray-400 text-center py-4">
                  No hay guías activas
                </p>
              ) : (
                activeGuides.map((guide) => {
                  const TramiteIcon = getTramiteIcon(guide.tramiteId);
                  return (
                    <button
                      key={guide.id}
                      onClick={() => onSelectGuide?.(guide.tramiteId)}
                      className="w-full px-3 py-2.5 bg-white hover:bg-gray-50 rounded-lg cursor-pointer transition-all duration-200 border border-gray-100 hover:border-yellow-200 hover:shadow-sm group text-left"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2 flex-1">
                          <div className="w-8 h-8 bg-yellow-50 rounded-lg flex items-center justify-center flex-shrink-0">
                            <TramiteIcon className="w-4 h-4 text-yellow-600" />
                          </div>
                          <h4 className="text-sm font-semibold text-gray-800 leading-tight group-hover:text-yellow-600 transition-colors">
                            {guide.title}
                          </h4>
                        </div>
                        {guide.status === "completed" && (
                          <Check className="w-4 h-4 text-green-600 flex-shrink-0 ml-2" />
                        )}
                      </div>

                      {/* Barra de progreso */}
                      <div className="mb-1.5">
                        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${guide.status === "completed"
                              ? "bg-green-500"
                              : "bg-yellow-500"
                              }`}
                            style={{ width: `${guide.progress}%` }}
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">{guide.lastUpdated}</span>
                        <span className={`text-xs font-bold ${guide.status === "completed" ? "text-green-600" : "text-yellow-600"
                          }`}>
                          {guide.progress}%
                        </span>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center">
            {activeGuidesCount > 0 && (
              <div className="w-6 h-6 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center text-xs font-bold">
                {activeGuidesCount}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
