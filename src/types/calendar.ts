/**
 * Tipos para Google Calendar Integration
 * 
 * REGLA FUNDAMENTAL: Govly organiza el tiempo del ciudadano, NO el sistema del Estado
 * - Nunca simular turnos oficiales
 * - Nunca generar fechas automáticamente
 * - Solo guardar datos proporcionados por el usuario
 */

// Tipos de recordatorios permitidos
export type ReminderType =
    | 'user_appointment'    // Turno que el usuario ya obtuvo externamente
    | 'time_block'          // Bloqueo de tiempo personal
    | 'document_expiry'     // Recordatorio de caducidad
    | 'suggestion';         // Sugerencia de horario libre

// Origen de los datos
export type ReminderSource =
    | 'user_input'          // Usuario ingresó la fecha manualmente
    | 'document_expiry'     // Calculado desde fecha de emisión del documento
    | 'system_suggestion';  // Sugerencia del sistema (no crea evento automáticamente)

/**
 * Recordatorio de usuario
 * REGLA: La fecha SIEMPRE viene del usuario o es calculada desde datos del usuario
 */
export type UserReminder = {
    id: string;
    tramiteId: string;
    type: ReminderType;
    title: string;
    description: string;
    dateTime?: Date;              // Solo si el usuario lo proporciona
    duration?: number;            // Duración en minutos (para time blocking)
    source: ReminderSource;
    calendarEventId?: string;     // ID del evento en Google Calendar
    createdAt: Date;
    metadata?: {
        officialUrl?: string;       // Enlace al sitio oficial
        requirements?: string[];    // Lista de requisitos
        location?: string;          // Ubicación de la institución
    };
};

/**
 * Evento de Google Calendar
 */
export type CalendarEvent = {
    id: string;
    summary: string;
    description?: string;
    location?: string;
    start: {
        dateTime: string;
        timeZone: string;
    };
    end: {
        dateTime: string;
        timeZone: string;
    };
    reminders?: {
        useDefault: boolean;
        overrides?: Array<{
            method: 'email' | 'popup';
            minutes: number;
        }>;
    };
};

/**
 * Slot de tiempo libre (para sugerencias)
 * REGLA: Solo para asesoría, nunca para crear turnos automáticos
 */
export type FreeTimeSlot = {
    start: Date;
    end: Date;
    durationMinutes: number;
};

/**
 * Sugerencia de horario
 * REGLA: Govly aconseja, no agenda
 */
export type TimeSuggestion = {
    slot: FreeTimeSlot;
    reason: string;           // Por qué es una buena opción
    confidence: number;       // 0-1, qué tan seguro está el sistema
};

/**
 * Request para crear recordatorio
 * REGLA: Siempre requiere input del usuario
 */
export type CreateReminderRequest = {
    tramiteId: string;
    type: ReminderType;
    userProvidedDate?: Date;  // Fecha que el usuario ingresó
    duration?: number;        // Para time blocking
    metadata?: UserReminder['metadata'];
};

/**
 * Estado de conexión de Google Calendar
 */
export type CalendarConnectionStatus = {
    isConnected: boolean;
    userEmail?: string;
    connectedAt?: Date;
    scopes: string[];
};
