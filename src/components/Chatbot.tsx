import { useState, useRef, useEffect } from 'react'
import '../styles/Chatbot.css'

interface Message {
  id: string
  text: string
  sender: 'user' | 'bot'
  timestamp: Date
}

interface ConversationHistory {
  role: 'user' | 'model'
  parts: Array<{ text: string }>
}

const Chatbot = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: '¡Hola! Soy tu asistente virtual alimentado por Gemini AI. ¿En qué puedo ayudarte hoy?',
      sender: 'bot',
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const conversationHistoryRef = useRef<ConversationHistory[]>([])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const generateBotResponse = async (userMessage: string): Promise<string> => {
    const apiKey = import.meta.env.VITE_GOOGLE_API_KEY

    if (!apiKey) {
      throw new Error(
        'No se encontró la clave API de Google. Configura VITE_GOOGLE_API_KEY en tu archivo .env'
      )
    }

    try {
      // Preparar historial de conversación
      const contents = [
        ...conversationHistoryRef.current,
        {
          role: 'user',
          parts: [{ text: userMessage }],
        },
      ]

      // Llamar a la API de Gemini
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: contents,
            generationConfig: {
              maxOutputTokens: 1000,
              temperature: 0.7,
            },
          }),
        }
      )

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(
          errorData.error?.message || `API error: ${response.statusText}`
        )
      }

      const data = await response.json()

      // Extraer la respuesta
      const botResponse = data.candidates?.[0]?.content?.parts?.[0]?.text

      if (!botResponse) {
        throw new Error('No se recibió respuesta del modelo')
      }

      // Actualizar historial
      conversationHistoryRef.current = [
        ...contents,
        {
          role: 'model',
          parts: [{ text: botResponse }],
        },
      ]

      return botResponse
    } catch (err) {
      throw new Error(
        'Error al conectar con Gemini AI: ' +
          (err instanceof Error ? err.message : String(err))
      )
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSendMessage = async () => {
    if (!input.trim()) return

    // Agregar mensaje del usuario
    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsLoading(true)
    setError(null)

    try {
      // Obtener respuesta de Gemini AI
      const botResponseText = await generateBotResponse(input)

      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponseText,
        sender: 'bot',
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, botResponse])
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err)
      setError(errorMessage)

      // Agregar mensaje de error al chat
      const errorResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Lo siento, hubo un error al procesar tu mensaje. Por favor, intenta de nuevo.',
        sender: 'bot',
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorResponse])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="chatbot-container">
      <div className="chatbot-header">
        <h1>Asistente Virtual con Gemini AI</h1>
        <p>Alimentado por Google Gemini 1.5 Flash</p>
      </div>

      {error && <div className="error-banner">{error}</div>}

      <div className="messages-container">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`message ${message.sender === 'user' ? 'user-message' : 'bot-message'}`}
          >
            <div className="message-bubble">
              <p>{message.text}</p>
              <span className="message-time">
                {message.timestamp.toLocaleTimeString('es-ES', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="message bot-message">
            <div className="message-bubble typing">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="input-container">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Escribe tu mensaje aquí..."
          disabled={isLoading}
          className="message-input"
        />
        <button
          onClick={handleSendMessage}
          disabled={isLoading || !input.trim()}
          className="send-button"
        >
          {isLoading ? '...' : 'Enviar'}
        </button>
      </div>
    </div>
  )
}

export default Chatbot
