import React from 'react';
import { Sparkles } from 'lucide-react';
import { Mission } from '../types';
import { MissionCard } from './MissionCard';

interface MysteryMissionDisplayProps {
  mission: Mission;
  currency: string;
  onComplete: () => void;
}

export function MysteryMissionDisplay({ mission, currency, onComplete }: MysteryMissionDisplayProps) {
  return (
    <div className="mb-6">
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl shadow-2xl p-6 mb-4">
        <div className="flex items-center justify-center gap-2 mb-3">
          <Sparkles className="w-8 h-8 text-yellow-300 animate-pulse" />
          <h3 className="text-2xl font-bold text-white">Mystery Mission</h3>
          <Sparkles className="w-8 h-8 text-yellow-300 animate-pulse" />
        </div>
        <p className="text-center text-purple-100 text-sm">
          Complete today's mystery mission for DOUBLE rewards!
        </p>
      </div>

      <MissionCard
        emoji="🔮"
        taskName={mission.taskName}
        xp={mission.xp}
        cash={mission.cash}
        currency={currency}
        hasTag={!!mission.tagId}
        tagName={mission.tagId ? 'Mystery Location' : undefined}
        onClick={onComplete}
      />
    </div>
  );
}
