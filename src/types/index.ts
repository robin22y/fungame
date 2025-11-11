export interface Member {
  id: string;
  nickname: string;
  pin: string;
  totalXp: number;
  xpToday: number;
  totalCash: number;
  cashToday: number;
}

export interface Tag {
  id: string;
  uid: string;
  qrCode: string;
  name?: string;
  message?: string;
  nextTagId?: string;
}

export interface PokerOffer {
  condition: string;
  bonusXp: number;
  bonusCash: number;
}

export interface MissionCheckpoint {
  tagId: string;
  order: number;
  completed: boolean;
}

export interface Mission {
  id: string;
  tagId: string;
  taskName: string;
  emoji: string;
  xp: number;
  cash: number;
  assignedTo: string;
  completed: boolean;
  completedBy?: string;
  completedAt?: string;
  pokerOffer?: PokerOffer;
  checkpoints?: MissionCheckpoint[];
  currentCheckpoint?: number;
}

export interface Game {
  id: string;
  name: string;
  description: string;
  emoji: string;
  price: number;
  imageUrl?: string;
  category: string;
  createdAt: string;
}

export interface PurchasedGame {
  gameId: string;
  purchasedAt: string;
  purchasedBy: string;
}

export interface Family {
  id: string;
  name: string;
  email: string;
  currency: string;
  xpToCashRate: number;
  members: Member[];
  tags: Tag[];
  missions: Mission[];
  purchasedGames: PurchasedGame[];
}

export interface AppContextType {
  family: Family | null;
  currentMember: Member | null;
  isParent: boolean;
  isSuperAdmin: boolean;
  availableGames: Game[];
  createFamily: (email: string) => void;
  updateMembers: (members: Member[]) => void;
  addTag: (tag: Tag) => void;
  addMission: (mission: Mission) => void;
  completeMission: (missionId: string, memberId: string, checkpointIndex?: number) => void;
  loginMember: (memberId: string, pin: string) => boolean;
  logout: () => void;
  parentLogin: (email: string) => boolean;
  superAdminLogin: (password: string) => boolean;
  addGame: (game: Game) => void;
  purchaseGame: (gameId: string, memberId: string) => void;
}
