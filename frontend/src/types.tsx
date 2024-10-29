export interface CalendarEvent {
    id: string;
    summary: string;
    location?: string;
    description?: string;
    start: {
        dateTime: string; // ISO 8601 format
    };
    end: {
        dateTime: string; // ISO 8601 format
    };
}