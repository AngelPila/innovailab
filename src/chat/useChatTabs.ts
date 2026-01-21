import { useMemo, useState } from "react";
import type { Message, Tab } from "./types";

export function useChatTabs() {
  const [tabs, setTabs] = useState<Tab[]>([{ id: 1, title: "Consulta Principal" }]);
  const [activeTabId, setActiveTabId] = useState<number>(1);
  const [messagesByTab, setMessagesByTab] = useState<Record<number, Message[]>>({ 1: [] });
  const [tramitesByTab, setTramitesByTab] = useState<Record<number, string | null>>({ 1: null });
  const [esRamaByTab, setEsRamaByTab] = useState<Record<number, boolean>>({ 1: false });

  const currentMessages = useMemo(
    () => messagesByTab[activeTabId] || [],
    [messagesByTab, activeTabId]
  );

  const currentTramite = useMemo(
    () => tramitesByTab[activeTabId] || null,
    [tramitesByTab, activeTabId]
  );

  const esRamaActual = useMemo(
    () => esRamaByTab[activeTabId] || false,
    [esRamaByTab, activeTabId]
  );

  const addNewTab = (tramiteId?: string, insertAfterCurrentTab: boolean = false) => {
    const newId = Math.max(...tabs.map((t) => t.id), 0) + 1;
    
    // Mapeo de IDs a nombres amigables
    const nombresTramites: Record<string, string> = {
      renovacion_cedula: '↳ Renovación Cédula',
      obtener_pasaporte: '↳ Obtener Pasaporte',
      visa_americana: '↳ Visa Americana',
      licencia_conducir: '↳ Licencia de Conducir',
    };
    
    // Si no se proporciona tramiteId, crear un chat vacío
    let titulo = tramiteId ? (nombresTramites[tramiteId] || `↳ ${tramiteId}`) : `Chat ${newId}`;
    
    // Si insertAfterCurrentTab es true, insertar después de la pestaña actual
    if (insertAfterCurrentTab) {
      const currentIndex = tabs.findIndex(t => t.id === activeTabId);
      setTabs((prev) => {
        const newTabs = [...prev];
        newTabs.splice(currentIndex + 1, 0, { id: newId, title: titulo });
        return newTabs;
      });
    } else {
      setTabs((prev) => [...prev, { id: newId, title: titulo }]);
    }
    
    setMessagesByTab((prev) => ({ ...prev, [newId]: [] }));
    setTramitesByTab((prev) => ({ ...prev, [newId]: tramiteId || null }));
    setEsRamaByTab((prev) => ({ ...prev, [newId]: insertAfterCurrentTab }));
    setActiveTabId(newId);
  };

  const closeTab = (tabId: number) => {
    const nextTabs = tabs.filter((t) => t.id !== tabId);
    
    // Si no quedan pestañas, volver al estado inicial con Consulta Principal vacía
    if (nextTabs.length === 0) {
      setTabs([{ id: 1, title: "Consulta Principal" }]);
      setMessagesByTab({ 1: [] });
      setTramitesByTab({ 1: null });
      setEsRamaByTab({ 1: false });
      setActiveTabId(1);
      return;
    }

    setTabs(nextTabs);
    if (activeTabId === tabId) setActiveTabId(nextTabs[0].id);

    setMessagesByTab((prev) => {
      const next = { ...prev };
      delete next[tabId];
      return next;
    });

    setTramitesByTab((prev) => {
      const next = { ...prev };
      delete next[tabId];
      return next;
    });

    setEsRamaByTab((prev) => {
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

  const setTabTramite = (tabId: number, tramiteId: string | null) => {
    setTramitesByTab((prev) => ({ ...prev, [tabId]: tramiteId }));
  };

  const updateTabTitle = (tabId: number, title: string) => {
    setTabs((prev) => prev.map((t) => (t.id === tabId ? { ...t, title } : t)));
  };

  return {
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
  };
}
