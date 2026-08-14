import { IntegrationState } from '../types';

const INTEGRATIONS_STORAGE_KEY = 'taskgenie_integrations_state';

const DEFAULT_INTEGRATIONS: IntegrationState = {
  googleCalendar: true,
  appleCalendar: true,
  gmail: true,
  outlook: false,
  whatsappBusiness: true,
};

export function getStoredIntegrations(): IntegrationState {
  if (typeof window === 'undefined') return DEFAULT_INTEGRATIONS;
  const stored = localStorage.getItem(INTEGRATIONS_STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(INTEGRATIONS_STORAGE_KEY, JSON.stringify(DEFAULT_INTEGRATIONS));
    return DEFAULT_INTEGRATIONS;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return DEFAULT_INTEGRATIONS;
  }
}

export function saveIntegrations(integrations: IntegrationState) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(INTEGRATIONS_STORAGE_KEY, JSON.stringify(integrations));
}

// Export Task to Google Calendar / iCal format (.ics)
export function exportTaskToCalendarICS(title: string, dueDate?: string, dueTime?: string, description?: string) {
  const startDateStr = (dueDate || new Date().toISOString().split('T')[0]).replace(/-/g, '');
  const startTimeStr = (dueTime || '09:00').replace(':', '') + '00';

  const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//TaskGenie AI Executive Assistant//EN
BEGIN:VEVENT
SUMMARY:${title}
DESCRIPTION:${description || 'Created via TaskGenie AI Assistant'}
DTSTART:${startDateStr}T${startTimeStr}Z
DTEND:${startDateStr}T${startTimeStr}Z
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${title.toLowerCase().replace(/\s+/g, '_')}_calendar_event.ics`;
  link.click();
  URL.revokeObjectURL(url);
}

// Generate Google Calendar Link
export function getGoogleCalendarEventUrl(title: string, dueDate?: string, dueTime?: string, description?: string): string {
  const dateStr = (dueDate || new Date().toISOString().split('T')[0]).replace(/-/g, '');
  const timeStr = (dueTime || '0900').replace(':', '') + '00';
  const startEnd = `${dateStr}T${timeStr}Z/${dateStr}T${timeStr}Z`;

  const baseUrl = 'https://calendar.google.com/calendar/render?action=TEMPLATE';
  const query = `&text=${encodeURIComponent(title)}&dates=${startEnd}&details=${encodeURIComponent(description || 'TaskGenie Scheduled Task')}`;
  return `${baseUrl}${query}`;
}
