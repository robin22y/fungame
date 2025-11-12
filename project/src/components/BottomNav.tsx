import React from 'react';
import { Home, Target, Plus, LogOut, ShoppingBag } from 'lucide-react';

interface BottomNavProps {
  activeTab: 'dashboard' | 'missions' | 'add' | 'store';
  onTabChange: (tab: 'dashboard' | 'missions' | 'add' | 'store') => void;
  onLogout: () => void;
}

export function BottomNav({ activeTab, onTabChange, onLogout }: BottomNavProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-gray-200 shadow-lg">
      <div className="max-w-3xl mx-auto px-4">
        <div className="flex items-center justify-around py-3">
          <button
            onClick={() => onTabChange('dashboard')}
            className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all ${
              activeTab === 'dashboard'
                ? 'bg-blue-50 text-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <Home className="w-6 h-6" />
            <span className="text-xs font-semibold">Home</span>
          </button>

          <button
            onClick={() => onTabChange('missions')}
            className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all ${
              activeTab === 'missions'
                ? 'bg-blue-50 text-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <Target className="w-6 h-6" />
            <span className="text-xs font-semibold">Missions</span>
          </button>

          <button
            onClick={() => onTabChange('store')}
            className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all ${
              activeTab === 'store'
                ? 'bg-blue-50 text-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <ShoppingBag className="w-6 h-6" />
            <span className="text-xs font-semibold">Store</span>
          </button>

          <button
            onClick={() => onTabChange('add')}
            className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all ${
              activeTab === 'add'
                ? 'bg-blue-50 text-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <Plus className="w-6 h-6" />
            <span className="text-xs font-semibold">Add</span>
          </button>

          <button
            onClick={onLogout}
            className="flex flex-col items-center gap-1 px-3 py-2 rounded-xl text-gray-600 hover:text-red-600 transition-all"
          >
            <LogOut className="w-6 h-6" />
            <span className="text-xs font-semibold">Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
}
