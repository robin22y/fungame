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
