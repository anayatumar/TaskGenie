import { IntegrationState } from '../types';
import { getLocalDateString } from './timeParser';

const INTEGRATIONS_STORAGE_KEY = 'taskgenie_integrations_state';

const DEFAULT_INTEGRATIONS: IntegrationState = {
  googleCalendar: true,
  appleCalendar: true,
  gmail: true,
  outlook: true,
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

// ----------------------------------------------------
// 1. REAL CALENDAR INTEGRATIONS (Google Calendar & iCal .ics)
// ----------------------------------------------------

export function formatDateTimeForCalendar(dueDate?: string, dueTime?: string): { startIso: string; endIso: string } {
  const date = dueDate || getLocalDateString(new Date());
  const time = dueTime || '09:00';
  const cleanDate = date.replace(/-/g, '');
  const cleanTime = time.replace(':', '') + '00';

  const startIso = `${cleanDate}T${cleanTime}Z`;
  
  // End time 1 hour later
  let [hrs, mins] = time.split(':').map(Number);
  hrs = (hrs + 1) % 24;
  const endCleanTime = `${String(hrs).padStart(2, '0')}${String(mins).padStart(2, '0')}00`;
  const endIso = `${cleanDate}T${endCleanTime}Z`;

  return { startIso, endIso };
}

// Export Task to iCal format (.ics) for Apple Calendar, Outlook & Phone Calendar
export function exportTaskToCalendarICS(title: string, dueDate?: string, dueTime?: string, description?: string) {
  const { startIso, endIso } = formatDateTimeForCalendar(dueDate, dueTime);

  const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//TaskGenie AI Executive Assistant//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
BEGIN:VEVENT
SUMMARY:${title.replace(/\n/g, ' ')}
DESCRIPTION:${(description || 'Created via TaskGenie AI Assistant').replace(/\n/g, '\\n')}
DTSTART:${startIso}
DTEND:${endIso}
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${title.toLowerCase().replace(/[^a-z0-9]/g, '_')}_event.ics`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Generate Google Calendar Event URL
export function getGoogleCalendarEventUrl(title: string, dueDate?: string, dueTime?: string, description?: string): string {
  const { startIso, endIso } = formatDateTimeForCalendar(dueDate, dueTime);
  const baseUrl = 'https://calendar.google.com/calendar/render?action=TEMPLATE';
  const query = `&text=${encodeURIComponent(title)}&dates=${startIso}/${endIso}&details=${encodeURIComponent(description || 'Scheduled via TaskGenie AI Assistant')}`;
  return `${baseUrl}${query}`;
}

export function openGoogleCalendarForTask(title: string, dueDate?: string, dueTime?: string, description?: string) {
  const url = getGoogleCalendarEventUrl(title, dueDate, dueTime, description);
  window.open(url, '_blank', 'noopener,noreferrer');
}

// ----------------------------------------------------
// 2. REAL EMAIL INTEGRATIONS (Gmail & Mailto Client)
// ----------------------------------------------------

export function getGmailComposeUrl(toEmail: string = '', subject: string = '', body: string = ''): string {
  const baseUrl = 'https://mail.google.com/mail/?view=cm&fs=1';
  const query = `&to=${encodeURIComponent(toEmail)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  return `${baseUrl}${query}`;
}

export function openGmailComposer(toEmail: string = '', subject: string = '', body: string = '') {
  const url = getGmailComposeUrl(toEmail, subject, body);
  window.open(url, '_blank', 'noopener,noreferrer');
}

export function getNativeMailtoUrl(toEmail: string = '', subject: string = '', body: string = ''): string {
  return `mailto:${encodeURIComponent(toEmail)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export function openNativeEmailClient(toEmail: string = '', subject: string = '', body: string = '') {
  const url = getNativeMailtoUrl(toEmail, subject, body);
  window.location.href = url;
}

// ----------------------------------------------------
// 3. REAL WHATSAPP INTEGRATIONS (WhatsApp Direct & Web)
// ----------------------------------------------------

export function getWhatsAppDirectUrl(phone: string = '', messageText: string = ''): string {
  // Clean phone number to digits only
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  const textEncoded = encodeURIComponent(messageText);

  if (cleanPhone.length > 5) {
    return `https://wa.me/${cleanPhone}?text=${textEncoded}`;
  }
  return `https://api.whatsapp.com/send?text=${textEncoded}`;
}

export function openWhatsAppDirect(phone: string = '', messageText: string = '') {
  const url = getWhatsAppDirectUrl(phone, messageText);
  window.open(url, '_blank', 'noopener,noreferrer');
}
