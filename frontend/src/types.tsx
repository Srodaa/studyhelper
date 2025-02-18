export interface CalendarEvent {
  id?: string;
  summary?: string;
  location?: string;
  description?: string;
  start: {
    dateTime: string; // ISO 8601 format
    timeZone?: string;
  };
  end: {
    dateTime: string; // ISO 8601 format
    timeZone?: string;
  };
  category: string;
  duration: number;
  defaultDuration: number;
}

export interface StudyProgressDTO {
  category: string;
  elapsedTime: number;
}

export interface UserName {
  given_name: string;
}

export interface TrackDetailsDTO {
  title: string;
  username: string;
  permalinkUrl: string;
  extractStreamUrl: string;
}
