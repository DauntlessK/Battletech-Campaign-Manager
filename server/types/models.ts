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
  currentTurn?: number;
  combatTeamRules?: boolean;
  combatTeamCount?: number;
  combatTeamBVLimit?: number;
  combatTeamSize?: number;
  objectiveControlType?: ObjectiveControlType;
  salariesEnabled?: boolean;
  startingResources?: ResourceBalance;
  turnLengthDays?: number;
  technicians?: number;
  unitsPerTechnician?: number;
  repairEstimateMultiplier?: number;
  techTeamExperience?: "Green" | "Regular" | "Veteran" | "Elite";
  workDayMinutes?: number;
  victoryConditions?: VictoryConditions;
  objectives?: CampaignSetupObjective[];
  planetaryControl?: Array<{ userId: string; percentage: number }>;
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
  turnNumber?: number;
  planetaryControl?: Array<{ userId: string; percentage: number }>;
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
  currentTurn?: number;
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
  startingUnitCount?: number;
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
  | "Ready"
  | "Damaged"
  | "Crippled"
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
  // Hydrated API-only fields. Persist pilot state in pilots.json and current damage in the damage collections.
  pilot?: PilotSummary | null;
  currentDamage?: CampaignUnitDamageOverlay | null;
  damageOverlay?: CampaignUnitDamageOverlay | null;
};

export type PilotStatus = "Assigned" | "Unassigned" | "Wounded" | "Captured" | "Missing" | "Killed";

export type Pilot = {
  id: string;
  ownerId: string;
  campaignId?: string;
  forceId?: string;
  assignedUnitId?: string;
  status: PilotStatus;
  name?: string;
  gunnery: number;
  piloting: number;
  wounds?: number;
  kills?: number;
  experience?: number;
  isAlive?: boolean;
  isCaptured?: boolean;
  createdAt: string;
  updatedAt: string;
};

export type PilotSummary = {
  id?: string;
  name?: string;
  gunnery: number;
  piloting: number;
  wounds?: number;
  dead?: boolean;
  status?: PilotStatus;
};

export type BattleStatus =
  | "Proposed"
  | "AwaitingOpponent"
  | "Confirmed"
  | "Disputed"
  | "Complete"
  | "Finalized";

export type BattleOutcome = "Victory" | "Defeat" | "Draw" | string;

export type RepairComplexity = "Simple" | "Intermediate" | "Difficult" | "Impossible";

export type CampaignUnitDamageOverlay = {
  campaignForceUnitId: string;
  participated?: boolean;
  unitName?: string;
  pilotName?: string;
  pilotDamage?: number | "KIA";
  killsMade?: number;
  status?: string;
  currentBV?: number;
  recalculatedBV?: number;
  repairComplexity?: RepairComplexity;
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
    condition: "ready" | "damaged" | "crippled" | "destroyed";
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


export type ForceUnitDamage = {
  id: string;
  campaignId?: string;
  forceId: string;
  forceUnitId: string;
  status?: string;
  repairComplexity?: RepairComplexity;
  armorDamageTotal?: number;
  rearArmorDamageTotal?: number;
  structureDamageTotal?: number;
  engineHits?: number;
  gyroHits?: number;
  ammoSpentTotal?: number;
  limbs?: number;
  weapons?: number;
  components?: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
};

export type ForceUnitLocationDamage = {
  id: string;
  unitDamageId: string;
  forceUnitId: string;
  locationId: string;
  locationName?: string;
  armorDamage?: number;
  rearArmorDamage?: number;
  structureDamage?: number;
  isMissing?: boolean;
  isDestroyed?: boolean;
  damagedSlots?: number[];
  destroyedSlots?: number[];
};

export type ForceUnitEquipmentDamage = {
  id: string;
  unitDamageId: string;
  forceUnitId: string;
  locationId?: string;
  slotNumber?: number;
  equipmentId?: string;
  equipmentName?: string;
  condition: "Damaged" | "Destroyed" | "Missing";
  techRating?: string;
  availabilityRating?: string;
  repairRoll?: number;
  disposition?: "Repair" | "Replace";
  replacementCostCBills?: number;
};

export type RepairOrder = {
  id: string;
  campaignId?: string;
  forceId: string;
  forceUnitId: string;
  unitDamageId: string;
  category: "Armor" | "Internal Structure" | "Equipment" | "Limb" | "Location Assembly" | "Ammunition";
  locationId?: string;
  slotNumber?: number;
  itemId?: string;
  itemName: string;
  quantity: number;
  action: "Repair" | "Replace" | "Rearm";
  repairRoll?: number;
  techRating?: string;
  availabilityRating?: string;
  replacementCostCBills?: number;
  status: "Pending" | "Failed" | "Ordered" | "Awaiting Delivery" | "Delivered" | "In Progress" | "Complete" | "Cancelled";
  requisitionStatus?: "Needs Order" | "Failed" | "Awaiting Delivery" | "Delivered";
  deliveryTurnsRemaining?: number;
  stockRoll?: number;
  stockTarget?: number;
  inStock?: boolean;
  repairTimeMinutes?: number;
  estimatedWorkDays?: number;
  createdAt: string;
  updatedAt: string;
};

export type ForceUnitAmmoState = {
  id: string;
  forceUnitId: string;
  unitDamageId?: string;
  ammoTypeId: string;
  shotsSpent: number;
  shotsRemaining?: number;
  tonsRequired?: number;
  updatedAt: string;
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
  validationIssues?: string[];
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


export type UnassignedPilot = {
  id: string;
  campaignId: string;
  userId: string;
  originalForceId: string;
  sourceForceUnitId: string;
  name?: string;
  gunnery: number;
  piloting: number;
  wounds?: number;
  status: "Available" | "Wounded";
  createdAt: string;
};


export type SystemSettings = {
  id: "global";
  repairEstimateMultiplier: number;
  unitsPerTechnician: number;
  defaultTurnLengthDays: number;
  workDayMinutes: number;
  requisitionsPerTurn: number;
  techExperience: "Green" | "Regular" | "Veteran" | "Elite";
  updatedAt?: string;
};
export type StoreData = {
  users: UserAccount[];
  campaigns: Campaign[];
  campaignParticipants: CampaignParticipant[];
  forces: Force[];
  forceUnits: ForceUnit[];
  pilots?: Pilot[];
  unitDamage?: ForceUnitDamage[];
  unitLocationDamage?: ForceUnitLocationDamage[];
  unitEquipmentDamage?: ForceUnitEquipmentDamage[];
  unitAmmoState?: ForceUnitAmmoState[];
  repairOrders?: RepairOrder[];
  battles: Battle[];
  objectives: Objective[];
  resourceAccounts: ResourceAccount[];
  resourceTransactions: ResourceTransaction[];
  authTokens: AuthToken[];
  notifications?: Notification[];
  friendRequests?: FriendRequest[];
  unassignedPilots?: UnassignedPilot[];
  systemSettings?: SystemSettings[];
};
