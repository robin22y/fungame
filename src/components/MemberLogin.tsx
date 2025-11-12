import React, { useState } from 'react';
import { RefreshCw, Shield } from 'lucide-react';
import { useApp } from '../context/AppContext';

export function MemberLogin() {
  const { family, loginMember, parentLogin } = useApp();
  const [selectedMember, setSelectedMember] = useState('');
  const [pin, setPin] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isParentMode, setIsParentMode] = useState(false);

  if (!family) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isParentMode) {
      if (!email || !password) {
        setError('Please enter email and password');
        return;
      }
      const success = parentLogin(email, password);
      if (!success) {
        setError('Invalid email or password. Try again!');
        setEmail('');
        setPassword('');
      }
    } else {
      if (!selectedMember || !pin) {
        setError('Please select a member and enter PIN');
        return;
      }

      const success = loginMember(selectedMember, pin);
      if (!success) {
        setError('Invalid PIN. Try again!');
        setPin('');
      }
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
          <div className="text-6xl mb-4">{isParentMode ? '👨‍👩‍👧‍👦' : '👋'}</div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            {isParentMode ? 'Parent Login' : 'Welcome Back!'}
          </h2>
          <p className="text-gray-600">
            {isParentMode ? 'Enter email and password to access parent features' : 'Choose your profile and enter PIN'}
          </p>
        </div>

        <div className="flex gap-2 mb-6">
          <button
            type="button"
            onClick={() => {
              setIsParentMode(false);
              setSelectedMember('');
              setPin('');
              setEmail('');
              setPassword('');
              setError('');
            }}
            className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
              !isParentMode
                ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Kids
          </button>
          <button
            type="button"
            onClick={() => {
              setIsParentMode(true);
              setSelectedMember('');
              setPin('');
              setEmail('');
              setPassword('');
              setError('');
            }}
            className={`flex-1 py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
              isParentMode
                ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Shield className="w-4 h-4" />
            Parents
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {!isParentMode && (
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
          )}

          {isParentMode && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError('');
                  }}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                  placeholder="parent@family.com"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError('');
                  }}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                  placeholder="Enter your password"
                  required
                />
              </div>
            </>
          )}

          {!isParentMode && selectedMember && (
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
            className={`w-full text-white py-4 rounded-xl font-semibold text-lg transition-all transform hover:scale-105 shadow-lg ${
              isParentMode
                ? 'bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600'
                : 'bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600'
            }`}
          >
            {isParentMode ? 'Parent Access' : "Let's Go!"}
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
