export interface Theme {
  id: string;
  name: string;
  emoji: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
  };
}

export const THEMES: Theme[] = [
  {
    id: 'home_heroes',
    name: 'Home Heroes',
    emoji: '🏠',
    colors: {
      primary: 'from-blue-400 to-blue-600',
      secondary: 'from-green-400 to-green-600',
      accent: 'from-yellow-400 to-yellow-600',
      background: 'from-blue-50 via-purple-50 to-pink-50',
    },
  },
  {
    id: 'garden_guardians',
    name: 'Garden Guardians',
    emoji: '🌿',
    colors: {
      primary: 'from-green-400 to-emerald-600',
      secondary: 'from-lime-400 to-green-600',
      accent: 'from-amber-400 to-orange-600',
      background: 'from-green-50 via-emerald-50 to-teal-50',
    },
  },
  {
    id: 'space_crew',
    name: 'Space Crew',
    emoji: '🚀',
    colors: {
      primary: 'from-purple-400 to-indigo-600',
      secondary: 'from-blue-400 to-purple-600',
      accent: 'from-pink-400 to-rose-600',
      background: 'from-purple-50 via-indigo-50 to-blue-50',
    },
  },
  {
    id: 'ocean_explorers',
    name: 'Ocean Explorers',
    emoji: '🌊',
    colors: {
      primary: 'from-cyan-400 to-blue-600',
      secondary: 'from-teal-400 to-cyan-600',
      accent: 'from-blue-400 to-indigo-600',
      background: 'from-cyan-50 via-blue-50 to-indigo-50',
    },
  },
  {
    id: 'forest_friends',
    name: 'Forest Friends',
    emoji: '🌲',
    colors: {
      primary: 'from-green-400 to-teal-600',
      secondary: 'from-emerald-400 to-green-600',
      accent: 'from-amber-400 to-yellow-600',
      background: 'from-green-50 via-teal-50 to-emerald-50',
    },
  },
];

export function getThemeOfTheWeek(): Theme {
  const weekNumber = Math.floor(Date.now() / (7 * 24 * 60 * 60 * 1000));
  const themeIndex = weekNumber % THEMES.length;
  return THEMES[themeIndex];
}

export function getCurrentTheme(): Theme {
  const stored = localStorage.getItem('current_theme');
  if (stored) {
    const theme = THEMES.find(t => t.id === stored);
    if (theme) return theme;
  }

  const weeklyTheme = getThemeOfTheWeek();
  localStorage.setItem('current_theme', weeklyTheme.id);
  return weeklyTheme;
}

export function setTheme(themeId: string): void {
  localStorage.setItem('current_theme', themeId);
}

export function getAppThemeClasses(theme: string): string {
  switch (theme) {
    case 'dark':
      return 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white';
    case 'light':
      return 'bg-gradient-to-br from-gray-50 via-white to-gray-100 text-gray-900';
    case 'festive':
      return 'bg-gradient-to-br from-pink-200 via-purple-200 to-yellow-200 text-gray-900';
    case 'ocean':
      return 'bg-gradient-to-br from-blue-300 via-cyan-200 to-teal-300 text-gray-900';
    case 'forest':
      return 'bg-gradient-to-br from-green-300 via-emerald-200 to-lime-300 text-gray-900';
    case 'sunset':
      return 'bg-gradient-to-br from-orange-300 via-pink-300 to-red-300 text-gray-900';
    case 'royal':
      return 'bg-gradient-to-br from-purple-400 via-indigo-300 to-pink-400 text-white';
    case 'default':
    default:
      return 'bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 text-gray-800';
  }
}

export function getCardThemeClasses(theme: string): string {
  switch (theme) {
    case 'dark':
      return 'bg-gray-800 bg-opacity-80 backdrop-blur-sm text-white border-gray-700';
    case 'light':
      return 'bg-white bg-opacity-90 backdrop-blur-sm text-gray-900 border-gray-200';
    case 'festive':
      return 'bg-white bg-opacity-70 backdrop-blur-sm text-gray-900 border-pink-300';
    case 'ocean':
      return 'bg-white bg-opacity-70 backdrop-blur-sm text-gray-900 border-blue-300';
    case 'forest':
      return 'bg-white bg-opacity-70 backdrop-blur-sm text-gray-900 border-green-300';
    case 'sunset':
      return 'bg-white bg-opacity-70 backdrop-blur-sm text-gray-900 border-orange-300';
    case 'royal':
      return 'bg-purple-900 bg-opacity-40 backdrop-blur-sm text-white border-purple-400';
    case 'default':
    default:
      return 'bg-white text-gray-800 border-gray-200';
  }
}

export function getTextThemeClasses(theme: string): string {
  switch (theme) {
    case 'dark':
      return 'text-white';
    case 'royal':
      return 'text-white';
    case 'light':
    case 'festive':
    case 'ocean':
    case 'forest':
    case 'sunset':
    case 'default':
    default:
      return 'text-gray-800';
  }
}

export function getAccentThemeClasses(theme: string): string {
  switch (theme) {
    case 'dark':
      return 'text-blue-400';
    case 'light':
      return 'text-blue-600';
    case 'festive':
      return 'text-pink-600';
    case 'ocean':
      return 'text-cyan-600';
    case 'forest':
      return 'text-green-600';
    case 'sunset':
      return 'text-orange-600';
    case 'royal':
      return 'text-yellow-300';
    case 'default':
    default:
      return 'text-blue-600';
  }
}

export const appThemeOptions = [
  { name: 'Default', value: 'default', emoji: '🎨' },
  { name: 'Light', value: 'light', emoji: '☀️' },
  { name: 'Dark', value: 'dark', emoji: '🌙' },
  { name: 'Festive', value: 'festive', emoji: '🎉' },
  { name: 'Ocean', value: 'ocean', emoji: '🌊' },
  { name: 'Forest', value: 'forest', emoji: '🌲' },
  { name: 'Sunset', value: 'sunset', emoji: '🌅' },
  { name: 'Royal', value: 'royal', emoji: '👑' },
];
