export type Tab = { id: number; title: string };

export type Message = {
  id: number;
  role: "user" | "assistant";
  content: string;
  showRouteButton?: boolean;
  isRoute?: boolean;
};

export type Connections = {
  whatsapp: boolean;
  calendar: boolean;
  gmail: boolean;
};

export type HistoryItem = {
  id: number;
  title: string;
  date: string;
  status: "completed" | "in-progress";
};
