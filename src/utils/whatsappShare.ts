import { processVoiceCommand } from './aiEngine';
import { Task, Contact, TeamMember, AppLanguage } from '../types';
import { getLocalDateString } from './timeParser';

export async function handleWebShareIncoming(
  contacts: Contact[],
  team: TeamMember[],
  language: AppLanguage,
  geminiApiKey: string,
  onTaskCreated: (newTask: Task) => void
) {
  if (typeof window === 'undefined') return;

  const urlParams = new URLSearchParams(window.location.search);
  const sharedText = urlParams.get('text') || urlParams.get('title') || urlParams.get('share');

  if (!sharedText) return;

  try {
    const result = await processVoiceCommand(
      sharedText,
      contacts,
      team,
      language,
      geminiApiKey
    );

    const newTask: Task = {
      id: `t_wa_${Date.now()}`,
      title: result.extractedTask?.title || (sharedText.length > 60 ? sharedText.substring(0, 58) + '...' : sharedText),
      description: `Shared WhatsApp Message:\n"${sharedText}"`,
      status: 'pending',
      priority: result.extractedTask?.priority || 'high',
      category: result.extractedTask?.category || 'follow_up',
      dueDate: result.extractedTask?.dueDate || getLocalDateString(new Date()),
      dueTime: result.extractedTask?.dueTime || '17:00',
      contactId: result.matchedContact?.id,
      contactName: result.matchedContact?.name,
      contactOrganization: result.matchedContact?.organization,
      subtasks: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onTaskCreated(newTask);

    // Clear URL parameters after importing
    const newUrl = window.location.pathname;
    window.history.replaceState({}, document.title, newUrl);
  } catch (e) {
    console.warn('Error processing shared WhatsApp text:', e);
  }
}
