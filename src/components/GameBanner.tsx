import React from 'react';
import { Crown, Gamepad2, Eye } from 'lucide-react';

interface GameBannerProps {
  role: 'organiser' | 'player' | 'spectator';
}

export function GameBanner({ role }: GameBannerProps) {
  if (role === 'organiser') {
    return (
      <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 rounded-r-xl mb-6">
        <div className="flex items-center gap-3">
          <Crown className="w-6 h-6 text-yellow-600" />
          <div>
            <h3 className="font-bold text-yellow-900">Organiser Mode</h3>
            <p className="text-sm text-yellow-700">You created this game</p>
          </div>
        </div>
      </div>
    );
  }

  if (role === 'player') {
    return (
      <div className="bg-green-100 border-l-4 border-green-500 p-4 rounded-r-xl mb-6">
        <div className="flex items-center gap-3">
          <Gamepad2 className="w-6 h-6 text-green-600" />
          <div>
            <h3 className="font-bold text-green-900">Player Mode</h3>
            <p className="text-sm text-green-700">You're playing!</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 border-l-4 border-gray-400 p-4 rounded-r-xl mb-6">
      <div className="flex items-center gap-3">
        <Eye className="w-6 h-6 text-gray-600" />
        <div>
          <h3 className="font-bold text-gray-900">Spectator Mode</h3>
          <p className="text-sm text-gray-700">Viewing progress</p>
        </div>
      </div>
    </div>
  );
}
