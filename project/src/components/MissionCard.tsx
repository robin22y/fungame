import React, { useState } from 'react';
import { Scan, CheckCircle, Sparkles } from 'lucide-react';

interface MissionCardProps {
  emoji: string;
  taskName: string;
  xp: number;
  cash: number;
  currency: string;
  hasTag: boolean;
  hasPokerOffer?: boolean;
  pokerOffer?: {
    condition: string;
    bonusXp: number;
    bonusCash: number;
  };
  tagName?: string;
  currentCheckpoint?: number;
  totalCheckpoints?: number;
  onClick: () => void;
}

export function MissionCard({
  emoji,
  taskName,
  xp,
  cash,
  currency,
  hasTag,
  hasPokerOffer,
  pokerOffer,
  tagName,
  currentCheckpoint,
  totalCheckpoints,
  onClick,
}: MissionCardProps) {
  const [showXpPop, setShowXpPop] = useState(false);

  const handleClick = () => {
    setShowXpPop(true);
    setTimeout(() => setShowXpPop(false), 1000);
    onClick();
  };

  return (
    <div
      className={`relative rounded-2xl p-6 border-2 transition-all duration-300 hover:scale-105 cursor-pointer ${
        hasPokerOffer
          ? 'bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-300 hover:border-amber-500 hover:shadow-xl'
          : 'bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200 hover:border-blue-400 hover:shadow-xl'
      }`}
    >
      {showXpPop && (
        <div className="absolute top-2 right-2 animate-bounce">
          <span className="text-2xl font-bold text-green-600 drop-shadow-lg">
            +{xp} XP!
          </span>
        </div>
      )}

      {hasPokerOffer && (
        <div className="mb-3 flex items-center gap-2 bg-amber-200 px-3 py-2 rounded-xl w-fit">
          <Sparkles className="w-4 h-4 text-amber-800" />
          <span className="text-xs font-bold text-amber-800 uppercase">
            Poker Offer
          </span>
        </div>
      )}

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="text-7xl animate-pulse">{emoji}</div>
          <div>
            <h4 className="text-xl font-bold text-gray-800">{taskName}</h4>
            {totalCheckpoints && totalCheckpoints > 0 ? (
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold text-blue-600">
                  Step {(currentCheckpoint ?? 0) + 1} of {totalCheckpoints}
                </p>
                {tagName && (
                  <span className="text-xs text-gray-500">→ {tagName}</span>
                )}
              </div>
            ) : tagName ? (
              <p className="text-sm text-gray-600">Location: {tagName}</p>
            ) : null}
          </div>
        </div>
        <div className="flex gap-2">
          <div className="bg-white rounded-xl px-4 py-2 shadow-md">
            <p className="text-lg font-bold text-blue-600">+{xp} XP</p>
          </div>
          <div className="bg-white rounded-xl px-4 py-2 shadow-md">
            <p className="text-lg font-bold text-green-600">
              +{currency}{cash.toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      {hasPokerOffer && pokerOffer && (
        <div className="mb-4 bg-amber-100 border border-amber-300 rounded-xl p-3">
          <p className="text-sm text-amber-900 mb-2">
            <span className="font-semibold">Bonus Challenge:</span> {pokerOffer.condition}
          </p>
          <div className="flex gap-3 text-xs">
            <span className="bg-blue-200 text-blue-800 px-2 py-1 rounded-full font-semibold">
              +{pokerOffer.bonusXp} XP
            </span>
            <span className="bg-green-200 text-green-800 px-2 py-1 rounded-full font-semibold">
              +{currency}{pokerOffer.bonusCash.toFixed(2)}
            </span>
          </div>
        </div>
      )}

      <button
        onClick={handleClick}
        className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white py-3 rounded-xl font-semibold hover:from-green-600 hover:to-blue-600 transition-all transform hover:scale-105 shadow-lg"
      >
        <div className="flex items-center justify-center gap-2">
          {hasTag ? (
            <>
              <Scan className="w-5 h-5" />
              Scan / Tap Tag
            </>
          ) : (
            <>
              <CheckCircle className="w-5 h-5" />
              Mark Complete
            </>
          )}
        </div>
      </button>
    </div>
  );
}
