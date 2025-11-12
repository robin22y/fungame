import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useEffect, useState } from 'react';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { Mission } from '../types';
import { speakGenie } from '../utils/speakGenie';

export function MessageBoard() {
  const { tagName } = useParams<{ tagName: string }>();
  const { family, currentMember } = useApp();
  const navigate = useNavigate();
  const [relevantMissions, setRelevantMissions] = useState<Mission[]>([]);
  const [tagMessage, setTagMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!tagName || !family) return;

    const tag = family.tags.find(
      t => t.name?.toLowerCase() === tagName.toLowerCase()
    );

    if (tag) {
      setTagMessage(tag.message || null);

      if (currentMember) {
        const missions = family.missions.filter(
          m => !m.completed &&
               m.assignedTo === currentMember.id &&
               family.tags.find(t => t.id === m.tagId)?.name?.toLowerCase() === tagName.toLowerCase()
        );
        setRelevantMissions(missions);

        if (missions.length > 0 && missions[0].parentMessage) {
          const clue = missions[0].parentMessage;
          if (family.genieSettings?.voiceEnabled) {
            speakGenie(`Hi ${currentMember.nickname}! ${clue}`, family.genieSettings);
          }
        } else if (tag.message && family.genieSettings?.voiceEnabled) {
          speakGenie(tag.message, family.genieSettings);
        }
      }
    }
  }, [tagName, family, currentMember]);

  if (!tagName) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white p-6">
        <p className="text-gray-500">Invalid tag</p>
      </div>
    );
  }

  const displayName = tagName.split('-').map(word =>
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-purple-50 to-white">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to App
        </button>

        <div className="bg-white rounded-3xl shadow-xl p-8 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <Sparkles className="w-8 h-8 text-purple-600" />
            <h1 className="text-3xl font-bold text-gray-800 capitalize">
              {displayName}
            </h1>
          </div>

          {!currentMember ? (
            <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-6 text-center">
              <p className="text-yellow-900 font-semibold mb-3">
                Please log in to see your missions!
              </p>
              <button
                onClick={() => navigate('/')}
                className="bg-blue-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-600 transition-colors"
              >
                Go to Login
              </button>
            </div>
          ) : relevantMissions.length > 0 ? (
            <div className="space-y-4">
              {relevantMissions.map((mission, index) => (
                <div
                  key={mission.id}
                  className="bg-gradient-to-br from-purple-50 to-blue-50 border-2 border-purple-200 rounded-xl p-6"
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div className="text-3xl">{mission.emoji}</div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-800 mb-2">
                        {mission.taskName}
                      </h3>
                      {mission.parentMessage && (
                        <div className="bg-white rounded-lg p-4 mb-3 border-2 border-purple-100">
                          <p className="text-gray-700 italic">
                            "{mission.parentMessage}"
                          </p>
                        </div>
                      )}
                      <div className="flex gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <span className="font-semibold text-purple-600">XP:</span>
                          <span className="text-gray-700">{mission.xp}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="font-semibold text-green-600">Cash:</span>
                          <span className="text-gray-700">
                            {family?.currency || '$'}{mission.cash.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 mt-4">
                <p className="text-sm text-blue-900">
                  <strong>Next Step:</strong> Complete the mission and scan this tag again to verify and earn your rewards!
                </p>
              </div>
            </div>
          ) : tagMessage ? (
            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-xl p-6">
              <p className="text-gray-700 text-lg italic mb-4">
                "{tagMessage}"
              </p>
              <p className="text-gray-600 text-sm">
                No missions available here for you right now.
              </p>
            </div>
          ) : (
            <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-6 text-center">
              <p className="text-gray-600">
                No missions or messages available at this location.
              </p>
            </div>
          )}
        </div>

        {currentMember && (
          <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
            <p className="text-gray-600 mb-4">
              Logged in as <strong className="text-blue-600">{currentMember.nickname}</strong>
            </p>
            <button
              onClick={() => navigate('/')}
              className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-600 transition-all shadow-md"
            >
              Open Full App
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
