import React from 'react';
import { Palette } from 'lucide-react';
import { THEMES, getCurrentTheme, setTheme, appThemeOptions } from '../utils/themeManager';
import { useApp } from '../context/AppContext';

interface ThemeSelectorProps {
  onThemeChange?: () => void;
}

export function ThemeSelector({ onThemeChange }: ThemeSelectorProps) {
  const [currentTheme, setCurrentTheme] = React.useState(getCurrentTheme());
  const { appTheme, updateAppTheme } = useApp();

  const handleThemeChange = (themeId: string) => {
    setTheme(themeId);
    const newTheme = THEMES.find(t => t.id === themeId);
    if (newTheme) {
      setCurrentTheme(newTheme);
      if (onThemeChange) onThemeChange();
    }
  };

  const handleAppThemeChange = (themeValue: string) => {
    updateAppTheme(themeValue);
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl p-8">
      <div className="flex items-center gap-2 mb-6">
        <Palette className="w-8 h-8 text-purple-600" />
        <h2 className="text-3xl font-bold text-gray-800">Theme Settings</h2>
      </div>

      <div className="mb-8">
        <h3 className="text-xl font-bold text-gray-800 mb-4">App Theme</h3>
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-4 mb-4 border-2 border-blue-200">
          <p className="text-gray-700 text-center">
            <span className="font-bold">Current:</span> {appThemeOptions.find(t => t.value === appTheme)?.emoji} {appThemeOptions.find(t => t.value === appTheme)?.name}
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {appThemeOptions.map((theme) => (
            <button
              key={theme.value}
              onClick={() => handleAppThemeChange(theme.value)}
              className={`rounded-xl p-4 border-2 transition-all ${
                appTheme === theme.value
                  ? 'border-purple-500 bg-purple-50 scale-105'
                  : 'border-gray-300 bg-white hover:border-purple-300'
              }`}
            >
              <div className="text-3xl mb-2">{theme.emoji}</div>
              <div className="text-sm font-semibold text-gray-800">{theme.name}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="border-t-2 border-gray-200 pt-8">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Mission Theme</h3>
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-4 mb-6 border-2 border-blue-200">
          <p className="text-gray-700 text-center">
            <span className="font-bold">Current Mission Theme:</span> {currentTheme.emoji} {currentTheme.name}
          </p>
        </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {THEMES.map((theme) => (
          <button
            key={theme.id}
            onClick={() => handleThemeChange(theme.id)}
            className={`rounded-2xl p-6 border-2 transition-all text-left ${
              currentTheme.id === theme.id
                ? 'border-purple-500 bg-purple-50 scale-105'
                : 'border-gray-300 bg-white hover:border-purple-300 hover:scale-102'
            }`}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="text-4xl">{theme.emoji}</div>
              <h3 className="text-xl font-bold text-gray-800">{theme.name}</h3>
            </div>
            <div className="space-y-2">
              <div className={`h-6 rounded-lg bg-gradient-to-r ${theme.colors.primary}`} />
              <div className={`h-6 rounded-lg bg-gradient-to-r ${theme.colors.secondary}`} />
              <div className={`h-6 rounded-lg bg-gradient-to-r ${theme.colors.accent}`} />
            </div>
            {currentTheme.id === theme.id && (
              <div className="mt-3 text-center">
                <span className="inline-block bg-purple-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                  Active
                </span>
              </div>
            )}
          </button>
        ))}
      </div>
      </div>
    </div>
  );
}
