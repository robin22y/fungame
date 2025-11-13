export interface Member {
  id: string;
  nickname: string;
  pin: string;
  role: 'parent' | 'kid';
  totalXp: number;
  xpToday: number;
  totalCash: number;
  cashToday: number;
  level?: number;
  avatarEmoji?: string;
  badges?: string[];
  streak?: number;
}

export interface Tag {
  id: string;
  uid: string;
  qrCode: string;
  name?: string;
  message?: string;
  nextTagId?: string;
  nfcWritten?: boolean;
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
  gameId?: string;
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
  isMystery?: boolean;
  mysteryDate?: string;
  genieDialogMode?: 'preset' | 'custom';
  genieDialog?: string;
  mood?: 'funny' | 'encouraging' | 'wise' | 'excited';
  photoRequired?: boolean;
  category?: string;
  photoProofId?: string;
  parentMessage?: string;
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

export interface FamilyGame {
  id: string;
  title: string;
  organiserId: string | null;
  suggestedBy?: string;
  participants: string[];
  rules: string;
  missions: Mission[];
  startDate: string;
  endDate: string | null;
  status: 'active' | 'completed' | 'pending_approval';
  createdAt: string;
}

export interface GenieCharacter {
  id: string;
  name: string;
  emoji: string;
  imageUrl?: string;
  occasion: string;
  description: string;
  active: boolean;
  createdAt: string;
}

export interface GenieMessage {
  id: string;
  message: string;
  targetAudience: 'everyone' | 'parents' | 'kids';
  genieCharacterId: string;
  active: boolean;
  expiresAt?: string;
  createdAt: string;
}

export interface GenieSettings {
  voiceEnabled: boolean;
  pitch: number;
  rate: number;
  mood: 'funny' | 'encouraging' | 'wise' | 'excited';
  currentGenieId: string;
}

export interface PhotoProof {
  id: string;
  missionId: string;
  memberId: string;
  date: string;
  imageUrl: string;
}

export interface Family {
  id: string;
  name: string;
  email: string;
  password: string;
  currency: string;
  xpToCashRate: number;
  members: Member[];
  tags: Tag[];
  missions: Mission[];
  purchasedGames: PurchasedGame[];
  familyGames?: FamilyGame[];
  photoProofs?: PhotoProof[];
  genieSettings?: GenieSettings;
}

export interface AppContextType {
  family: Family | null;
  currentMember: Member | null;
  isParent: boolean;
  isSuperAdmin: boolean;
  availableGames: Game[];
  appTheme: string;
  genieCharacters: GenieCharacter[];
  genieMessages: GenieMessage[];
  globalGenieSettings: GenieSettings;
  createFamily: (email: string, password: string) => void;
  updateMembers: (members: Member[]) => void;
  addTag: (tag: Tag) => void;
  addMission: (mission: Mission) => void;
  completeMission: (missionId: string, memberId: string, checkpointIndex?: number) => void;
  loginMember: (memberId: string, pin: string) => boolean;
  logout: () => void;
  parentLogin: (email: string, password: string) => boolean;
  superAdminLogin: (password: string) => boolean;
  addGame: (game: Game) => void;
  purchaseGame: (gameId: string, memberId: string) => void;
  createFamilyGame: (game: Omit<FamilyGame, 'id' | 'createdAt'>) => void;
  endFamilyGame: (gameId: string) => void;
  updateFamilyGame: (gameId: string, updates: Partial<FamilyGame>) => void;
  getUserRole: (game: FamilyGame) => 'organiser' | 'player' | 'spectator';
  approveGameSuggestion: (gameId: string) => void;
  rejectGameSuggestion: (gameId: string) => void;
  addPhotoProof: (proof: Omit<PhotoProof, 'id'>) => void;
  updateGenieSettings: (settings: Partial<GenieSettings>) => void;
  updateAppTheme: (theme: string) => void;
  addGenieCharacter: (character: Omit<GenieCharacter, 'id' | 'createdAt'>) => void;
  updateGenieCharacter: (id: string, updates: Partial<GenieCharacter>) => void;
  deleteGenieCharacter: (id: string) => void;
  addGenieMessage: (message: Omit<GenieMessage, 'id' | 'createdAt'>) => void;
  updateGenieMessage: (id: string, updates: Partial<GenieMessage>) => void;
  deleteGenieMessage: (id: string) => void;
  updateGlobalGenieSettings: (settings: Partial<GenieSettings>) => void;
}
