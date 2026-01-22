import React, { useRef, useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Tabs from "./Tabs";
import Welcome from "./Welcome";
import MessageList from "./MessageList";
import ChatInput from "./ChatInput";
import { useChatTabs } from "./useChatTabs";
import { useAutoScroll } from "./useAutoScroll";
import { useInterfaceStore } from "../store/interfaceStore";
import { InterfaceSelector } from "../components/Tramites";
import type { Connections, ActiveGuide, Message } from "./types";
import { TramiteFlow } from "../components/Tramites";
import { SelectorTramiteMapa, ModalLugaresMapa } from "../components/Mapa";
import { tramitesService } from "../services/tramitesService";
import { aiService } from "../services/aiService";
import { useTramiteStore } from "../store/tramiteStore";
import { Menu, X } from "lucide-react";

const activeGuidesMock: ActiveGuide[] = [
  { id: 1, tramiteId: "pasaporte", title: "Pasaporte", progress: 60, lastUpdated: "Hace 2 horas", status: "active" },
  { id: 2, tramiteId: "visa-americana", title: "Visa Americana", progress: 35, lastUpdated: "Ayer", status: "active" },
];

export default function GobotChat() {
  const {
    tabs,
    activeTabId,
    currentMessages,
    currentTramite,
    esRamaActual,
    addNewTab,
    closeTab,
    switchTab,
    setTabMessages,
    pushMessages,
    setTabTramite,
    updateTabTitle,
  } = useChatTabs();

  const { limpiarProgreso } = useTramiteStore();
  const { selectedVersion, selectVersion, resetVersion } = useInterfaceStore();
  const [sidebarAbierto, setSidebarAbierto] = useState(false);
  const [showInterfaceSelector, setShowInterfaceSelector] = useState(true);

  const [inputValue, setInputValue] = useState<string>("");
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [tramiteActivo, setTramiteActivo] = useState<string | null>(null);
  const [connections, setConnections] = useState<Connections>({
    whatsapp: false,
    calendar: false,
    gmail: false,
  });

  // Estados para el mapa
  const [mostrarSelectorMapa, setMostrarSelectorMapa] = useState(false);
  const [mapaConTramite, setMapaConTramite] = useState<{ id: string; nombre: string } | null>(null);

  const endRef = useRef<HTMLDivElement>(null);
  useAutoScroll(endRef, [currentMessages.length, activeTabId]);

  // Limpiar progreso cuando se carga la app inicialmente y no hay trámites activos
  useEffect(() => {
    if (!currentTramite && !tramiteActivo) {
      limpiarProgreso();
    }
    // Limpiar la versión de interfaz seleccionada al cargar la página
    // para que SIEMPRE muestre el selector
    resetVersion();
  }, []); // Solo al montar el componente

  // Actualizar sidebar cuando cambia la versión
  useEffect(() => {
    if (selectedVersion === 'advanced') {
      setSidebarAbierto(true);
      setShowInterfaceSelector(false);
    } else if (selectedVersion === 'basic') {
      setSidebarAbierto(false);
      setShowInterfaceSelector(false);
    }
  }, [selectedVersion]);

  // Cuando cambia de pestaña y la nueva no tiene trámite, limpiar tramiteActivo
  useEffect(() => {
    if (!currentTramite) {
      setTramiteActivo(null);
    }
  }, [currentTramite, activeTabId]);

  // showWelcome solo si no hay mensajes Y no hay un trámite activo en esta pestaña
  const showWelcome = currentMessages.length === 0 && !currentTramite && !tramiteActivo;

  const toggleConnection = (service: keyof Connections) => {
    setConnections((prev) => ({ ...prev, [service]: !prev[service] }));
  };

  const onToggleRecording = () => setIsRecording((v) => !v);

  const handleAbrirRamaEnPestaña = (tramiteId: string, nombreTramite: string, prerequisitoId: string) => {
    // Crear nueva pestaña al lado del trámite principal
    addNewTab(tramiteId, true);
  };

  const handleVolverAlChat = () => {
    // Limpiar el trámite activo de la pestaña actual para volver al chat
    // Las pestañas se mantienen abiertas
    setTramiteActivo(null);
    setTabTramite(activeTabId, null);
    // No limpiar el progreso global, solo el de esta pestaña
  };

  const onGenerateRoute = () => {
    // Verificar si hay un trámite activo en la conversación actual
    const tramiteEnConversacion = currentTramite || tramiteActivo;

    if (tramiteEnConversacion) {
      // Si hay trámite, obtener su nombre y mostrar directamente el mapa
      const tramiteInfo = tramitesService.getPorId(tramiteEnConversacion);
      if (tramiteInfo) {
        setMapaConTramite({ id: tramiteEnConversacion, nombre: tramiteInfo.nombre });
      } else {
        // Fallback si no encontramos el trámite
        setMostrarSelectorMapa(true);
      }
    } else {
      // Si no hay trámite, mostrar el selector para que el usuario elija
      setMostrarSelectorMapa(true);
    }
  };

  const handleIrAlTramite = (tramiteId: string, tramiteName: string) => {
    // Activar el flujo de trámite y actualizar el título de la pestaña
    setTabTramite(activeTabId, tramiteId);
    setTramiteActivo(tramiteId);
    updateTabTitle(activeTabId, tramiteName);
  };

  const handleSelectGuide = (tramiteId: string) => {
    // Activar el trámite seleccionado desde el sidebar
    const tramiteInfo = tramitesService.getPorId(tramiteId);
    if (tramiteInfo) {
      setTabTramite(activeTabId, tramiteId);
      setTramiteActivo(tramiteId);
      updateTabTitle(activeTabId, tramiteInfo.nombre);
      // Cerrar sidebar en versión básica
      if (selectedVersion === 'basic') {
        setSidebarAbierto(false);
      }
    }
  };

  const handleSeleccionarTramiteMapa = (tramiteId: string, nombreTramite: string) => {
    setMostrarSelectorMapa(false);
    setMapaConTramite({ id: tramiteId, nombre: nombreTramite });
  };

  const handleCerrarMapa = () => {
    setMapaConTramite(null);
  };

  const onSend = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = { id: Date.now(), role: "user", content: inputValue };
    const nextMessages = [...currentMessages, userMessage];

    setTabMessages(activeTabId, nextMessages);
    setInputValue("");

    // Obtener respuesta de la IA
    try {
      const respuestaIA = await aiService.sendMessage(inputValue);

      // Verificar si la IA detectó un trámite
      const tramiteDetectado = aiService.detectarTramiteEnRespuesta(respuestaIA);

      if (tramiteDetectado) {
        const tramiteInfo = tramitesService.getPorId(tramiteDetectado);

        // Construir mensaje breve + tarjetas de info
        const saludo = tramiteInfo
          ? `¡Excelente! Te ayudaré con ${tramiteInfo.nombre.toLowerCase()}.`
          : '¡Excelente! Te ayudaré con tu trámite.';
        const prompt = 'Antes de empezar, necesito hacerte unas preguntas rápidas sobre tu situación. Vamos paso a paso. ¿Estás listo?';

        const quickInfo = {
          tiempo: tramiteInfo?.estimadoDias ? `~${tramiteInfo.estimadoDias} días hábiles` : undefined,
          costo: tramiteInfo?.costo !== undefined ? `$${tramiteInfo.costo.toFixed(2)}` : undefined,
          vigencia:
            tramiteDetectado === 'obtener_pasaporte'
              ? '10 años'
              : tramiteDetectado === 'licencia_conducir'
                ? '5 años'
                : undefined,
        };

        const assistantMessage: Message = {
          id: Date.now() + 1,
          role: "assistant",
          content: `${saludo}\n\n${prompt}`,
          tramiteId: tramiteDetectado,
          tramiteName: tramiteInfo?.nombre,
          quickInfo,
        };
        setTabMessages(activeTabId, [...nextMessages, assistantMessage]);

        // Activar el flujo de trámite INMEDIATAMENTE y actualizar título
        console.log('🎯 Activando trámite:', tramiteDetectado);
        setTabTramite(activeTabId, tramiteDetectado);
        setTramiteActivo(tramiteDetectado);
        if (tramiteInfo?.nombre) {
          updateTabTitle(activeTabId, tramiteInfo.nombre);
        }
      } else {
        // Respuesta normal del chatbot
        const assistantMessage: Message = {
          id: Date.now() + 1,
          role: "assistant",
          content: respuestaIA,
        };
        setTabMessages(activeTabId, [...nextMessages, assistantMessage]);
      }
    } catch (error) {
      console.error('Error al obtener respuesta de IA:', error);

      // Fallback a detección simple
      const tramiteDetectado = tramitesService.detectarIntencion(inputValue);

      if (tramiteDetectado) {
        console.log('🎯 Fallback: Activando trámite:', tramiteDetectado.id);

        // Mostrar mensaje de confirmación con redireccionamiento
        const assistantMessage: Message = {
          id: Date.now() + 1,
          role: "assistant",
          content: `¡Perfecto! Te ayudaré con ${tramiteDetectado.nombre.toLowerCase()}.\n\nTiempo estimado: ~${tramiteDetectado.estimadoDias} días\nCosto: $${tramiteDetectado.costo?.toFixed(2)}\n\n¿Comenzamos?`,
          tramiteId: tramiteDetectado.id,
          tramiteName: tramiteDetectado.nombre,
        };
        setTabMessages(activeTabId, [...nextMessages, assistantMessage]);

        // Activar flujo INMEDIATAMENTE y actualizar título
        setTabTramite(activeTabId, tramiteDetectado.id);
        setTramiteActivo(tramiteDetectado.id);
        updateTabTitle(activeTabId, tramiteDetectado.nombre);
      } else {
        const assistantMessage: Message = {
          id: Date.now() + 1,
          role: "assistant",
          content: "Lo siento, tuve un problema al procesar tu mensaje. ¿Podrías intentar de nuevo?",
        };
        setTabMessages(activeTabId, [...nextMessages, assistantMessage]);
      }
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  // Si no hay versión seleccionada, mostrar selector
  if (showInterfaceSelector) {
    return (
      <InterfaceSelector
        onSelectBasic={() => {
          selectVersion('basic');
          setShowInterfaceSelector(false);
        }}
        onSelectAdvanced={() => {
          selectVersion('advanced');
          setShowInterfaceSelector(false);
        }}
      />
    );
  }

  // Si se debe mostrar el flujo demo de licencia
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar - Visible en versión avanzada, oculto en básica */}
      {sidebarAbierto && (
        <div className="relative">
          <Sidebar
            connections={connections}
            toggleConnection={toggleConnection}
            activeGuides={activeGuidesMock}
            onSelectGuide={handleSelectGuide}
          />
          {/* Botón cerrar sidebar solo en versión básica */}
          {selectedVersion === 'basic' && (
            <button
              onClick={() => setSidebarAbierto(false)}
              className="absolute top-4 right-4 p-2 hover:bg-gray-200 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      )}

      <div className="flex-1 flex flex-col">
        {/* Botón hamburguesa - Solo visible en versión básica cuando sidebar está cerrado */}
        {selectedVersion === 'basic' && !sidebarAbierto && (
          <button
            onClick={() => setSidebarAbierto(true)}
            className="p-4 hover:bg-gray-100 transition-colors"
          >
            <Menu className="w-6 h-6 text-gray-700" />
          </button>
        )}

        {/* Encabezado amarillo - Pestañas de chat */}
        <div className="bg-yellow-400">
          {/* Mostrar pestañas solo si hay más de una, O si hay mensajes/trámites */}
          {(tabs.length > 1 || !showWelcome) ? (
            <Tabs
              tabs={tabs}
              activeTabId={activeTabId}
              onSwitch={switchTab}
              onClose={closeTab}
              onAdd={addNewTab}
            />
          ) : (
            <div className="h-[140px]" />
          )}
        </div>

        {/* Área de contenido */}
        <div className="flex-1 overflow-y-auto bg-gray-50">
          {currentTramite ? (
            <TramiteFlow
              tramiteId={currentTramite}
              esRama={esRamaActual}
              onAbrirRamaEnPestaña={handleAbrirRamaEnPestaña}
              tabsAbiertos={tabs.map(t => t.title)}
              onVolverAlChat={handleVolverAlChat}
            />
          ) : tramiteActivo ? (
            <TramiteFlow
              tramiteId={tramiteActivo}
              esRama={esRamaActual}
              onAbrirRamaEnPestaña={handleAbrirRamaEnPestaña}
              tabsAbiertos={tabs.map(t => t.title)}
              onVolverAlChat={handleVolverAlChat}
            />
          ) : showWelcome ? (
            <Welcome
              inputValue={inputValue}
              setInputValue={setInputValue}
              onKeyDown={onKeyDown}
              onSend={onSend}
              onToggleRecording={onToggleRecording}
              isRecording={isRecording}
              onGenerateRoute={onGenerateRoute}
            />
          ) : (
            <MessageList
              messages={currentMessages}
              onGenerateRoute={onGenerateRoute}
              onIrAlTramite={handleIrAlTramite}
              endRef={endRef}
            />
          )}
        </div>

        {!showWelcome && !tramiteActivo && !currentTramite && (
          <ChatInput
            inputValue={inputValue}
            setInputValue={setInputValue}
            onKeyDown={onKeyDown}
            onSend={onSend}
            onToggleRecording={onToggleRecording}
            isRecording={isRecording}
            onGenerateRoute={onGenerateRoute}
          />
        )}
      </div>

      {/* Modal: Selector de trámite para mapa */}
      {mostrarSelectorMapa && (
        <SelectorTramiteMapa
          onSelectTramite={handleSeleccionarTramiteMapa}
          onClose={() => setMostrarSelectorMapa(false)}
        />
      )}

      {/* Modal: Mapa con lugares del trámite */}
      {mapaConTramite && (
        <ModalLugaresMapa
          tramiteId={mapaConTramite.id}
          nombreTramite={mapaConTramite.nombre}
          onClose={handleCerrarMapa}
        />
      )}
    </div>
  );
}
