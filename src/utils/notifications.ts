import { Task, AppNotification } from '../types';

export type AlarmSoundType = 'chime' | 'radar' | 'digital' | 'gong' | 'silent';

export interface MobileNotificationSettings {
  pushEnabled: boolean;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  dailyBriefingEnabled: boolean;
  soundType: AlarmSoundType;
}

export function getStoredMobileNotificationSettings(): MobileNotificationSettings {
  if (typeof window === 'undefined') {
    return {
      pushEnabled: true,
      soundEnabled: true,
      vibrationEnabled: true,
      dailyBriefingEnabled: true,
      soundType: 'chime',
    };
  }
  const stored = localStorage.getItem('taskgenie_mobile_notif_settings');
  if (!stored) {
    return {
      pushEnabled: true,
      soundEnabled: true,
      vibrationEnabled: true,
      dailyBriefingEnabled: true,
      soundType: 'chime',
    };
  }
  try {
    return JSON.parse(stored);
  } catch {
    return {
      pushEnabled: true,
      soundEnabled: true,
      vibrationEnabled: true,
      dailyBriefingEnabled: true,
      soundType: 'chime',
    };
  }
}

export function saveMobileNotificationSettings(settings: MobileNotificationSettings) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('taskgenie_mobile_notif_settings', JSON.stringify(settings));
}

export function getStoredNotifications(): AppNotification[] {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem('taskgenie_notifications');
  if (!stored) return [];
  try {
    return JSON.parse(stored);
  } catch {
    return [];
  }
}

export function saveNotifications(notifications: AppNotification[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('taskgenie_notifications', JSON.stringify(notifications));
}

// Cross-Browser Synthesized Web Audio API Alarm Sound & Haptic Vibration Generator
export function playAlarmSound(soundType: AlarmSoundType = 'chime', enableVibration: boolean = true) {
  // Mobile Haptic Vibration
  if (enableVibration && typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    try {
      navigator.vibrate([200, 100, 200, 100, 400]);
    } catch (e) {
      console.warn('Vibration not supported:', e);
    }
  }

  if (soundType === 'silent') return;
  if (typeof window === 'undefined') return;

  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;

    const ctx = new AudioCtx();
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    if (soundType === 'chime') {
      // Gentle Bell Chime (E5 -> G5 -> C6)
      const notes = [659.25, 783.99, 1046.50];
      notes.forEach((freq, index) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + index * 0.15);
        gain.gain.setValueAtTime(0.4, ctx.currentTime + index * 0.15);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + index * 0.15 + 0.6);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + index * 0.15);
        osc.stop(ctx.currentTime + index * 0.15 + 0.6);
      });
    } else if (soundType === 'radar') {
      // Modern Radar Beep Pulsar
      [0, 0.2, 0.4].forEach((delay) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(1200, ctx.currentTime + delay);
        gain.gain.setValueAtTime(0.4, ctx.currentTime + delay);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + 0.12);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + delay);
        osc.stop(ctx.currentTime + delay + 0.12);
      });
    } else if (soundType === 'digital') {
      // High-Pitch Digital Alarm Beep
      [0, 0.15, 0.3, 0.45].forEach((delay) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(1800, ctx.currentTime + delay);
        gain.gain.setValueAtTime(0.25, ctx.currentTime + delay);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + 0.08);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + delay);
        osc.stop(ctx.currentTime + delay + 0.08);
      });
    } else if (soundType === 'gong') {
      // Deep Executive Metallic Gong
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(320, ctx.currentTime);
      gain.gain.setValueAtTime(0.6, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.8);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 1.8);
    }
  } catch (e) {
    console.warn('Audio Synthesis Error:', e);
  }
}

// Request System Notification Permissions
export async function requestNotificationPermissions(): Promise<NotificationPermission> {
  if (typeof window !== 'undefined' && 'Notification' in window) {
    if (Notification.permission === 'default') {
      const res = await Notification.requestPermission();
      return res;
    }
    return Notification.permission;
  }
  return 'denied';
}

// Fire Mobile System Push Notification & Sound Alarm
export function triggerSystemNotification(
  title: string,
  body: string,
  type: 'task' | 'reminder' | 'call' | 'note' | 'system' = 'task',
  settings?: MobileNotificationSettings,
  targetId?: string
) {
  const currentSettings = settings || getStoredMobileNotificationSettings();

  // 1. Audio Alarm & Vibration
  if (currentSettings.soundEnabled) {
    playAlarmSound(currentSettings.soundType, currentSettings.vibrationEnabled);
  }

  // 2. System Popup Notification
  if (currentSettings.pushEnabled && typeof window !== 'undefined' && 'Notification' in window) {
    if (Notification.permission === 'granted') {
      try {
        new Notification(`TaskGenie: ${title}`, {
          body,
          icon: '/mascot.png',
          tag: `tg_${targetId || Date.now()}`,
        });
      } catch (e) {
        console.warn('Browser notification popup failed:', e);
      }
    }
  }

  // 3. Save to In-App Notification Center History
  const existing = getStoredNotifications();
  const newNotif: AppNotification = {
    id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
    title,
    body,
    timestamp: new Date().toISOString(),
    read: false,
    type,
    targetId,
  };

  const updated = [newNotif, ...existing];
  saveNotifications(updated);
  return newNotif;
}

// Helper: Normalize time string "02:13", "2:13", "02:13 AM", "14:13" to total minutes of day
function parseTimeToMinutes(timeStr?: string): number | null {
  if (!timeStr) return null;
  const cleaned = timeStr.trim().toLowerCase();
  const match = cleaned.match(/^(\d{1,2}):(\d{2})\s*(am|pm)?$/);
  if (!match) return null;

  let hrs = parseInt(match[1], 10);
  const mins = parseInt(match[2], 10);
  const ampm = match[3];

  if (ampm === 'pm' && hrs < 12) hrs += 12;
  if (ampm === 'am' && hrs === 12) hrs = 0;

  return hrs * 60 + mins;
}

// Bulletproof Reminder & Sound Alarm Monitor (Supports exact time, 1-minute window, and overdue triggers)
export function checkAndTriggerDueReminders(
  tasks: Task[],
  settings?: MobileNotificationSettings
): AppNotification[] {
  const now = new Date();
  const currentDateStr = now.toISOString().split('T')[0];
  const currentTotalMins = now.getHours() * 60 + now.getMinutes();

  const triggered: AppNotification[] = [];
  const currentSettings = settings || getStoredMobileNotificationSettings();

  tasks.forEach((t) => {
    if (t.status !== 'completed') {
      const taskDate = t.dueDate || currentDateStr;
      const taskMins = parseTimeToMinutes(t.dueTime);

      // Trigger if date matches today (or passed) AND task due time has arrived or passed
      const isDateDueOrPassed = taskDate <= currentDateStr;
      const isTimeDueOrPassed = taskMins !== null ? taskMins <= currentTotalMins : true;

      if (isDateDueOrPassed && isTimeDueOrPassed) {
        const notifKey = `reminded_${t.id}`;
        if (!sessionStorage.getItem(notifKey)) {
          sessionStorage.setItem(notifKey, 'true');
          const notif = triggerSystemNotification(
            `🔔 TASK DUE ALARM`,
            `Due Now: ${t.title} (${t.dueTime || 'Today'})`,
            'reminder',
            currentSettings,
            t.id
          );
          triggered.push(notif);
        }
      }
    }
  });

  return triggered;
}
