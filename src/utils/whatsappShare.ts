import { processVoiceCommand } from './aiEngine';
import { Task, Contact, TeamMember, AppLanguage } from '../types';

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

  if (sharedText && sharedText.trim().length > 0) {
    console.log('Incoming WhatsApp / System Share Text Detected:', sharedText);

    // AI Analyzes the shared WhatsApp message
    const result = await processVoiceCommand(
      sharedText,
      contacts,
      team,
      language,
      geminiApiKey
    );

    const newTask: Task = {
      id: `t_share_${Date.now()}`,
      title: result.extractedTask?.title || (sharedText.length > 60 ? sharedText.substring(0, 58) + '...' : sharedText),
      description: `Shared WhatsApp Message:\n"${sharedText}"`,
      status: 'pending',
      priority: result.extractedTask?.priority || 'high',
      category: result.extractedTask?.category || 'follow_up',
      dueDate: result.extractedTask?.dueDate || new Date().toISOString().split('T')[0],
      dueTime: result.extractedTask?.dueTime || '17:00',
      contactId: result.matchedContact?.id,
      contactName: result.matchedContact?.name,
      contactOrganization: result.matchedContact?.organization,
      subtasks: [],
      sourceWhatsAppMessage: sharedText,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onTaskCreated(newTask);

    // Clean URL parameters after importing
    window.history.replaceState({}, document.title, window.location.pathname);
  }
}
