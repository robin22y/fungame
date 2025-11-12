import React from 'react';

interface LevelProgressBarProps {
  currentXp: number;
  level?: number;
}

export function LevelProgressBar({ currentXp, level }: LevelProgressBarProps) {
  const calculatedLevel = level ?? Math.floor(currentXp / 100) + 1;
  const xpForCurrentLevel = (calculatedLevel - 1) * 100;
  const xpForNextLevel = calculatedLevel * 100;
  const progressXp = currentXp - xpForCurrentLevel;
  const maxXpForLevel = xpForNextLevel - xpForCurrentLevel;
  const percentage = (progressXp / maxXpForLevel) * 100;

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-semibold text-gray-700">
          Level {calculatedLevel}
        </p>
        <p className="text-sm text-gray-600">
          {progressXp} / {maxXpForLevel} XP
        </p>
      </div>
      <div className="relative w-full h-8 bg-gray-200 rounded-full overflow-hidden shadow-inner">
        <div
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 transition-all duration-500 rounded-full"
          style={{ width: `${percentage}%` }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-bold text-white drop-shadow-lg">
            {Math.round(percentage)}%
          </span>
        </div>
      </div>
      <p className="text-xs text-gray-500 mt-1 text-center">
        {xpForNextLevel - currentXp} XP to Level {calculatedLevel + 1}
      </p>
    </div>
  );
}
