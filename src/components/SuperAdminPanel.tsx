import React, { useState } from 'react';
import { Plus, GamepadIcon, Trash2, Package } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Game } from '../types';

export function SuperAdminPanel() {
  const { availableGames, addGame } = useApp();
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    emoji: '🎮',
    price: '9.99',
    category: 'Educational',
    imageUrl: '',
  });
  const [success, setSuccess] = useState('');

  const categories = ['Educational', 'Adventure', 'Puzzle', 'Creative', 'Sports', 'Strategy'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newGame: Game = {
      id: crypto.randomUUID(),
      name: formData.name.trim(),
      description: formData.description.trim(),
      emoji: formData.emoji,
      price: parseFloat(formData.price),
      category: formData.category,
      imageUrl: formData.imageUrl.trim() || undefined,
      createdAt: new Date().toISOString(),
    };

    addGame(newGame);
    setSuccess(`Game "${formData.name}" added successfully!`);

    setFormData({
      name: '',
      description: '',
      emoji: '🎮',
      price: '9.99',
      category: 'Educational',
      imageUrl: '',
    });

    setTimeout(() => {
      setSuccess('');
      setShowAddForm(false);
    }, 2000);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl shadow-xl p-8 mb-6">
        <div className="flex items-center justify-between text-white">
          <div>
            <h2 className="text-3xl font-bold mb-2">Super Admin Panel</h2>
            <p className="text-purple-100">Manage game store inventory</p>
          </div>
          <GamepadIcon className="w-16 h-16 opacity-80" />
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-xl p-8 mb-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-bold text-gray-800">Games Library</h3>
            <p className="text-gray-600">{availableGames.length} games available</p>
          </div>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-600 transition-all shadow-lg"
          >
            <div className="flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Add New Game
            </div>
          </button>
        </div>

        {showAddForm && (
          <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-6 mb-6 border-2 border-purple-200">
            <h4 className="text-lg font-bold text-gray-800 mb-4">Create New Game</h4>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Game Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none"
                    placeholder="e.g., Math Quest Adventure"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none"
                    placeholder="Describe the game..."
                    rows={3}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Emoji
                  </label>
                  <input
                    type="text"
                    value={formData.emoji}
                    onChange={(e) => setFormData({ ...formData, emoji: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none text-center text-2xl"
                    placeholder="🎮"
                    maxLength={2}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price (£)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none"
                    min="0"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none"
                    required
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Image URL (optional)
                  </label>
                  <input
                    type="url"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none"
                    placeholder="https://..."
                  />
                </div>
              </div>

              {success && (
                <div className="p-4 bg-green-100 border-2 border-green-300 rounded-xl">
                  <p className="text-green-700 font-medium text-center">{success}</p>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg"
                >
                  Add Game
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {availableGames.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No games added yet</p>
              <p className="text-gray-400 text-sm mt-2">Click "Add New Game" to create your first game</p>
            </div>
          ) : (
            availableGames.map((game) => (
              <div
                key={game.id}
                className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-5 border-2 border-blue-200 hover:border-blue-400 transition-colors"
              >
                <div className="text-center mb-3">
                  <div className="text-5xl mb-2">{game.emoji}</div>
                  <h4 className="text-lg font-bold text-gray-800">{game.name}</h4>
                  <span className="inline-block bg-purple-200 text-purple-800 text-xs px-2 py-1 rounded-full mt-1">
                    {game.category}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{game.description}</p>
                <div className="flex items-center justify-between pt-3 border-t border-blue-200">
                  <span className="text-xl font-bold text-green-600">£{game.price.toFixed(2)}</span>
                  <span className="text-xs text-gray-500">
                    {new Date(game.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
