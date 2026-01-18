import React, { useRef, useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Tabs from "./Tabs";
import Welcome from "./Welcome";
import MessageList from "./MessageList";
import ChatInput from "./ChatInput";
import { useChatTabs } from "./useChatTabs";
import { useAutoScroll } from "./useAutoScroll";
import type { Connections, HistoryItem, Message } from "./types";
import { TramiteFlow } from "../components/Tramites";
import { tramitesService } from "../services/tramitesService";
import { aiService } from "../services/aiService";
import { useTramiteStore } from "../store/tramiteStore";

const historyMock: HistoryItem[] = [
  { id: 1, title: "Renovación de cédula", date: "Hace 2 horas", status: "completed" },
  { id: 2, title: "Visa americana", date: "Ayer", status: "in-progress" },
  { id: 3, title: "Licencia de conducir", date: "Hace 3 días", status: "completed" },
];

export default function GobotChat() {
  const { 
    tabs, 
    activeTabId, 
    currentMessages, 
    currentTramite,
    addNewTab, 
    closeTab, 
    switchTab, 
    setTabMessages, 
    pushMessages,
    setTabTramite,
    updateTabTitle,
  } = useChatTabs();

  const { limpiarProgreso } = useTramiteStore();

  const [inputValue, setInputValue] = useState<string>("");
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [tramiteActivo, setTramiteActivo] = useState<string | null>(null);
  const [connections, setConnections] = useState<Connections>({
    whatsapp: false,
    calendar: false,
    gmail: false,
  });

  const endRef = useRef<HTMLDivElement>(null);
  useAutoScroll(endRef, [currentMessages.length, activeTabId]);

  // Limpiar progreso cuando se carga la app inicialmente y no hay trámites activos
  useEffect(() => {
    if (!currentTramite && !tramiteActivo) {
      limpiarProgreso();
    }
  }, []); // Solo al montar el componente

  // showWelcome solo si no hay mensajes Y no hay un trámite activo en esta pestaña
  const showWelcome = currentMessages.length === 0 && !currentTramite;

  const toggleConnection = (service: keyof Connections) => {
    setConnections((prev) => ({ ...prev, [service]: !prev[service] }));
  };

  const onToggleRecording = () => setIsRecording((v) => !v);

  const handleAbrirRamaEnPestaña = (tramiteId: string, nombreTramite: string, prerequisitoId: string) => {
    // Crear nueva pestaña
    addNewTab(tramiteId);
  };

  const onGenerateRoute = () => {
    const routeMessage: Message = {
      id: Date.now(),
      role: "assistant",
      content: "Te armé la mejor ruta según tu ubicación...",
      isRoute: true,
    };
    pushMessages(activeTabId, [routeMessage]);
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
        // Limpiar la respuesta del marcador y mostrarla
        const respuestaLimpia = aiService.limpiarRespuesta(respuestaIA);
        
        const assistantMessage: Message = {
          id: Date.now() + 1,
          role: "assistant",
          content: respuestaLimpia,
        };
        setTabMessages(activeTabId, [...nextMessages, assistantMessage]);
        
        // Activar el flujo de trámite INMEDIATAMENTE
        console.log('🎯 Activando trámite:', tramiteDetectado);
        setTabTramite(activeTabId, tramiteDetectado);
        setTramiteActivo(tramiteDetectado);
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
        
        // Mostrar mensaje de confirmación
        const assistantMessage: Message = {
          id: Date.now() + 1,
          role: "assistant",
          content: `¡Perfecto! Te ayudaré con ${tramiteDetectado.nombre.toLowerCase()}.\n\nTiempo estimado: ~${tramiteDetectado.estimadoDias} días\nCosto: $${tramiteDetectado.costo?.toFixed(2)}\n\n¿Comenzamos?`,
        };
        setTabMessages(activeTabId, [...nextMessages, assistantMessage]);
        
        // Activar flujo INMEDIATAMENTE
        setTabTramite(activeTabId, tramiteDetectado.id);
        setTramiteActivo(tramiteDetectado.id);
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

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar connections={connections} toggleConnection={toggleConnection} history={historyMock} />

      <div className="flex-1 flex flex-col">
        {/* Encabezado amarillo - Pestañas de chat */}
        <div className="bg-yellow-400">
          {showWelcome && <div className="h-[140px]" />}

          {!showWelcome && (
            <Tabs
              tabs={tabs}
              activeTabId={activeTabId}
              onSwitch={switchTab}
              onClose={closeTab}
              onAdd={addNewTab}
            />
          )}
        </div>

        {/* Área de contenido */}
        <div className="flex-1 overflow-y-auto bg-gray-50">
          {currentTramite ? (
            <TramiteFlow 
              tramiteId={currentTramite}
              onAbrirRamaEnPestaña={handleAbrirRamaEnPestaña}
              tabsAbiertos={tabs.map(t => t.title)}
            />
          ) : tramiteActivo ? (
            <TramiteFlow 
              tramiteId={tramiteActivo}
              onAbrirRamaEnPestaña={handleAbrirRamaEnPestaña}
              tabsAbiertos={tabs.map(t => t.title)}
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
            <MessageList messages={currentMessages} onGenerateRoute={onGenerateRoute} endRef={endRef} />
          )}
        </div>

        {!showWelcome && !tramiteActivo && (
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
    </div>
  );
}
