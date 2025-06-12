export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  description?: string;
  location?: string;
  attendees?: string[];
  color?: string;
  allDay?: boolean;
  meetLink?: string;
  meetId?: string;
  priority?: 'low' | 'medium' | 'high';
  category?: string;
  recurring?: boolean;
  reminders?: number[]; // minutes before event
}

export interface GoogleCalendarEvent {
  id: string;
  summary: string;
  description?: string;
  location?: string;
  start: {
    dateTime?: string;
    date?: string;
    timeZone?: string;
  };
  end: {
    dateTime?: string;
    date?: string;
    timeZone?: string;
  };
  attendees?: Array<{
    email: string;
    displayName?: string;
    responseStatus?: string;
  }>;
  colorId?: string;
  conferenceData?: {
    conferenceSolution?: {
      name: string;
      iconUri?: string;
    };
    conferenceId?: string;
    entryPoints?: Array<{
      entryPointType: string;
      uri: string;
      label?: string;
    }>;
  };
  hangoutLink?: string;
  recurrence?: string[];
  reminders?: {
    useDefault: boolean;
    overrides?: Array<{
      method: string;
      minutes: number;
    }>;
  };
}

export type CalendarViewType = 'month' | 'week' | 'day';

export interface EventFormData {
  title: string;
  description?: string;
  location?: string;
  start: Date;
  end: Date;
  allDay: boolean;
  attendees: string[];
  meetLink?: string;
  color: string;
  priority?: 'low' | 'medium' | 'high';
  category?: string;
  reminders?: number[];
}