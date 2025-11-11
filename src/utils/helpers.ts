const adjectives = [
  'Happy', 'Sunny', 'Brave', 'Swift', 'Clever', 'Mighty', 'Golden', 'Silver',
  'Crystal', 'Dancing', 'Cosmic', 'Rainbow', 'Thunder', 'Sparkle', 'Wonder'
];

const animals = [
  'Lions🦁', 'Eagles🦅', 'Dolphins🐬', 'Owls🦉', 'Pandas🐼', 'Tigers🐯',
  'Dragons🐉', 'Wolves🐺', 'Bears🐻', 'Foxes🦊', 'Unicorns🦄', 'Penguins🐧'
];

export function generateFamilyName(): string {
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const animal = animals[Math.floor(Math.random() * animals.length)];
  const number = Math.floor(Math.random() * 90) + 10;
  return `${adjective}${animal}${number}`;
}

export function validatePin(pin: string): boolean {
  return /^\d{4}$/.test(pin);
}

export function mockTagUID(): string {
  const chars = '0123456789ABCDEF';
  let uid = '';
  for (let i = 0; i < 8; i++) {
    uid += chars[Math.floor(Math.random() * chars.length)];
  }
  return uid;
}

export function getTaskEmoji(taskName: string): string {
  const lower = taskName.toLowerCase();
  if (lower.includes('water') || lower.includes('plant')) return '🌿';
  if (lower.includes('clean') || lower.includes('tidy')) return '🧹';
  if (lower.includes('dish') || lower.includes('wash')) return '🍽️';
  if (lower.includes('laundry') || lower.includes('clothes')) return '👕';
  if (lower.includes('homework') || lower.includes('study')) return '📚';
  if (lower.includes('bed')) return '🛏️';
  if (lower.includes('trash') || lower.includes('garbage')) return '🗑️';
  if (lower.includes('pet') || lower.includes('feed')) return '🐕';
  return '✨';
}

export function getTodayString(): string {
  return new Date().toISOString().split('T')[0];
}
