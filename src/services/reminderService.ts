import { calendarService } from './calendarService';
import type {
    UserReminder,
    CreateReminderRequest,
    ReminderType,
    TimeSuggestion,
    FreeTimeSlot
} from '../types/calendar';

/**
 * Servicio de Recordatorios
 * 
 * PRINCIPIO: Govly organiza el tiempo del ciudadano
 * 
 * RESPONSABILIDADES:
 * - Guardar turnos que el usuario ya obtuvo
 * - Crear recordatorios de caducidad
 * - Bloquear tiempo personal
 * - Generar sugerencias (sin crear eventos automáticos)
 */
class ReminderService {
    private reminders: Map<string, UserReminder> = new Map();

    /**
     * Guardar turno que el usuario ya obtuvo externamente
     * 
     * FLUJO:
     * 1. Usuario completa trámite
     * 2. Usuario indica "Ya tengo mi turno"
     * 3. Usuario ingresa fecha y hora
     * 4. Se guarda en Google Calendar
     * 
     * REGLA: La fecha DEBE venir del usuario
     */
    async saveUserAppointment(
        tramiteId: string,
        tramiteName: string,
        userProvidedDate: Date,
        metadata?: UserReminder['metadata']
    ): Promise<UserReminder> {
        if (!userProvidedDate) {
            throw new Error('La fecha debe ser proporcionada por el usuario');
        }

        // Verificar que Calendar esté conectado
        if (!calendarService.isCalendarConnected()) {
            throw new Error('Debes conectar Google Calendar primero');
        }

        // Crear recordatorio
        const reminder: UserReminder = {
            id: this.generateId(),
            tramiteId,
            type: 'user_appointment',
            title: tramiteName,
            description: `Cita para ${tramiteName}`,
            dateTime: userProvidedDate,
            duration: 60, // 1 hora por defecto
            source: 'user_input',
            createdAt: new Date(),
            metadata
        };

        // Crear evento en Google Calendar
        const eventId = await calendarService.createUserEvent(reminder);
        reminder.calendarEventId = eventId;

        // Guardar en memoria
        this.reminders.set(reminder.id, reminder);

        console.log('✅ Turno guardado:', reminder);
        return reminder;
    }

    /**
     * Bloquear tiempo personal para una tarea
     * 
     * PROPÓSITO: Time blocking - organizar tiempo del usuario
     * EJEMPLO: "Bloquear 2 horas mañana para recolectar documentos"
     * 
     * REGLA: El usuario elige cuándo y cuánto tiempo
     */
    async blockTimeForTask(
        tramiteId: string,
        tramiteName: string,
        taskDescription: string,
        userProvidedDate: Date,
        durationMinutes: number,
        metadata?: UserReminder['metadata']
    ): Promise<UserReminder> {
        if (!userProvidedDate) {
            throw new Error('La fecha debe ser proporcionada por el usuario');
        }

        if (!calendarService.isCalendarConnected()) {
            throw new Error('Debes conectar Google Calendar primero');
        }

        const reminder: UserReminder = {
            id: this.generateId(),
            tramiteId,
            type: 'time_block',
            title: `${taskDescription} - ${tramiteName}`,
            description: `Tiempo bloqueado para: ${taskDescription}`,
            dateTime: userProvidedDate,
            duration: durationMinutes,
            source: 'user_input',
            createdAt: new Date(),
            metadata
        };

        const eventId = await calendarService.createUserEvent(reminder);
        reminder.calendarEventId = eventId;

        this.reminders.set(reminder.id, reminder);

        console.log('✅ Tiempo bloqueado:', reminder);
        return reminder;
    }

    /**
     * Crear recordatorio de caducidad de documento
     * 
     * PROPÓSITO: Recordar al usuario cuando su documento esté por caducar
     * EJEMPLO: Licencia válida por 5 años → Recordatorio en 4 años 11 meses
     * 
     * REGLA: La fecha se calcula desde la emisión del documento (dato del usuario)
     */
    async createExpiryReminder(
        tramiteId: string,
        documentType: string,
        issueDate: Date,
        validityYears: number,
        metadata?: UserReminder['metadata']
    ): Promise<UserReminder> {
        if (!calendarService.isCalendarConnected()) {
            throw new Error('Debes conectar Google Calendar primero');
        }

        // Calcular fecha de recordatorio (1 mes antes de caducar)
        const expiryDate = new Date(issueDate);
        expiryDate.setFullYear(expiryDate.getFullYear() + validityYears);

        const reminderDate = new Date(expiryDate);
        reminderDate.setMonth(reminderDate.getMonth() - 1);

        const reminder: UserReminder = {
            id: this.generateId(),
            tramiteId,
            type: 'document_expiry',
            title: `${documentType} está por caducar`,
            description: `Tu ${documentType} caducará el ${expiryDate.toLocaleDateString('es-ES')}. Govly puede ayudarte a renovarlo.`,
            dateTime: reminderDate,
            duration: 0,
            source: 'document_expiry',
            createdAt: new Date(),
            metadata
        };

        const eventId = await calendarService.createUserEvent(reminder);
        reminder.calendarEventId = eventId;

        this.reminders.set(reminder.id, reminder);

        console.log('✅ Recordatorio de caducidad creado:', reminder);
        return reminder;
    }

    /**
     * Generar sugerencias de horarios libres
     * 
     * PROPÓSITO: Asesorar al usuario sobre cuándo tiene tiempo libre
     * REGLA: Govly aconseja, NO agenda automáticamente
     * 
     * FLUJO:
     * 1. Leer calendario del usuario
     * 2. Encontrar espacios libres
     * 3. Mostrar sugerencias en UI
     * 4. Usuario decide si bloquea ese tiempo
     */
    async suggestFreeSlots(
        startDate: Date,
        endDate: Date,
        preferredDuration: number = 120 // 2 horas por defecto
    ): Promise<TimeSuggestion[]> {
        if (!calendarService.isCalendarConnected()) {
            throw new Error('Debes conectar Google Calendar primero');
        }

        // Obtener slots libres del calendario del usuario
        const freeSlots = await calendarService.getUserFreeSlots(startDate, endDate);

        // Filtrar por duración mínima
        const suitableSlots = freeSlots.filter(
            slot => slot.durationMinutes >= preferredDuration
        );

        // Generar sugerencias con razones
        const suggestions: TimeSuggestion[] = suitableSlots.map(slot => ({
            slot,
            reason: this.generateSuggestionReason(slot),
            confidence: this.calculateConfidence(slot)
        }));

        // Ordenar por confianza
        suggestions.sort((a, b) => b.confidence - a.confidence);

        return suggestions.slice(0, 3); // Máximo 3 sugerencias
    }

    /**
     * Obtener todos los recordatorios del usuario
     */
    getUserReminders(): UserReminder[] {
        return Array.from(this.reminders.values());
    }

    /**
     * Obtener recordatorios de un trámite específico
     */
    getRemindersByTramite(tramiteId: string): UserReminder[] {
        return this.getUserReminders().filter(r => r.tramiteId === tramiteId);
    }

    // ============= MÉTODOS PRIVADOS =============

    private generateId(): string {
        return 'reminder_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    private generateSuggestionReason(slot: FreeTimeSlot): string {
        const dayName = slot.start.toLocaleDateString('es-ES', { weekday: 'long' });
        const time = slot.start.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
        const hour = slot.start.getHours();

        let reason = `${dayName} a las ${time}`;

        // Agregar contexto según la hora
        if (hour >= 9 && hour < 12) {
            reason += ' (horario de mañana, menos tráfico)';
        } else if (hour >= 14 && hour < 17) {
            reason += ' (horario de tarde)';
        }

        return reason;
    }

    private calculateConfidence(slot: FreeTimeSlot): number {
        // Preferir horarios de mañana (9-12) y tarde temprano (14-16)
        const hour = slot.start.getHours();

        if (hour >= 9 && hour < 12) {
            return 0.9; // Alta confianza
        } else if (hour >= 14 && hour < 17) {
            return 0.7; // Media-alta
        } else {
            return 0.5; // Media
        }
    }
}

// Exportar instancia singleton
export const reminderService = new ReminderService();
