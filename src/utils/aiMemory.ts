import { AIMemory } from '../types';

const MEMORY_STORAGE_KEY = 'taskgenie_ai_memories';

const DEFAULT_MEMORIES: AIMemory[] = [
  {
    id: 'mem_1',
    key: 'Ahmed Machine Handling',
    value: 'Ahmed handles Olympus CX31 microscope quotations and maintenance.',
    category: 'partner',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'mem_2',
    key: 'Tariq Preferred Communication',
    value: 'Tariq Khan prefers WhatsApp messaging for quotation updates.',
    category: 'preference',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'mem_3',
    key: 'Default Delivery Location',
    value: 'Main equipment warehouse located in Industrial Zone, Karachi.',
    category: 'workflow',
    createdAt: new Date().toISOString(),
  },
];

export function getStoredMemories(): AIMemory[] {
  if (typeof window === 'undefined') return DEFAULT_MEMORIES;
  const stored = localStorage.getItem(MEMORY_STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(MEMORY_STORAGE_KEY, JSON.stringify(DEFAULT_MEMORIES));
    return DEFAULT_MEMORIES;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return DEFAULT_MEMORIES;
  }
}

export function saveMemories(memories: AIMemory[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(MEMORY_STORAGE_KEY, JSON.stringify(memories));
}

export function addMemory(key: string, value: string, category: AIMemory['category'] = 'workflow'): AIMemory {
  const existing = getStoredMemories();
  const newMemory: AIMemory = {
    id: `mem_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
    key,
    value,
    category,
    createdAt: new Date().toISOString(),
  };
  const updated = [newMemory, ...existing];
  saveMemories(updated);
  return newMemory;
}

export function deleteMemory(id: string) {
  const existing = getStoredMemories();
  const updated = existing.filter((m) => m.id !== id);
  saveMemories(updated);
  return updated;
}

export function editMemory(id: string, newKey: string, newValue: string) {
  const existing = getStoredMemories();
  const updated = existing.map((m) => (m.id === id ? { ...m, key: newKey, value: newValue } : m));
  saveMemories(updated);
  return updated;
}

export function clearAllMemories() {
  saveMemories([]);
  return [];
}
