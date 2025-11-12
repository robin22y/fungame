import genieDialogues from '../data/genieDialogues.json';
import { Mission } from '../types';

export function getGenieMessage(
  missionOrCategory: Mission | string,
  mood: 'funny' | 'encouraging' | 'wise' | 'excited',
  memberName?: string
): string {
  if (typeof missionOrCategory === 'string') {
    const category = missionOrCategory;
    const dialogues = genieDialogues[mood as keyof typeof genieDialogues];
    const categoryDialogues = dialogues[category as keyof typeof dialogues];

    if (Array.isArray(categoryDialogues) && categoryDialogues.length > 0) {
      const randomMessage = categoryDialogues[Math.floor(Math.random() * categoryDialogues.length)];
      return memberName ? randomMessage.replace(/\{\{name\}\}/g, memberName) : randomMessage;
    }

    const generalDialogues = dialogues.general;
    const fallbackMessage = generalDialogues[Math.floor(Math.random() * generalDialogues.length)];
    return memberName ? fallbackMessage.replace(/\{\{name\}\}/g, memberName) : fallbackMessage;
  }

  const mission = missionOrCategory;
  if (mission.genieDialogMode === 'custom' && mission.genieDialog) {
    return memberName ? mission.genieDialog.replace(/\{\{name\}\}/g, memberName) : mission.genieDialog;
  }

  const category = mission.category || 'general';
  const dialogues = genieDialogues[mood as keyof typeof genieDialogues];
  const categoryDialogues = dialogues[category as keyof typeof dialogues];

  if (Array.isArray(categoryDialogues) && categoryDialogues.length > 0) {
    const randomMessage = categoryDialogues[Math.floor(Math.random() * categoryDialogues.length)];
    return memberName ? randomMessage.replace(/\{\{name\}\}/g, memberName) : randomMessage;
  }

  const generalDialogues = dialogues.general;
  const fallbackMessage = generalDialogues[Math.floor(Math.random() * generalDialogues.length)];
  return memberName ? fallbackMessage.replace(/\{\{name\}\}/g, memberName) : fallbackMessage;
}

export function getPhotoPrompt(
  mood: 'funny' | 'encouraging' | 'wise' | 'excited',
  memberName: string
): string {
  const dialogues = genieDialogues[mood as keyof typeof genieDialogues];
  const prompts = dialogues.photo_prompts;

  const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];
  return randomPrompt.replace(/\{\{name\}\}/g, memberName);
}

export function getRandomCorner(): {
  top?: string;
  bottom?: string;
  left?: string;
  right?: string;
} {
  const corners = [
    { top: '20px', left: '20px' },
    { top: '20px', right: '20px' },
    { bottom: '100px', left: '20px' },
    { bottom: '100px', right: '20px' },
  ];

  return corners[Math.floor(Math.random() * corners.length)];
}
