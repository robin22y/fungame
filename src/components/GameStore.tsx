import React, { useState } from 'react';
import { ShoppingCart, Package, Check, Lock } from 'lucide-react';
import { useApp } from '../context/AppContext';

export function GameStore() {
  const { family, availableGames, purchaseGame } = useApp();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [selectedGame, setSelectedGame] = useState<string | null>(null);

  if (!family) return null;

  const categories = ['All', ...new Set(availableGames.map((g) => g.category))];
  const filteredGames =
    selectedCategory === 'All'
      ? availableGames
      : availableGames.filter((g) => g.category === selectedCategory);

  const isPurchased = (gameId: string) => {
    return family.purchasedGames.some((pg) => pg.gameId === gameId);
  };

  const handlePurchaseClick = (gameId: string) => {
    setSelectedGame(gameId);
    setShowPurchaseModal(true);
  };

  const handleConfirmPurchase = (memberId: string) => {
    if (selectedGame) {
      purchaseGame(selectedGame, memberId);
      setShowPurchaseModal(false);
      setSelectedGame(null);
    }
  };

  const game = selectedGame ? availableGames.find((g) => g.id === selectedGame) : null;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl shadow-xl p-8 mb-6">
        <div className="flex items-center justify-between text-white">
          <div>
            <h2 className="text-3xl font-bold mb-2">Game Store</h2>
            <p className="text-blue-100">Discover amazing games for your family</p>
          </div>
          <ShoppingCart className="w-16 h-16 opacity-80" />
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-xl p-8 mb-6">
        <div className="mb-6">
          <h3 className="text-lg font-bold text-gray-800 mb-3">Categories</h3>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl font-semibold transition-all ${
                  selectedCategory === cat
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGames.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No games available</p>
              <p className="text-gray-400 text-sm mt-2">Check back later for new games</p>
            </div>
          ) : (
            filteredGames.map((game) => {
              const purchased = isPurchased(game.id);
              return (
                <div
                  key={game.id}
                  className={`rounded-2xl p-6 border-2 transition-all ${
                    purchased
                      ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-300'
                      : 'bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200 hover:border-blue-400 hover:shadow-lg'
                  }`}
                >
                  <div className="text-center mb-4">
                    <div className="text-6xl mb-3">{game.emoji}</div>
                    <h4 className="text-xl font-bold text-gray-800 mb-2">{game.name}</h4>
                    <span
                      className={`inline-block text-xs px-3 py-1 rounded-full ${
                        purchased
                          ? 'bg-green-200 text-green-800'
                          : 'bg-purple-200 text-purple-800'
                      }`}
                    >
                      {game.category}
                    </span>
                  </div>

                  <p className="text-sm text-gray-600 mb-4 line-clamp-3">{game.description}</p>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <span className="text-2xl font-bold text-green-600">
                      £{game.price.toFixed(2)}
                    </span>
                    {purchased ? (
                      <div className="flex items-center gap-2 bg-green-200 text-green-800 px-4 py-2 rounded-xl font-semibold">
                        <Check className="w-5 h-5" />
                        Owned
                      </div>
                    ) : (
                      <button
                        onClick={() => handlePurchaseClick(game.id)}
                        className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-2 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-600 transition-all shadow-lg"
                      >
                        Buy Now
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {showPurchaseModal && game && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full">
            <div className="text-center mb-6">
              <div className="text-6xl mb-3">{game.emoji}</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">{game.name}</h3>
              <p className="text-gray-600 mb-4">{game.description}</p>
              <div className="text-3xl font-bold text-green-600 mb-6">
                £{game.price.toFixed(2)}
              </div>
            </div>

            <div className="mb-6">
              <h4 className="text-lg font-bold text-gray-800 mb-3">Who is purchasing?</h4>
              <div className="space-y-2">
                {family.members.map((member) => (
                  <button
                    key={member.id}
                    onClick={() => handleConfirmPurchase(member.id)}
                    className="w-full bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 hover:border-blue-400 rounded-xl p-4 transition-all text-left"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-bold text-gray-800">{member.nickname}</p>
                        <p className="text-sm text-gray-600">
                          Wallet: £{member.totalCash.toFixed(2)}
                        </p>
                      </div>
                      {member.totalCash < game.price ? (
                        <Lock className="w-6 h-6 text-red-500" />
                      ) : (
                        <Check className="w-6 h-6 text-green-500" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => {
                setShowPurchaseModal(false);
                setSelectedGame(null);
              }}
              className="w-full bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
