import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { FamilyGame } from '../types';
import { GameBanner } from './GameBanner';
import { Trophy, Edit2, Flag, Users, Calendar, FileText, Plus } from 'lucide-react';
import Confetti from 'react-confetti';

interface GameDetailPageProps {
  game: FamilyGame;
  onBack: () => void;
}

export function GameDetailPage({ game, onBack }: GameDetailPageProps) {
  const { family, currentMember, getUserRole, endFamilyGame, updateFamilyGame } = useApp();
  const [showConfetti, setShowConfetti] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedRules, setEditedRules] = useState(game.rules);

  if (!family || !currentMember) return null;

  const role = getUserRole(game);
  const organiser = family.members.find(m => m.id === game.organiserId);
  const participants = family.members.filter(m => game.participants.includes(m.id));

  const handleEndGame = () => {
    endFamilyGame(game.id);
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 5000);
  };

  const handleSaveRules = () => {
    updateFamilyGame(game.id, { rules: editedRules });
    setIsEditing(false);
  };

  const getLeaderboard = () => {
    return participants
      .map(member => {
        const memberMissions = game.missions.filter(
          m => m.completedBy === member.id && m.completed
        );
        const totalXp = memberMissions.reduce((sum, m) => sum + m.xp, 0);
        return { member, totalXp, missionsCompleted: memberMissions.length };
      })
      .sort((a, b) => b.totalXp - a.totalXp);
  };

  const leaderboard = getLeaderboard();

  return (
    <div className="max-w-4xl mx-auto">
      {showConfetti && <Confetti recycle={false} numberOfPieces={500} />}

      <button
        onClick={onBack}
        className="mb-4 text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-2"
      >
        ← Back to Task Groups
      </button>

      <div className="bg-white rounded-3xl shadow-xl p-8">
        <div className="text-center mb-6">
          <div className="text-6xl mb-4">📋</div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">{game.title}</h2>
          <div className="flex items-center justify-center gap-4 text-sm text-gray-600">
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {new Date(game.startDate).toLocaleDateString()}
            </span>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
              game.status === 'active'
                ? 'bg-green-100 text-green-700'
                : 'bg-gray-100 text-gray-700'
            }`}>
              {game.status === 'active' ? '🟢 Active' : '⚪ Completed'}
            </span>
          </div>
        </div>

        <GameBanner role={role} />

        <div className="space-y-6">
          <div className="bg-gray-50 rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="flex items-center gap-2 font-bold text-gray-800">
                <FileText className="w-5 h-5" />
                Description & Rules
              </h3>
              {role === 'organiser' && game.status === 'active' && !isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-semibold"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit
                </button>
              )}
            </div>
            {isEditing ? (
              <div className="space-y-3">
                <textarea
                  value={editedRules}
                  onChange={(e) => setEditedRules(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                  rows={4}
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleSaveRules}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-semibold"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setEditedRules(game.rules);
                      setIsEditing(false);
                    }}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-semibold"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-gray-700 whitespace-pre-wrap">{game.rules}</p>
            )}
          </div>

          <div className="bg-blue-50 rounded-xl p-5">
            <h3 className="flex items-center gap-2 font-bold text-gray-800 mb-3">
              <Users className="w-5 h-5" />
              Participants
            </h3>
            <div className="space-y-2">
              {participants.map(member => (
                <div
                  key={member.id}
                  className="flex items-center gap-3 bg-white p-3 rounded-lg"
                >
                  <span className="text-2xl">{member.avatarEmoji || '👤'}</span>
                  <span className="font-medium text-gray-800">{member.nickname}</span>
                  {member.id === game.organiserId && (
                    <span className="ml-auto text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full font-semibold">
                      Organiser
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-5">
            <h3 className="flex items-center gap-2 font-bold text-gray-800 mb-4">
              <Trophy className="w-5 h-5 text-yellow-600" />
              Leaderboard
            </h3>
            {leaderboard.length === 0 ? (
              <p className="text-gray-600 text-center py-4">No progress yet</p>
            ) : (
              <div className="space-y-2">
                {leaderboard.map((entry, index) => (
                  <div
                    key={entry.member.id}
                    className={`flex items-center gap-3 p-3 rounded-lg ${
                      index === 0
                        ? 'bg-yellow-100 border-2 border-yellow-400'
                        : 'bg-white'
                    }`}
                  >
                    <span className="text-2xl font-bold text-gray-400 w-8">
                      #{index + 1}
                    </span>
                    <span className="text-2xl">{entry.member.avatarEmoji || '👤'}</span>
                    <div className="flex-1">
                      <p className="font-bold text-gray-800">{entry.member.nickname}</p>
                      <p className="text-sm text-gray-600">
                        {entry.missionsCompleted} missions completed
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-yellow-600">{entry.totalXp}</p>
                      <p className="text-xs text-gray-600">XP</p>
                    </div>
                    {index === 0 && leaderboard.length > 1 && (
                      <Trophy className="w-6 h-6 text-yellow-600" />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {role === 'organiser' && game.status === 'active' && (
            <div className="pt-4 space-y-3">
              <button
                onClick={handleEndGame}
                className="w-full bg-gradient-to-r from-red-500 to-pink-500 text-white py-4 rounded-xl font-semibold text-lg hover:from-red-600 hover:to-pink-600 transition-all shadow-lg flex items-center justify-center gap-2"
              >
                <Flag className="w-5 h-5" />
                End Task Group
              </button>
            </div>
          )}

          {game.status === 'completed' && (
            <div className="bg-green-100 border-2 border-green-400 rounded-xl p-5 text-center">
              <div className="text-4xl mb-2">🏆</div>
              <h3 className="font-bold text-green-900 text-xl mb-2">Task Group Completed!</h3>
              <p className="text-green-700">
                Ended on {new Date(game.endDate!).toLocaleDateString()}
              </p>
              {leaderboard[0] && (
                <p className="text-green-800 font-semibold mt-2">
                  Winner: {leaderboard[0].member.nickname} with {leaderboard[0].totalXp} XP
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
