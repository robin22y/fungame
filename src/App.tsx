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
import { WalletPage } from './components/WalletPage';
import { BadgeDisplay } from './components/BadgeDisplay';
import { OpenScanModal } from './components/OpenScanModal';
import { ThemeSelector } from './components/ThemeSelector';
import { FamilyGamesPage } from './components/FamilyGamesPage';
import { MemberManagement } from './components/MemberManagement';
import { getAppThemeClasses, getCardThemeClasses, getTextThemeClasses } from './utils/themeManager';

type AppStep = 'login' | 'setup' | 'member-login' | 'main' | 'super-admin-login' | 'super-admin';
type MainTab = 'dashboard' | 'missions' | 'add' | 'wallet' | 'badges' | 'camera' | 'theme';

function AppContent() {
  const { family, currentMember, isParent, isSuperAdmin, logout, appTheme, updateGenieSettings } = useApp();
  const [step, setStep] = useState<AppStep>('login');
  const [activeTab, setActiveTab] = useState<MainTab>('dashboard');
  const [addTab, setAddTab] = useState<'tag' | 'mission' | 'view' | 'members'>('tag');
  const [showOpenScan, setShowOpenScan] = useState(false);

  const themeClasses = getAppThemeClasses(appTheme);
  const cardClasses = getCardThemeClasses(appTheme);
  const textClasses = getTextThemeClasses(appTheme);

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

  const handleTabChange = (tab: MainTab) => {
    if (tab === 'camera') {
      setShowOpenScan(true);
    } else {
      setActiveTab(tab);
    }
  };

  const handleToggleVoice = () => {
    if (family) {
      const currentSettings = family.genieSettings || {
        voiceEnabled: true,
        pitch: 1,
        rate: 1,
        mood: 'funny' as const,
        currentGenieId: 'genie_default',
      };
      updateGenieSettings({
        ...currentSettings,
        voiceEnabled: !currentSettings.voiceEnabled,
      });
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-500 pb-24 ${themeClasses}`}>
      <div className="container mx-auto px-4 py-8">
        {isParent ? (
          <>
            {activeTab === 'dashboard' && <FamilyDashboard />}
            {activeTab === 'missions' && <FamilyDashboard />}
            {activeTab === 'theme' && <ThemeSelector />}
            {activeTab === 'add' && (
              <div className="max-w-2xl mx-auto">
                <div className={`${cardClasses} rounded-3xl shadow-xl p-6 mb-6 border-2`}>
                  <h2 className={`text-2xl font-bold ${textClasses} mb-4 text-center`}>Parent Controls</h2>
                  <div className="grid grid-cols-4 gap-2">
                    <button
                      onClick={() => setAddTab('tag')}
                      className={`py-3 px-2 rounded-xl font-semibold transition-all border-2 ${
                        addTab === 'tag'
                          ? 'bg-blue-500 text-white border-blue-600 shadow-lg scale-105'
                          : appTheme === 'dark' || appTheme === 'royal'
                          ? 'bg-gray-700 text-white hover:bg-gray-600 border-gray-600'
                          : 'bg-white text-gray-800 hover:bg-gray-50 border-gray-300'
                      }`}
                    >
                      🏷️ Add Tag
                    </button>
                    <button
                      onClick={() => setAddTab('view')}
                      className={`py-3 px-2 rounded-xl font-semibold transition-all border-2 ${
                        addTab === 'view'
                          ? 'bg-blue-500 text-white border-blue-600 shadow-lg scale-105'
                          : appTheme === 'dark' || appTheme === 'royal'
                          ? 'bg-gray-700 text-white hover:bg-gray-600 border-gray-600'
                          : 'bg-white text-gray-800 hover:bg-gray-50 border-gray-300'
                      }`}
                    >
                      👁️ View Tags
                    </button>
                    <button
                      onClick={() => setAddTab('mission')}
                      className={`py-3 px-2 rounded-xl font-semibold transition-all border-2 ${
                        addTab === 'mission'
                          ? 'bg-blue-500 text-white border-blue-600 shadow-lg scale-105'
                          : appTheme === 'dark' || appTheme === 'royal'
                          ? 'bg-gray-700 text-white hover:bg-gray-600 border-gray-600'
                          : 'bg-white text-gray-800 hover:bg-gray-50 border-gray-300'
                      }`}
                    >
                      🎯 Mission
                    </button>
                    <button
                      onClick={() => setAddTab('members')}
                      className={`py-3 px-2 rounded-xl font-semibold transition-all border-2 ${
                        addTab === 'members'
                          ? 'bg-blue-500 text-white border-blue-600 shadow-lg scale-105'
                          : appTheme === 'dark' || appTheme === 'royal'
                          ? 'bg-gray-700 text-white hover:bg-gray-600 border-gray-600'
                          : 'bg-white text-gray-800 hover:bg-gray-50 border-gray-300'
                      }`}
                    >
                      👥 Members
                    </button>
                  </div>
                </div>
                {addTab === 'tag' && <AddTag />}
                {addTab === 'view' && <ViewAllTags />}
                {addTab === 'mission' && <AddMission />}
                {addTab === 'members' && <MemberManagement />}
              </div>
            )}
          </>
        ) : (
          <>
            {activeTab === 'dashboard' && <KidView />}
            {activeTab === 'missions' && <KidView />}
            {activeTab === 'wallet' && <WalletPage />}
            {activeTab === 'badges' && currentMember && <BadgeDisplay member={currentMember} />}
            {activeTab === 'theme' && <ThemeSelector />}
            {activeTab === 'add' && <KidView />}
          </>
        )}

      </div>

      <BottomNav
        activeTab={activeTab}
        onTabChange={handleTabChange}
        onLogout={handleLogout}
        isParent={isParent}
        voiceEnabled={family?.genieSettings?.voiceEnabled ?? true}
        onToggleVoice={handleToggleVoice}
      />

      {showOpenScan && !isParent && (
        <OpenScanModal onClose={() => setShowOpenScan(false)} />
      )}
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
