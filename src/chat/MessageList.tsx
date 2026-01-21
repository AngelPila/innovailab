import React from "react";
import { Map, Bot, User } from "lucide-react";
import type { Message } from "./types";

type Props = {
  messages: Message[];
  onGenerateRoute: () => void;
  endRef: React.RefObject<HTMLDivElement | null>;
};

export default function MessageList({ messages, onGenerateRoute, endRef }: Props) {
  return (
    <div className="px-6 py-6">
      <div className="max-w-4xl mx-auto space-y-5">
        {messages.map((message) => (
          <div 
            key={message.id} 
            className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"} ${
              message.role === "user" ? "message-enter-user" : "message-enter-assistant"
            }`}
          >
            {/* Avatar para asistente */}
            {message.role === "assistant" && (
              <div className="flex-shrink-0 w-9 h-9 bg-gradient-to-br from-yellow-400 to-amber-500 
                              rounded-xl flex items-center justify-center shadow-md shadow-yellow-400/30">
                <Bot className="w-5 h-5 text-gray-900" />
              </div>
            )}

            <div
              className={`max-w-[75%] rounded-2xl px-5 py-3.5 shadow-sm transition-all duration-300 hover:shadow-md ${
                message.role === "user"
                  ? "bg-gradient-to-br from-gray-800 to-gray-900 text-white"
                  : "bg-white/90 backdrop-blur-sm text-gray-800 border border-gray-100"
              }`}
            >
              <p className="text-sm leading-relaxed">{message.content}</p>

              {message.showRouteButton && (
                <button
                  onClick={onGenerateRoute}
                  className="mt-3 flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-yellow-400 to-amber-500 
                             text-gray-900 rounded-xl text-sm font-semibold hover:shadow-lg hover:shadow-yellow-400/30 
                             transition-all duration-300 hover:-translate-y-0.5"
                >
                  <Map className="w-4 h-4" />
                  Generar Ruta
                </button>
              )}

              {message.isRoute && (
                <div className="mt-4 p-4 bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-xl border border-gray-200">
                  <p className="text-xs font-bold text-gray-500 mb-3 uppercase tracking-wider">Lugares a visitar:</p>
                  <div className="space-y-2.5">
                    {[
                      { n: 1, name: "Registro Civil" },
                      { n: 2, name: "Banco del Pacífico" },
                      { n: 3, name: "Notaría" },
                    ].map((p) => (
                      <div key={p.n} className="flex items-center gap-3 text-sm group">
                        <span className="w-6 h-6 bg-gradient-to-br from-yellow-400 to-amber-500 text-gray-900 rounded-lg 
                                        flex items-center justify-center text-xs font-bold shadow-sm 
                                        group-hover:scale-110 transition-transform">
                          {p.n}
                        </span>
                        <span className="text-gray-700 font-medium group-hover:text-gray-900 transition-colors">{p.name}</span>
                      </div>
                    ))}
                  </div>

                  <button className="mt-4 w-full py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl 
                                     text-sm font-semibold hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 
                                     hover:-translate-y-0.5">
                    Abrir en Google Maps
                  </button>
                </div>
              )}
            </div>

            {/* Avatar para usuario */}
            {message.role === "user" && (
              <div className="flex-shrink-0 w-9 h-9 bg-gradient-to-br from-gray-700 to-gray-900 
                              rounded-xl flex items-center justify-center shadow-md">
                <User className="w-5 h-5 text-white" />
              </div>
            )}
          </div>
        ))}

        <div ref={endRef} />
      </div>
    </div>
  );
}
