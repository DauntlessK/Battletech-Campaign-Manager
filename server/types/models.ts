export type UserRole = "player" | "admin";
export type AccountStatus = "active" | "disabled" | "pending";
export type AuthProvider = "local";

export type UserAccount = {
  id: string;
  email: string;
  displayName: string;
  friendCode: string;
  passwordHash: string;
  role: UserRole;
  status: AccountStatus;
  authProvider: AuthProvider;
  createdAt: string;
  updatedAt: string;
};

export type CampaignType = "Chaos" | "Advanced" | "Conquest";
export type CampaignStatus =
  | "Setup"
  | "Active"
  | "Paused"
  | "Completed"
  | "Archived";
export type ObjectiveControlType = "Binary" | "Percentage";

export type VictoryConditions = {
  capitulationBVEnabled?: boolean;
  capitulationBVPercent?: number;
  capitulationResourcesEnabled?: boolean;
  capitulationResourcesPercent?: number;
  dominationEnabled?: boolean;
  dominationControlPercent?: number;
  keyObjectivesEnabled?: boolean;
  turnsElapsedEnabled?: boolean;
  turnsElapsed?: number;
  mapControlEnabled?: boolean;
  mapControlPercent?: number;
};

export type CampaignObjectiveType =
  | "Factory"
  | "Depot"
  | "Comms Array"
  | "Small City"
  | "Large City"
  | "Fort Holding"
  | "Repair Facility"
  | "Space Port"
  | "Medical Facility"
  | string;

export type CampaignSetupObjective = {
  id: string;
  name: string;
  type: CampaignObjectiveType;
  isKey?: boolean;
  currentControl?: Array<{ userId: string; percentage: number }>;
};

export type CampaignFluff = {
  year?: number;
  planet?: string;
  conflictDescription?: string;
};

export type CampaignSettings = {
  type: CampaignType;
  era:
    | "Star League"
    | "Succession Wars"
    | "Clan Invasion"
    | "Civil War"
    | "Jihad"
    | "Republic"
    | "Dark Age"
    | "IlClan"
    | string;
  rulesLevel:
    | "Introductory"
    | "Standard"
    | "Advanced"
    | "Experimental"
    | "Unofficial"
    | string;
  forceBVLimit: number;
  maxPlayers?: number;
  maxTurns?: number;
  maxTurnsAhead?: number;
  combatTeamRules?: boolean;
  combatTeamCount?: number;
  combatTeamBVLimit?: number;
  combatTeamSize?: number;
  objectiveControlType?: ObjectiveControlType;
  salariesEnabled?: boolean;
  startingResources?: ResourceBalance;
  victoryConditions?: VictoryConditions;
  objectives?: CampaignSetupObjective[];
  fluff?: CampaignFluff;
};

export type Campaign = {
  id: string;
  ownerId: string;
  name: string;
  description?: string;
  status: CampaignStatus;
  settings: CampaignSettings;
  createdAt: string;
  updatedAt: string;
  startDate?: string;
  finishDate?: string;
  assignedForceId?: string;
  participants?: CampaignParticipantSummary[];
};

export type MembershipStatus = "Pending" | "Accepted" | "Declined" | "Removed";
export type CampaignParticipantRole = "Owner" | "Participant" | "Spectator";

export type CampaignParticipant = {
  id: string;
  campaignId: string;
  userId: string;
  role: CampaignParticipantRole;
  status: MembershipStatus;
  invitedById?: string;
  invitedAt: string;
  joinedAt?: string;
  leftAt?: string;
  forceId?: string;
  color?: string;
};

export type CampaignParticipantSummary = CampaignParticipant & {
  user?: {
    id: string;
    displayName: string;
    friendCode: string;
  };
  force?: {
    id: string;
    name: string;
    totalBV?: number;
    startingBV?: number;
    faction?: string;
  };
};

export type ForceStatus = "Active" | "Archived" | "Assigned" | "Deleted";
export type ForceOrigin = "UserCreated" | "CampaignCopy";

export type Force = {
  id: string;
  ownerId: string;
  name: string;
  description?: string;
  era?: CampaignSettings["era"];
  rulesLevel?: CampaignSettings["rulesLevel"];
  totalBV?: number;
  startingBV?: number;
  currencyCBills?: number;
  faction?: string;
  forConquest?: boolean;
  combatTeamCount?: number;
  combatTeamBV?: number;
  unitIds: string[];
  createdAt: string;
  updatedAt: string;
  campaignId?: string;
  originalForceId?: string;
  origin: ForceOrigin;
  status: ForceStatus;
  forceUnits?: ForceUnit[];
};

export type UnitType = "BattleMech" | "Vehicle" | "Infantry" | "Aerospace";
export type UnitStatus =
  | "Available"
  | "Destroyed"
  | "InRepair"
  | "Reserved"
  | "Unavailable";

export type CampaignUnitSnapshot = {
  id: string;
  name: string;
  model: string;
  chassis: string;
  type: UnitType;
  techBase: string;
  era: string;
  year: number;
  tonnage: number;
  weightClass: string;
  totalBV: number;
  role: string;
  weapons: {
    name: string;
    damage: number | string;
    heat: number;
    location: string;
    ammo?: string;
    shots: number | "∞";
  }[];
  locations: {
    id: string;
    name: string;
    armor: number;
    rearArmor?: number;
    structure: number;
    slots: {
      slot: number;
      item: string;
      type?: string;
    }[];
  }[];
};

export type ForceUnit = {
  id: string;
  forceId: string;
  baseUnitId: string;
  snapshot: CampaignUnitSnapshot;
  currentBV: number;
  status: UnitStatus;
  kills: number;
  damageDescription?: string;
  isDestroyed: boolean;
  assignedPilotId?: string;
  teamNumber?: number;
  sortOrder?: number;
  pilot?: {
    name?: string;
    gunnery: number;
    piloting: number;
  };
};

export type BattleStatus =
  | "Proposed"
  | "AwaitingOpponent"
  | "Confirmed"
  | "Disputed"
  | "Complete"
  | "Finalized";

export type BattleOutcome = "Victory" | "Defeat" | "Draw" | string;

export type CampaignUnitDamageOverlay = {
  campaignForceUnitId: string;
  participated?: boolean;
  unitName?: string;
  pilotName?: string;
  pilotDamage?: number | "KIA";
  killsMade?: number;
  status?: string;
  damageSummary?: {
    armor: number;
    internal: number;
    weapons: number;
    components: number;
    engineHits: number;
    gyroHits: number;
    ammo: number;
    limbs: number;
  };
  chaos?: {
    condition: "ready" | "damaged" | "destroyed";
  };
  detailed?: {
    locations: Record<
      string,
      {
        armorDamage?: number;
        rearArmorDamage?: number;
        structureDamage?: number;
        missing?: boolean;
        destroyed?: boolean;
        damagedSlots?: number[];
        destroyedSlots?: number[];
      }
    >;
    ammoSpent?: Record<string, number>;
    ammoConfirmed?: boolean;
    destroyedEquipmentIds?: string[];
    damagedEquipmentIds?: string[];
    notes?: string;
  };
};

export type BattleLogEntry = {
  id: string;
  userId: string;
  date?: string;
  campaignForceId?: string;
  opponentUserId?: string;
  objectiveId?: string;
  objectiveName?: string;
  outcome?: BattleOutcome;
  controlsField?: boolean;
  unitDamage?: CampaignUnitDamageOverlay[];
  summary?: string;
  submittedAt: string;
};

export type Battle = {
  id: string;
  campaignId: string;
  turnNumber?: number;
  date: string;
  location?: string;
  objectiveId?: string;
  objectiveName?: string;
  status: BattleStatus;
  submittedByUserId: string;
  defendingUserId?: string;
  opponentUserId?: string;
  winnerUserId?: string;
  attackerForceId?: string;
  defenderForceId?: string;
  attackerScore?: number;
  defenderScore?: number;
  outcome?: BattleOutcome;
  controlsField?: boolean;
  summary?: string;
  battleLogs?: BattleLogEntry[];
  controlChangePercent?: number;
  controlSwingBreakdown?: Record<string, number | string | boolean>;
  disputeNotes?: Array<{
    userId: string;
    notes: string;
    submittedAt: string;
  }>;
  confirmedAt?: string;
  createdAt: string;
  updatedAt: string;
};

export type ObjectiveType =
  | "Factory"
  | "Depot"
  | "City"
  | "Fort"
  | "Medical"
  | "Comms"
  | "Spaceport"
  | "Custom";

export type ObjectiveControl = {
  userId: string;
  percentage: number;
};

export type Objective = {
  id: string;
  campaignId: string;
  name: string;
  description?: string;
  type: ObjectiveType;
  controlType: ObjectiveControlType;
  currentOwnerId?: string;
  currentControl?: ObjectiveControl[];
  bonusDescription?: string;
  createdAt: string;
  updatedAt: string;
};

export type ResourceType =
  | "CBills"
  | "RepairPoints"
  | "Warchest"
  | "Time"
  | "Salvage";
export type ResourceBalance = Partial<Record<ResourceType, number>>;

export type ResourceTransaction = {
  id: string;
  campaignId: string;
  userId: string;
  type: ResourceType;
  amount: number;
  reason: string;
  createdAt: string;
};

export type ResourceAccount = {
  id: string;
  campaignId: string;
  userId: string;
  balances: ResourceBalance;
  lastUpdatedAt: string;
};

export type AuthToken = {
  id: string;
  token: string;
  userId: string;
  createdAt: string;
  expiresAt: string;
};

export type Notification = {
  id: string;
  userId: string; // recipient
  type: string;
  payload?: Record<string, any>;
  read?: boolean;
  createdAt: string;
};

export type FriendRequestStatus =
  | "Pending"
  | "Accepted"
  | "Declined"
  | "Cancelled";

export type FriendRequest = {
  id: string;
  requesterId: string;
  recipientId: string;
  status: FriendRequestStatus;
  createdAt: string;
  updatedAt: string;
  respondedAt?: string;
};

export type StoreData = {
  users: UserAccount[];
  campaigns: Campaign[];
  campaignParticipants: CampaignParticipant[];
  forces: Force[];
  forceUnits: ForceUnit[];
  battles: Battle[];
  objectives: Objective[];
  resourceAccounts: ResourceAccount[];
  resourceTransactions: ResourceTransaction[];
  authTokens: AuthToken[];
  notifications?: Notification[];
  friendRequests?: FriendRequest[];
};
