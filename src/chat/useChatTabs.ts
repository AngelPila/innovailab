import { useMemo, useState } from "react";
import type { Message, Tab } from "./types";

export function useChatTabs() {
  const [tabs, setTabs] = useState<Tab[]>([{ id: 1, title: "Consulta Principal" }]);
  const [activeTabId, setActiveTabId] = useState<number>(1);
  const [messagesByTab, setMessagesByTab] = useState<Record<number, Message[]>>({ 1: [] });

  const currentMessages = useMemo(
    () => messagesByTab[activeTabId] || [],
    [messagesByTab, activeTabId]
  );

  const addNewTab = () => {
    const newId = Math.max(...tabs.map((t) => t.id)) + 1;
    setTabs((prev) => [...prev, { id: newId, title: `Consulta ${newId}` }]);
    setMessagesByTab((prev) => ({ ...prev, [newId]: [] }));
    setActiveTabId(newId);
  };

  const closeTab = (tabId: number) => {
    if (tabs.length === 1) return;

    const nextTabs = tabs.filter((t) => t.id !== tabId);
    setTabs(nextTabs);

    if (activeTabId === tabId) setActiveTabId(nextTabs[0].id);

    setMessagesByTab((prev) => {
      const next = { ...prev };
      delete next[tabId];
      return next;
    });
  };

  const switchTab = (tabId: number) => setActiveTabId(tabId);

  const setTabMessages = (tabId: number, nextMessages: Message[]) => {
    setMessagesByTab((prev) => ({ ...prev, [tabId]: nextMessages }));
  };

  const pushMessages = (tabId: number, newMessages: Message[]) => {
    setMessagesByTab((prev) => ({
      ...prev,
      [tabId]: [...(prev[tabId] || []), ...newMessages],
    }));
  };

  return {
    tabs,
    activeTabId,
    currentMessages,
    addNewTab,
    closeTab,
    switchTab,
    setTabMessages,
    pushMessages,
  };
}
