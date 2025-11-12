import React, { useState, useEffect } from 'react';
import { Trophy, Target, CheckCircle, Wallet, TrendingUp, Sparkles, Plus, QrCode, Tag, ShoppingBag, FolderKanban, Camera, Printer } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getTaskEmoji } from '../utils/taskEmoji';
import { GeniePopup } from './GeniePopup';
import { getGenieMessage } from '../utils/genieMessage';
import { speakGenie } from '../utils/speakGenie';
import { AddMission } from './AddMission';
import { ViewAllTags } from './ViewAllTags';
import { GameStore } from './GameStore';
import { FamilyGamesPage } from './FamilyGamesPage';
import { PrintQRCodes } from './PrintQRCodes';

export function FamilyDashboard() {
  const { family } = useApp();
  const [showGenieGreeting, setShowGenieGreeting] = useState(false);
  const [genieGreeting, setGenieGreeting] = useState('');
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [showTagsModal, setShowTagsModal] = useState(false);
  const [showStoreModal, setShowStoreModal] = useState(false);
  const [showGamesModal, setShowGamesModal] = useState(false);
  const [showPhotoGallery, setShowPhotoGallery] = useState(false);
  const [showPrintQR, setShowPrintQR] = useState(false);

  useEffect(() => {
    if (family) {
      const lastGreeting = localStorage.getItem('genie_greeting_parent');
      const today = new Date().toDateString();
      const isFirstVisit = !lastGreeting;

      if (lastGreeting !== today) {
        let greeting = getGenieMessage('welcome', family.genieSettings?.mood || 'funny');

        if (isFirstVisit) {
          greeting = `Welcome to your Family Task Game! I'm your magical genie assistant! I'll help guide your family on fun adventures and missions. Let's make chores exciting together!`;
        }

        setGenieGreeting(greeting);
        setShowGenieGreeting(true);
        localStorage.setItem('genie_greeting_parent', today);

        if (family.genieSettings?.voiceEnabled) {
          speakGenie(greeting, family.genieSettings);
        }
      }
    }
  }, [family]);

  if (!family) return null;

  const totalMissions = family.missions.length;
  const completedMissions = family.missions.filter(m => m.completed).length;
  const totalXpToday = family.members.reduce((sum, m) => sum + m.xpToday, 0);
  const totalCashToday = family.members.reduce((sum, m) => sum + m.cashToday, 0);
  const totalCashEarned = family.members.reduce((sum, m) => sum + m.totalCash, 0);

  const sortedByXp = [...family.members].sort((a, b) => b.totalXp - a.totalXp);
  const sortedByCash = [...family.members].sort((a, b) => b.totalCash - a.totalCash);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-3xl shadow-xl p-8 mb-6">
        <div className="text-center mb-6">
          <h2 className="text-4xl font-bold text-gray-800 mb-2">
            {family.name}
          </h2>
          <p className="text-gray-600">Track your family's progress</p>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-8">
          <button
            onClick={() => setShowQuickAdd(!showQuickAdd)}
            className="bg-gradient-to-r from-blue-500 to-purple-500 text-white py-4 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-600 transition-all shadow-lg"
          >
            <div className="flex items-center justify-center gap-2">
              <Plus className="w-5 h-5" />
              {showQuickAdd ? 'Close' : 'Add Mission'}
            </div>
          </button>
          <button
            onClick={() => setShowTagsModal(!showTagsModal)}
            className="bg-gradient-to-r from-green-500 to-teal-500 text-white py-4 rounded-xl font-semibold hover:from-green-600 hover:to-teal-600 transition-all shadow-lg"
          >
            <div className="flex items-center justify-center gap-2">
              <QrCode className="w-5 h-5" />
              {showTagsModal ? 'Close' : 'View QR Tags'}
            </div>
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border-2 border-blue-200">
            <div className="flex items-center gap-3 mb-2">
              <Target className="w-6 h-6 text-blue-600" />
              <h3 className="text-sm font-semibold text-gray-800">Missions</h3>
            </div>
            <p className="text-3xl font-bold text-blue-600">{totalMissions}</p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 border-2 border-green-200">
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle className="w-6 h-6 text-green-600" />
              <h3 className="text-sm font-semibold text-gray-800">Completed</h3>
            </div>
            <p className="text-3xl font-bold text-green-600">{completedMissions}</p>
          </div>

          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-2xl p-6 border-2 border-yellow-200">
            <div className="flex items-center gap-3 mb-2">
              <Trophy className="w-6 h-6 text-yellow-600" />
              <h3 className="text-sm font-semibold text-gray-800">XP Today</h3>
            </div>
            <p className="text-3xl font-bold text-yellow-600">{totalXpToday}</p>
          </div>

          <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl p-6 border-2 border-emerald-200">
            <div className="flex items-center gap-3 mb-2">
              <Wallet className="w-6 h-6 text-emerald-600" />
              <h3 className="text-sm font-semibold text-gray-800">Today</h3>
            </div>
            <p className="text-3xl font-bold text-emerald-600">
              {family.currency}{totalCashToday.toFixed(2)}
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border-2 border-green-300 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Wallet className="w-6 h-6 text-green-600" />
                <h3 className="text-xl font-bold text-gray-800">Family Wallet</h3>
              </div>
              <p className="text-gray-600 text-sm">Total pocket money earned by everyone</p>
            </div>
            <div className="text-right">
              <p className="text-5xl font-bold text-green-600">
                {family.currency}{totalCashEarned.toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-6 border-2 border-yellow-300">
            <div className="flex items-center gap-2 mb-4">
              <Trophy className="w-6 h-6 text-yellow-600" />
              <h3 className="text-lg font-bold text-gray-800">Top XP Earners</h3>
            </div>
            <div className="space-y-3">
              {sortedByXp.slice(0, 3).map((member, index) => (
                <div key={member.id} className="flex items-center gap-3">
                  <div className={`text-2xl ${index === 0 ? 'text-3xl' : ''}`}>
                    {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800">{member.nickname}</p>
                    <p className="text-sm text-gray-600">{member.totalXp} XP</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border-2 border-green-300">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-6 h-6 text-green-600" />
              <h3 className="text-lg font-bold text-gray-800">Top Cash Earners</h3>
            </div>
            <div className="space-y-3">
              {sortedByCash.slice(0, 3).map((member, index) => (
                <div key={member.id} className="flex items-center gap-3">
                  <div className={`text-2xl ${index === 0 ? 'text-3xl' : ''}`}>
                    {index === 0 ? '💰' : index === 1 ? '💵' : '💸'}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800">{member.nickname}</p>
                    <p className="text-sm text-gray-600">
                      {family.currency}{member.totalCash.toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Family Members</h3>
          {family.members.map((member) => {
            const maxXp = Math.max(...family.members.map(m => m.totalXp), 100);
            const percentage = (member.totalXp / maxXp) * 100;

            return (
              <div key={member.id} className="bg-gray-50 rounded-2xl p-6 border-2 border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="text-xl font-bold text-gray-800">{member.nickname}</h4>
                    <div className="flex gap-4 mt-1">
                      <p className="text-sm text-gray-600">
                        Total XP: <span className="font-semibold">{member.totalXp}</span>
                      </p>
                      <p className="text-sm text-gray-600">
                        Today: <span className="font-semibold text-green-600">{member.xpToday}</span>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-center bg-white rounded-xl px-4 py-2 shadow-md">
                      <Wallet className="w-5 h-5 text-green-500 mx-auto mb-1" />
                      <p className="text-lg font-bold text-green-600">
                        {family.currency}{member.totalCash.toFixed(2)}
                      </p>
                    </div>
                    <Trophy className="w-8 h-8 text-yellow-500" />
                  </div>
                </div>

                <div className="relative w-full h-6 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500 rounded-full"
                    style={{ width: `${percentage}%` }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xs font-semibold text-gray-700">
                      {member.totalXp} XP
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-8">
        <button
          onClick={() => setShowStoreModal(true)}
          className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-6 rounded-xl font-semibold hover:from-blue-600 hover:to-cyan-600 transition-all shadow-lg"
        >
          <div className="flex flex-col items-center gap-2">
            <ShoppingBag className="w-8 h-8" />
            <span>Game Store</span>
          </div>
        </button>
        <button
          onClick={() => setShowGamesModal(true)}
          className="bg-gradient-to-r from-purple-500 to-pink-500 text-white py-6 rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg"
        >
          <div className="flex flex-col items-center gap-2">
            <FolderKanban className="w-8 h-8" />
            <span>Family Games</span>
          </div>
        </button>
        <button
          onClick={() => setShowPhotoGallery(true)}
          className="bg-gradient-to-r from-green-500 to-emerald-500 text-white py-6 rounded-xl font-semibold hover:from-green-600 hover:to-emerald-600 transition-all shadow-lg"
        >
          <div className="flex flex-col items-center gap-2">
            <Camera className="w-8 h-8" />
            <span>Photo Gallery</span>
          </div>
        </button>
        <button
          onClick={() => setShowPrintQR(true)}
          className="bg-gradient-to-r from-orange-500 to-red-500 text-white py-6 rounded-xl font-semibold hover:from-orange-600 hover:to-red-600 transition-all shadow-lg"
        >
          <div className="flex flex-col items-center gap-2">
            <Printer className="w-8 h-8" />
            <span>Print QR Codes</span>
          </div>
        </button>
      </div>

      <div className="bg-white rounded-3xl shadow-xl p-8">
        <h3 className="text-2xl font-bold text-gray-800 mb-6">Recent Activity</h3>

        {family.missions.filter(m => m.completed).length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🚀</div>
            <p className="text-gray-600 text-lg">No completed missions yet</p>
            <p className="text-gray-500 text-sm mt-2">Start completing tasks to see activity here</p>
          </div>
        ) : (
          <div className="space-y-3">
            {family.missions
              .filter(m => m.completed)
              .sort((a, b) => {
                const dateA = a.completedAt ? new Date(a.completedAt).getTime() : 0;
                const dateB = b.completedAt ? new Date(b.completedAt).getTime() : 0;
                return dateB - dateA;
              })
              .slice(0, 10)
              .map((mission) => {
                const member = family.members.find(m => m.id === mission.completedBy);
                const hasPokerOffer = mission.pokerOffer;

                return (
                  <div
                    key={mission.id}
                    className={`flex items-center justify-between rounded-xl p-4 border ${
                      hasPokerOffer
                        ? 'bg-amber-50 border-amber-300'
                        : 'bg-green-50 border-green-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {hasPokerOffer ? (
                        <Sparkles className="w-5 h-5 text-amber-600" />
                      ) : (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      )}
                      <span className="text-2xl">{getTaskEmoji(mission.category, mission.taskName)}</span>
                      <div>
                        <p className="font-semibold text-gray-800">{mission.taskName}</p>
                        <p className="text-sm text-gray-600">
                          Completed by {member?.nickname || 'Unknown'}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-blue-600">+{mission.xp} XP</p>
                      <p className="font-bold text-green-600">
                        +{family.currency}{mission.cash.toFixed(2)}
                      </p>
                    </div>
                  </div>
                );
              })}
          </div>
        )}
      </div>

      {showGenieGreeting && (
        <GeniePopup
          message={genieGreeting}
          onClose={() => setShowGenieGreeting(false)}
          duration={5000}
        />
      )}

      {showQuickAdd && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b-2 border-gray-200 p-6 flex items-center justify-between rounded-t-3xl">
              <h3 className="text-2xl font-bold text-gray-800">Add New Mission</h3>
              <button
                onClick={() => setShowQuickAdd(false)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 w-10 h-10 rounded-xl flex items-center justify-center transition-all"
              >
                ✕
              </button>
            </div>
            <div className="p-6">
              <AddMission />
            </div>
          </div>
        </div>
      )}

      {showTagsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b-2 border-gray-200 p-6 flex items-center justify-between rounded-t-3xl">
              <h3 className="text-2xl font-bold text-gray-800">QR Tags & NFC</h3>
              <button
                onClick={() => setShowTagsModal(false)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 w-10 h-10 rounded-xl flex items-center justify-center transition-all"
              >
                ✕
              </button>
            </div>
            <div className="p-6">
              <ViewAllTags />
            </div>
          </div>
        </div>
      )}

      {showStoreModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b-2 border-gray-200">
              <h2 className="text-3xl font-bold text-gray-800">Game Store</h2>
              <button
                onClick={() => setShowStoreModal(false)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 w-10 h-10 rounded-xl flex items-center justify-center transition-all"
              >
                ✕
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-100px)]">
              <GameStore />
            </div>
          </div>
        </div>
      )}

      {showGamesModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b-2 border-gray-200">
              <h2 className="text-3xl font-bold text-gray-800">Family Games</h2>
              <button
                onClick={() => setShowGamesModal(false)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 w-10 h-10 rounded-xl flex items-center justify-center transition-all"
              >
                ✕
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-100px)]">
              <FamilyGamesPage />
            </div>
          </div>
        </div>
      )}

      {showPhotoGallery && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b-2 border-gray-200">
              <h2 className="text-3xl font-bold text-gray-800">Photo Gallery</h2>
              <button
                onClick={() => setShowPhotoGallery(false)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 w-10 h-10 rounded-xl flex items-center justify-center transition-all"
              >
                ✕
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-100px)]">
              {family.missions.filter(m => m.photoProofId).length === 0 ? (
                <div className="text-center py-12">
                  <Camera className="w-20 h-20 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600 text-lg">No photos yet</p>
                  <p className="text-gray-500 text-sm mt-2">Photos will appear here when kids complete missions with photo proof</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {family.missions
                    .filter(m => m.photoProofId)
                    .sort((a, b) => {
                      const dateA = a.completedAt ? new Date(a.completedAt).getTime() : 0;
                      const dateB = b.completedAt ? new Date(b.completedAt).getTime() : 0;
                      return dateB - dateA;
                    })
                    .map((mission) => {
                      const member = family.members.find(m => m.id === mission.completedBy);
                      return (
                        <div key={mission.id} className="bg-gray-50 rounded-xl p-3 border-2 border-gray-200">
                          <div className="aspect-square bg-gray-200 rounded-lg mb-2 overflow-hidden">
                            <img
                              src={mission.photoProofId}
                              alt={mission.taskName}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <p className="font-semibold text-sm text-gray-800 truncate">{mission.taskName}</p>
                          <p className="text-xs text-gray-500">{member?.nickname || 'Unknown'}</p>
                          {mission.completedAt && (
                            <p className="text-xs text-gray-400 mt-1">
                              {new Date(mission.completedAt).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      );
                    })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {showPrintQR && (
        <PrintQRCodes onClose={() => setShowPrintQR(false)} />
      )}
    </div>
  );
}
