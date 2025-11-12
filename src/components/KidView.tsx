import React, { useState, useEffect } from 'react';
import { Trophy, Wallet, CheckCircle, Scan } from 'lucide-react';
import Confetti from 'react-confetti';
import { useApp } from '../context/AppContext';
import { ScanModal } from './ScanModal';
import { OpenScanModal } from './OpenScanModal';
import { MissionCard } from './MissionCard';
import { LevelProgressBar } from './LevelProgressBar';
import { MysteryMissionDisplay } from './MysteryMissionDisplay';
import { getMysteryMissionForToday, generateMysteryMission } from '../utils/mysteryMission';
import { getTaskEmoji } from '../utils/taskEmoji';
import { GeniePopup } from './GeniePopup';
import { getGenieMessage } from '../utils/genieMessage';
import { speakGenie } from '../utils/speakGenie';

export function KidView() {
  const { family, currentMember, completeMission } = useApp();
  const [showScanModal, setShowScanModal] = useState(false);
  const [selectedMission, setSelectedMission] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [mysteryMission, setMysteryMission] = useState<any>(null);
  const [showGenieGreeting, setShowGenieGreeting] = useState(false);
  const [genieGreeting, setGenieGreeting] = useState('');
  const [showOpenScan, setShowOpenScan] = useState(false);

  if (!family || !currentMember) return null;

  const myMissions = family.missions.filter(
    m => m.assignedTo === currentMember.id && !m.completed && !m.isMystery
  );

  useEffect(() => {
    if (family && currentMember) {
      const existing = getMysteryMissionForToday(family.missions);
      if (existing) {
        setMysteryMission(existing);
      } else {
        const newMystery = generateMysteryMission(
          family.missions.filter(m => m.assignedTo === currentMember.id)
        );
        if (newMystery) {
          setMysteryMission(newMystery);
        }
      }

      const lastGreeting = localStorage.getItem(`genie_greeting_${currentMember.id}`);
      const today = new Date().toDateString();
      const isFirstVisit = !lastGreeting;

      if (lastGreeting !== today) {
        let greeting = getGenieMessage('welcome', family.genieSettings?.mood || 'funny');

        if (isFirstVisit) {
          greeting = `Hello ${currentMember.nickname}! Welcome to your adventure! I'm your magical genie guide! Complete missions to earn rewards and unlock cool badges. Ready to become a super hero? Let's go!`;
        }

        setGenieGreeting(greeting);
        setShowGenieGreeting(true);
        localStorage.setItem(`genie_greeting_${currentMember.id}`, today);

        if (family.genieSettings?.voiceEnabled) {
          speakGenie(greeting, family.genieSettings);
        }
      }
    }
  }, [family, currentMember]);

  const [complimentMessage, setComplimentMessage] = useState<string | null>(null);

  const kindWords = [
    "You're awesome! 🌟",
    "Super job! 🚀",
    "Keep going! 💪",
    "Amazing work! ✨",
    "You're a star! ⭐",
    "Fantastic! 🎉",
    "Well done! 👏",
    "You rock! 🎸",
    "Incredible! 🌈",
    "You're unstoppable! 🔥"
  ];

  const handleScanClick = (missionId: string) => {
    const mission = family.missions.find(m => m.id === missionId);
    if (mission && !mission.tagId) {
      completeMission(missionId, currentMember.id);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);

      const randomCompliment = kindWords[Math.floor(Math.random() * kindWords.length)];
      setComplimentMessage(randomCompliment);
      setTimeout(() => setComplimentMessage(null), 3000);
    } else {
      setSelectedMission(missionId);
      setShowScanModal(true);
    }
  };

  const handleScanComplete = () => {
    setShowScanModal(false);
    setSelectedMission(null);
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);

    const randomCompliment = kindWords[Math.floor(Math.random() * kindWords.length)];
    setComplimentMessage(randomCompliment);
    setTimeout(() => setComplimentMessage(null), 3000);
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

      {complimentMessage && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 animate-bounce">
          <div className="bg-gradient-to-r from-green-400 to-blue-500 text-white px-8 py-4 rounded-2xl shadow-2xl text-2xl font-bold">
            {complimentMessage}
          </div>
        </div>
      )}

    <div className="max-w-4xl mx-auto">
      <div className="bg-gradient-to-r from-yellow-400 to-orange-400 rounded-3xl shadow-xl p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
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
        <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl p-4">
          <LevelProgressBar currentXp={currentMember.totalXp} level={currentMember.level} />
        </div>
      </div>

      {mysteryMission && (
        <MysteryMissionDisplay
          mission={mysteryMission}
          currency={family.currency}
          onComplete={() => handleScanClick(mysteryMission.id)}
        />
      )}

      <button
        onClick={() => setShowOpenScan(true)}
        className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-6 rounded-3xl font-bold text-xl shadow-xl hover:from-blue-600 hover:to-purple-600 transition-all mb-6 flex items-center justify-center gap-3"
      >
        <Scan className="w-8 h-8" />
        Scan Any Tag to Find Missions
      </button>

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

              return (
                <MissionCard
                  key={mission.id}
                  emoji={getTaskEmoji(mission.category, mission.taskName)}
                  taskName={mission.taskName}
                  xp={mission.xp}
                  cash={mission.cash}
                  currency={family.currency}
                  hasTag={!!mission.tagId}
                  hasPokerOffer={!!mission.pokerOffer}
                  pokerOffer={mission.pokerOffer}
                  tagName={tag?.name || tag?.uid}
                  currentCheckpoint={mission.currentCheckpoint}
                  totalCheckpoints={mission.checkpoints?.length}
                  onClick={() => handleScanClick(mission.id)}
                />
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

      {showGenieGreeting && (
        <GeniePopup
          message={genieGreeting}
          onClose={() => setShowGenieGreeting(false)}
          duration={5000}
        />
      )}

      {showOpenScan && (
        <OpenScanModal onClose={() => setShowOpenScan(false)} />
      )}
    </div>
    </>
  );
}
