import React from 'react';
import { Award } from 'lucide-react';
import { AVAILABLE_BADGES, getBadgeDetails } from '../utils/badgeSystem';
import { Member } from '../types';

interface BadgeDisplayProps {
  member: Member;
}

export function BadgeDisplay({ member }: BadgeDisplayProps) {
  const earnedBadges = (member.badges || []).map(badgeId => getBadgeDetails(badgeId)).filter(Boolean);
  const unearnedBadges = AVAILABLE_BADGES.filter(
    badge => !member.badges?.includes(badge.id)
  );

  return (
    <div className="bg-white rounded-3xl shadow-xl p-8">
      <div className="flex items-center gap-2 mb-6">
        <Award className="w-8 h-8 text-yellow-600" />
        <h2 className="text-3xl font-bold text-gray-800">Badges</h2>
      </div>

      {earnedBadges.length > 0 && (
        <div className="mb-8">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Earned Badges</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {earnedBadges.map((badge) => (
              <div
                key={badge!.id}
                className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-6 border-2 border-yellow-300 text-center transform hover:scale-105 transition-all"
              >
                <div className="text-6xl mb-3">{badge!.emoji}</div>
                <h4 className="font-bold text-gray-800 mb-1">{badge!.name}</h4>
                <p className="text-sm text-gray-600">{badge!.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {unearnedBadges.length > 0 && (
        <div>
          <h3 className="text-xl font-bold text-gray-800 mb-4">Locked Badges</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {unearnedBadges.map((badge) => (
              <div
                key={badge.id}
                className="bg-gray-100 rounded-2xl p-6 border-2 border-gray-300 text-center opacity-60"
              >
                <div className="text-6xl mb-3 grayscale">{badge.emoji}</div>
                <h4 className="font-bold text-gray-600 mb-1">{badge.name}</h4>
                <p className="text-sm text-gray-500">{badge.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {earnedBadges.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🎖️</div>
          <p className="text-gray-600 text-lg">No badges earned yet</p>
          <p className="text-gray-500 text-sm mt-2">Complete missions to unlock badges!</p>
        </div>
      )}
    </div>
  );
}
