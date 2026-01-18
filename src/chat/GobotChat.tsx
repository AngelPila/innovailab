import React, { useRef, useState } from "react";
import Sidebar from "./Sidebar";
import Tabs from "./Tabs";
import Welcome from "./Welcome";
import MessageList from "./MessageList";
import ChatInput from "./ChatInput";
import { useChatTabs } from "./useChatTabs";
import { useAutoScroll } from "./useAutoScroll";
import type { Connections, HistoryItem, Message } from "./types";

const historyMock: HistoryItem[] = [
  { id: 1, title: "Renovación de cédula", date: "Hace 2 horas", status: "completed" },
  { id: 2, title: "Visa americana", date: "Ayer", status: "in-progress" },
  { id: 3, title: "Licencia de conducir", date: "Hace 3 días", status: "completed" },
];

export default function GobotChat() {
  const { tabs, activeTabId, currentMessages, addNewTab, closeTab, switchTab, setTabMessages, pushMessages } =
    useChatTabs();

  const [inputValue, setInputValue] = useState<string>("");
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [connections, setConnections] = useState<Connections>({
    whatsapp: false,
    calendar: false,
    gmail: false,
  });

  const endRef = useRef<HTMLDivElement>(null);
  useAutoScroll(endRef, [currentMessages.length, activeTabId]);

  const showWelcome = currentMessages.length === 0;

  const toggleConnection = (service: keyof Connections) => {
    setConnections((prev) => ({ ...prev, [service]: !prev[service] }));
  };

  const onToggleRecording = () => setIsRecording((v) => !v);

  const onGenerateRoute = () => {
    const routeMessage: Message = {
      id: Date.now(),
      role: "assistant",
      content: "Te armé la mejor ruta según tu ubicación...",
      isRoute: true,
    };
    pushMessages(activeTabId, [routeMessage]);
  };

  const onSend = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = { id: Date.now(), role: "user", content: inputValue };
    const nextMessages = [...currentMessages, userMessage];

    setTabMessages(activeTabId, nextMessages);
    setInputValue("");

    setTimeout(() => {
      const assistantMessage: Message = {
        id: Date.now() + 1,
        role: "assistant",
        content: "Entendido. Para ese trámite vas a necesitar algunos documentos específicos...",
        showRouteButton: true,
      };
      setTabMessages(activeTabId, [...nextMessages, assistantMessage]);
    }, 800);
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

      <div className="flex-1 flex flex-col bg-yellow-400">
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

        <div className="flex-1 overflow-y-auto bg-gray-50">
          {showWelcome ? (
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

        {!showWelcome && (
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
