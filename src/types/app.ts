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

export type UnitType = "BattleMech" | "Vehicle" | "Infantry" | "Aerospace" | string;
export type BattleStatus = "Proposed" | "Confirmed" | "Disputed" | "Finalized";
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
  rulesLevel: "Introductory" | "Standard" | "Advanced" | "Experimental" | "Unknown" | string;
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
  myomer?: string;
  armorType?: string;
  structureType?: string;
  weapons?: UnitWeapon[];
  locations?: UnitLocation[];
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

export type Campaign = {
  id: string;
  name: string;
  description?: string;
  ownerId: string;
  status?: string;
  settings?: Record<string, unknown>;
  createdAt?: string;
  updatedAt?: string;
};

export type Force = {
  id: string;
  name: string;
  ownerId: string;
  description?: string;
  era?: string;
  rulesLevel?: string;
  totalBV?: number;
  currencyCBills?: number;
  faction?: string;
  forConquest?: boolean;
  combatTeamCount?: number;
  combatTeamBV?: number;
  unitIds?: string[];
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
    name: string;
    ownerId: string;
    status?: string;
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
