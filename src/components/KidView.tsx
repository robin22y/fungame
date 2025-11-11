import React, { useState } from 'react';
import { Scan, CheckCircle, Trophy, Wallet, Sparkles } from 'lucide-react';
import Confetti from 'react-confetti';
import { useApp } from '../context/AppContext';
import { ScanModal } from './ScanModal';

export function KidView() {
  const { family, currentMember, completeMission } = useApp();
  const [showScanModal, setShowScanModal] = useState(false);
  const [selectedMission, setSelectedMission] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);

  if (!family || !currentMember) return null;

  const myMissions = family.missions.filter(
    m => m.assignedTo === currentMember.id && !m.completed
  );

  const handleScanClick = (missionId: string) => {
    const mission = family.missions.find(m => m.id === missionId);
    if (mission && !mission.tagId) {
      completeMission(missionId, currentMember.id);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    } else {
      setSelectedMission(missionId);
      setShowScanModal(true);
    }
  };

  const handleScanComplete = () => {
    setShowScanModal(false);
    setSelectedMission(null);
  };

  return (
    <>
      {showConfetti && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false}
          numberOfPieces={500}
        />
      )}
    <div className="max-w-4xl mx-auto">
      <div className="bg-gradient-to-r from-yellow-400 to-orange-400 rounded-3xl shadow-xl p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">
              Hey {currentMember.nickname}!
            </h2>
            <p className="text-yellow-50">Ready for some missions?</p>
          </div>
          <div className="flex gap-3">
            <div className="text-center bg-white rounded-2xl p-4 shadow-lg">
              <Trophy className="w-8 h-8 text-yellow-500 mx-auto mb-1" />
              <p className="text-2xl font-bold text-gray-800">{currentMember.totalXp}</p>
              <p className="text-xs text-gray-600">Total XP</p>
            </div>
            <div className="text-center bg-white rounded-2xl p-4 shadow-lg">
              <Wallet className="w-8 h-8 text-green-500 mx-auto mb-1" />
              <p className="text-2xl font-bold text-gray-800">
                {family.currency}{currentMember.totalCash.toFixed(2)}
              </p>
              <p className="text-xs text-gray-600">Wallet</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-xl p-8">
        <h3 className="text-2xl font-bold text-gray-800 mb-6">Your Missions</h3>

        {myMissions.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎉</div>
            <p className="text-gray-600 text-lg">No missions right now!</p>
            <p className="text-gray-500 text-sm mt-2">Check back later for new tasks</p>
          </div>
        ) : (
          <div className="space-y-4">
            {myMissions.map((mission) => {
              const tag = family.tags.find(t => t.id === mission.tagId);
              const hasPokerOffer = mission.pokerOffer;

              return (
                <div
                  key={mission.id}
                  className={`rounded-2xl p-6 border-2 transition-colors ${
                    hasPokerOffer
                      ? 'bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-300 hover:border-amber-500'
                      : 'bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200 hover:border-blue-400'
                  }`}
                >
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
                      <div className="text-3xl">{mission.emoji}</div>
                      <div>
                        <h4 className="text-xl font-bold text-gray-800">{mission.taskName}</h4>
                        {mission.checkpoints && mission.checkpoints.length > 0 ? (
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-semibold text-blue-600">
                              Step {(mission.currentCheckpoint ?? 0) + 1} of {mission.checkpoints.length}
                            </p>
                            {tag && (
                              <span className="text-xs text-gray-500">
                                → {tag.name || tag.uid}
                              </span>
                            )}
                          </div>
                        ) : tag ? (
                          <p className="text-sm text-gray-600">
                            Location: {tag.name || tag.uid}
                          </p>
                        ) : null}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <div className="bg-white rounded-xl px-4 py-2 shadow-md">
                        <p className="text-lg font-bold text-blue-600">+{mission.xp} XP</p>
                      </div>
                      <div className="bg-white rounded-xl px-4 py-2 shadow-md">
                        <p className="text-lg font-bold text-green-600">
                          +{family.currency}{mission.cash.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {hasPokerOffer && mission.pokerOffer && (
                    <div className="mb-4 bg-amber-100 border border-amber-300 rounded-xl p-3">
                      <p className="text-sm text-amber-900 mb-2">
                        <span className="font-semibold">Bonus Challenge:</span> {mission.pokerOffer.condition}
                      </p>
                      <div className="flex gap-3 text-xs">
                        <span className="bg-blue-200 text-blue-800 px-2 py-1 rounded-full font-semibold">
                          +{mission.pokerOffer.bonusXp} XP
                        </span>
                        <span className="bg-green-200 text-green-800 px-2 py-1 rounded-full font-semibold">
                          +{family.currency}{mission.pokerOffer.bonusCash.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  )}

                  <button
                    onClick={() => handleScanClick(mission.id)}
                    className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white py-3 rounded-xl font-semibold hover:from-green-600 hover:to-blue-600 transition-all transform hover:scale-105 shadow-lg"
                  >
                    <div className="flex items-center justify-center gap-2">
                      {mission.tagId ? (
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
            })}
          </div>
        )}

        <div className="mt-8 pt-6 border-t-2 border-gray-200">
          <h4 className="text-lg font-bold text-gray-800 mb-4">Completed Today</h4>
          {family.missions.filter(
            m => m.completedBy === currentMember.id && m.completed
          ).length === 0 ? (
            <p className="text-gray-500 text-sm">No missions completed yet today</p>
          ) : (
            <div className="space-y-2">
              {family.missions
                .filter(m => m.completedBy === currentMember.id && m.completed)
                .map((mission) => (
                  <div
                    key={mission.id}
                    className="flex items-center gap-3 bg-green-50 rounded-xl p-3 border border-green-200"
                  >
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-2xl">{mission.emoji}</span>
                    <span className="flex-1 text-gray-700">{mission.taskName}</span>
                    <div className="flex gap-2 text-sm font-semibold">
                      <span className="text-blue-600">+{mission.xp} XP</span>
                      <span className="text-green-600">
                        +{family.currency}{mission.cash.toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>

      {showScanModal && selectedMission && (
        <ScanModal
          missionId={selectedMission}
          onClose={() => setShowScanModal(false)}
          onComplete={handleScanComplete}
        />
      )}
    </div>
    </>
  );
}
