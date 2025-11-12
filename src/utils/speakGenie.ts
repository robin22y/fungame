import { GenieSettings } from '../types';

export function speakGenie(message: string, settings: GenieSettings): void {
  if (!settings.voiceEnabled) return;

  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(message);
    utterance.pitch = settings.pitch;
    utterance.rate = settings.rate;
    utterance.volume = 1;

    window.speechSynthesis.speak(utterance);
  }
}

export function stopGenieSpeech(): void {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}
