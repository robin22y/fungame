import { Member } from '../types';

export interface Badge {
  id: string;
  name: string;
  emoji: string;
  description: string;
}

export const AVAILABLE_BADGES: Badge[] = [
  {
    id: 'daily_streak_3',
    name: 'Daily Streak',
    emoji: '🔥',
    description: 'Complete 3 missions in a row',
  },
  {
    id: 'hero_10',
    name: 'Hero Badge',
    emoji: '🦸',
    description: 'Complete 10 total missions',
  },
  {
    id: 'champion_25',
    name: 'Champion',
    emoji: '🏆',
    description: 'Complete 25 total missions',
  },
  {
    id: 'legend_50',
    name: 'Legend',
    emoji: '⭐',
    description: 'Complete 50 total missions',
  },
  {
    id: 'wealthy_100',
    name: 'Wealthy',
    emoji: '💎',
    description: 'Earn 100 in cash',
  },
  {
    id: 'xp_master_500',
    name: 'XP Master',
    emoji: '🎯',
    description: 'Earn 500 total XP',
  },
];

export function checkAndAwardBadges(
  member: Member,
  completedMissionsCount: number,
  consecutiveDays: number
): { newBadges: string[]; messages: string[] } {
  const currentBadges = member.badges || [];
  const newBadges: string[] = [];
  const messages: string[] = [];

  if (consecutiveDays >= 3 && !currentBadges.includes('daily_streak_3')) {
    newBadges.push('daily_streak_3');
    messages.push('🔥 You earned the Daily Streak badge!');
  }

  if (completedMissionsCount >= 10 && !currentBadges.includes('hero_10')) {
    newBadges.push('hero_10');
    messages.push('🦸 You earned the Hero Badge!');
  }

  if (completedMissionsCount >= 25 && !currentBadges.includes('champion_25')) {
    newBadges.push('champion_25');
    messages.push('🏆 You earned the Champion badge!');
  }

  if (completedMissionsCount >= 50 && !currentBadges.includes('legend_50')) {
    newBadges.push('legend_50');
    messages.push('⭐ You earned the Legend badge!');
  }

  if (member.totalCash >= 100 && !currentBadges.includes('wealthy_100')) {
    newBadges.push('wealthy_100');
    messages.push('💎 You earned the Wealthy badge!');
  }

  if (member.totalXp >= 500 && !currentBadges.includes('xp_master_500')) {
    newBadges.push('xp_master_500');
    messages.push('🎯 You earned the XP Master badge!');
  }

  return { newBadges, messages };
}

export function getBadgeDetails(badgeId: string): Badge | undefined {
  return AVAILABLE_BADGES.find(b => b.id === badgeId);
}
