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

  jubilacion_vejez_iess: `TRAMITE_DETECTADO: jubilacion_vejez_iess

¡Entendido! Vamos a gestionar tu jubilación por vejez del IESS.

📋 **Información rápida:**
• Tiempo: ~${tramite.estimadoDias} días hábiles
• Costo: $${Number(tramite.costo ?? 0).toFixed(2)}
• Beneficio: Pensión mensual vitalicia

Revisemos tu historial de aportes y la cuenta de acreditación. ¿Listo para validar requisitos?`,

  atencion_medica_preferente_iess: `TRAMITE_DETECTADO: atencion_medica_preferente_iess

Puedo activar tu atención médica preferente en el IESS.

📋 **Información rápida:**
• Tiempo: ~${tramite.estimadoDias} días
• Costo: $${Number(tramite.costo ?? 0).toFixed(2)}
• Cobertura: Consultas, medicinas y hospitalización con prioridad

Solo necesitamos validar tu cédula y, si lo tienes, tu carné de jubilado. ¿Continuamos?`,

  afiliacion_voluntaria_iess: `TRAMITE_DETECTADO: afiliacion_voluntaria_iess

Te guío para afiliarte voluntariamente al IESS (salud + pensión).

📋 **Información rápida:**
• Tiempo: ~${tramite.estimadoDias} días
• Costo: $${Number(tramite.costo ?? 0).toFixed(2)}
• Pago: Débito mensual de tus aportes

Confirmemos tu cédula, cuenta bancaria y declaración de salud. ¿Empezamos?`,

  bono_adulto_mayor_mies: `TRAMITE_DETECTADO: bono_adulto_mayor_mies

Voy a ayudarte con el bono para adultos mayores del MIES.

📋 **Información rápida:**
• Tiempo: ~${tramite.estimadoDias} días
• Costo: $${Number(tramite.costo ?? 0).toFixed(2)}
• Pago: Transferencia mensual

Validemos cédula, Registro Social y, si tienes, cuenta bancaria para depósito. ¿Seguimos?`,

  exoneracion_predial_adulto_mayor: `TRAMITE_DETECTADO: exoneracion_predial_adulto_mayor

Gestionemos tu exoneración o descuento del impuesto predial.

📋 **Información rápida:**
• Tiempo: ~${tramite.estimadoDias} días
• Costo: $${Number(tramite.costo ?? 0).toFixed(2)}
• Requisito clave: Ser titular del inmueble

Revisemos cédula, escritura y certificado de pensión/ingresos. ¿Listo para validarlos?`,

  exoneracion_servicios_basicos: `TRAMITE_DETECTADO: exoneracion_servicios_basicos

Te ayudo a solicitar el descuento en servicios básicos.

📋 **Información rápida:**
• Tiempo: ~${tramite.estimadoDias} días
• Costo: $${Number(tramite.costo ?? 0).toFixed(2)}
• Cobertura: Agua, alcantarillado, recolección

Confirmemos tu cédula, planilla y certificado de pensión. ¿Continuamos?`,

  transporte_preferente_adulto_mayor: `TRAMITE_DETECTADO: transporte_preferente_adulto_mayor

Configuramos tu beneficio de transporte preferente.

📋 **Información rápida:**
• Tiempo: ~${tramite.estimadoDias} día
• Costo: $${Number(tramite.costo ?? 0).toFixed(2)}
• Beneficio: Pasajes gratuitos o con descuento mostrando la cédula

Solo validaré tu cédula. ¿Avanzamos?`,

  devolucion_iva_adulto_mayor: `TRAMITE_DETECTADO: devolucion_iva_adulto_mayor

Tramitemos la devolución del IVA para adulto mayor.

📋 **Información rápida:**
• Tiempo: ~${tramite.estimadoDias} días
• Costo: $${Number(tramite.costo ?? 0).toFixed(2)}
• Periodicidad: Devolución mensual

Necesito validar tus facturas a tu cédula y, si quieres abono, la cuenta bancaria. ¿Listo?`,

  exoneracion_matricula_vehicular_adulto_mayor: `TRAMITE_DETECTADO: exoneracion_matricula_vehicular_adulto_mayor

Vamos por la exoneración de matrícula vehicular para adulto mayor.

📋 **Información rápida:**
• Tiempo: ~${tramite.estimadoDias} días
• Costo: $${Number(tramite.costo ?? 0).toFixed(2)}
• Alcance: Tasas municipales y ANT

Validemos cédula, matrícula vigente y certificado de propiedad. ¿Seguimos?`,

  testamento_notarial: `TRAMITE_DETECTADO: testamento_notarial

Te guío para preparar tu testamento en notaría.

📋 **Información rápida:**
• Tiempo: ~${tramite.estimadoDias} días
• Costo: ~$${Number(tramite.costo ?? 0).toFixed(2)}
• Requisito: Presencia para firma ante notario

Confirmemos cédula y, si tienes, listado de bienes y certificado médico. ¿Avanzamos?`,

  poder_notarial_adulto_mayor: `TRAMITE_DETECTADO: poder_notarial_adulto_mayor

Te ayudo a otorgar un poder notarial.

📋 **Información rápida:**
• Tiempo: ~${tramite.estimadoDias} día
• Costo: ~$${Number(tramite.costo ?? 0).toFixed(2)}
• Uso: Delegar trámites a un familiar o apoderado

Revisemos cédulas (tuya y del apoderado) y, si aplica, el certificado médico. ¿Empezamos?`,
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
      console.log('🤖 AI detectó trámite:', match[1]);
      return match[1];
    }
    console.log('🤖 AI no detectó ningún trámite');
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
