import type {
    WhatsAppConnectionStatus,
    WhatsAppMessage,
    WhatsAppMessageType
} from '../types/calendar';

/**
 * Servicio de WhatsApp para Recordatorios
 * 
 * PRINCIPIO: WhatsApp solo para recordatorios, NO para chat
 * 
 * REGLAS ESTRICTAS:
 * - Opt-in obligatorio: Usuario debe vincular explícitamente
 * - Solo 2 tipos de mensajes: confirmación y recordatorio 24h
 * - Sin chat bidireccional
 * - Sin múltiples mensajes
 * - Govly recuerda, NO agenda
 */
class WhatsAppService {
    private isConnected: boolean = false;
    private phoneNumber: string | null = null;
    private connectedAt: Date | null = null;
    private scheduledMessages: Map<string, WhatsAppMessage> = new Map();

    /**
     * Conectar WhatsApp (Opt-in)
     * 
     * FLUJO:
     * 1. Usuario hace clic en "Vincular WhatsApp"
     * 2. Modal explica qué mensajes recibirá
     * 3. Usuario ingresa número de teléfono
     * 4. Usuario confirma vinculación
     * 5. Se guarda la preferencia
     * 
     * TODO: Implementar validación real con WhatsApp Business API
     * Por ahora es simulado para desarrollo
     */
    async connectWhatsApp(phoneNumber: string): Promise<boolean> {
        console.log('📱 Vinculando WhatsApp...');

        // Validar formato de número
        if (!this.validatePhoneNumber(phoneNumber)) {
            throw new Error('Número de teléfono inválido. Usa formato internacional (+593...)');
        }

        // TODO: Implementar validación real con WhatsApp Business API
        // const isValid = await whatsappAPI.validateNumber(phoneNumber);

        // Simulación para desarrollo
        return new Promise((resolve) => {
            setTimeout(() => {
                this.isConnected = true;
                this.phoneNumber = phoneNumber;
                this.connectedAt = new Date();
                console.log(`✅ WhatsApp conectado: ${phoneNumber}`);
                resolve(true);
            }, 1000);
        });
    }

    /**
     * Desconectar WhatsApp
     */
    disconnectWhatsApp(): void {
        this.isConnected = false;
        this.phoneNumber = null;
        this.connectedAt = null;
        this.scheduledMessages.clear();
        console.log('❌ WhatsApp desconectado');
    }

    /**
     * Verificar si WhatsApp está conectado
     */
    isWhatsAppConnected(): boolean {
        return this.isConnected;
    }

    /**
     * Obtener estado de conexión
     */
    getWhatsAppStatus(): WhatsAppConnectionStatus {
        return {
            isConnected: this.isConnected,
            phoneNumber: this.phoneNumber || undefined,
            connectedAt: this.connectedAt || undefined,
            messagesScheduled: this.scheduledMessages.size
        };
    }

    /**
     * Programar mensaje de confirmación
     * 
     * PROPÓSITO: Confirmar que el trámite fue guardado
     * MOMENTO: Inmediatamente después de guardar
     * 
     * REGLA: Solo si el usuario tiene WhatsApp vinculado
     */
    async scheduleConfirmationMessage(
        tramiteId: string,
        tramiteName: string,
        dateTime: Date,
        location?: string,
        requirements?: string[]
    ): Promise<void> {
        if (!this.isConnected) {
            throw new Error('WhatsApp no está conectado');
        }

        const message: WhatsAppMessage = {
            id: this.generateMessageId(),
            tramiteId,
            type: 'confirmation',
            scheduledFor: new Date(), // Enviar inmediatamente
            sent: false,
            content: this.buildConfirmationMessage(tramiteName, dateTime, location, requirements)
        };

        this.scheduledMessages.set(message.id, message);

        // TODO: Enviar mensaje real con WhatsApp Business API
        // await whatsappAPI.sendMessage(this.phoneNumber, message.content);

        // Simulación: marcar como enviado
        setTimeout(() => {
            message.sent = true;
            console.log('📱 Mensaje de confirmación enviado:', message.content);
        }, 500);

        console.log(`📱 Mensaje de confirmación programado para: ${tramiteName}`);
    }

    /**
     * Programar recordatorio 24 horas antes
     * 
     * PROPÓSITO: Recordar al usuario 1 día antes de su cita
     * MOMENTO: 24 horas antes de la fecha del trámite
     * 
     * REGLA: Solo si el usuario tiene WhatsApp vinculado
     */
    async schedule24HourReminder(
        tramiteId: string,
        tramiteName: string,
        dateTime: Date,
        location?: string
    ): Promise<void> {
        if (!this.isConnected) {
            throw new Error('WhatsApp no está conectado');
        }

        // Calcular 24 horas antes
        const reminderTime = new Date(dateTime);
        reminderTime.setHours(reminderTime.getHours() - 24);

        const message: WhatsAppMessage = {
            id: this.generateMessageId(),
            tramiteId,
            type: '24h_reminder',
            scheduledFor: reminderTime,
            sent: false,
            content: this.build24HourReminderMessage(tramiteName, dateTime, location)
        };

        this.scheduledMessages.set(message.id, message);

        // TODO: Programar mensaje real con WhatsApp Business API
        // await whatsappAPI.scheduleMessage(this.phoneNumber, message.content, reminderTime);

        console.log(`📱 Recordatorio 24h programado para: ${reminderTime.toLocaleString('es-ES')}`);
    }

    /**
     * Obtener mensajes programados
     */
    getScheduledMessages(): WhatsAppMessage[] {
        return Array.from(this.scheduledMessages.values());
    }

    /**
     * Obtener mensajes de un trámite específico
     */
    getMessagesByTramite(tramiteId: string): WhatsAppMessage[] {
        return this.getScheduledMessages().filter(m => m.tramiteId === tramiteId);
    }

    // ============= MÉTODOS PRIVADOS =============

    /**
     * Validar número de teléfono
     * REGLA: Debe estar en formato internacional (+código país)
     */
    private validatePhoneNumber(phoneNumber: string): boolean {
        // Formato internacional: +[código país][número]
        // Ejemplo: +593991234567 (Ecuador)
        const phoneRegex = /^\+\d{10,15}$/;
        return phoneRegex.test(phoneNumber.replace(/\s/g, ''));
    }

    /**
     * Construir mensaje de confirmación
     * REGLA: Mensaje corto y claro
     */
    private buildConfirmationMessage(
        tramiteName: string,
        dateTime: Date,
        location?: string,
        requirements?: string[]
    ): string {
        let message = `✅ *Govly*: Tu trámite "${tramiteName}" ha sido guardado.\n\n`;
        message += `📅 *Fecha:* ${dateTime.toLocaleDateString('es-ES', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })} a las ${dateTime.toLocaleTimeString('es-ES', {
            hour: '2-digit',
            minute: '2-digit'
        })}\n\n`;

        if (location) {
            message += `📍 *Lugar:* ${location}\n\n`;
        }

        if (requirements && requirements.length > 0) {
            message += `📋 *Requisitos:*\n`;
            requirements.slice(0, 3).forEach(req => {
                message += `• ${req}\n`;
            });
            if (requirements.length > 3) {
                message += `• ... y ${requirements.length - 3} más\n`;
            }
        }

        return message;
    }

    /**
     * Construir mensaje de recordatorio 24h
     * REGLA: Mensaje corto y urgente
     */
    private build24HourReminderMessage(
        tramiteName: string,
        dateTime: Date,
        location?: string
    ): string {
        let message = `⏰ *Govly*: Recordatorio importante\n\n`;
        message += `Mañana tienes tu cita para "${tramiteName}"\n\n`;
        message += `📅 ${dateTime.toLocaleDateString('es-ES', {
            weekday: 'long',
            day: 'numeric',
            month: 'long'
        })} a las ${dateTime.toLocaleTimeString('es-ES', {
            hour: '2-digit',
            minute: '2-digit'
        })}\n\n`;

        if (location) {
            message += `📍 ${location}\n\n`;
        }

        message += `¡No olvides tus documentos!`;

        return message;
    }

    /**
     * Generar ID único para mensaje
     */
    private generateMessageId(): string {
        return 'wa_msg_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
}

// Exportar instancia singleton
export const whatsappService = new WhatsAppService();
