import React from 'react';
import { MapPin, ArrowRight, CheckCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import Confetti from 'react-confetti';

interface TagClueProps {
  tagId: string;
  onComplete: () => void;
}

export function TagClue({ tagId, onComplete }: TagClueProps) {
  const { family } = useApp();
  const [showConfetti, setShowConfetti] = React.useState(false);

  if (!family) return null;

  const tag = family.tags.find(t => t.id === tagId);
  const nextTag = tag?.nextTagId ? family.tags.find(t => t.id === tag.nextTagId) : null;

  if (!tag) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-red-50 rounded-3xl shadow-xl p-8 border-2 border-red-200 text-center">
          <p className="text-red-600 font-semibold">Tag not found</p>
        </div>
      </div>
    );
  }

  const handleMarkDone = () => {
    setShowConfetti(true);
    setTimeout(() => {
      setShowConfetti(false);
      onComplete();
    }, 2000);
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
      <div className="max-w-2xl mx-auto">
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl shadow-xl p-8 border-2 border-blue-200">
          <div className="text-center mb-6">
            <MapPin className="w-16 h-16 text-blue-600 mx-auto mb-3" />
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              {tag.name || 'Mystery Location'}
            </h2>
          </div>

          <div className="bg-white rounded-2xl p-6 mb-6 border-2 border-blue-300">
            <div className="text-6xl text-center mb-4">🔍</div>
            <h3 className="text-xl font-bold text-gray-800 mb-3 text-center">Clue Message</h3>
            <p className="text-lg text-gray-700 text-center leading-relaxed">
              {tag.message || 'Great job finding this location! Keep exploring!'}
            </p>
          </div>

          {nextTag && (
            <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-2xl p-6 mb-6 border-2 border-amber-300">
              <div className="flex items-center gap-3 mb-3">
                <ArrowRight className="w-6 h-6 text-amber-600" />
                <h3 className="text-lg font-bold text-gray-800">Next Clue</h3>
              </div>
              <p className="text-gray-700">
                Find the tag at: <span className="font-bold text-amber-700">{nextTag.name || nextTag.uid}</span>
              </p>
            </div>
          )}

          <button
            onClick={handleMarkDone}
            className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white py-4 rounded-xl font-bold text-lg hover:from-green-600 hover:to-blue-600 transition-all shadow-lg flex items-center justify-center gap-2"
          >
            <CheckCircle className="w-6 h-6" />
            {nextTag ? 'Continue to Next Clue' : 'Complete Mission'}
          </button>
        </div>
      </div>
    </>
  );
}
