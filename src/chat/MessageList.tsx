import React from "react";
import { Map, Bot } from "lucide-react";
import ReactMarkdown from "react-markdown";
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
            className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"} animate-slideUp`}
          >
            {/* Avatar del bot (izquierda) */}
            {message.role === "assistant" && (
              <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-govly-secondary to-indigo-600 rounded-full flex items-center justify-center shadow-sm">
                <Bot className="w-5 h-5 text-white" />
              </div>
            )}

            {/* Burbuja de mensaje */}
            <div
              className={`max-w-[75%] rounded-2xl px-5 py-3 shadow-sm ${
                message.role === "user"
                  ? "bg-gradient-to-br from-govly-secondary to-indigo-600 text-white"
                  : "bg-white text-gray-800 border border-gray-200"
              }`}
            >
              {/* Contenido con markdown rendering */}
              {message.role === "assistant" ? (
                <div className="prose prose-sm max-w-none prose-p:my-2 prose-ul:my-2 prose-li:my-1">
                  <ReactMarkdown>{message.content}</ReactMarkdown>
                </div>
              ) : (
                <p className="text-sm leading-relaxed">{message.content}</p>
              )}

              {/* Botón generar ruta */}
              {message.showRouteButton && (
                <button
                  onClick={onGenerateRoute}
                  className="mt-3 flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-govly-secondary to-indigo-600 text-white rounded-lg text-sm font-medium hover:from-indigo-600 hover:to-govly-secondary transition-all duration-300 shadow-sm hover:shadow-md"
                >
                  <Map className="w-4 h-4" />
                  Generar Ruta
                </button>
              )}

              {/* Visualización de ruta */}
              {message.isRoute && (
                <div className="mt-4 p-4 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-200 shadow-sm">
                  <p className="text-xs font-bold text-govly-secondary mb-3 uppercase tracking-wide">
                    📍 Ruta Optimizada
                  </p>
                  <div className="space-y-2.5">
                    {[
                      { n: 1, name: "Registro Civil", time: "9:00 AM" },
                      { n: 2, name: "Banco del Pacífico", time: "10:30 AM" },
                      { n: 3, name: "Notaría", time: "11:45 AM" },
                    ].map((p) => (
                      <div key={p.n} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors">
                        <span className="w-7 h-7 bg-gradient-to-br from-govly-secondary to-indigo-600 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-sm">
                          {p.n}
                        </span>
                        <div className="flex-1">
                          <span className="text-sm font-semibold text-gray-800 block">{p.name}</span>
                          <span className="text-xs text-gray-500">{p.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button className="mt-4 w-full py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg text-sm font-semibold hover:from-emerald-600 hover:to-green-600 transition-all duration-300 shadow-sm hover:shadow-md flex items-center justify-center gap-2">
                    <Map className="w-4 h-4" />
                    Abrir en Google Maps
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Indicador de escritura animado */}
        {/* Puedes agregar esto cuando el bot esté "pensando" */}
        {/* <div className="flex gap-3 justify-start">
          <div className="w-10 h-10 bg-gradient-to-br from-govly-secondary to-indigo-600 rounded-full flex items-center justify-center shadow-sm">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div className="bg-white border border-gray-200 rounded-2xl px-5 py-3 shadow-sm">
            <div className="flex gap-1.5">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" />
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
            </div>
          </div>
        </div> */}

        <div ref={endRef} />
      </div>
    </div>
  );
}
