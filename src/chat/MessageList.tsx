import React from "react";
import { Map } from "lucide-react";
import type { Message } from "./types";

type Props = {
  messages: Message[];
  onGenerateRoute: () => void;
  endRef: React.RefObject<HTMLDivElement | null>;
};

export default function MessageList({ messages, onGenerateRoute, endRef }: Props) {
  return (
    <div className="px-6 py-6">
      <div className="max-w-4xl mx-auto space-y-4">
        {messages.map((message) => (
          <div 
            key={message.id} 
            className={`flex ${message.role === "user" ? "justify-end" : "justify-start"} ${
              message.role === "user" ? "chat-message-enter-user" : "chat-message-enter-assistant"
            }`}
          >
            <div
              className={`max-w-[75%] rounded-2xl px-4 py-3 ${
                message.role === "user"
                  ? "bg-gray-900 text-white"
                  : "bg-white text-gray-800 border border-gray-200"
              }`}
            >
              <p className="text-sm leading-relaxed">{message.content}</p>

              {message.showRouteButton && (
                <button
                  onClick={onGenerateRoute}
                  className="mt-3 flex items-center gap-2 px-3 py-2 bg-yellow-400 text-gray-900 rounded-lg text-sm font-medium hover:bg-yellow-500 transition-colors"
                >
                  <Map className="w-4 h-4" />
                  Generar Ruta
                </button>
              )}

              {message.isRoute && (
                <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-xs font-semibold text-gray-600 mb-2">Lugares a visitar:</p>
                  <div className="space-y-2">
                    {[
                      { n: 1, name: "Registro Civil" },
                      { n: 2, name: "Banco del Pacífico" },
                      { n: 3, name: "Notaría" },
                    ].map((p) => (
                      <div key={p.n} className="flex items-center gap-2 text-sm">
                        <span className="w-5 h-5 bg-yellow-400 text-gray-900 rounded-full flex items-center justify-center text-xs font-bold">
                          {p.n}
                        </span>
                        <span className="text-gray-700">{p.name}</span>
                      </div>
                    ))}
                  </div>

                  <button className="mt-3 w-full py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                    Abrir en Google Maps
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}

        <div ref={endRef} />
      </div>
    </div>
  );
}
