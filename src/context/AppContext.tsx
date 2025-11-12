import React, { createContext, useContext, useState, useEffect } from 'react';
import { Family, Member, Tag, Mission, Game, PurchasedGame, FamilyGame, PhotoProof, GenieSettings, GenieCharacter, GenieMessage, AppContextType } from '../types';
import { generateFamilyName, getTodayString } from '../utils/helpers';
import { checkAndAwardBadges } from '../utils/badgeSystem';

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY = 'family_task_game';
const GAMES_STORAGE_KEY = 'tappy_games_store';
const AUTH_STORAGE_KEY = 'tappy_auth_state';
const THEME_STORAGE_KEY = 'app_theme';
const GENIE_CHARACTERS_KEY = 'genie_characters';
const GENIE_MESSAGES_KEY = 'genie_messages';
const GLOBAL_GENIE_SETTINGS_KEY = 'global_genie_settings';
const SUPER_ADMIN_PASSWORD = 'Rncdm@2025';

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [family, setFamily] = useState<Family | null>(null);
  const [currentMember, setCurrentMember] = useState<Member | null>(null);
  const [isParent, setIsParent] = useState(false);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [availableGames, setAvailableGames] = useState<Game[]>([]);
  const [appTheme, setAppTheme] = useState<string>(
    localStorage.getItem(THEME_STORAGE_KEY) || 'default'
  );
  const [genieCharacters, setGenieCharacters] = useState<GenieCharacter[]>([]);
  const [genieMessages, setGenieMessages] = useState<GenieMessage[]>([]);
  const [globalGenieSettings, setGlobalGenieSettings] = useState<GenieSettings>({
    voiceEnabled: true,
    pitch: 1,
    rate: 1,
    mood: 'funny',
    currentGenieId: 'genie_default',
  });

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const data = JSON.parse(stored);
      setFamily(data);
    }

    const gamesStored = localStorage.getItem(GAMES_STORAGE_KEY);
    if (gamesStored) {
      setAvailableGames(JSON.parse(gamesStored));
    }

    const authStored = localStorage.getItem(AUTH_STORAGE_KEY);
    if (authStored) {
      const authData = JSON.parse(authStored);
      setIsParent(authData.isParent || false);
      setIsSuperAdmin(authData.isSuperAdmin || false);
      if (authData.currentMemberId && stored) {
        const familyData = JSON.parse(stored);
        const member = familyData.members.find((m: Member) => m.id === authData.currentMemberId);
        if (member) setCurrentMember(member);
      }
    }

    const genieCharsStored = localStorage.getItem(GENIE_CHARACTERS_KEY);
    if (genieCharsStored) {
      setGenieCharacters(JSON.parse(genieCharsStored));
    } else {
      const defaultGenie: GenieCharacter = {
        id: 'genie_default',
        name: 'Classic Genie',
        emoji: '🧞',
        occasion: 'default',
        description: 'The original friendly genie',
        active: true,
        createdAt: new Date().toISOString(),
      };
      setGenieCharacters([defaultGenie]);
    }

    const genieMessagesStored = localStorage.getItem(GENIE_MESSAGES_KEY);
    if (genieMessagesStored) {
      setGenieMessages(JSON.parse(genieMessagesStored));
    }

    const globalGenieStored = localStorage.getItem(GLOBAL_GENIE_SETTINGS_KEY);
    if (globalGenieStored) {
      setGlobalGenieSettings(JSON.parse(globalGenieStored));
    }
  }, []);

  useEffect(() => {
    if (family) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(family));
    }
  }, [family]);

  useEffect(() => {
    localStorage.setItem(GAMES_STORAGE_KEY, JSON.stringify(availableGames));
  }, [availableGames]);

  useEffect(() => {
    const authState = {
      isParent,
      isSuperAdmin,
      currentMemberId: currentMember?.id || null,
    };
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authState));
  }, [isParent, isSuperAdmin, currentMember]);

  useEffect(() => {
    localStorage.setItem(GENIE_CHARACTERS_KEY, JSON.stringify(genieCharacters));
  }, [genieCharacters]);

  useEffect(() => {
    localStorage.setItem(GENIE_MESSAGES_KEY, JSON.stringify(genieMessages));
  }, [genieMessages]);

  useEffect(() => {
    localStorage.setItem(GLOBAL_GENIE_SETTINGS_KEY, JSON.stringify(globalGenieSettings));
  }, [globalGenieSettings]);

  const createFamily = (email: string, password: string) => {
    const newFamily: Family = {
      id: crypto.randomUUID(),
      name: generateFamilyName(),
      email,
      password,
      currency: '£',
      xpToCashRate: 10,
      members: [],
      tags: [],
      missions: [],
      purchasedGames: [],
      genieSettings: {
        voiceEnabled: true,
        pitch: 1,
        rate: 1,
        mood: 'funny',
        currentGenieId: 'genie_default',
      },
    };
    setFamily(newFamily);
    setIsParent(true);
  };

  const updateMembers = (members: Member[]) => {
    if (family) {
      setFamily({ ...family, members });
    }
  };

  const addTag = (tag: Tag) => {
    if (family) {
      setFamily({ ...family, tags: [...family.tags, tag] });
    }
  };

  const addMission = (mission: Mission) => {
    if (family) {
      setFamily({ ...family, missions: [...family.missions, mission] });
    }
  };

  const completeMission = (missionId: string, memberId: string, checkpointIndex?: number) => {
    if (!family) return;

    const mission = family.missions.find(m => m.id === missionId);
    if (!mission) return;

    const today = getTodayString();
    let updatedMissions = [...family.missions];
    let shouldAwardPoints = false;

    if (mission.checkpoints && mission.checkpoints.length > 0) {
      const currentIdx = checkpointIndex ?? mission.currentCheckpoint ?? 0;
      const updatedCheckpoints = mission.checkpoints.map((cp, idx) =>
        idx === currentIdx ? { ...cp, completed: true } : cp
      );

      const allCheckpointsComplete = updatedCheckpoints.every(cp => cp.completed);
      const nextCheckpoint = allCheckpointsComplete ? currentIdx : currentIdx + 1;

      updatedMissions = family.missions.map(m =>
        m.id === missionId
          ? {
              ...m,
              checkpoints: updatedCheckpoints,
              currentCheckpoint: nextCheckpoint,
              completed: allCheckpointsComplete,
              completedBy: allCheckpointsComplete ? memberId : m.completedBy,
              completedAt: allCheckpointsComplete ? today : m.completedAt,
            }
          : m
      );

      shouldAwardPoints = allCheckpointsComplete;
    } else {
      updatedMissions = family.missions.map(m =>
        m.id === missionId
          ? { ...m, completed: true, completedBy: memberId, completedAt: today }
          : m
      );
      shouldAwardPoints = true;
    }

    const updatedMembers = shouldAwardPoints
      ? family.members.map(m => {
          if (m.id === memberId) {
            const completedMissionsCount = updatedMissions.filter(
              mission => mission.completedBy === memberId
            ).length;
            const consecutiveDays = m.streak || 1;

            const { newBadges } = checkAndAwardBadges(m, completedMissionsCount, consecutiveDays);

            return {
              ...m,
              totalXp: m.totalXp + mission.xp,
              xpToday: m.xpToday + mission.xp,
              totalCash: m.totalCash + mission.cash,
              cashToday: m.cashToday + mission.cash,
              badges: [...(m.badges || []), ...newBadges],
              level: Math.floor((m.totalXp + mission.xp) / 100) + 1,
            };
          }
          return m;
        })
      : family.members;

    setFamily({ ...family, missions: updatedMissions, members: updatedMembers });

    if (currentMember && currentMember.id === memberId) {
      const updated = updatedMembers.find(m => m.id === memberId);
      if (updated) setCurrentMember(updated);
    }
  };

  const loginMember = (memberId: string, pin: string): boolean => {
    if (!family) return false;
    const member = family.members.find(m => m.id === memberId && m.pin === pin);
    if (member) {
      setCurrentMember(member);
      setIsParent(false);
      setIsSuperAdmin(false);
      return true;
    }
    return false;
  };

  const parentLogin = (email: string, password: string): boolean => {
    if (!email || !email.trim() || !password) {
      return false;
    }

    if (family) {
      if (family.email === email.trim() && family.password === password) {
        setIsParent(true);
        setCurrentMember(null);
        setIsSuperAdmin(false);

        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({
          isParent: true,
          isSuperAdmin: false,
          memberId: null,
        }));

        return true;
      } else {
        return false;
      }
    }

    const newFamily: Family = {
      id: crypto.randomUUID(),
      name: generateFamilyName(),
      email: email.trim(),
      password,
      currency: '£',
      xpToCashRate: 10,
      members: [],
      tags: [],
      missions: [],
      purchasedGames: [],
      genieSettings: {
        voiceEnabled: true,
        pitch: 1,
        rate: 1,
        mood: 'funny',
        currentGenieId: 'genie_default',
      },
    };

    setFamily(newFamily);
    setIsParent(true);
    setCurrentMember(null);
    setIsSuperAdmin(false);

    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({
      isParent: true,
      isSuperAdmin: false,
      memberId: null,
    }));

    return true;
  };

  const superAdminLogin = (password: string): boolean => {
    if (password === SUPER_ADMIN_PASSWORD) {
      setIsSuperAdmin(true);
      setIsParent(false);
      setCurrentMember(null);
      return true;
    }
    return false;
  };

  const addGame = (game: Game) => {
    setAvailableGames([...availableGames, game]);
  };

  const purchaseGame = (gameId: string, memberId: string) => {
    if (!family) return;

    const purchase: PurchasedGame = {
      gameId,
      purchasedAt: new Date().toISOString(),
      purchasedBy: memberId,
    };

    setFamily({
      ...family,
      purchasedGames: [...family.purchasedGames, purchase],
    });
  };

  const createFamilyGame = (game: Omit<FamilyGame, 'id' | 'createdAt'>) => {
    if (!family) return;

    const newGame: FamilyGame = {
      ...game,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };

    setFamily({
      ...family,
      familyGames: [...(family.familyGames || []), newGame],
    });
  };

  const endFamilyGame = (gameId: string) => {
    if (!family) return;

    const updatedGames = (family.familyGames || []).map(game =>
      game.id === gameId
        ? { ...game, status: 'completed' as const, endDate: new Date().toISOString() }
        : game
    );

    setFamily({
      ...family,
      familyGames: updatedGames,
    });
  };

  const updateFamilyGame = (gameId: string, updates: Partial<FamilyGame>) => {
    if (!family) return;

    const updatedGames = (family.familyGames || []).map(game =>
      game.id === gameId ? { ...game, ...updates } : game
    );

    setFamily({
      ...family,
      familyGames: updatedGames,
    });
  };

  const getUserRole = (game: FamilyGame): 'organiser' | 'player' | 'spectator' => {
    if (!currentMember) return 'spectator';
    if (game.organiserId === currentMember.id) return 'organiser';
    if (game.participants.includes(currentMember.id)) return 'player';
    return 'spectator';
  };

  const approveGameSuggestion = (gameId: string) => {
    if (!family || !currentMember) return;

    const updatedGames = (family.familyGames || []).map(game =>
      game.id === gameId
        ? { ...game, organiserId: currentMember.id, status: 'active' as const }
        : game
    );

    setFamily({
      ...family,
      familyGames: updatedGames,
    });
  };

  const rejectGameSuggestion = (gameId: string) => {
    if (!family) return;

    const updatedGames = (family.familyGames || []).filter(game => game.id !== gameId);

    setFamily({
      ...family,
      familyGames: updatedGames,
    });
  };

  const addPhotoProof = (proof: Omit<PhotoProof, 'id'>) => {
    if (!family) return;

    const newProof: PhotoProof = {
      ...proof,
      id: crypto.randomUUID(),
    };

    setFamily({
      ...family,
      photoProofs: [...(family.photoProofs || []), newProof],
    });
  };

  const updateGenieSettings = (settings: Partial<GenieSettings>) => {
    if (!family) return;

    const currentSettings = family.genieSettings || {
      voiceEnabled: true,
      pitch: 1,
      rate: 1,
      mood: 'funny' as const,
      currentGenieId: 'genie_default',
    };

    setFamily({
      ...family,
      genieSettings: { ...currentSettings, ...settings },
    });
  };

  const updateAppTheme = (theme: string) => {
    setAppTheme(theme);
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  };

  const updateGlobalGenieSettings = (settings: Partial<GenieSettings>) => {
    setGlobalGenieSettings({ ...globalGenieSettings, ...settings });
  };

  const addGenieCharacter = (character: Omit<GenieCharacter, 'id' | 'createdAt'>) => {
    const newCharacter: GenieCharacter = {
      ...character,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    setGenieCharacters([...genieCharacters, newCharacter]);
  };

  const updateGenieCharacter = (id: string, updates: Partial<GenieCharacter>) => {
    setGenieCharacters(genieCharacters.map(char =>
      char.id === id ? { ...char, ...updates } : char
    ));
  };

  const deleteGenieCharacter = (id: string) => {
    setGenieCharacters(genieCharacters.filter(char => char.id !== id));
  };

  const addGenieMessage = (message: Omit<GenieMessage, 'id' | 'createdAt'>) => {
    const newMessage: GenieMessage = {
      ...message,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    setGenieMessages([...genieMessages, newMessage]);
  };

  const updateGenieMessage = (id: string, updates: Partial<GenieMessage>) => {
    setGenieMessages(genieMessages.map(msg =>
      msg.id === id ? { ...msg, ...updates } : msg
    ));
  };

  const deleteGenieMessage = (id: string) => {
    setGenieMessages(genieMessages.filter(msg => msg.id !== id));
  };

  const logout = () => {
    setCurrentMember(null);
    setIsParent(false);
    setIsSuperAdmin(false);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  };

  return (
    <AppContext.Provider
      value={{
        family,
        currentMember,
        isParent,
        isSuperAdmin,
        availableGames,
        appTheme,
        genieCharacters,
        genieMessages,
        globalGenieSettings,
        createFamily,
        updateMembers,
        addTag,
        addMission,
        completeMission,
        loginMember,
        logout,
        parentLogin,
        superAdminLogin,
        addGame,
        purchaseGame,
        createFamilyGame,
        endFamilyGame,
        updateFamilyGame,
        getUserRole,
        approveGameSuggestion,
        rejectGameSuggestion,
        addPhotoProof,
        updateGenieSettings,
        updateAppTheme,
        addGenieCharacter,
        updateGenieCharacter,
        deleteGenieCharacter,
        addGenieMessage,
        updateGenieMessage,
        deleteGenieMessage,
        updateGlobalGenieSettings,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
