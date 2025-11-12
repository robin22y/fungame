import { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { LoginPage } from './components/LoginPage';
import { MemberSetup } from './components/MemberSetup';
import { MemberLogin } from './components/MemberLogin';
import { FamilyDashboard } from './components/FamilyDashboard';
import { KidView } from './components/KidView';
import { AddTag } from './components/AddTag';
import { AddMission } from './components/AddMission';
import { GameStore } from './components/GameStore';
import { SuperAdminLogin } from './components/SuperAdminLogin';
import { SuperAdminPanel } from './components/SuperAdminPanel';
import { BottomNav } from './components/BottomNav';
import { ViewAllTags } from './components/ViewAllTags';

type AppStep = 'login' | 'setup' | 'member-login' | 'main' | 'super-admin-login' | 'super-admin';
type MainTab = 'dashboard' | 'missions' | 'add' | 'store';

function AppContent() {
  const { family, currentMember, isParent, isSuperAdmin, logout } = useApp();
  const [step, setStep] = useState<AppStep>('login');
  const [activeTab, setActiveTab] = useState<MainTab>('dashboard');
  const [addTab, setAddTab] = useState<'tag' | 'mission' | 'view'>('tag');

  if (step === 'super-admin-login') {
    return <SuperAdminLogin onSuccess={() => setStep('super-admin')} />;
  }

  if (isSuperAdmin || step === 'super-admin') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 pb-24">
        <div className="container mx-auto px-4 py-8">
          <SuperAdminPanel />
        </div>
        <div className="fixed bottom-6 right-6">
          <button
            onClick={() => {
              logout();
              setStep('login');
            }}
            className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-red-600 hover:to-pink-600 transition-all shadow-lg"
          >
            Logout
          </button>
        </div>
      </div>
    );
  }

  if (!family) {
    return (
      <div>
        <LoginPage onNext={() => setStep('setup')} />
        <div className="fixed bottom-6 right-6">
          <button
            onClick={() => setStep('super-admin-login')}
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg"
          >
            Super Admin
          </button>
        </div>
      </div>
    );
  }

  if (step === 'setup' || (family && family.members.length === 0)) {
    return <MemberSetup onComplete={() => setStep('member-login')} />;
  }

  if (!currentMember && !isParent) {
    return <MemberLogin />;
  }

  const handleLogout = () => {
    logout();
    setActiveTab('dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 pb-24">
      <div className="container mx-auto px-4 py-8">
        {isParent ? (
          <>
            {activeTab === 'dashboard' && <FamilyDashboard />}
            {activeTab === 'missions' && <FamilyDashboard />}
            {activeTab === 'store' && <GameStore />}
            {activeTab === 'add' && (
              <div className="max-w-2xl mx-auto">
                <div className="bg-white rounded-3xl shadow-xl p-6 mb-6">
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => setAddTab('tag')}
                      className={`py-3 rounded-xl font-semibold transition-all ${
                        addTab === 'tag'
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Add Tag
                    </button>
                    <button
                      onClick={() => setAddTab('view')}
                      className={`py-3 rounded-xl font-semibold transition-all ${
                        addTab === 'view'
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      View Tags
                    </button>
                    <button
                      onClick={() => setAddTab('mission')}
                      className={`py-3 rounded-xl font-semibold transition-all ${
                        addTab === 'mission'
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Add Mission
                    </button>
                  </div>
                </div>
                {addTab === 'tag' && <AddTag />}
                {addTab === 'view' && <ViewAllTags />}
                {addTab === 'mission' && <AddMission />}
              </div>
            )}
          </>
        ) : (
          <>
            {activeTab === 'dashboard' && <KidView />}
            {activeTab === 'missions' && <KidView />}
            {activeTab === 'store' && <GameStore />}
            {activeTab === 'add' && <KidView />}
          </>
        )}
      </div>

      <BottomNav
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onLogout={handleLogout}
      />
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
