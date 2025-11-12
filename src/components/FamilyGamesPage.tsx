import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { FamilyGame } from '../types';
import { CreateGamePage } from './CreateGamePage';
import { GameDetailPage } from './GameDetailPage';
import { Plus, Trophy, Users, Calendar, Crown, Gamepad2 } from 'lucide-react';

export function FamilyGamesPage() {
  const { family, currentMember, getUserRole, approveGameSuggestion, rejectGameSuggestion } = useApp();
  const [view, setView] = useState<'list' | 'create' | 'detail'>('list');
  const [selectedGame, setSelectedGame] = useState<FamilyGame | null>(null);

  if (!family || !currentMember) return null;

  const isParent = currentMember.role === 'parent';
  const games = family.familyGames || [];
  const activeGames = games.filter(g => g.status === 'active');
  const completedGames = games.filter(g => g.status === 'completed');
  const pendingGames = games.filter(g => g.status === 'pending_approval');
  const mySuggestions = pendingGames.filter(g => g.suggestedBy === currentMember.id);

  const handleViewGame = (game: FamilyGame) => {
    setSelectedGame(game);
    setView('detail');
  };

  if (view === 'create') {
    return (
      <CreateGamePage
        onComplete={() => {
          setView('list');
        }}
      />
    );
  }

  if (view === 'detail' && selectedGame) {
    return (
      <GameDetailPage
        game={selectedGame}
        onBack={() => {
          setSelectedGame(null);
          setView('list');
        }}
      />
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-3xl shadow-xl p-8">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">📋</div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Task Groups</h2>
          <p className="text-gray-600">Organize family missions into themed bundles</p>
        </div>

        <button
          onClick={() => setView('create')}
          className={`w-full text-white py-4 rounded-xl font-semibold text-lg transition-all shadow-lg mb-8 flex items-center justify-center gap-2 ${
            isParent
              ? 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600'
              : 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600'
          }`}
        >
          <Plus className="w-5 h-5" />
          {isParent ? 'Create Task Group' : '💡 Suggest Task Group'}
        </button>

        {isParent && pendingGames.length > 0 && (
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              ⏳ Pending Task Group Suggestions
            </h3>
            <div className="space-y-3">
              {pendingGames.map(game => {
                const suggestor = family.members.find(m => m.id === game.suggestedBy);
                const participants = family.members.filter(m =>
                  game.participants.includes(m.id)
                );

                return (
                  <div
                    key={game.id}
                    className="bg-yellow-50 border-2 border-yellow-300 rounded-xl p-4"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="text-lg font-bold text-gray-800 mb-1">
                          {game.title}
                        </h4>
                        <p className="text-sm text-gray-600 mb-2">
                          Suggested by: {suggestor?.avatarEmoji || '👤'} {suggestor?.nickname}
                        </p>
                        <div className="text-sm text-gray-700 mb-2">
                          <strong>Rules:</strong> {game.rules}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Users className="w-4 h-4" />
                          <span>Players: {participants.map(p => p.nickname).join(', ')}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => approveGameSuggestion(game.id)}
                        className="flex-1 bg-green-500 text-white py-2 px-4 rounded-lg font-semibold hover:bg-green-600 transition-colors"
                      >
                        ✓ Approve
                      </button>
                      <button
                        onClick={() => rejectGameSuggestion(game.id)}
                        className="flex-1 bg-red-500 text-white py-2 px-4 rounded-lg font-semibold hover:bg-red-600 transition-colors"
                      >
                        ✗ Reject
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {!isParent && mySuggestions.length > 0 && (
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              ⏳ Your Suggestions
            </h3>
            <div className="space-y-3">
              {mySuggestions.map(game => (
                <div
                  key={game.id}
                  className="bg-yellow-50 border-2 border-yellow-300 rounded-xl p-4"
                >
                  <h4 className="text-lg font-bold text-gray-800 mb-2">{game.title}</h4>
                  <p className="text-sm text-yellow-700 font-medium">
                    ⏳ Waiting for parent approval
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeGames.length > 0 && (
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Trophy className="w-6 h-6 text-green-600" />
              Active Task Groups
            </h3>
            <div className="space-y-3">
              {activeGames.map(game => {
                const role = getUserRole(game);
                const organiser = family.members.find(m => m.id === game.organiserId);
                const participants = family.members.filter(m =>
                  game.participants.includes(m.id)
                );

                return (
                  <div
                    key={game.id}
                    onClick={() => handleViewGame(game)}
                    className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-5 cursor-pointer hover:shadow-lg transition-all border-2 border-blue-200 hover:border-blue-400"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="text-xl font-bold text-gray-800 mb-1">
                          {game.title}
                        </h4>
                        <div className="flex items-center gap-3 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(game.startDate).toLocaleDateString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            {participants.length} players
                          </span>
                        </div>
                      </div>
                      <div>
                        {role === 'organiser' && (
                          <span className="flex items-center gap-1 bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-semibold">
                            <Crown className="w-3 h-3" />
                            Organiser
                          </span>
                        )}
                        {role === 'player' && (
                          <span className="flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
                            <Gamepad2 className="w-3 h-3" />
                            Playing
                          </span>
                        )}
                        {role === 'spectator' && (
                          <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-semibold">
                            Spectator
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-600">Organiser:</span>
                      <span className="text-sm">{organiser?.avatarEmoji || '👤'}</span>
                      <span className="text-sm font-semibold text-gray-700">
                        {organiser?.nickname}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {completedGames.length > 0 && (
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Trophy className="w-6 h-6 text-gray-400" />
              Completed Task Groups
            </h3>
            <div className="space-y-3">
              {completedGames.map(game => {
                const organiser = family.members.find(m => m.id === game.organiserId);
                const participants = family.members.filter(m =>
                  game.participants.includes(m.id)
                );

                return (
                  <div
                    key={game.id}
                    onClick={() => handleViewGame(game)}
                    className="bg-gray-50 rounded-xl p-5 cursor-pointer hover:shadow-lg transition-all border-2 border-gray-200 hover:border-gray-300"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="text-lg font-bold text-gray-700 mb-1">
                          {game.title}
                        </h4>
                        <div className="flex items-center gap-3 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(game.startDate).toLocaleDateString()} - {' '}
                            {game.endDate && new Date(game.endDate).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <span className="bg-gray-200 text-gray-600 px-3 py-1 rounded-full text-xs font-semibold">
                        Completed
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {games.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎮</div>
            <p className="text-gray-600 text-lg mb-2">No task groups yet</p>
            <p className="text-gray-500 text-sm">Create your first task group to get started!</p>
          </div>
        )}
      </div>
    </div>
  );
}
