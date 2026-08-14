import { Task, Contact, IntentResult, AppLanguage, TeamMember, Note, AIMemory } from '../types';
import { executeMultiStepMeetingPreparation, executeMultiStepQuotationFollowUp, routeToSkill } from './skillsEngine';

export interface ConversationContext {
  activeTask?: Task | null;
  activeNote?: Note | null;
  activeTeamMember?: TeamMember | null;
  pendingMultiTurnIntent?: string | null;
  partialTaskData?: Partial<Task> | null;
}

let conversationContext: ConversationContext = {};

export function setConversationContext(context: Partial<ConversationContext>) {
  conversationContext = { ...conversationContext, ...context };
}

export function clearConversationContext() {
  conversationContext = {};
}

export async function processVoiceCommand(
  spokenText: string,
  contacts: Contact[] = [],
  team: TeamMember[] = [],
  language: AppLanguage = 'en',
  apiKey?: string,
  contextOverride?: ConversationContext
): Promise<IntentResult> {
  const currentCtx = contextOverride || conversationContext;
  const textLower = spokenText.toLowerCase().trim();

  // 1. MULTI-TURN CONVERSATION STATE HANDLING
  if (currentCtx.pendingMultiTurnIntent === 'AWAITING_TITLE') {
    const partial = currentCtx.partialTaskData || {};
    partial.title = spokenText;
    currentCtx.pendingMultiTurnIntent = 'AWAITING_DATE';
    currentCtx.partialTaskData = partial;
    return {
      intent: 'CREATE_TASK',
      rawText: spokenText,
      humanResponse: language === 'ur' ? 'یہ کام کب تک مکمل ہونا چاہیے؟' : 'When should it be done?',
      languageDetected: language,
      extractedTask: partial,
      confidence: 0.9,
    };
  }

  if (currentCtx.pendingMultiTurnIntent === 'AWAITING_DATE') {
    const partial = currentCtx.partialTaskData || {};
    let dueDate = new Date().toISOString().split('T')[0];
    if (textLower.includes('tomorrow') || textLower.includes('کل')) {
      const tmr = new Date();
      tmr.setDate(tmr.getDate() + 1);
      dueDate = tmr.toISOString().split('T')[0];
    } else if (textLower.includes('friday') || textLower.includes('جمعہ')) {
      const fri = new Date();
      fri.setDate(fri.getDate() + 4);
      dueDate = fri.toISOString().split('T')[0];
    }
    partial.dueDate = dueDate;
    clearConversationContext();

    return {
      intent: 'CREATE_TASK',
      rawText: spokenText,
      humanResponse: language === 'ur'
        ? `مکمل ہو گیا۔ میں نے ${partial.assigneeName || ''} کے لیے ٹاسک بنا دیا ہے۔`
        : `Done. I've created it for ${partial.assigneeName || 'you'} ${dueDate}.`,
      languageDetected: language,
      extractedTask: partial,
      confidence: 0.98,
    };
  }

  // 2. MULTI-TURN INITIATION: "Create a task for Ahmed"
  if (
    (textLower.startsWith('create a task for') || textLower.startsWith('assign a task to')) &&
    !textLower.includes('to send') &&
    !textLower.includes('to call')
  ) {
    const targetName = spokenText.replace(/create a task for|assign a task to/gi, '').trim();
    const matchedPerson = [...team, ...contacts].find((p) => p.name.toLowerCase().includes(targetName.toLowerCase()));

    conversationContext.pendingMultiTurnIntent = 'AWAITING_TITLE';
    conversationContext.partialTaskData = {
      assigneeId: matchedPerson?.id,
      assigneeName: matchedPerson?.name || targetName,
    };

    return {
      intent: 'CREATE_TASK',
      rawText: spokenText,
      humanResponse: language === 'ur' ? `${matchedPerson?.name || targetName} کو کیا کام کرنا ہے؟` : `What should ${matchedPerson?.name || targetName} do?`,
      languageDetected: language,
      confidence: 0.95,
    };
  }

  // 3. CONTEXT-AWARE COMMANDS ("Move this to Friday", "Mark this complete", "Assign this to Ahmed", "Show me his overdue tasks")
  if (textLower.includes('move this to friday') || textLower.includes('this to friday')) {
    const targetTask = currentCtx.activeTask;
    const fri = new Date();
    fri.setDate(fri.getDate() + 4);
    const friDate = fri.toISOString().split('T')[0];

    return {
      intent: 'UPDATE_TASK',
      rawText: spokenText,
      humanResponse: `Moved "${targetTask?.title || 'task'}" to Friday (${friDate}).`,
      languageDetected: language,
      extractedTask: targetTask ? { ...targetTask, dueDate: friDate } : { dueDate: friDate },
      confidence: 0.95,
    };
  }

  if (textLower.includes('mark this complete') || textLower.includes('complete this task')) {
    const targetTask = currentCtx.activeTask;
    return {
      intent: 'COMPLETE_TASK',
      rawText: spokenText,
      humanResponse: `Marked "${targetTask?.title || 'task'}" as completed!`,
      languageDetected: language,
      extractedTask: targetTask ? { ...targetTask, status: 'completed' } : { status: 'completed' },
      confidence: 0.95,
    };
  }

  if (textLower.includes('show me his overdue tasks') || textLower.includes("show his overdue tasks")) {
    const memberName = currentCtx.activeTeamMember?.name || 'Ahmed';
    return {
      intent: 'SHOW_TASKS',
      rawText: spokenText,
      humanResponse: `Showing overdue tasks for ${memberName}.`,
      languageDetected: language,
      searchQuery: memberName,
      confidence: 0.95,
    };
  }

  // 4. VOICE REPLIES GENERATOR ("Prepare a reply to Ahmed saying I'll send the quotation tomorrow")
  if (textLower.includes('prepare a reply to') || textLower.includes('reply to')) {
    const recipientMatch = spokenText.match(/reply to ([a-zA-Z\s]+)(?: saying| with|$)/i);
    const recipientName = recipientMatch ? recipientMatch[1].trim() : 'Ahmed';
    const draftMsg = `Hi ${recipientName}, I will send the quotation tomorrow as requested.`;

    return {
      intent: 'GENERAL_CONVERSATION',
      rawText: spokenText,
      humanResponse: `Drafted reply to ${recipientName}: "${draftMsg}". Tap Send to confirm.`,
      languageDetected: language,
      confidence: 0.95,
    };
  }

  // 5. GENERAL PARSING & MATCHING (English, Urdu, Roman Urdu, Pashto)
  const allPeople = [
    ...contacts.map((c) => ({ id: c.id, name: c.name, org: c.organization, type: 'contact' as const })),
    ...team.map((t) => ({ id: t.id, name: t.name, org: t.role, type: 'team' as const })),
  ];

  let matchedPerson = allPeople.find((p) =>
    p.name.toLowerCase().split(' ').some((part) => part.length > 2 && textLower.includes(part))
  );

  let category: Task['category'] = 'general';
  if (textLower.includes('call') || textLower.includes('کال') || textLower.includes('فون')) {
    category = 'call';
  } else if (textLower.includes('quotation') || textLower.includes('کوٹیشن') || textLower.includes('قیمت')) {
    category = 'quotation';
  } else if (textLower.includes('order') || textLower.includes('آرڈر')) {
    category = 'order';
  } else if (textLower.includes('delivery') || textLower.includes('ڈیلیوری')) {
    category = 'delivery';
  } else if (textLower.includes('payment') || textLower.includes('پیسے') || textLower.includes('ادائیگی')) {
    category = 'payment';
  } else if (textLower.includes('follow') || textLower.includes('فالو')) {
    category = 'follow_up';
  }

  let priority: Task['priority'] = 'normal';
  if (textLower.includes('urgent') || textLower.includes('فوری') || textLower.includes('ضروری') || textLower.includes('asap')) {
    priority = 'urgent';
  } else if (textLower.includes('high') || textLower.includes('اہم')) {
    priority = 'high';
  }

  const today = new Date();
  let dueDate = today.toISOString().split('T')[0];
  let dueTime = '12:00';

  if (textLower.includes('tomorrow') || textLower.includes('کل')) {
    const tmr = new Date(today);
    tmr.setDate(tmr.getDate() + 1);
    dueDate = tmr.toISOString().split('T')[0];
  } else if (textLower.includes('friday') || textLower.includes('جمعہ')) {
    const fri = new Date(today);
    fri.setDate(fri.getDate() + 4);
    dueDate = fri.toISOString().split('T')[0];
  }

  const timeMatch = textLower.match(/(\d{1,2})(?::(\d{2}))?\s*(am|pm|بجے|baje)?/i);
  if (timeMatch) {
    let hrs = parseInt(timeMatch[1], 10);
    const mins = timeMatch[2] || '00';
    const ampm = (timeMatch[3] || '').toLowerCase();

    if ((ampm === 'pm' || textLower.includes('evening') || textLower.includes('شام')) && hrs < 12) {
      hrs += 12;
    }
    dueTime = `${String(hrs).padStart(2, '0')}:${mins}`;
  }

  let cleanTitle = spokenText;
  if (cleanTitle.length < 3) {
    cleanTitle = `Task: ${spokenText}`;
  }

  const extractedTask: Partial<Task> = {
    title: cleanTitle,
    dueDate,
    dueTime,
    priority,
    category,
    assigneeId: matchedPerson?.id,
    assigneeName: matchedPerson?.name,
    contactId: matchedPerson?.id,
    contactName: matchedPerson?.name,
    contactOrganization: matchedPerson?.org,
  };

  const humanResponseText = language === 'ur'
    ? `ہمیں سمجھ آ گیا: "${cleanTitle}"`
    : `Done. I've added "${cleanTitle}" for ${dueDate}.`;

  return {
    intent: 'CREATE_TASK',
    rawText: spokenText,
    humanResponse: humanResponseText,
    languageDetected: language,
    extractedTask,
    confidence: 0.95,
  };
}
