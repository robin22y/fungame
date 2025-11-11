import React, { useState } from 'react';
import { Users, UserPlus, Trash2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { validatePin } from '../utils/helpers';
import { Member } from '../types';

export function MemberSetup({ onComplete }: { onComplete: () => void }) {
  const { updateMembers } = useApp();
  const [step, setStep] = useState<'parents' | 'count' | 'details'>('parents');
  const [parentCount, setParentCount] = useState('2');
  const [kidCount, setKidCount] = useState('2');
  const [parents, setParents] = useState<Member[]>([]);
  const [kids, setKids] = useState<Member[]>([]);
  const [extraMembers, setExtraMembers] = useState<Member[]>([]);
  const [error, setError] = useState('');

  const handleSetParentCount = () => {
    const count = parseInt(parentCount);
    if (count < 1 || count > 2) {
      setError('Please enter 1 or 2 parents');
      return;
    }

    const newParents: Member[] = [];
    for (let i = 1; i <= count; i++) {
      newParents.push({
        id: crypto.randomUUID(),
        nickname: count === 1 ? 'Parent' : i === 1 ? 'Parent1' : 'Parent2',
        pin: '',
        totalXp: 0,
        xpToday: 0,
        totalCash: 0,
        cashToday: 0,
      });
    }

    setParents(newParents);
    setStep('count');
    setError('');
  };

  const handleSetKidCount = () => {
    const count = parseInt(kidCount);
    if (count < 0 || count > 10) {
      setError('Please enter between 0 and 10 kids');
      return;
    }

    const newKids: Member[] = [];
    for (let i = 1; i <= count; i++) {
      newKids.push({
        id: crypto.randomUUID(),
        nickname: `Kid${i}`,
        pin: '',
        totalXp: 0,
        xpToday: 0,
        totalCash: 0,
        cashToday: 0,
      });
    }

    setKids(newKids);
    setStep('details');
    setError('');
  };

  const handleAddExtraMember = () => {
    const newMember: Member = {
      id: crypto.randomUUID(),
      nickname: '',
      pin: '',
      totalXp: 0,
      xpToday: 0,
      totalCash: 0,
      cashToday: 0,
    };
    setExtraMembers([...extraMembers, newMember]);
  };

  const handleRemoveExtraMember = (id: string) => {
    setExtraMembers(extraMembers.filter(m => m.id !== id));
  };

  const handleNicknameChange = (id: string, nickname: string, type: 'parent' | 'kid' | 'extra') => {
    if (type === 'parent') {
      setParents(parents.map(m => m.id === id ? { ...m, nickname } : m));
    } else if (type === 'kid') {
      setKids(kids.map(m => m.id === id ? { ...m, nickname } : m));
    } else {
      setExtraMembers(extraMembers.map(m => m.id === id ? { ...m, nickname } : m));
    }
  };

  const handlePinChange = (id: string, pin: string, type: 'parent' | 'kid' | 'extra') => {
    if (pin.length <= 4 && /^\d*$/.test(pin)) {
      if (type === 'parent') {
        setParents(parents.map(m => m.id === id ? { ...m, pin } : m));
      } else if (type === 'kid') {
        setKids(kids.map(m => m.id === id ? { ...m, pin } : m));
      } else {
        setExtraMembers(extraMembers.map(m => m.id === id ? { ...m, pin } : m));
      }
    }
  };

  const handleSubmit = () => {
    const allMembers = [...parents, ...kids, ...extraMembers];

    const allValid = allMembers.every(m => m.nickname.trim() && validatePin(m.pin));
    if (!allValid) {
      setError('All members need a nickname and a 4-digit PIN');
      return;
    }

    const uniquePins = new Set(allMembers.map(m => m.pin));
    if (uniquePins.size !== allMembers.length) {
      setError('Each member needs a unique PIN');
      return;
    }

    updateMembers(allMembers);
    onComplete();
  };

  if (step === 'parents') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">👨‍👩‍👧‍👦</div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Setup Parents</h2>
            <p className="text-gray-600">How many parents in the family?</p>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Number of Parents
            </label>
            <input
              type="number"
              value={parentCount}
              onChange={(e) => setParentCount(e.target.value)}
              className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none text-center text-2xl font-bold"
              min="1"
              max="2"
              placeholder="2"
            />
            <p className="text-xs text-gray-500 mt-2 text-center">1 or 2 parents</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-xl">
              <p className="text-red-600 text-sm font-medium text-center">{error}</p>
            </div>
          )}

          <button
            onClick={handleSetParentCount}
            className="w-full bg-gradient-to-r from-blue-500 to-teal-500 text-white py-4 rounded-xl font-semibold text-lg hover:from-blue-600 hover:to-teal-600 transition-all transform hover:scale-105 shadow-lg"
          >
            <div className="flex items-center justify-center gap-2">
              <Users className="w-5 h-5" />
              Continue
            </div>
          </button>
        </div>
      </div>
    );
  }

  if (step === 'count') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">👶</div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">How Many Kids?</h2>
            <p className="text-gray-600">Enter the number of children in your family</p>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Number of Kids
            </label>
            <input
              type="number"
              value={kidCount}
              onChange={(e) => setKidCount(e.target.value)}
              className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none text-center text-2xl font-bold"
              min="0"
              max="10"
              placeholder="2"
            />
            <p className="text-xs text-gray-500 mt-2 text-center">Between 0 and 10 kids</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-xl">
              <p className="text-red-600 text-sm font-medium text-center">{error}</p>
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={() => setStep('parents')}
              className="flex-1 bg-gray-200 text-gray-700 py-4 rounded-xl font-semibold text-lg hover:bg-gray-300 transition-colors"
            >
              Back
            </button>
            <button
              onClick={handleSetKidCount}
              className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 rounded-xl font-semibold text-lg hover:from-purple-600 hover:to-pink-600 transition-all transform hover:scale-105 shadow-lg"
            >
              <div className="flex items-center justify-center gap-2">
                <Users className="w-5 h-5" />
                Continue
              </div>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <div className="text-5xl mb-3">✏️</div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Setup Family</h2>
            <p className="text-gray-600">Set nicknames and PINs for everyone</p>
          </div>

          <div className="space-y-6">
            {parents.length > 0 && (
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-4">Parents</h3>
                <div className="space-y-4">
                  {parents.map((parent, index) => (
                    <div key={parent.id} className="bg-teal-50 rounded-2xl p-5 border-2 border-teal-200">
                      <h4 className="text-sm font-semibold text-teal-600 mb-3">Parent {index + 1}</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Nickname
                          </label>
                          <input
                            type="text"
                            value={parent.nickname}
                            onChange={(e) => handleNicknameChange(parent.id, e.target.value, 'parent')}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:outline-none"
                            placeholder="e.g., Dad, Mom, Papa"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            4-Digit PIN
                          </label>
                          <input
                            type="password"
                            value={parent.pin}
                            onChange={(e) => handlePinChange(parent.id, e.target.value, 'parent')}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:outline-none"
                            placeholder="1234"
                            maxLength={4}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {kids.length > 0 && (
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-4">Kids</h3>
                <div className="space-y-4">
                  {kids.map((kid, index) => (
                    <div key={kid.id} className="bg-blue-50 rounded-2xl p-5 border-2 border-blue-200">
                      <h4 className="text-sm font-semibold text-blue-600 mb-3">Kid {index + 1}</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Nickname
                          </label>
                          <input
                            type="text"
                            value={kid.nickname}
                            onChange={(e) => handleNicknameChange(kid.id, e.target.value, 'kid')}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                            placeholder="e.g., Alex, Emma, Max"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            4-Digit PIN
                          </label>
                          <input
                            type="password"
                            value={kid.pin}
                            onChange={(e) => handlePinChange(kid.id, e.target.value, 'kid')}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                            placeholder="1234"
                            maxLength={4}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {extraMembers.length > 0 && (
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-4">
                  Grandparents & Guests
                </h3>
                <div className="space-y-4">
                  {extraMembers.map((member) => (
                    <div key={member.id} className="bg-green-50 rounded-2xl p-5 border-2 border-green-200 relative">
                      <button
                        onClick={() => handleRemoveExtraMember(member.id)}
                        className="absolute top-4 right-4 text-red-400 hover:text-red-600 transition-colors"
                        type="button"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pr-8">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Nickname
                          </label>
                          <input
                            type="text"
                            value={member.nickname}
                            onChange={(e) => handleNicknameChange(member.id, e.target.value, 'extra')}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none"
                            placeholder="e.g., Grandma, Grandpa, Uncle"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            4-Digit PIN
                          </label>
                          <input
                            type="password"
                            value={member.pin}
                            onChange={(e) => handlePinChange(member.id, e.target.value, 'extra')}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none"
                            placeholder="1234"
                            maxLength={4}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={handleAddExtraMember}
              className="w-full bg-gradient-to-r from-green-500 to-teal-500 text-white py-3 rounded-xl font-semibold hover:from-green-600 hover:to-teal-600 transition-all shadow-md border-2 border-dashed border-green-300"
            >
              <div className="flex items-center justify-center gap-2">
                <UserPlus className="w-5 h-5" />
                Add Grandparent / Guest
              </div>
            </button>
          </div>

          {error && (
            <div className="mt-6 p-4 bg-red-50 border-2 border-red-200 rounded-xl">
              <p className="text-red-600 text-sm font-medium">{error}</p>
            </div>
          )}

          <div className="flex gap-3 mt-6">
            <button
              onClick={() => setStep('count')}
              className="flex-1 bg-gray-200 text-gray-700 py-4 rounded-xl font-semibold text-lg hover:bg-gray-300 transition-colors"
            >
              Back
            </button>
            <button
              onClick={handleSubmit}
              className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 rounded-xl font-semibold text-lg hover:from-purple-600 hover:to-pink-600 transition-all transform hover:scale-105 shadow-lg"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
