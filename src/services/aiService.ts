import { GoogleGenerativeAI } from '@google/generative-ai';
import { tramitesService } from './tramitesService';

class AIService {
  private genAI: GoogleGenerativeAI | null = null;
  private model: any = null;
  private conversationHistory: Array<{ role: string; parts: string }> = [];

  constructor() {
    this.initializeAI();
  }

  private initializeAI() {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🚀 INICIALIZANDO GOVLY AI SERVICE');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    if (!apiKey) {
      console.warn('⚠️  VITE_GEMINI_API_KEY no está configurada.');
      console.warn('📝 El chatbot funcionará en modo básico (sin IA).');
      console.warn('💡 Para activar Gemini AI:');
      console.warn('   1. Obtén tu API key en: https://makersuite.google.com/app/apikey');
      console.warn('   2. Crea un archivo .env en la raíz del proyecto');
      console.warn('   3. Agrega: VITE_GEMINI_API_KEY=tu_key_aqui');
      console.warn('   4. Reinicia el servidor');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
      return;
    }

    try {
      console.log('🔑 API Key detectada:', apiKey.substring(0, 10) + '...' + apiKey.substring(apiKey.length - 4));
      this.genAI = new GoogleGenerativeAI(apiKey);
      this.model = this.genAI.getGenerativeModel({ 
        model: 'gemini-pro',
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
      });
      console.log('✅ Gemini AI inicializado correctamente');
      console.log('🤖 Modelo: gemini-pro');
      console.log('🌡️  Temperature: 0.7 (balanceado)');
      console.log('📊 Max tokens: 1024');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    } catch (error) {
      console.error('❌ Error al inicializar Gemini AI:');
      console.error(error);
      console.warn('⚠️  El chatbot funcionará en modo básico.');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    }
  }

  // Prompt del sistema para guiar a Gemini
  private getSystemPrompt(): string {
    const tramitesDisponibles = tramitesService.getTodos();
    const listaTramites = tramitesDisponibles
      .map(t => `- ${t.nombre}: ${t.descripcion}`)
      .join('\n');

    return `Eres Govly, un asistente virtual especializado en trámites gubernamentales de Ecuador. Tu objetivo es ayudar a usuarios (especialmente adultos mayores) a realizar trámites de manera simple y clara.

TRÁMITES DISPONIBLES:
${listaTramites}

INSTRUCCIONES:
1. Sé amable, claro y conciso
2. Usa lenguaje sencillo, evita términos técnicos
3. Cuando detectes que el usuario quiere hacer un trámite, menciona el nombre exacto del trámite
4. Si el usuario pregunta sobre requisitos, costos o tiempos, proporciona información precisa
5. Siempre ofrece ayuda adicional al final de tu respuesta
6. Usa un tono cálido y paciente

IMPORTANTE: Si detectas que el usuario quiere iniciar un trámite, tu respuesta DEBE incluir la frase exacta: "TRAMITE_DETECTADO: [nombre_del_tramite]" al inicio.

Ejemplos:
- Usuario: "Quiero renovar mi cédula" 
  → "TRAMITE_DETECTADO: renovacion_cedula\n\n¡Perfecto! Te ayudaré con la renovación de tu cédula..."

- Usuario: "Necesito sacar pasaporte"
  → "TRAMITE_DETECTADO: obtener_pasaporte\n\n¡Claro! El pasaporte es importante para viajar..."

Responde siempre en español de Ecuador.`;
  }

  // Enviar mensaje a Gemini
  async sendMessage(userMessage: string): Promise<string> {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📨 MENSAJE DEL USUARIO:', userMessage);
    console.log('🤖 Estado de IA:', this.model ? '✅ Activa (Gemini)' : '⚠️ Modo Básico');
    
    // Si no hay API key, usar respuesta básica
    if (!this.model) {
      console.log('⚠️ No hay API key configurada, usando respuesta básica...');
      const respuesta = this.getFallbackResponse(userMessage);
      console.log('💬 RESPUESTA (Básica):', respuesta);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
      return respuesta;
    }

    try {
      console.log('🔄 Enviando a Gemini AI...');
      
      // Preparar el contexto completo
      const fullPrompt = `${this.getSystemPrompt()}

CONVERSACIÓN ACTUAL:
${this.conversationHistory.map(msg => `${msg.role}: ${msg.parts}`).join('\n')}

Usuario: ${userMessage}

Asistente:`;

      console.log('📝 Historial de conversación:', this.conversationHistory.length / 2, 'mensajes');

      // Enviar a Gemini
      const startTime = Date.now();
      const result = await this.model.generateContent(fullPrompt);
      const response = result.response;
      const text = response.text();
      const endTime = Date.now();

      console.log('⏱️ Tiempo de respuesta:', (endTime - startTime) + 'ms');
      console.log('💬 RESPUESTA DE GEMINI:', text);

      // Guardar en historial
      this.conversationHistory.push({ role: 'user', parts: userMessage });
      this.conversationHistory.push({ role: 'model', parts: text });

      // Mantener solo los últimos 10 mensajes para no exceder límites
      if (this.conversationHistory.length > 20) {
        console.log('🗑️ Limpiando historial antiguo...');
        this.conversationHistory = this.conversationHistory.slice(-20);
      }

      // Detectar si hay un trámite
      const tramiteDetectado = this.detectarTramiteEnRespuesta(text);
      if (tramiteDetectado) {
        console.log('🎯 TRÁMITE DETECTADO:', tramiteDetectado);
      } else {
        console.log('💭 Conversación normal (sin trámite detectado)');
      }

      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
      return text;
    } catch (error) {
      console.error('❌ ERROR AL COMUNICARSE CON GEMINI:');
      console.error(error);
      console.log('🔄 Usando respuesta de fallback...');
      
      const respuesta = this.getFallbackResponse(userMessage);
      console.log('💬 RESPUESTA (Fallback):', respuesta);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
      return respuesta;
    }
  }

  // Detectar si Gemini identificó un trámite
  detectarTramiteEnRespuesta(respuestaIA: string): string | null {
    const match = respuestaIA.match(/TRAMITE_DETECTADO:\s*(\w+)/);
    if (match) {
      return match[1];
    }
    return null;
  }

  // Limpiar el marcador de trámite de la respuesta visible
  limpiarRespuesta(respuestaIA: string): string {
    return respuestaIA.replace(/TRAMITE_DETECTADO:\s*\w+\n\n?/, '').trim();
  }

  // Respuesta de fallback si no hay API
  private getFallbackResponse(userMessage: string): string {
    console.log('🔍 Buscando respuesta en modo básico...');
    
    const tramiteDetectado = tramitesService.detectarIntencion(userMessage);
    
    if (tramiteDetectado) {
      console.log('✅ Trámite detectado (modo básico):', tramiteDetectado.nombre);
      return `TRAMITE_DETECTADO: ${tramiteDetectado.id}

¡Perfecto! Te ayudaré con ${tramiteDetectado.nombre.toLowerCase()}. 

Este trámite toma aproximadamente ${tramiteDetectado.estimadoDias} días y tiene un costo de $${tramiteDetectado.costo?.toFixed(2) || '0.00'}.

Voy a guiarte paso a paso para que completes todo de manera sencilla. ¿Estás listo para comenzar?`;
    }

    // Respuestas genéricas
    console.log('💬 Usando respuesta genérica...');
    const respuestasGenericas = [
      '¡Hola! Soy Govly, tu asistente para trámites. ¿En qué puedo ayudarte hoy?',
      'Estoy aquí para ayudarte con tus trámites. ¿Qué necesitas?',
      'Puedo ayudarte con renovación de cédula, pasaporte, visa americana y licencia de conducir. ¿Cuál te interesa?',
    ];

    const mensajeLower = userMessage.toLowerCase();
    
    if (mensajeLower.includes('hola') || mensajeLower.includes('buenos') || mensajeLower.includes('buenas')) {
      return respuestasGenericas[0];
    }
    
    if (mensajeLower.includes('ayuda') || mensajeLower.includes('qué puedes') || mensajeLower.includes('que puedes')) {
      return respuestasGenericas[2];
    }

    return 'Entiendo. ¿Podrías decirme qué trámite necesitas realizar? Puedo ayudarte con cédula, pasaporte, visa o licencia de conducir.';
  }

  // Limpiar el historial de conversación
  resetConversation(): void {
    console.log('🔄 Reiniciando historial de conversación...');
    this.conversationHistory = [];
    console.log('✅ Historial limpiado');
  }

  // Verificar si la IA está disponible
  isAvailable(): boolean {
    const disponible = this.model !== null;
    console.log('🔍 Estado de IA:', disponible ? '✅ Disponible' : '❌ No disponible');
    return disponible;
  }
}

// Exportar instancia única
export const aiService = new AIService();
