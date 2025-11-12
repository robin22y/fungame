import React, { useState } from 'react';
import { Smile, Check } from 'lucide-react';

interface EmojiAvatarPickerProps {
  currentEmoji?: string;
  onSelect: (emoji: string) => void;
}

const EMOJI_CATEGORIES = {
  animals: {
    name: 'Animals',
    emojis: ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🦉', '🦆', '🦋'],
  },
  heroes: {
    name: 'Heroes',
    emojis: ['🦸‍♂️', '🦸‍♀️', '🦹‍♂️', '🦹‍♀️', '🧙‍♂️', '🧙‍♀️', '🧚‍♂️', '🧚‍♀️', '🧛‍♂️', '🧛‍♀️', '👮‍♂️', '👮‍♀️', '👩‍🚀', '👨‍🚀', '🤴', '👸'],
  },
  sports: {
    name: 'Sports',
    emojis: ['⚽', '🏀', '🏈', '⚾', '🎾', '🏐', '🏉', '🎱', '🏓', '🏸', '🏒', '🏑', '🥊', '🥋', '⛸️', '🛹'],
  },
  fun: {
    name: 'Fun',
    emojis: ['🎉', '🎊', '🎈', '🎁', '🎮', '🎯', '🎲', '🎨', '🎭', '🎪', '🎬', '🎤', '🎧', '🎸', '🎹', '🎺'],
  },
  space: {
    name: 'Space',
    emojis: ['🚀', '🛸', '🌟', '⭐', '✨', '💫', '🌙', '☄️', '🪐', '🌍', '🌎', '🌏', '🛰️', '👽', '🤖', '🔭'],
  },
  food: {
    name: 'Food',
    emojis: ['🍕', '🍔', '🍟', '🌭', '🍿', '🧁', '🍰', '🎂', '🍪', '🍩', '🍦', '🍨', '🍧', '🍌', '🍓', '🍇'],
  },
};

export function EmojiAvatarPicker({ currentEmoji, onSelect }: EmojiAvatarPickerProps) {
  const [selectedCategory, setSelectedCategory] = useState<keyof typeof EMOJI_CATEGORIES>('animals');
  const [selectedEmoji, setSelectedEmoji] = useState(currentEmoji || '');

  const handleEmojiSelect = (emoji: string) => {
    setSelectedEmoji(emoji);
    onSelect(emoji);
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl p-8">
      <div className="text-center mb-6">
        <Smile className="w-16 h-16 text-blue-600 mx-auto mb-3" />
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Pick Your Avatar</h2>
        <p className="text-gray-600">Choose an emoji that represents you</p>
      </div>

      {selectedEmoji && (
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 mb-6 border-2 border-blue-300 text-center">
          <p className="text-sm text-gray-600 mb-2">Your Avatar</p>
          <div className="text-8xl mb-2">{selectedEmoji}</div>
          <div className="flex items-center justify-center gap-2 text-green-600">
            <Check className="w-5 h-5" />
            <span className="font-semibold">Selected!</span>
          </div>
        </div>
      )}

      <div className="mb-6">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {Object.entries(EMOJI_CATEGORIES).map(([key, category]) => (
            <button
              key={key}
              onClick={() => setSelectedCategory(key as keyof typeof EMOJI_CATEGORIES)}
              className={`px-4 py-2 rounded-xl font-semibold whitespace-nowrap transition-all ${
                selectedCategory === key
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-6 gap-3">
        {EMOJI_CATEGORIES[selectedCategory].emojis.map((emoji) => (
          <button
            key={emoji}
            onClick={() => handleEmojiSelect(emoji)}
            className={`aspect-square rounded-2xl text-4xl hover:scale-110 transition-all ${
              selectedEmoji === emoji
                ? 'bg-blue-100 border-4 border-blue-500 scale-110'
                : 'bg-gray-50 border-2 border-gray-200 hover:border-blue-300'
            }`}
          >
            {emoji}
          </button>
        ))}
      </div>
    </div>
  );
}
