import React from 'react';
import { Home, Target, Plus, LogOut, Wallet, Award, Camera, Palette, Volume2, VolumeX } from 'lucide-react';

interface BottomNavProps {
  activeTab: 'dashboard' | 'missions' | 'add' | 'wallet' | 'badges' | 'camera' | 'theme';
  onTabChange: (tab: 'dashboard' | 'missions' | 'add' | 'wallet' | 'badges' | 'camera' | 'theme') => void;
  onLogout: () => void;
  isParent?: boolean;
  voiceEnabled: boolean;
  onToggleVoice: () => void;
}

export function BottomNav({ activeTab, onTabChange, onLogout, isParent, voiceEnabled, onToggleVoice }: BottomNavProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-gray-200 shadow-lg z-50">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between px-0.5 py-1.5">
          <button
            onClick={() => onTabChange('dashboard')}
            className={`flex flex-col items-center gap-0.5 px-1 py-1 rounded-lg transition-all min-w-0 flex-shrink ${
              activeTab === 'dashboard'
                ? 'bg-blue-50 text-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <Home className="w-4 h-4" />
            <span className="text-[9px] font-semibold leading-none">Home</span>
          </button>

          {isParent && (
            <button
              onClick={() => onTabChange('add')}
              className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg transition-all min-w-0 flex-shrink ${
                activeTab === 'add'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md'
                  : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
              }`}
            >
              <Plus className="w-5 h-5" />
              <span className="text-[9px] font-bold leading-none">Add</span>
            </button>
          )}

          <button
            onClick={() => onTabChange('missions')}
            className={`flex flex-col items-center gap-0.5 px-1 py-1 rounded-lg transition-all min-w-0 flex-shrink ${
              activeTab === 'missions'
                ? 'bg-blue-50 text-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <Target className="w-4 h-4" />
            <span className="text-[9px] font-semibold leading-none">Tasks</span>
          </button>

          {!isParent && (
            <>
              <button
                onClick={() => onTabChange('wallet')}
                className={`flex flex-col items-center gap-0.5 px-1 py-1 rounded-lg transition-all min-w-0 flex-shrink ${
                  activeTab === 'wallet'
                    ? 'bg-green-50 text-green-600'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <Wallet className="w-4 h-4" />
                <span className="text-[9px] font-semibold leading-none">Wallet</span>
              </button>

              <button
                onClick={() => onTabChange('badges')}
                className={`flex flex-col items-center gap-0.5 px-1 py-1 rounded-lg transition-all min-w-0 flex-shrink ${
                  activeTab === 'badges'
                    ? 'bg-yellow-50 text-yellow-600'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <Award className="w-4 h-4" />
                <span className="text-[9px] font-semibold leading-none">Badges</span>
              </button>

              <button
                onClick={() => onTabChange('camera')}
                className={`flex flex-col items-center gap-0.5 px-1 py-1 rounded-lg transition-all min-w-0 flex-shrink ${
                  activeTab === 'camera'
                    ? 'bg-purple-50 text-purple-600'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <Camera className="w-4 h-4" />
                <span className="text-[9px] font-semibold leading-none">Scan</span>
              </button>
            </>
          )}

          <button
            onClick={() => onTabChange('theme')}
            className={`flex flex-col items-center gap-0.5 px-1 py-1 rounded-lg transition-all min-w-0 flex-shrink ${
              activeTab === 'theme'
                ? 'bg-pink-50 text-pink-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <Palette className="w-4 h-4" />
            <span className="text-[9px] font-semibold leading-none">Theme</span>
          </button>

          <button
            onClick={onToggleVoice}
            className={`flex flex-col items-center gap-0.5 px-1 py-1 rounded-lg transition-all min-w-0 flex-shrink ${
              voiceEnabled
                ? 'bg-green-50 text-green-600'
                : 'bg-gray-100 text-gray-500'
            }`}
          >
            {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            <span className="text-[9px] font-semibold leading-none">Voice</span>
          </button>

          <button
            onClick={onLogout}
            className="flex flex-col items-center gap-0.5 px-1 py-1 rounded-lg text-gray-600 hover:text-red-600 transition-all min-w-0 flex-shrink"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-[9px] font-semibold leading-none">Exit</span>
          </button>
        </div>
      </div>
    </div>
  );
}
