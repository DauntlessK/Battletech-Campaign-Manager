export type UnitType = "BattleMech" | "Vehicle" | "Infantry" | "Aerospace";

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
  type: UnitType;
  techBase: "Inner Sphere" | "Clan" | "Mixed";
  era: string;
  year: number;
  tonnage: number;
  weightClass: "Light" | "Medium" | "Heavy" | "Assault";
  costCBills: number;
  rulesLevel: "Introductory" | "Standard" | "Advanced" | "Experimental";
  walk: number;
  run: number;
  jump: number;
  heatSinks: number;
  armor: number;
  structure: number;
  offensiveBV: number;
  defensiveBV: number;
  totalBV: number;
  role: string;
  engine: string;
  gyro: string;
  cockpit: string;
  sourceFile?: string;
  weapons: UnitWeapon[];
  locations: UnitLocation[];
};

export type UnitListItem = Pick<
  Unit,
  | "id"
  | "name"
  | "model"
  | "chassis"
  | "type"
  | "techBase"
  | "era"
  | "year"
  | "tonnage"
  | "weightClass"
  | "costCBills"
  | "rulesLevel"
  | "totalBV"
  | "role"
>;