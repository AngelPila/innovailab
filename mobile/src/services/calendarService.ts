import type {
    CalendarEvent,
    CalendarConnectionStatus,
    FreeTimeSlot,
    UserReminder
} from '../types/calendar';

/**
 * Servicio de Google Calendar
 * 
 * PRINCIPIO: Govly organiza el tiempo del ciudadano, NO el sistema del Estado
 * 
 * REGLAS ESTRICTAS:
 * - OAuth on-demand: Solo conectar cuando el usuario lo necesita
 * - Nunca crear turnos oficiales automáticos
 * - Nunca simular disponibilidad gubernamental
 * - Solo crear eventos con datos proporcionados por el usuario
 */
class CalendarService {
    private accessToken: string | null = null;
    private refreshToken: string | null = null;
    private isConnected: boolean = false;
    private userEmail: string | null = null;

    /**
     * Conectar con Google Calendar (OAuth 2.0)
     * 
     * FLUJO:
     * 1. Usuario hace click en acción relacionada con Calendar
     * 2. Si no está conectado, se abre popup OAuth
     * 3. Usuario autoriza solo permisos de Calendar
     * 4. Se guarda el token y se ejecuta la acción
     * 
     * TODO: Implementar OAuth real con Google
     * Por ahora es simulado para desarrollo
     */
    async connectOnDemand(): Promise<boolean> {
        console.log('🔐 Iniciando OAuth con Google Calendar...');

        // TODO: Implementar OAuth real
        // const auth = await gapi.auth2.getAuthInstance().signIn();
        // this.accessToken = auth.getAuthResponse().access_token;

        // Simulación para desarrollo
        return new Promise((resolve) => {
            setTimeout(() => {
                this.isConnected = true;
                this.accessToken = 'mock_token_' + Date.now();
                this.userEmail = 'usuario@gmail.com';
                console.log('✅ Google Calendar conectado (simulado)');
                resolve(true);
            }, 1000);
        });
    }

    /**
     * Desconectar Google Calendar
     */
    disconnect(): void {
        this.isConnected = false;
        this.accessToken = null;
        this.refreshToken = null;
        this.userEmail = null;
        console.log('❌ Google Calendar desconectado');
    }

    /**
     * Obtener estado de conexión
     */
    getConnectionStatus(): CalendarConnectionStatus {
        return {
            isConnected: this.isConnected,
            userEmail: this.userEmail || undefined,
            connectedAt: this.isConnected ? new Date() : undefined,
            scopes: ['https://www.googleapis.com/auth/calendar.events']
        };
    }

    /**
     * Verificar si está conectado
     */
    isCalendarConnected(): boolean {
        return this.isConnected;
    }

    /**
     * Crear evento en Google Calendar con datos del usuario
     * 
     * REGLA: Solo crear eventos con información proporcionada por el usuario
     * - La fecha DEBE venir del usuario
     * - El título debe ser claro sobre el origen
     * - La descripción debe incluir enlace oficial
     */
    async createUserEvent(reminder: UserReminder): Promise<string> {
        if (!this.isConnected) {
            throw new Error('Google Calendar no está conectado. Conecta primero.');
        }

        if (!reminder.dateTime) {
            throw new Error('La fecha debe ser proporcionada por el usuario');
        }

        // Construir evento
        const event: Omit<CalendarEvent, 'id'> = {
            summary: this.buildEventTitle(reminder),
            description: this.buildEventDescription(reminder),
            location: reminder.metadata?.location,
            start: {
                dateTime: reminder.dateTime.toISOString(),
                timeZone: 'America/Bogota'
            },
            end: {
                dateTime: this.calculateEndTime(reminder.dateTime, reminder.duration || 60).toISOString(),
                timeZone: 'America/Bogota'
            },
            reminders: {
                useDefault: false,
                overrides: [
                    { method: 'popup', minutes: 24 * 60 },  // 1 día antes
                    { method: 'popup', minutes: 60 }         // 1 hora antes
                ]
            }
        };

        // TODO: Llamada real a Google Calendar API
        // const response = await gapi.client.calendar.events.insert({
        //   calendarId: 'primary',
        //   resource: event
        // });

        // Simulación para desarrollo
        const eventId = 'event_' + Date.now();
        console.log('📅 Evento creado en Google Calendar:', event);

        return eventId;
    }

    /**
     * Obtener slots de tiempo libre del usuario
     * 
     * PROPÓSITO: Solo para sugerencias, NO para crear turnos automáticos
     * REGLA: Govly aconseja, no agenda
     */
    async getUserFreeSlots(startDate: Date, endDate: Date): Promise<FreeTimeSlot[]> {
        if (!this.isConnected) {
            throw new Error('Google Calendar no está conectado');
        }

        // TODO: Llamada real a Google Calendar API
        // const response = await gapi.client.calendar.freebusy.query({
        //   timeMin: startDate.toISOString(),
        //   timeMax: endDate.toISOString(),
        //   items: [{ id: 'primary' }]
        // });

        // Simulación: Generar algunos slots libres
        return this.mockFreeSlots(startDate, endDate);
    }

    // ============= MÉTODOS PRIVADOS =============

    /**
     * Construir título del evento
     * REGLA: Debe ser claro sobre el origen (usuario, recordatorio, etc)
     */
    private buildEventTitle(reminder: UserReminder): string {
        switch (reminder.type) {
            case 'user_appointment':
                return `Cita: ${reminder.title}`;
            case 'time_block':
                return `Tiempo bloqueado: ${reminder.title}`;
            case 'document_expiry':
                return `Recordatorio: ${reminder.title}`;
            default:
                return reminder.title;
        }
    }

    /**
     * Construir descripción del evento
     * REGLA: Incluir requisitos, enlace oficial, y clarificar origen
     */
    private buildEventDescription(reminder: UserReminder): string {
        let description = reminder.description + '\n\n';

        // Requisitos
        if (reminder.metadata?.requirements && reminder.metadata.requirements.length > 0) {
            description += '📋 Requisitos:\n';
            reminder.metadata.requirements.forEach(req => {
                description += `• ${req}\n`;
            });
            description += '\n';
        }

        // Enlace oficial
        if (reminder.metadata?.officialUrl) {
            description += `🔗 Sitio oficial: ${reminder.metadata.officialUrl}\n\n`;
        }

        // Clarificar origen
        if (reminder.source === 'user_input') {
            description += '✅ Turno obtenido externamente por el usuario\n';
        } else if (reminder.source === 'document_expiry') {
            description += '⏰ Recordatorio personal de Govly\n';
        }

        description += '\n📱 Organizado con Govly - Tu asistente de trámites';

        return description;
    }

    /**
     * Calcular hora de fin del evento
     */
    private calculateEndTime(startTime: Date, durationMinutes: number): Date {
        const endTime = new Date(startTime);
        endTime.setMinutes(endTime.getMinutes() + durationMinutes);
        return endTime;
    }

    /**
     * Mock: Generar slots libres simulados
     */
    private mockFreeSlots(startDate: Date, endDate: Date): FreeTimeSlot[] {
        const slots: FreeTimeSlot[] = [];
        const currentDate = new Date(startDate);

        while (currentDate < endDate) {
            // Simular slots libres en horario laboral
            const morningSlot = new Date(currentDate);
            morningSlot.setHours(10, 0, 0, 0);

            const afternoonSlot = new Date(currentDate);
            afternoonSlot.setHours(15, 0, 0, 0);

            if (morningSlot >= startDate && morningSlot < endDate) {
                slots.push({
                    start: new Date(morningSlot),
                    end: new Date(morningSlot.getTime() + 2 * 60 * 60000), // 2 horas
                    durationMinutes: 120
                });
            }

            if (afternoonSlot >= startDate && afternoonSlot < endDate) {
                slots.push({
                    start: new Date(afternoonSlot),
                    end: new Date(afternoonSlot.getTime() + 2 * 60 * 60000), // 2 horas
                    durationMinutes: 120
                });
            }

            currentDate.setDate(currentDate.getDate() + 1);
        }

        return slots.slice(0, 5); // Máximo 5 sugerencias
    }
}

// Exportar instancia singleton
export const calendarService = new CalendarService();
