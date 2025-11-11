import React, { createContext, useContext, useState, useEffect } from 'react';
import { Family, Member, Tag, Mission, Game, PurchasedGame, AppContextType } from '../types';
import { generateFamilyName, getTodayString } from '../utils/helpers';

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY = 'family_task_game';
const GAMES_STORAGE_KEY = 'tappy_games_store';
const AUTH_STORAGE_KEY = 'tappy_auth_state';
const SUPER_ADMIN_PASSWORD = 'tappyadmin123';

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [family, setFamily] = useState<Family | null>(null);
  const [currentMember, setCurrentMember] = useState<Member | null>(null);
  const [isParent, setIsParent] = useState(false);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [availableGames, setAvailableGames] = useState<Game[]>([]);

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

  const createFamily = (email: string) => {
    const newFamily: Family = {
      id: crypto.randomUUID(),
      name: generateFamilyName(),
      email,
      currency: '£',
      xpToCashRate: 10,
      members: [],
      tags: [],
      missions: [],
      purchasedGames: [],
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
            return {
              ...m,
              totalXp: m.totalXp + mission.xp,
              xpToday: m.xpToday + mission.xp,
              totalCash: m.totalCash + mission.cash,
              cashToday: m.cashToday + mission.cash,
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

  const parentLogin = (email: string): boolean => {
    if (family && family.email === email) {
      setIsParent(true);
      setCurrentMember(null);
      setIsSuperAdmin(false);
      return true;
    }
    return false;
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
