import { Mission } from '../types';

export function getTodayString(): string {
  return new Date().toISOString().split('T')[0];
}

export function generateMysteryMission(availableMissions: Mission[]): Mission | null {
  const today = getTodayString();

  const eligibleMissions = availableMissions.filter(
    m => !m.completed && !m.isMystery
  );

  if (eligibleMissions.length === 0) return null;

  const randomIndex = Math.floor(Math.random() * eligibleMissions.length);
  const selectedMission = eligibleMissions[randomIndex];

  const mysteryMission: Mission = {
    ...selectedMission,
    id: `mystery_${selectedMission.id}_${today}`,
    isMystery: true,
    mysteryDate: today,
    xp: selectedMission.xp * 2,
    cash: selectedMission.cash * 2,
    taskName: `🔮 Mystery Mission: ${selectedMission.taskName}`,
  };

  return mysteryMission;
}

export function shouldGenerateNewMystery(currentMystery: Mission | null): boolean {
  const today = getTodayString();

  if (!currentMystery) return true;
  if (!currentMystery.isMystery) return true;
  if (currentMystery.mysteryDate !== today) return true;
  if (currentMystery.completed) return true;

  return false;
}

export function getMysteryMissionForToday(missions: Mission[]): Mission | null {
  const today = getTodayString();

  const existingMystery = missions.find(
    m => m.isMystery && m.mysteryDate === today && !m.completed
  );

  if (existingMystery) return existingMystery;

  return null;
}
