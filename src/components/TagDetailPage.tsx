import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Camera, Check, Star, Coins } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Mission } from '../types';
import { GeniePopup } from './GeniePopup';
import { MissionCompleteModal } from './MissionCompleteModal';
import { speakGenie } from '../utils/speakGenie';
import { compressToWebP } from '../utils/imageUtils';

export function TagDetailPage() {
  const { tagId } = useParams<{ tagId: string }>();
  const { family, currentMember, completeMission, addPhotoProof } = useApp();
  const navigate = useNavigate();
  const [mission, setMission] = useState<Mission | null>(null);
  const [tagName, setTagName] = useState<string>('');
  const [showGeniePopup, setShowGeniePopup] = useState(false);
  const [genieMessage, setGenieMessage] = useState('');
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [completedMission, setCompletedMission] = useState<Mission | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!tagId || !family) return;

    const tag = family.tags.find(t => t.uid === tagId);

    if (tag) {
      setTagName(tag.name || 'Unknown Tag');

      if (currentMember) {
        const linkedMission = family.missions.find(
          m => m.tagId === tag.id &&
               m.assignedTo === currentMember.id &&
               !m.completed
        );

        if (linkedMission) {
          setMission(linkedMission);

          if (linkedMission.genieDialog && family.genieSettings?.voiceEnabled) {
            const message = linkedMission.genieDialog || `Hey ${currentMember.nickname}! Time to complete your mission!`;
            speakGenie(message, family.genieSettings);
          }
        }
      }
    }
  }, [tagId, family, currentMember]);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    try {
      const compressed = await compressToWebP(file);
      setPhotoFile(file);
      setPhotoPreview(compressed);
    } catch (error) {
      console.error('Photo compression error:', error);
      alert('Failed to process photo. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCompleteMission = async () => {
    if (!mission || !currentMember) return;

    if (mission.photoRequired && !photoPreview) {
      setGenieMessage('📸 Please upload a photo before completing this mission!');
      setShowGeniePopup(true);
      return;
    }

    if (mission.photoRequired && photoPreview) {
      addPhotoProof({
        missionId: mission.id,
        memberId: currentMember.id,
        date: new Date().toISOString(),
        imageUrl: photoPreview,
      });
    }

    completeMission(mission.id, currentMember.id);

    const updatedMission = family?.missions.find(m => m.id === mission.id);
    if (updatedMission) {
      setCompletedMission(updatedMission);
      setShowCompleteModal(true);
    }

    if (mission.genieDialog && family?.genieSettings?.voiceEnabled) {
      const completionMessage = `Great job ${currentMember.nickname}! ${mission.genieDialog}`;
      speakGenie(completionMessage, family.genieSettings);
    }
  };

  const handleCompleteModalClose = () => {
    setShowCompleteModal(false);
    setCompletedMission(null);
    navigate('/');
  };

  if (!family) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white p-6">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Loading...</p>
          <button
            onClick={() => navigate('/')}
            className="text-blue-600 hover:text-blue-700 transition-colors"
          >
            Back to App
          </button>
        </div>
      </div>
    );
  }

  if (!tagId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white p-6">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Invalid tag</p>
          <button
            onClick={() => navigate('/')}
            className="text-blue-600 hover:text-blue-700 transition-colors"
          >
            Back to App
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-purple-50 to-white">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6 transition-colors font-semibold"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to App
        </button>

        <div className="bg-white rounded-3xl shadow-xl p-8 mb-6">
          <div className="text-center mb-6">
            <div className="text-6xl mb-4">🏷️</div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              {tagName}
            </h1>
            <p className="text-gray-600">Tag ID: {tagId}</p>
          </div>

          {!currentMember ? (
            <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-6 text-center">
              <p className="text-yellow-900 font-semibold mb-3">
                Please log in to see your missions!
              </p>
              <button
                onClick={() => navigate('/')}
                className="px-6 py-2 bg-yellow-500 text-white rounded-xl hover:bg-yellow-600 transition-colors font-semibold"
              >
                Go to Login
              </button>
            </div>
          ) : mission ? (
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-purple-50 to-blue-50 border-2 border-purple-200 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-4xl">{mission.emoji}</span>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">
                      {mission.taskName}
                    </h2>
                    <div className="flex items-center gap-4 mt-2">
                      <div className="flex items-center gap-1 text-amber-600">
                        <Star className="w-4 h-4 fill-amber-500" />
                        <span className="font-semibold">{mission.xp} XP</span>
                      </div>
                      <div className="flex items-center gap-1 text-green-600">
                        <Coins className="w-4 h-4" />
                        <span className="font-semibold">{mission.cash} {family.currency}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {mission.genieDialog && (
                  <div className="bg-white border-2 border-purple-300 rounded-xl p-4 mb-4">
                    <div className="flex items-start gap-3">
                      <div className="text-3xl">🧞</div>
                      <div>
                        <p className="text-sm text-purple-600 font-semibold mb-1">
                          Genie says:
                        </p>
                        <p className="text-gray-700">{mission.genieDialog}</p>
                      </div>
                    </div>
                  </div>
                )}

                {mission.parentMessage && (
                  <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 mb-4">
                    <p className="text-sm text-blue-600 font-semibold mb-1">
                      From your parent:
                    </p>
                    <p className="text-gray-700">{mission.parentMessage}</p>
                  </div>
                )}
              </div>

              {mission.photoRequired && (
                <div className="bg-white border-2 border-gray-200 rounded-2xl p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Camera className="w-6 h-6 text-blue-600" />
                    <h3 className="text-lg font-bold text-gray-800">
                      Photo Proof Required
                    </h3>
                  </div>

                  {photoPreview ? (
                    <div className="space-y-4">
                      <div className="relative">
                        <img
                          src={photoPreview}
                          alt="Mission proof"
                          className="w-full rounded-xl border-2 border-gray-200"
                        />
                        <button
                          onClick={() => {
                            setPhotoFile(null);
                            setPhotoPreview('');
                          }}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors"
                        >
                          ✕
                        </button>
                      </div>
                      <p className="text-sm text-green-600 font-semibold flex items-center gap-2">
                        <Check className="w-4 h-4" />
                        Photo ready!
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <p className="text-sm text-gray-600">
                        Take a photo to prove you completed this mission
                      </p>
                      <label className="block">
                        <input
                          type="file"
                          accept="image/*"
                          capture="environment"
                          onChange={handlePhotoUpload}
                          disabled={isProcessing}
                          className="hidden"
                        />
                        <div className="flex items-center justify-center gap-2 px-6 py-4 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors cursor-pointer font-semibold">
                          <Camera className="w-5 h-5" />
                          {isProcessing ? 'Processing...' : 'Take Photo'}
                        </div>
                      </label>
                    </div>
                  )}
                </div>
              )}

              <button
                onClick={handleCompleteMission}
                disabled={mission.photoRequired && !photoPreview}
                className={`w-full py-4 rounded-xl font-bold text-lg transition-all shadow-lg ${
                  mission.photoRequired && !photoPreview
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <Check className="w-6 h-6" />
                  Complete Mission & Earn Rewards!
                </div>
              </button>
            </div>
          ) : (
            <div className="bg-gray-50 border-2 border-gray-200 rounded-2xl p-8 text-center">
              <div className="text-6xl mb-4">🤷</div>
              <p className="text-gray-700 text-lg mb-2">
                No mission assigned to this tag yet
              </p>
              <p className="text-gray-500 text-sm">
                Ask your parent to create and assign a mission to this tag!
              </p>
            </div>
          )}
        </div>
      </div>

      {showGeniePopup && (
        <GeniePopup
          message={genieMessage}
          onClose={() => setShowGeniePopup(false)}
        />
      )}

      {showCompleteModal && completedMission && (
        <MissionCompleteModal
          mission={completedMission}
          onClose={handleCompleteModalClose}
        />
      )}
    </div>
  );
}
