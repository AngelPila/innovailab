export type Tab = { id: number; title: string };

export type Message = {
  id: number;
  role: "user" | "assistant";
  content: string;
  showRouteButton?: boolean;
  isRoute?: boolean;
  tramiteId?: string;
  tramiteName?: string;
  quickInfo?: {
    tiempo?: string;
    costo?: string;
    vigencia?: string;
  };
};

export type Connections = {
  whatsapp: boolean;
  calendar: boolean;
  gmail: boolean;
};

export type ActiveGuide = {
  id: number;
  tramiteId: string;
  title: string;
  progress: number; // 0-100
  lastUpdated: string;
  status: "active" | "completed";
};
