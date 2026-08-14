import { AutomationRule } from '../types';

const AUTOMATIONS_STORAGE_KEY = 'taskgenie_automation_rules';

const DEFAULT_AUTOMATIONS: AutomationRule[] = [
  {
    id: 'auto_1',
    name: 'Auto-Remind 1 Day Before Due Task',
    trigger: 'TASK_ASSIGNED',
    condition: 'Priority is High or Urgent',
    action: 'Schedule System Sound Alarm 1 Day Before Due Date',
    enabled: true,
  },
  {
    id: 'auto_2',
    name: 'Auto-Escalate Overdue High Priority Tasks',
    trigger: 'TASK_OVERDUE',
    condition: 'Status is Pending for > 2 hours',
    action: 'Elevate Priority to Urgent & Trigger Push Notification',
    enabled: true,
  },
  {
    id: 'auto_3',
    name: 'Auto-Follow Up Customer Meetings',
    trigger: 'NOTE_SAVED',
    condition: 'Note Category is Meeting',
    action: 'Extract Action Items & Suggest Follow-Up Tasks',
    enabled: true,
  },
];

export function getStoredAutomations(): AutomationRule[] {
  if (typeof window === 'undefined') return DEFAULT_AUTOMATIONS;
  const stored = localStorage.getItem(AUTOMATIONS_STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(AUTOMATIONS_STORAGE_KEY, JSON.stringify(DEFAULT_AUTOMATIONS));
    return DEFAULT_AUTOMATIONS;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return DEFAULT_AUTOMATIONS;
  }
}

export function saveAutomations(rules: AutomationRule[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(AUTOMATIONS_STORAGE_KEY, JSON.stringify(rules));
}

export function addAutomationRule(name: string, trigger: string, condition: string, action: string): AutomationRule {
  const existing = getStoredAutomations();
  const newRule: AutomationRule = {
    id: `auto_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
    name,
    trigger,
    condition,
    action,
    enabled: true,
  };
  const updated = [newRule, ...existing];
  saveAutomations(updated);
  return newRule;
}

export function toggleAutomationRule(id: string) {
  const existing = getStoredAutomations();
  const updated = existing.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r));
  saveAutomations(updated);
  return updated;
}

export function deleteAutomationRule(id: string) {
  const existing = getStoredAutomations();
  const updated = existing.filter((r) => r.id !== id);
  saveAutomations(updated);
  return updated;
}
