import React, { useState } from 'react';
import { Plus, GamepadIcon, Trash2, Package, Sparkles, Volume2, VolumeX, MessageSquare, Upload, Edit2, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Game, GenieCharacter } from '../types';

export function SuperAdminPanel() {
  const {
    availableGames,
    addGame,
    genieCharacters,
    genieMessages,
    globalGenieSettings,
    addGenieCharacter,
    updateGenieCharacter,
    deleteGenieCharacter,
    addGenieMessage,
    updateGenieMessage,
    deleteGenieMessage,
    updateGlobalGenieSettings,
  } = useApp();

  const [activeSection, setActiveSection] = useState<'games' | 'genies' | 'messages' | 'settings'>('games');
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

  const [genieFormData, setGenieFormData] = useState({
    name: '',
    emoji: '🧞',
    occasion: '',
    description: '',
    imageUrl: '',
  });
  const [editingGenieId, setEditingGenieId] = useState<string | null>(null);
  const [genieImageFile, setGenieImageFile] = useState<File | null>(null);
  const [genieImagePreview, setGenieImagePreview] = useState<string>('');

  const [messageFormData, setMessageFormData] = useState({
    message: '',
    targetAudience: 'everyone' as 'everyone' | 'parents' | 'kids',
    genieCharacterId: 'genie_default',
    expiresAt: '',
  });

  const categories = ['Educational', 'Adventure', 'Puzzle', 'Creative', 'Sports', 'Strategy'];

  const handleGameSubmit = (e: React.FormEvent) => {
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

  const handleGenieImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/apng'];
      if (!allowedTypes.includes(file.type)) {
        alert('Please upload a valid image file (JPG, PNG, GIF, WebP, or APNG)');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }

      setGenieImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setGenieImagePreview(base64);
        setGenieFormData({ ...genieFormData, imageUrl: base64 });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditGenie = (genie: GenieCharacter) => {
    setEditingGenieId(genie.id);
    setGenieFormData({
      name: genie.name,
      emoji: genie.emoji,
      occasion: genie.occasion,
      description: genie.description,
      imageUrl: genie.imageUrl || '',
    });
    setGenieImagePreview(genie.imageUrl || '');
    setShowAddForm(true);
  };

  const handleGenieSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const finalImageUrl = genieImagePreview || genieFormData.imageUrl || undefined;

    if (editingGenieId) {
      updateGenieCharacter(editingGenieId, {
        name: genieFormData.name,
        emoji: genieFormData.emoji,
        occasion: genieFormData.occasion,
        description: genieFormData.description,
        imageUrl: finalImageUrl,
      });
      setSuccess(`Genie "${genieFormData.name}" updated!`);
      setEditingGenieId(null);
    } else {
      addGenieCharacter({
        name: genieFormData.name,
        emoji: genieFormData.emoji,
        occasion: genieFormData.occasion,
        description: genieFormData.description,
        imageUrl: finalImageUrl,
        active: true,
      });
      setSuccess(`Genie "${genieFormData.name}" added!`);
    }

    setGenieFormData({
      name: '',
      emoji: '🧞',
      occasion: '',
      description: '',
      imageUrl: '',
    });
    setGenieImageFile(null);
    setGenieImagePreview('');

    setTimeout(() => {
      setSuccess('');
      setShowAddForm(false);
    }, 2000);
  };

  const handleMessageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addGenieMessage({
      message: messageFormData.message,
      targetAudience: messageFormData.targetAudience,
      genieCharacterId: messageFormData.genieCharacterId,
      active: true,
      expiresAt: messageFormData.expiresAt || undefined,
    });

    setSuccess('Message broadcast created!');
    setMessageFormData({
      message: '',
      targetAudience: 'everyone',
      genieCharacterId: 'genie_default',
      expiresAt: '',
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
            <p className="text-purple-100">Manage games, genies, and messages</p>
          </div>
          <GamepadIcon className="w-16 h-16 opacity-80" />
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-xl p-6 mb-6">
        <div className="grid grid-cols-4 gap-4">
          <button
            onClick={() => {
              setActiveSection('games');
              setShowAddForm(false);
            }}
            className={`py-4 rounded-xl font-semibold transition-all ${
              activeSection === 'games'
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <GamepadIcon className="w-5 h-5" />
              Games
            </div>
          </button>
          <button
            onClick={() => {
              setActiveSection('genies');
              setShowAddForm(false);
            }}
            className={`py-4 rounded-xl font-semibold transition-all ${
              activeSection === 'genies'
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Sparkles className="w-5 h-5" />
              Genies
            </div>
          </button>
          <button
            onClick={() => {
              setActiveSection('messages');
              setShowAddForm(false);
            }}
            className={`py-4 rounded-xl font-semibold transition-all ${
              activeSection === 'messages'
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Messages
            </div>
          </button>
          <button
            onClick={() => {
              setActiveSection('settings');
              setShowAddForm(false);
            }}
            className={`py-4 rounded-xl font-semibold transition-all ${
              activeSection === 'settings'
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Volume2 className="w-5 h-5" />
              Settings
            </div>
          </button>
        </div>
      </div>

      {success && (
        <div className="bg-green-100 border-2 border-green-500 text-green-800 px-6 py-4 rounded-xl mb-6 font-semibold">
          {success}
        </div>
      )}

      {/* GAMES SECTION */}
      {activeSection === 'games' && (
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
              <form onSubmit={handleGameSubmit} className="space-y-4">
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

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-300 transition-all"
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
                  className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-6 border-2 border-purple-200"
                >
                  <div className="text-5xl mb-4 text-center">{game.emoji}</div>
                  <h4 className="text-lg font-bold text-gray-800 mb-2">{game.name}</h4>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{game.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-purple-600">
                      £{game.price.toFixed(2)}
                    </span>
                    <span className="text-xs bg-purple-200 text-purple-800 px-3 py-1 rounded-full font-semibold">
                      {game.category}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* GENIES SECTION */}
      {activeSection === 'genies' && (
        <div className="bg-white rounded-3xl shadow-xl p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-2xl font-bold text-gray-800">Genie Characters</h3>
              <p className="text-gray-600">{genieCharacters.length} genies available</p>
            </div>
            <button
              onClick={() => {
                setEditingGenieId(null);
                setGenieFormData({
                  name: '',
                  emoji: '🧞',
                  occasion: '',
                  description: '',
                  imageUrl: '',
                });
                setGenieImagePreview('');
                setShowAddForm(!showAddForm);
              }}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg"
            >
              <div className="flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Add New Genie
              </div>
            </button>
          </div>

          {showAddForm && (
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 mb-6 border-2 border-purple-200">
              <h4 className="text-lg font-bold text-gray-800 mb-4">{editingGenieId ? 'Edit Genie Character' : 'Create New Genie Character'}</h4>
              <form onSubmit={handleGenieSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Genie Name
                    </label>
                    <input
                      type="text"
                      value={genieFormData.name}
                      onChange={(e) => setGenieFormData({ ...genieFormData, name: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none"
                      placeholder="e.g., Christmas Genie"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Emoji
                    </label>
                    <input
                      type="text"
                      value={genieFormData.emoji}
                      onChange={(e) => setGenieFormData({ ...genieFormData, emoji: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none text-center text-2xl"
                      placeholder="🧞"
                      maxLength={2}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Occasion
                    </label>
                    <input
                      type="text"
                      value={genieFormData.occasion}
                      onChange={(e) => setGenieFormData({ ...genieFormData, occasion: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none"
                      placeholder="e.g., Christmas, Birthday, Halloween"
                      required
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Upload Genie Image (JPG, PNG, GIF, WebP, APNG)
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 hover:border-purple-400 transition-all">
                      <input
                        type="file"
                        accept="image/jpeg,image/jpg,image/png,image/gif,image/webp,image/apng"
                        onChange={handleGenieImageChange}
                        className="w-full"
                        id="genie-image-upload"
                      />
                      <p className="text-xs text-gray-500 mt-2">
                        Supports static and animated formats. Max size: 5MB
                      </p>
                    </div>
                    {genieImagePreview && (
                      <div className="mt-4 bg-gray-50 rounded-xl p-4 border-2 border-gray-200">
                        <p className="text-sm font-semibold text-gray-700 mb-2">Preview:</p>
                        <div className="flex items-center justify-center">
                          <img
                            src={genieImagePreview}
                            alt="Genie preview"
                            className="max-h-48 rounded-xl shadow-lg"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setGenieImagePreview('');
                            setGenieImageFile(null);
                            setGenieFormData({ ...genieFormData, imageUrl: '' });
                          }}
                          className="mt-3 w-full bg-red-100 text-red-600 py-2 rounded-xl font-semibold hover:bg-red-200 transition-all"
                        >
                          Remove Image
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Or paste Image URL (alternative)
                    </label>
                    <input
                      type="url"
                      value={genieFormData.imageUrl}
                      onChange={(e) => setGenieFormData({ ...genieFormData, imageUrl: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none"
                      placeholder="https://..."
                      disabled={!!genieImagePreview}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      You can either upload a file or paste a URL
                    </p>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      value={genieFormData.description}
                      onChange={(e) => setGenieFormData({ ...genieFormData, description: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none"
                      placeholder="Describe this genie..."
                      rows={2}
                      required
                    />
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-300 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg"
                  >
                    {editingGenieId ? 'Update Genie' : 'Add Genie'}
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {genieCharacters.map((genie) => (
              <div
                key={genie.id}
                className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border-2 border-purple-200"
              >
                {genie.imageUrl ? (
                  <img src={genie.imageUrl} alt={genie.name} className="w-full h-32 object-cover rounded-xl mb-4" />
                ) : (
                  <div className="text-6xl mb-4 text-center">{genie.emoji}</div>
                )}
                <h4 className="text-lg font-bold text-gray-800 mb-1">{genie.name}</h4>
                <p className="text-sm text-purple-600 font-semibold mb-2">{genie.occasion}</p>
                <p className="text-sm text-gray-600 mb-4">{genie.description}</p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateGenieCharacter(genie.id, { active: !genie.active })}
                    className={`flex-1 px-4 py-2 rounded-xl font-semibold transition-all ${
                      genie.active
                        ? 'bg-green-500 text-white hover:bg-green-600'
                        : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
                    }`}
                  >
                    {genie.active ? 'Active' : 'Inactive'}
                  </button>
                  <button
                    onClick={() => handleEditGenie(genie)}
                    className="bg-blue-500 text-white p-2 rounded-xl hover:bg-blue-600 transition-all"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Delete "${genie.name}"?`)) {
                        deleteGenieCharacter(genie.id);
                      }
                    }}
                    className="bg-red-500 text-white p-2 rounded-xl hover:bg-red-600 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MESSAGES SECTION */}
      {activeSection === 'messages' && (
        <div className="bg-white rounded-3xl shadow-xl p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-2xl font-bold text-gray-800">Broadcast Messages</h3>
              <p className="text-gray-600">{genieMessages.length} messages</p>
            </div>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-600 transition-all shadow-lg"
            >
              <div className="flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Create Message
              </div>
            </button>
          </div>

          {showAddForm && (
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 mb-6 border-2 border-blue-200">
              <h4 className="text-lg font-bold text-gray-800 mb-4">Create Broadcast Message</h4>
              <form onSubmit={handleMessageSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message
                  </label>
                  <textarea
                    value={messageFormData.message}
                    onChange={(e) => setMessageFormData({ ...messageFormData, message: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                    placeholder="Type your message..."
                    rows={4}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Target Audience
                    </label>
                    <select
                      value={messageFormData.targetAudience}
                      onChange={(e) => setMessageFormData({ ...messageFormData, targetAudience: e.target.value as any })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                    >
                      <option value="everyone">Everyone</option>
                      <option value="parents">Parents Only</option>
                      <option value="kids">Kids Only</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Genie Character
                    </label>
                    <select
                      value={messageFormData.genieCharacterId}
                      onChange={(e) => setMessageFormData({ ...messageFormData, genieCharacterId: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                    >
                      {genieCharacters.filter(g => g.active).map((genie) => (
                        <option key={genie.id} value={genie.id}>
                          {genie.emoji} {genie.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Expires (optional)
                    </label>
                    <input
                      type="datetime-local"
                      value={messageFormData.expiresAt}
                      onChange={(e) => setMessageFormData({ ...messageFormData, expiresAt: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-300 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-600 transition-all shadow-lg"
                  >
                    Broadcast Message
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="space-y-4">
            {genieMessages.length === 0 ? (
              <div className="text-center py-12">
                <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">No messages created yet</p>
              </div>
            ) : (
              genieMessages.map((msg) => {
                const genie = genieCharacters.find(g => g.id === msg.genieCharacterId);
                return (
                  <div
                    key={msg.id}
                    className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border-2 border-blue-200"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="text-3xl">{genie?.emoji || '🧞'}</div>
                        <div>
                          <p className="font-semibold text-gray-800">{genie?.name || 'Unknown Genie'}</p>
                          <p className="text-xs text-gray-600">
                            To: {msg.targetAudience.charAt(0).toUpperCase() + msg.targetAudience.slice(1)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateGenieMessage(msg.id, { active: !msg.active })}
                          className={`px-4 py-2 rounded-xl font-semibold transition-all text-sm ${
                            msg.active
                              ? 'bg-green-500 text-white hover:bg-green-600'
                              : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
                          }`}
                        >
                          {msg.active ? 'Active' : 'Inactive'}
                        </button>
                        <button
                          onClick={() => {
                            if (confirm('Delete this message?')) {
                              deleteGenieMessage(msg.id);
                            }
                          }}
                          className="bg-red-500 text-white p-2 rounded-xl hover:bg-red-600 transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <p className="text-gray-700 mb-2">{msg.message}</p>
                    {msg.expiresAt && (
                      <p className="text-xs text-gray-500">
                        Expires: {new Date(msg.expiresAt).toLocaleString()}
                      </p>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* SETTINGS SECTION */}
      {activeSection === 'settings' && (
        <div className="bg-white rounded-3xl shadow-xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <Volume2 className="w-8 h-8 text-purple-600" />
            <h3 className="text-2xl font-bold text-gray-800">Global Genie Settings</h3>
          </div>

          <div className="space-y-6">
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border-2 border-purple-200">
              <h4 className="text-lg font-bold text-gray-800 mb-4">Voice Settings</h4>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {globalGenieSettings.voiceEnabled ? (
                      <Volume2 className="w-6 h-6 text-green-600" />
                    ) : (
                      <VolumeX className="w-6 h-6 text-gray-400" />
                    )}
                    <div>
                      <p className="font-semibold text-gray-800">Voice Narration</p>
                      <p className="text-sm text-gray-600">
                        {globalGenieSettings.voiceEnabled ? 'Enabled' : 'Disabled'}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => updateGlobalGenieSettings({ voiceEnabled: !globalGenieSettings.voiceEnabled })}
                    className={`px-6 py-2 rounded-xl font-semibold transition-all ${
                      globalGenieSettings.voiceEnabled
                        ? 'bg-green-500 text-white hover:bg-green-600'
                        : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
                    }`}
                  >
                    {globalGenieSettings.voiceEnabled ? 'ON' : 'OFF'}
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Voice Pitch: {globalGenieSettings.pitch.toFixed(1)}
                  </label>
                  <input
                    type="range"
                    min="0.5"
                    max="2"
                    step="0.1"
                    value={globalGenieSettings.pitch}
                    onChange={(e) => updateGlobalGenieSettings({ pitch: parseFloat(e.target.value) })}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Low</span>
                    <span>High</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Voice Speed: {globalGenieSettings.rate.toFixed(1)}
                  </label>
                  <input
                    type="range"
                    min="0.5"
                    max="2"
                    step="0.1"
                    value={globalGenieSettings.rate}
                    onChange={(e) => updateGlobalGenieSettings({ rate: parseFloat(e.target.value) })}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Slow</span>
                    <span>Fast</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border-2 border-blue-200">
              <h4 className="text-lg font-bold text-gray-800 mb-4">Genie Mood</h4>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {(['funny', 'encouraging', 'wise', 'excited'] as const).map((mood) => (
                  <button
                    key={mood}
                    onClick={() => updateGlobalGenieSettings({ mood })}
                    className={`py-3 px-4 rounded-xl font-semibold transition-all ${
                      globalGenieSettings.mood === mood
                        ? 'bg-purple-500 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-100 border-2 border-gray-200'
                    }`}
                  >
                    {mood === 'funny' && '😄 Funny'}
                    {mood === 'encouraging' && '💪 Encouraging'}
                    {mood === 'wise' && '🧙 Wise'}
                    {mood === 'excited' && '🎉 Excited'}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border-2 border-green-200">
              <h4 className="text-lg font-bold text-gray-800 mb-2">About Genie System</h4>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <Sparkles className="w-5 h-5 text-purple-500 mt-0.5" />
                  <span>Create multiple genie characters for different occasions and seasons</span>
                </li>
                <li className="flex items-start gap-2">
                  <MessageSquare className="w-5 h-5 text-blue-500 mt-0.5" />
                  <span>Broadcast messages to everyone, parents only, or kids only</span>
                </li>
                <li className="flex items-start gap-2">
                  <Volume2 className="w-5 h-5 text-green-500 mt-0.5" />
                  <span>Global voice settings apply to all genie interactions</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
