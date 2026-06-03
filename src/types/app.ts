export type PageKey =
  | "landing"
  | "about"
  | "faq"
  | "campaignTypes"
  | "guide"
  | "units"
  | "myForces"
  | "myCampaigns"
  | "battles"
  | "myAccount";

export type UnitType =
  | "BattleMech"
  | "Vehicle"
  | "Infantry"
  | "Aerospace"
  | string;
export type BattleStatus = "Proposed" | "Confirmed" | "Disputed" | "Finalized";

export type Battle = {
  id: string;
  campaignId: string;
  turnNumber?: number;
  date: string;
  location?: string;
  status: BattleStatus;
  submittedByUserId: string;
  defendingUserId?: string;
  winnerUserId?: string;
  attackerForceId?: string;
  defenderForceId?: string;
  attackerScore?: number;
  defenderScore?: number;
  summary?: string;
  confirmedAt?: string;
  createdAt: string;
  updatedAt: string;
};

export type UnitPanelMode = "slots" | "weapons" | "details";
export type SortMode = "name" | "tonnage" | "bv" | "cost";

export type CriticalSlot = {
  slot: number;
  item: string;
  type?: "weapon" | "ammo" | "equipment" | "engine" | "structure" | "empty";
};

export type UnitLocation = {
  id: string;
  name: string;
  armor: number;
  rearArmor?: number;
  structure: number;
  slots: CriticalSlot[];
};

export type UnitJsonWarning =
  | string
  | {
      severity?: string;
      code?: string;
      field?: string;
      message?: string;
    };

export type UnitWeapon = {
  id: string;
  name: string;
  location: string;
  damage: number | string;
  heat: number;
  range: string;
  slots: number;
  ammo?: string;
  shots: number | "∞";
};

export type Unit = {
  id: string;
  name: string;
  model: string;
  chassis: string;
  unitType?: string;
  type: UnitType;
  techBase: "Inner Sphere" | "Clan" | "Mixed" | "Unknown" | string;
  era: string;
  year: number;
  tonnage: number;
  weightClass: "Light" | "Medium" | "Heavy" | "Assault" | string;
  costCBills: number;
  rulesLevel:
    | "Introductory"
    | "Standard"
    | "Advanced"
    | "Experimental"
    | "Unknown"
    | string;
  walk: number;
  run: number;
  jump: number;
  heatSinks: number;
  heatSinkType?: string;
  armor?: number;
  structure?: number;
  offensiveBV?: number;
  defensiveBV?: number;
  totalBV: number;
  bv?: number;
  role: string;
  engine: string;
  engineRating?: string | number;
  engineType?: string;
  gyro: string;
  cockpit?: string;
  sourceFile?: string;
  fileName?: string;
  relativePath?: string;
  detailSource?: "json" | "mtf" | string;
  mulId?: string | number;
  sourceBook?: string;
  overview?: string;
  capabilities?: string;
  deployment?: string;
  history?: string;
  quirks?: string[];
  manufacturer?: string;
  factory?: string;
  primaryFactory?: string;
  systemManufacturers?: Record<string, string>;
  myomer?: string;
  armorType?: string;
  structureType?: string;
  weapons?: UnitWeapon[];
  locations?: UnitLocation[];
  warnings?: UnitJsonWarning[];
};

export type User = {
  id: string;
  email: string;
  displayName: string;
  friendCode: string;
  role: string;
  status: string;
  authProvider: string;
  createdAt: string;
  updatedAt: string;
};

export type CampaignType = "Chaos" | "Advanced" | "Conquest" | string;
export type CampaignStatus =
  | "Setup"
  | "Active"
  | "Paused"
  | "Completed"
  | "Archived"
  | string;
export type ObjectiveControlType = "Binary" | "Percentage" | string;
export type ResourceBalance = Partial<
  Record<"CBills" | "Warchest" | "Time" | string, number>
>;


export type VictoryConditions = {
  totalBattlesEnabled?: boolean;
  totalBattles?: number;
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

export type CampaignObjective = {
  id: string;
  name: string;
  type: CampaignObjectiveType;
  isKey?: boolean;
};

export type CampaignFluff = {
  year?: number;
  planet?: string;
  conflictDescription?: string;
};

export type CampaignSettings = {
  type: CampaignType;
  era: string;
  rulesLevel: string;
  forceBVLimit: number;
  maxPlayers?: number;
  maxTurnsAhead?: number;
  maxTurns?: number;
  combatTeamRules?: boolean;
  combatTeamCount?: number;
  combatTeamBVLimit?: number;
  combatTeamSize?: number;
  objectiveControlType?: ObjectiveControlType;
  salariesEnabled?: boolean;
  startingResources?: ResourceBalance;
  victoryConditions?: VictoryConditions;
  objectives?: CampaignObjective[];
  fluff?: CampaignFluff;
};


export type FriendSummary = {
  id: string;
  friendUserId: string;
  displayName: string;
  friendCode: string;
  createdAt?: string;
};

export type FriendRequestSummary = {
  id: string;
  requesterId: string;
  recipientId: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  respondedAt?: string;
  requester?: {
    id: string;
    displayName: string;
    friendCode: string;
  };
  recipient?: {
    id: string;
    displayName: string;
    friendCode: string;
  };
};

export type CampaignParticipantSummary = {
  id: string;
  campaignId: string;
  userId: string;
  role: string;
  status: string;
  invitedById?: string;
  invitedAt: string;
  joinedAt?: string;
  leftAt?: string;
  forceId?: string;
  color?: string;
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

export type Campaign = {
  id: string;
  name: string;
  description?: string;
  ownerId: string;
  status?: CampaignStatus;
  settings?: CampaignSettings;
  createdAt?: string;
  updatedAt?: string;
  startDate?: string;
  finishDate?: string;
  assignedForceId?: string;
  participants?: CampaignParticipantSummary[];
};

export type ForceUnit = {
  id: string;
  forceId: string;
  baseUnitId: string;
  snapshot?: {
    id: string;
    name: string;
    model: string;
    chassis: string;
    type?: string;
    techBase?: string;
    era?: string;
    year?: number;
    tonnage?: number;
    weightClass?: string;
    totalBV?: number;
    role?: string;
  };
  currentBV: number;
  status?: string;
  kills?: number;
  isDestroyed?: boolean;
  teamNumber?: number;
  sortOrder?: number;
  pilot?: {
    name?: string;
    gunnery: number;
    piloting: number;
  };
};

export type Force = {
  id: string;
  name: string;
  ownerId: string;
  description?: string;
  era?: string;
  rulesLevel?: string;
  totalBV?: number;
  startingBV?: number;
  currencyCBills?: number;
  faction?: string;
  forConquest?: boolean;
  combatTeamCount?: number;
  combatTeamBV?: number;
  unitIds?: string[];
  forceUnits?: ForceUnit[];
  createdAt?: string;
  updatedAt?: string;
  campaignId?: string;
  originalForceId?: string;
  origin?: string;
  status?: string;
};

export type PendingInvite = {
  participant: {
    id: string;
    campaignId: string;
    userId: string;
    role: string;
    status: string;
    invitedById: string;
    invitedAt: string;
  };
  campaign: {
    id: string;
    name?: string;
    description?: string;
    ownerId?: string;
    status?: string;
    settings?: CampaignSettings;
  };
  inviter?: {
    id: string;
    displayName: string;
    friendCode: string;
  };
};

export type NotificationItem = {
  id: string;
  type: string;
  payload: Record<string, any>;
  read: boolean;
  createdAt: string;
};

export type AuthMode = "login" | "register";
