import React from 'react';
import { Trophy, Target, CheckCircle, Wallet, TrendingUp, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';

export function FamilyDashboard() {
  const { family } = useApp();

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
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-gray-800 mb-2">
            {family.name}
          </h2>
          <p className="text-gray-600">Track your family's progress</p>
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
                      <span className="text-2xl">{mission.emoji}</span>
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
    </div>
  );
}
