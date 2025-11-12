import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Mission } from '../types';
import { Camera, X } from 'lucide-react';
import { compressToWebP } from '../utils/imageUtils';
import { getGenieMessage, getPhotoPrompt } from '../utils/genieMessage';
import { speakGenie } from '../utils/speakGenie';
import { GeniePopup } from './GeniePopup';

interface MissionCompleteModalProps {
  mission: Mission;
  onClose: () => void;
  onComplete: () => void;
}

export function MissionCompleteModal({ mission, onClose, onComplete }: MissionCompleteModalProps) {
  const { family, currentMember, completeMission, addPhotoProof } = useApp();
  const [step, setStep] = useState<'genie' | 'photo' | 'done'>('genie');
  const [photoData, setPhotoData] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showGenie, setShowGenie] = useState(true);
  const [genieMessage, setGenieMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const genieSettings = family?.genieSettings || {
    voiceEnabled: true,
    pitch: 1,
    rate: 1,
    mood: 'funny' as const,
    currentGenieId: 'genie_default',
  };

  useEffect(() => {
    if (!currentMember) return;

    const mood = mission.mood || genieSettings.mood;
    let message = getGenieMessage(mission, mood, currentMember.nickname);

    if (mission.parentMessage) {
      message = `${message} ${mission.parentMessage}`;
    }

    setGenieMessage(message);

    if (genieSettings.voiceEnabled) {
      speakGenie(message, genieSettings);
    }

    const timer = setTimeout(() => {
      setShowGenie(false);
      if (mission.photoRequired) {
        setStep('photo');
      } else {
        handleComplete();
      }
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    try {
      const compressed = await compressToWebP(file, 0.6);
      setPhotoData(compressed);
    } catch (error) {
      console.error('Error compressing image:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePhotoSubmit = () => {
    if (!currentMember || !photoData) return;

    addPhotoProof({
      missionId: mission.id,
      memberId: currentMember.id,
      date: new Date().toISOString(),
      imageUrl: photoData,
    });

    handleComplete();
  };

  const handleComplete = () => {
    if (!currentMember) return;
    completeMission(mission.id, currentMember.id);
    setStep('done');
    setTimeout(() => {
      onComplete();
    }, 1500);
  };

  const handleSkipPhoto = () => {
    handleComplete();
  };

  if (step === 'genie' && showGenie) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center">
          <div className="text-8xl mb-4">🧞</div>
          <p className="text-purple-600 font-medium text-lg mb-4">{genieMessage}</p>
          {mission.photoRequired && (
            <p className="text-gray-600 text-sm">Get ready to take a photo proof!</p>
          )}
        </div>
      </div>
    );
  }

  if (step === 'photo' && mission.photoRequired) {
    const photoPromptMessage = currentMember
      ? getPhotoPrompt(mission.mood || genieSettings.mood, currentMember.nickname)
      : 'Take a photo as proof!';

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-800">📸 Photo Proof</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="text-center mb-6">
            <div className="text-6xl mb-4">🧞</div>
            <p className="text-purple-600 font-medium mb-4">{photoPromptMessage}</p>
          </div>

          {photoData ? (
            <div className="space-y-4">
              <img
                src={photoData}
                alt="Proof"
                className="w-full rounded-xl border-4 border-purple-200"
              />
              <div className="flex gap-3">
                <button
                  onClick={() => setPhotoData(null)}
                  className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-300"
                >
                  Retake
                </button>
                <button
                  onClick={handlePhotoSubmit}
                  className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 rounded-xl font-semibold hover:from-green-600 hover:to-emerald-600"
                >
                  Submit ✓
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleFileSelect}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isProcessing}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Camera className="w-5 h-5" />
                {isProcessing ? 'Processing...' : 'Take Photo'}
              </button>
              <button
                onClick={handleSkipPhoto}
                className="w-full text-gray-500 hover:text-gray-700 text-sm"
              >
                Skip photo (not recommended)
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (step === 'done') {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center">
          <div className="text-8xl mb-4">🎉</div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">Mission Complete!</h3>
          <p className="text-gray-600">
            +{mission.xp} XP · +{mission.cash} {family?.currency || '$'}
          </p>
        </div>
      </div>
    );
  }

  return null;
}
