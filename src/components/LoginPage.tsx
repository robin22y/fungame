import React, { useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { useApp } from '../context/AppContext';

export function LoginPage({ onNext }: { onNext: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { createFamily, family } = useApp();

  const handleClearData = () => {
    if (confirm('Are you sure you want to clear all family data? This cannot be undone.')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (email.trim() && password.trim()) {
      if (password.length < 4) {
        setError('Password must be at least 4 characters');
        return;
      }
      createFamily(email.trim(), password);
      onNext();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🎮</div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Family Task Game</h1>
          <p className="text-gray-600">Turn chores into adventures!</p>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-xl text-center font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Parent Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
              placeholder="parent@family.com"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Parent Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
              placeholder="Enter a secure password"
              required
              minLength={4}
            />
            <p className="text-xs text-gray-500 mt-1">At least 4 characters</p>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-green-500 text-white py-4 rounded-xl font-semibold text-lg hover:from-blue-600 hover:to-green-600 transition-all transform hover:scale-105 shadow-lg"
          >
            Create Family
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500">
          <p>Your family will get a fun codename!</p>
        </div>

        {family && (
          <div className="mt-4">
            <button
              type="button"
              onClick={handleClearData}
              className="w-full flex items-center justify-center gap-2 text-red-600 py-2 text-sm hover:text-red-700 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Clear All Data & Start Over
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
