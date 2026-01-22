import { tramitesService } from './tramitesService';

class AIService {
  private conversationHistory: Array<{ role: string; parts: string }> = [];

  constructor() {
    console.log('🚀 AI Service inicializado (modo local sin IA)');
  }

  // Sistema de respuestas predeterminadas por trámite
  private getResponseForTramite(tramiteId: string): string {
    const tramite = tramitesService.getPorId(tramiteId);
    if (!tramite) return '';

    const responses: Record<string, string> = {
      renovacion_cedula: `TRAMITE_DETECTADO: renovacion_cedula

¡Perfecto! Te guiaré en la renovación de tu cédula.

📋 **Información rápida:**
• Tiempo: ~${tramite.estimadoDias} días hábiles
• Costo: $${tramite.costo?.toFixed(2)}
• Documento: ${tramite.descripcion}

Vamos a verificar que tengas todos los requisitos necesarios. Es sencillo y rápido. ¿Estás listo?`,

      obtener_pasaporte: `TRAMITE_DETECTADO: obtener_pasaporte

¡Excelente! Voy a ayudarte a obtener tu pasaporte ecuatoriano.

📋 **Información rápida:**
• Tiempo: ~${tramite.estimadoDias} días hábiles
• Costo: $${tramite.costo?.toFixed(2)}
• Validez: 10 años

Antes de empezar, necesito hacerte unas preguntas rápidas sobre tu situación. Vamos paso a paso. ¿Estás listo?`,

      visa_americana: `TRAMITE_DETECTADO: visa_americana

¡Listo! Te guiaré en tu solicitud de visa americana.

📋 **Información rápida:**
• Tiempo: ~${tramite.estimadoDias} días
• Costo: $${tramite.costo?.toFixed(2)}
• Tipo: Visa de turista (B1/B2)

Este es un trámite importante. Vamos a verificar tus requisitos. ¿Tienes tiempo ahora?`,

      licencia_conducir: `TRAMITE_DETECTADO: licencia_conducir

¡Perfecto! Te ayudaré con tu licencia de conducir.

📋 **Información rápida:**
• Tiempo: ~${tramite.estimadoDias} días hábiles
• Costo: $${tramite.costo?.toFixed(2)}
• Validez: 5 años
• Tipo: Licencia tipo B (vehículos livianos)

Verificaremos tus requisitos. ¿Comenzamos?`,
    };

    return responses[tramiteId] || '';
  }

  // Enviar mensaje a Gemini
  async sendMessage(userMessage: string): Promise<string> {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📨 MENSAJE DEL USUARIO:', userMessage);
    console.log('🤖 Modo: Detección local (sin IA)');

    // Detectar trámite
    const tramiteDetectado = tramitesService.detectarIntencion(userMessage);

    if (tramiteDetectado) {
      const respuesta = this.getResponseForTramite(tramiteDetectado.id);
      console.log('✅ Trámite detectado:', tramiteDetectado.nombre);
      console.log('💬 RESPUESTA:', respuesta);

      // Guardar en historial
      this.conversationHistory.push({ role: 'user', parts: userMessage });
      this.conversationHistory.push({ role: 'assistant', parts: respuesta });

      // Mantener solo últimos 20 mensajes
      if (this.conversationHistory.length > 20) {
        this.conversationHistory = this.conversationHistory.slice(-20);
      }

      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
      return respuesta;
    }

    // Si no se detecta trámite, respuesta genérica
    const respuestasGenericas = [
      '¡Hola! Soy Govly, tu asistente para trámites gubernamentales. ¿En qué puedo ayudarte?\n\nPuedo guiarte en:\n• Renovación de cédula\n• Obtener pasaporte\n• Visa americana\n• Licencia de conducir',
      'Entiendo. ¿Cuál de estos trámites necesitas?\n\n📋 Renovación de cédula\n📋 Pasaporte\n📋 Visa americana\n📋 Licencia de conducir',
      'Estoy aquí para ayudarte. ¿Cuál es tu trámite?',
    ];

    const mensajeLower = userMessage.toLowerCase();
    let respuesta = respuestasGenericas[0];

    if (mensajeLower.includes('hola') || mensajeLower.includes('buenos') || mensajeLower.includes('buenas')) {
      respuesta = respuestasGenericas[0];
    } else if (mensajeLower.includes('ayuda') || mensajeLower.includes('qué puedes')) {
      respuesta = respuestasGenericas[0];
    } else if (mensajeLower.includes('hola') || mensajeLower.length < 5) {
      respuesta = respuestasGenericas[1];
    }

    console.log('💬 Respuesta genérica');
    this.conversationHistory.push({ role: 'user', parts: userMessage });
    this.conversationHistory.push({ role: 'assistant', parts: respuesta });
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    return respuesta;
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
  // Limpiar el historial de conversación
  resetConversation(): void {
    console.log('🔄 Reiniciando historial de conversación...');
    this.conversationHistory = [];
    console.log('✅ Historial limpiado');
  }
  // Detectar si la IA está disponible
  isAvailable(): boolean {
    return true; // Siempre disponible en modo local
  }
}

// Exportar instancia única
export const aiService = new AIService();
