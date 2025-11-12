import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, Calendar, Users, FileText } from 'lucide-react';

interface CreateGamePageProps {
  onComplete: () => void;
}

export function CreateGamePage({ onComplete }: CreateGamePageProps) {
  const { family, currentMember, createFamilyGame } = useApp();
  const [title, setTitle] = useState('');
  const [rules, setRules] = useState('');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>([]);
  const [includeMe, setIncludeMe] = useState(true);
  const [error, setError] = useState('');

  if (!family || !currentMember) return null;

  const isKid = currentMember.role === 'kid';
  const pageTitle = isKid ? '💡 Suggest Task Group' : '📋 Create Task Group';
  const pageDescription = isKid
    ? 'Suggest a task bundle for your family'
    : 'Create a themed bundle of family missions';
  const buttonText = isKid ? 'Submit Suggestion' : 'Create Task Group';

  const handleToggleParticipant = (memberId: string) => {
    if (selectedParticipants.includes(memberId)) {
      setSelectedParticipants(selectedParticipants.filter(id => id !== memberId));
    } else {
      setSelectedParticipants([...selectedParticipants, memberId]);
    }
  };

  const handleSubmit = () => {
    if (!title.trim()) {
      setError('Please enter a task group title');
      return;
    }

    if (!rules.trim()) {
      setError('Please enter a description');
      return;
    }

    let participants = [...selectedParticipants];
    if (includeMe && !participants.includes(currentMember.id)) {
      participants.push(currentMember.id);
    }

    if (participants.length === 0) {
      setError('Please select at least one participant');
      return;
    }

    if (isKid) {
      createFamilyGame({
        title,
        organiserId: null,
        suggestedBy: currentMember.id,
        participants,
        rules,
        missions: [],
        startDate,
        endDate: null,
        status: 'pending_approval',
      });
    } else {
      createFamilyGame({
        title,
        organiserId: currentMember.id,
        participants,
        rules,
        missions: [],
        startDate,
        endDate: null,
        status: 'active',
      });
    }

    onComplete();
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-3xl shadow-xl p-8">
        {isKid && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 rounded-r-xl">
            <p className="text-yellow-800 text-sm font-medium">
              ⏳ Your suggestion will be sent to parents for approval
            </p>
          </div>
        )}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">{isKid ? '💡' : '📋'}</div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">{pageTitle}</h2>
          <p className="text-gray-600">{pageDescription}</p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <Sparkles className="w-4 h-4" />
              Task Group Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
              placeholder="e.g., Weekend Clean-Up Race"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <FileText className="w-4 h-4" />
              Description & Rules
            </label>
            <textarea
              value={rules}
              onChange={(e) => setRules(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
              rows={4}
              placeholder="Describe this task group, rules, and objectives..."
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <Calendar className="w-4 h-4" />
              Start Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
              <Users className="w-4 h-4" />
              Select Participants
            </label>
            <div className="space-y-2">
              {family.members
                .filter(m => m.id !== currentMember.id)
                .map(member => (
                  <label
                    key={member.id}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 cursor-pointer transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={selectedParticipants.includes(member.id)}
                      onChange={() => handleToggleParticipant(member.id)}
                      className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-2xl">{member.avatarEmoji || '👤'}</span>
                    <span className="font-medium text-gray-800">{member.nickname}</span>
                  </label>
                ))}
            </div>
          </div>

          <div>
            <label className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl hover:bg-blue-100 cursor-pointer transition-colors border-2 border-blue-200">
              <input
                type="checkbox"
                checked={includeMe}
                onChange={(e) => setIncludeMe(e.target.checked)}
                className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-2xl">{currentMember.avatarEmoji || '👤'}</span>
              <div>
                <span className="font-medium text-gray-800">Include me as a player</span>
                <p className="text-xs text-gray-600">You'll be the organiser and a player</p>
              </div>
            </label>
          </div>

          {error && (
            <div className="p-4 bg-red-50 border-2 border-red-200 rounded-xl">
              <p className="text-red-600 text-sm font-medium">{error}</p>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button
              onClick={onComplete}
              className="flex-1 bg-gray-200 text-gray-700 py-4 rounded-xl font-semibold text-lg hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className={`flex-1 text-white py-4 rounded-xl font-semibold text-lg transition-all transform hover:scale-105 shadow-lg ${
                isKid
                  ? 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600'
                  : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600'
              }`}
            >
              {buttonText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
