// Natural Language Time & Date Parser (English, Urdu, Roman Urdu)

export interface ParsedDateTime {
  date: string; // YYYY-MM-DD
  time?: string; // HH:mm
  formatted: string;
}

export function getLocalDateString(d: Date = new Date()): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function parseNaturalTime(input: string): ParsedDateTime {
  const text = input.toLowerCase();
  const now = new Date();
  let targetDate = new Date(now);
  let timeStr: string | undefined = undefined;

  // Check for specific days
  if (text.includes('tomorrow') || text.includes('kal') || text.includes('aglay din')) {
    targetDate.setDate(targetDate.getDate() + 1);
  } else if (text.includes('day after tomorrow') || text.includes('parson')) {
    targetDate.setDate(targetDate.getDate() + 2);
  } else if (text.includes('next week') || text.includes('aglay hafte')) {
    targetDate.setDate(targetDate.getDate() + 7);
  } else if (text.includes('tonight') || text.includes('aaj raat')) {
    timeStr = '20:00';
  }

  // Check for specific weekdays
  const daysOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  
  daysOfWeek.forEach((day, index) => {
    if (text.includes(day)) {
      const currentDay = now.getDay();
      let distance = index - currentDay;
      if (distance <= 0) distance += 7;
      targetDate = new Date(now);
      targetDate.setDate(now.getDate() + distance);
    }
  });

  // Check time formats (e.g., "4 pm", "at 4", "4:30", "shaam 6 baje", "at 10:00")
  const pmMatch = text.match(/(\d{1,2})(?::(\d{2}))?\s*(pm|p\.m\.|shaam|raat|dopehar)/i);
  const amMatch = text.match(/(\d{1,2})(?::(\d{2}))?\s*(am|a\.m\.|subah)/i);
  const genericTimeMatch = text.match(/at\s+(\d{1,2})(?::(\d{2}))?/i) || text.match(/(\d{1,2})\s*baje/i);

  if (pmMatch) {
    let hours = parseInt(pmMatch[1], 10);
    const minutes = pmMatch[2] ? parseInt(pmMatch[2], 10) : 0;
    if (hours < 12) hours += 12;
    timeStr = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  } else if (amMatch) {
    let hours = parseInt(amMatch[1], 10);
    const minutes = amMatch[2] ? parseInt(amMatch[2], 10) : 0;
    if (hours === 12) hours = 0;
    timeStr = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  } else if (genericTimeMatch) {
    let hours = parseInt(genericTimeMatch[1], 10);
    const minutes = genericTimeMatch[2] ? parseInt(genericTimeMatch[2], 10) : 0;
    if (hours <= 6 && !text.includes('subah') && !text.includes('am')) {
      hours += 12;
    }
    timeStr = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  }

  const dateStr = getLocalDateString(targetDate);
  const todayStr = getLocalDateString(now);

  const isToday = dateStr === todayStr;
  const tomorrowDate = new Date(now);
  tomorrowDate.setDate(now.getDate() + 1);
  const isTomorrow = dateStr === getLocalDateString(tomorrowDate);

  let formatted = dateStr;
  if (isToday) formatted = 'Today';
  else if (isTomorrow) formatted = 'Tomorrow';
  else formatted = targetDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

  if (timeStr) {
    const [h, m] = timeStr.split(':').map(Number);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const displayHour = h % 12 === 0 ? 12 : h % 12;
    formatted += ` at ${displayHour}:${m.toString().padStart(2, '0')} ${ampm}`;
  }

  return {
    date: dateStr,
    time: timeStr,
    formatted,
  };
}
