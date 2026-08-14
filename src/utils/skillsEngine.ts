import { Task, Note, Contact, TeamMember, AIMemory } from '../types';

export type SkillType = 
  | 'TaskSkill' 
  | 'NoteSkill' 
  | 'ReminderSkill' 
  | 'SearchSkill' 
  | 'MemorySkill'
  | 'CalendarSkill' 
  | 'EmailSkill' 
  | 'WhatsAppSkill' 
  | 'DocumentSkill' 
  | 'TeamSkill';

export interface MultiStepWorkflowResult {
  summary: string;
  matchedTasks: Task[];
  matchedNotes: Note[];
  matchedContacts: Contact[];
  matchedMemories: AIMemory[];
  recommendedActions: string[];
  draftReply?: {
    recipientName: string;
    channel: 'WhatsApp' | 'Email' | 'SMS';
    message: string;
  };
}

// Router to select appropriate skill based on user request
export function routeToSkill(intent: string): SkillType {
  const i = intent.toUpperCase();
  if (i.includes('NOTE')) return 'NoteSkill';
  if (i.includes('REMINDER')) return 'ReminderSkill';
  if (i.includes('SEARCH') || i.includes('SHOW')) return 'SearchSkill';
  if (i.includes('CALENDAR') || i.includes('MEETING')) return 'CalendarSkill';
  if (i.includes('EMAIL')) return 'EmailSkill';
  if (i.includes('WHATSAPP')) return 'WhatsAppSkill';
  if (i.includes('DOCUMENT') || i.includes('OCR')) return 'DocumentSkill';
  if (i.includes('TEAM') || i.includes('ASSIGN')) return 'TeamSkill';
  if (i.includes('MEMORY')) return 'MemorySkill';
  return 'TaskSkill';
}

// Multi-step workflow for: "Prepare everything for tomorrow's customer meeting"
export function executeMultiStepMeetingPreparation(
  query: string,
  tasks: Task[],
  notes: Note[],
  contacts: Contact[],
  memories: AIMemory[]
): MultiStepWorkflowResult {
  const queryLower = query.toLowerCase();

  const matchedTasks = tasks.filter(
    (t) =>
      t.title.toLowerCase().includes(queryLower) ||
      (t.contactName && t.contactName.toLowerCase().includes(queryLower)) ||
      (t.category && t.category.toLowerCase().includes(queryLower))
  );

  const matchedNotes = notes.filter(
    (n) =>
      n.title.toLowerCase().includes(queryLower) ||
      n.content.toLowerCase().includes(queryLower) ||
      n.peopleMentioned.some((p) => p.toLowerCase().includes(queryLower))
  );

  const matchedContacts = contacts.filter(
    (c) =>
      c.name.toLowerCase().includes(queryLower) ||
      c.organization.toLowerCase().includes(queryLower)
  );

  const matchedMemories = memories.filter(
    (m) =>
      m.key.toLowerCase().includes(queryLower) ||
      m.value.toLowerCase().includes(queryLower)
  );

  const recommendedActions: string[] = [];
  if (matchedTasks.length > 0) {
    recommendedActions.push(`Review ${matchedTasks.length} pending tasks before meeting`);
  }
  if (matchedNotes.length > 0) {
    recommendedActions.push(`Re-read ${matchedNotes.length} meeting transcript notes`);
  }
  if (matchedContacts.length > 0) {
    recommendedActions.push(`Confirm attendance with ${matchedContacts[0].name} (${matchedContacts[0].phone})`);
  }

  return {
    summary: `Prepared executive brief for "${query}": Found ${matchedTasks.length} tasks, ${matchedNotes.length} notes, and ${matchedContacts.length} contacts.`,
    matchedTasks,
    matchedNotes,
    matchedContacts,
    matchedMemories,
    recommendedActions,
  };
}

// Multi-step workflow for: "Take care of the quotation follow-up"
export function executeMultiStepQuotationFollowUp(
  targetName: string,
  tasks: Task[],
  contacts: Contact[]
): MultiStepWorkflowResult {
  const matchedContact = contacts.find((c) => c.name.toLowerCase().includes(targetName.toLowerCase())) || contacts[0];
  const matchedTasks = tasks.filter(
    (t) => t.category === 'quotation' || (t.contactName && t.contactName.toLowerCase().includes(targetName.toLowerCase()))
  );

  const draftMessage = `Hi ${matchedContact?.name || targetName}, following up regarding the quotation details. Please let us know if you need any adjustments.`;

  return {
    summary: `Quotation follow-up prepared for ${matchedContact?.name || targetName}.`,
    matchedTasks,
    matchedNotes: [],
    matchedContacts: matchedContact ? [matchedContact] : [],
    matchedMemories: [],
    recommendedActions: [
      `Review ${matchedTasks.length} quotation tasks`,
      `Send WhatsApp follow-up message to ${matchedContact?.name || targetName}`,
    ],
    draftReply: {
      recipientName: matchedContact?.name || targetName,
      channel: 'WhatsApp',
      message: draftMessage,
    },
  };
}
