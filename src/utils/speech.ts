import { AppLanguage } from '../types';

export class SpeechEngine {
  private recognition: any = null;
  private isSupported: boolean = false;
  private synthesis: SpeechSynthesis | null = null;
  private currentLanguage: AppLanguage = 'en';

  constructor() {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        try {
          this.recognition = new SpeechRecognition();
          this.recognition.continuous = false;
          this.recognition.interimResults = true;
          this.recognition.lang = 'en-US';
          this.isSupported = true;
        } catch (e) {
          console.warn('SpeechRecognition constructor failed:', e);
        }
      }
      if ('speechSynthesis' in window) {
        this.synthesis = window.speechSynthesis;
      }
    }
  }

  public get supported(): boolean {
    return this.isSupported;
  }

  // iOS Safari User Gesture Audio Context Unlock Handler
  public unlockiOSAudio() {
    if (typeof window !== 'undefined') {
      if (this.synthesis && this.synthesis.paused) {
        this.synthesis.resume();
      }
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        try {
          const dummyCtx = new AudioCtx();
          if (dummyCtx.state === 'suspended') {
            dummyCtx.resume();
          }
        } catch (e) {
          console.warn('iOS audio unlock warning:', e);
        }
      }
    }
  }

  public async requestMicPermission(): Promise<boolean> {
    if (typeof navigator !== 'undefined' && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach(track => track.stop());
        return true;
      } catch (e) {
        console.warn('Microphone permission denied:', e);
        return false;
      }
    }
    return false;
  }

  public setLanguage(lang: AppLanguage) {
    this.currentLanguage = lang;
    if (this.recognition) {
      if (lang === 'ur') {
        this.recognition.lang = 'ur-PK';
      } else if (lang === 'ps') {
        this.recognition.lang = 'ps-PK';
      } else {
        this.recognition.lang = 'en-US';
      }
    }
  }

  public async startListening(
    onResult: (transcript: string, isFinal: boolean) => void,
    onError: (err: any) => void,
    onEnd: () => void,
    onAudioLevel?: (level: number) => void
  ) {
    this.unlockiOSAudio();

    if (!this.recognition) {
      onError('Speech Recognition is not supported in this browser environment.');
      return;
    }

    await this.requestMicPermission();

    this.recognition.onresult = (event: any) => {
      let interim = '';
      let final = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          final += event.results[i][0].transcript;
        } else {
          interim += event.results[i][0].transcript;
        }
      }
      onResult(final || interim, Boolean(final));
    };

    this.recognition.onerror = (event: any) => {
      console.warn('Speech recognition error:', event.error);
      onError(event.error || 'Voice input error');
    };

    this.recognition.onend = () => {
      onEnd();
    };

    try {
      this.recognition.start();
    } catch (e: any) {
      console.warn('Speech recognition start error:', e);
      if (e?.name !== 'InvalidStateError') {
        onError(e?.message || 'Failed to start microphone listening');
      }
    }
  }

  public stopListening() {
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch (e) {
        console.warn('Stop recognition error:', e);
      }
    }
  }

  public speak(text: string, language: AppLanguage = 'en', onEnd?: () => void) {
    this.unlockiOSAudio();
    if (!this.synthesis) {
      if (onEnd) onEnd();
      return;
    }

    try {
      this.synthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      if (language === 'ur') {
        utterance.lang = 'ur-PK';
      } else if (language === 'ps') {
        utterance.lang = 'ps-PK';
      } else {
        utterance.lang = 'en-US';
      }

      utterance.rate = 1.0;
      utterance.pitch = 1.0;

      if (onEnd) {
        utterance.onend = () => onEnd();
        utterance.onerror = () => onEnd();
      }

      this.synthesis.speak(utterance);
    } catch (e) {
      console.warn('Speech Synthesis error:', e);
      if (onEnd) onEnd();
    }
  }

  public stopSpeaking() {
    if (this.synthesis) {
      try {
        this.synthesis.cancel();
      } catch (e) {
        console.warn('Stop speaking error:', e);
      }
    }
  }
}

export const speechEngine = new SpeechEngine();
