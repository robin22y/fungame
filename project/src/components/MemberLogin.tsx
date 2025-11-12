import React, { useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { useApp } from '../context/AppContext';

export function MemberLogin() {
  const { family, loginMember } = useApp();
  const [selectedMember, setSelectedMember] = useState('');
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  if (!family) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedMember || !pin) {
      setError('Please select a member and enter PIN');
      return;
    }

    const success = loginMember(selectedMember, pin);
    if (!success) {
      setError('Invalid PIN. Try again!');
      setPin('');
    }
  };

  const handlePinChange = (value: string) => {
    if (value.length <= 4 && /^\d*$/.test(value)) {
      setPin(value);
      setError('');
    }
  };

  const handleClearData = () => {
    if (confirm('Are you sure you want to clear all family data? This cannot be undone.')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">👋</div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back!</h2>
          <p className="text-gray-600">Choose your profile and enter PIN</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Who are you?
            </label>
            <div className="grid grid-cols-2 gap-3">
              {family.members.map((member) => (
                <button
                  key={member.id}
                  type="button"
                  onClick={() => setSelectedMember(member.id)}
                  className={`p-4 rounded-xl border-2 font-semibold transition-all ${
                    selectedMember === member.id
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 bg-gray-50 text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {member.nickname}
                </button>
              ))}
            </div>
          </div>

          {selectedMember && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter your PIN
              </label>
              <input
                type="password"
                value={pin}
                onChange={(e) => handlePinChange(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none text-center text-2xl tracking-widest"
                placeholder="••••"
                maxLength={4}
                autoFocus
              />
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-50 border-2 border-red-200 rounded-xl">
              <p className="text-red-600 text-sm font-medium text-center">{error}</p>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white py-4 rounded-xl font-semibold text-lg hover:from-green-600 hover:to-blue-600 transition-all transform hover:scale-105 shadow-lg"
          >
            Let's Go!
          </button>
        </form>

        <div className="mt-6">
          <button
            onClick={handleClearData}
            className="w-full flex items-center justify-center gap-2 text-red-600 py-2 text-sm hover:text-red-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Clear All Data & Start Over
          </button>
        </div>
      </div>
    </div>
  );
}
