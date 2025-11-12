export const taskEmojiMap: Record<string, string> = {
  brushing_teeth: '🪥',
  washing_machine: '👕',
  shower: '🚿',
  arranging: '🧩',
  tidying: '🧹',
  watering_plants: '🌿',
  general: '⭐',
};

export function getTaskEmoji(category?: string, taskName?: string): string {
  if (category && taskEmojiMap[category]) {
    return taskEmojiMap[category];
  }

  if (taskName) {
    const lowerName = taskName.toLowerCase();
    if (lowerName.includes('brush') || lowerName.includes('teeth')) return '🪥';
    if (lowerName.includes('wash') || lowerName.includes('laundry') || lowerName.includes('clothes')) return '👕';
    if (lowerName.includes('shower') || lowerName.includes('bath')) return '🚿';
    if (lowerName.includes('arrange')) return '🧩';
    if (lowerName.includes('tidy') || lowerName.includes('clean')) return '🧹';
    if (lowerName.includes('plant') || lowerName.includes('water')) return '🌿';
  }

  return '✨';
}

export function detectCategory(taskName: string): string {
  const lowerName = taskName.toLowerCase();
  if (lowerName.includes('brush') || lowerName.includes('teeth')) return 'brushing_teeth';
  if (lowerName.includes('wash') || lowerName.includes('laundry') || lowerName.includes('clothes')) return 'washing_machine';
  if (lowerName.includes('shower') || lowerName.includes('bath')) return 'shower';
  if (lowerName.includes('arrange')) return 'arranging';
  if (lowerName.includes('tidy') || lowerName.includes('clean')) return 'tidying';
  if (lowerName.includes('plant') || lowerName.includes('water')) return 'watering_plants';
  return 'general';
}
