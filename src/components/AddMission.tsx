import React, { useState } from 'react';
import { Target, Sparkles, Plus, X, MapPin } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Mission, MissionCheckpoint } from '../types';
import { getTaskEmoji } from '../utils/helpers';

export function AddMission() {
  const { family, addMission } = useApp();
  const [selectedTag, setSelectedTag] = useState('');
  const [taskName, setTaskName] = useState('');
  const [emoji, setEmoji] = useState('');
  const [xp, setXp] = useState('10');
  const [cash, setCash] = useState('0.50');
  const [assignedTo, setAssignedTo] = useState('');
  const [hasPokerOffer, setHasPokerOffer] = useState(false);
  const [pokerCondition, setPokerCondition] = useState('');
  const [pokerBonusXp, setPokerBonusXp] = useState('5');
  const [pokerBonusCash, setPokerBonusCash] = useState('1.00');
  const [success, setSuccess] = useState('');
  const [useMultiCheckpoints, setUseMultiCheckpoints] = useState(false);
  const [checkpoints, setCheckpoints] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!taskName.trim() || !xp || !assignedTo) {
      return;
    }

    const finalEmoji = emoji || getTaskEmoji(taskName);

    const missionCheckpoints: MissionCheckpoint[] | undefined = useMultiCheckpoints && checkpoints.length > 0
      ? checkpoints.map((tagId, index) => ({
          tagId,
          order: index + 1,
          completed: false,
        }))
      : undefined;

    const newMission: Mission = {
      id: crypto.randomUUID(),
      tagId: useMultiCheckpoints && checkpoints.length > 0 ? checkpoints[0] : (selectedTag || ''),
      taskName: taskName.trim(),
      emoji: finalEmoji,
      xp: parseInt(xp),
      cash: parseFloat(cash),
      assignedTo,
      completed: false,
      checkpoints: missionCheckpoints,
      currentCheckpoint: useMultiCheckpoints && checkpoints.length > 0 ? 0 : undefined,
    };

    if (hasPokerOffer && pokerCondition.trim()) {
      newMission.pokerOffer = {
        condition: pokerCondition.trim(),
        bonusXp: parseInt(pokerBonusXp),
        bonusCash: parseFloat(pokerBonusCash),
      };
    }

    addMission(newMission);
    setSuccess(`Mission "${taskName}" created! ${finalEmoji}`);

    setTimeout(() => {
      setSelectedTag('');
      setTaskName('');
      setEmoji('');
      setXp('10');
      setCash('0.50');
      setAssignedTo('');
      setHasPokerOffer(false);
      setPokerCondition('');
      setPokerBonusXp('5');
      setPokerBonusCash('1.00');
      setUseMultiCheckpoints(false);
      setCheckpoints([]);
      setSuccess('');
    }, 3000);
  };

  if (!family) return null;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-3xl shadow-xl p-8">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🎯</div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Add Mission</h2>
          <p className="text-gray-600">Assign tasks to family members</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-blue-600" />
                <span className="font-bold text-gray-800">Multi-Checkpoint Quest</span>
                <span className="text-xs bg-blue-200 text-blue-800 px-2 py-1 rounded-full">Treasure Hunt</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={useMultiCheckpoints}
                  onChange={(e) => setUseMultiCheckpoints(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
              </label>
            </div>

            {useMultiCheckpoints ? (
              <div className="space-y-4">
                <p className="text-sm text-gray-600 mb-3">
                  Create a treasure hunt with multiple QR codes to scan in order
                </p>

                {checkpoints.map((checkpointTagId, index) => (
                  <div key={index} className="flex gap-2 items-center bg-white rounded-xl p-3 border-2 border-blue-200">
                    <span className="text-sm font-bold text-blue-600 min-w-[60px]">
                      Step {index + 1}
                    </span>
                    <select
                      value={checkpointTagId}
                      onChange={(e) => {
                        const newCheckpoints = [...checkpoints];
                        newCheckpoints[index] = e.target.value;
                        setCheckpoints(newCheckpoints);
                      }}
                      className="flex-1 px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none text-sm"
                    >
                      <option value="">Choose tag...</option>
                      {family.tags.map((tag) => (
                        <option key={tag.id} value={tag.id}>
                          {tag.name || tag.uid}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => setCheckpoints(checkpoints.filter((_, i) => i !== index))}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() => setCheckpoints([...checkpoints, ''])}
                  className="w-full bg-blue-100 text-blue-700 py-2 rounded-lg font-semibold hover:bg-blue-200 transition-colors flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Checkpoint (Step {checkpoints.length + 1})
                </button>

                {checkpoints.length > 0 && (
                  <div className="bg-blue-100 rounded-lg p-3 text-sm text-blue-800">
                    <strong>Quest Path:</strong> {checkpoints.map((cpId, idx) => {
                      const tag = family.tags.find(t => t.id === cpId);
                      return tag ? (tag.name || tag.uid) : `Step ${idx + 1}`;
                    }).join(' → ')}
                  </div>
                )}
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Tag (Optional)
                </label>
                <select
                  value={selectedTag}
                  onChange={(e) => setSelectedTag(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                >
                  <option value="">No tag - Simple task</option>
                  {family.tags.map((tag) => (
                    <option key={tag.id} value={tag.id}>
                      {tag.name || `Tag ${tag.uid}`}
                      {tag.message && ` - ${tag.message.substring(0, 40)}...`}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  Without a tag, kids can complete the task with one tap
                </p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Task Name
              </label>
              <input
                type="text"
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                placeholder="e.g., Water Plants, Do Dishes"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Emoji
              </label>
              <input
                type="text"
                value={emoji}
                onChange={(e) => setEmoji(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none text-center text-2xl"
                placeholder="🌿"
                maxLength={2}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                XP Points
              </label>
              <input
                type="number"
                value={xp}
                onChange={(e) => setXp(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                min="1"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pocket Money ({family.currency})
              </label>
              <input
                type="number"
                step="0.01"
                value={cash}
                onChange={(e) => setCash(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                min="0"
                max="99999"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Assign To
            </label>
            <select
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
              required
            >
              <option value="">Choose a member...</option>
              {family.members.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.nickname}
                </option>
              ))}
            </select>
          </div>

          <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border-2 border-amber-200 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-600" />
                <span className="font-bold text-gray-800">Poker Offer</span>
                <span className="text-xs bg-amber-200 text-amber-800 px-2 py-1 rounded-full">Bonus Challenge</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasPokerOffer}
                  onChange={(e) => setHasPokerOffer(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
              </label>
            </div>

            {hasPokerOffer && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Condition
                  </label>
                  <input
                    type="text"
                    value={pokerCondition}
                    onChange={(e) => setPokerCondition(e.target.value)}
                    className="w-full px-4 py-2 border-2 border-amber-200 rounded-xl focus:border-amber-500 focus:outline-none text-sm"
                    placeholder="e.g., Complete before 6 PM"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bonus XP
                    </label>
                    <input
                      type="number"
                      value={pokerBonusXp}
                      onChange={(e) => setPokerBonusXp(e.target.value)}
                      className="w-full px-4 py-2 border-2 border-amber-200 rounded-xl focus:border-amber-500 focus:outline-none text-sm"
                      min="1"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bonus Cash ({family.currency})
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={pokerBonusCash}
                      onChange={(e) => setPokerBonusCash(e.target.value)}
                      className="w-full px-4 py-2 border-2 border-amber-200 rounded-xl focus:border-amber-500 focus:outline-none text-sm"
                      min="0"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {success && (
            <div className="p-4 bg-green-100 border-2 border-green-300 rounded-xl">
              <p className="text-green-700 font-medium text-center">{success}</p>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-4 rounded-xl font-semibold text-lg hover:from-blue-600 hover:to-purple-600 transition-all transform hover:scale-105 shadow-lg"
          >
            <div className="flex items-center justify-center gap-2">
              <Target className="w-5 h-5" />
              Create Mission
            </div>
          </button>
        </form>
      </div>
    </div>
  );
}
