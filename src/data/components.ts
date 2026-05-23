export type TechRating = "A" | "B" | "C" | "D" | "E" | "F" | "X";

export type AvailabilityCode = `${string}-${string}-${string}`;

export type ComponentCategory =
  | "cockpit"
  | "lifeSupport"
  | "sensors"
  | "musculature"
  | "internalStructure"
  | "actuator"
  | "engine"
  | "gyro"
  | "jumpJet"
  | "masc"
  | "heatSink"
  | "powerAmplifier"
  | "track"
  | "armor";

export type CostFormula =
  | { type: "fixed"; amount: number }
  | { type: "unitTonnage"; multiplier: number }
  | { type: "engineRatingUnitTonnageDiv75"; multiplier: number }
  | { type: "gyroTonnage"; multiplier: number }
  | { type: "jumpJetsSquaredUnitTonnage"; multiplier: number }
  | { type: "heatSinksOverFreeFusionSinks"; multiplier: number; freeFusionSinks: number }
  | { type: "totalHeatSinks"; multiplier: number }
  | { type: "armorTonnage"; multiplier: number }
  | { type: "amplifierTonnage"; multiplier: number }
  | { type: "masc"; multiplier: number }
  | { type: "track"; multiplier: number };

export type ComponentDefinition = {
  id: string;
  name: string;
  altNames: string[];
  category: ComponentCategory;
  techRating: TechRating;
  availability: AvailabilityCode;
  cost: CostFormula;
  notes?: string[];
};

export type EngineType =
  | "Standard Fusion"
  | "Light Fusion"
  | "XL Fusion"
  | "Compact Fusion"
  | "Internal Combustion"
  | "Fuel Cell"
  | "Fission";

export type GyroType = "Standard" | "Compact" | "Heavy Duty" | "XL";

export type CockpitType =
  | "Standard"
  | "Small"
  | "Industrial"
  | "Industrial Advanced Fire Control";

export type ArmorType =
  | "Standard"
  | "Heavy Industrial"
  | "Ferro-Fibrous"
  | "Light Ferro-Fibrous"
  | "Heavy Ferro-Fibrous"
  | "Stealth"
  | "Commercial"
  | "Industrial";

export type InternalStructureType = "Standard" | "Endo-Steel" | "Industrial";

export const COMPONENTS = {
  // Cockpit / Control Systems
  standardCockpit: {
    id: "standardCockpit",
    name: "Standard Cockpit",
    altNames: ["Cockpit", "Standard"],
    category: "cockpit",
    techRating: "D",
    availability: "C-C-C",
    cost: { type: "fixed", amount: 200_000 },
  },
  smallCockpit: {
    id: "smallCockpit",
    name: "Small Cockpit",
    altNames: ["Small Cockpit", "Small"],
    category: "cockpit",
    techRating: "E",
    availability: "X-X-E",
    cost: { type: "fixed", amount: 175_000 },
  },
  industrialCockpitNoFireControl: {
    id: "industrialCockpitNoFireControl",
    name: "Industrial Cockpit (No Fire Control)",
    altNames: ["Industrial Cockpit", "Industrial (No Fire Control)", "No Fire Control"],
    category: "cockpit",
    techRating: "C",
    availability: "B-C-C",
    cost: { type: "fixed", amount: 100_000 },
  },
  industrialCockpitAdvancedFireControl: {
    id: "industrialCockpitAdvancedFireControl",
    name: "Industrial Cockpit (Advanced Fire Control)",
    altNames: ["Industrial Advanced Fire Control", "Industrial (Advanced Fire Control)", "Advanced Fire Control"],
    category: "cockpit",
    techRating: "D",
    availability: "D-E-E",
    cost: { type: "fixed", amount: 200_000 },
  },
  lifeSupport: {
    id: "lifeSupport",
    name: "Life Support",
    altNames: ["Life Support"],
    category: "lifeSupport",
    techRating: "C",
    availability: "C-C-C",
    cost: { type: "fixed", amount: 50_000 },
  },
  sensors: {
    id: "sensors",
    name: "Sensors",
    altNames: ["Sensors"],
    category: "sensors",
    techRating: "C",
    availability: "C-C-C",
    cost: { type: "unitTonnage", multiplier: 2_000 },
  },

  // Musculature / structure
  standardMusculature: {
    id: "standardMusculature",
    name: "Standard Musculature",
    altNames: ["Musculature", "Standard Myomer", "Standard Musculature"],
    category: "musculature",
    techRating: "D",
    availability: "C-C-C",
    cost: { type: "unitTonnage", multiplier: 2_000 },
  },
  tripleStrengthMyomer: {
    id: "tripleStrengthMyomer",
    name: "Triple-Strength Myomer",
    altNames: ["TSM", "Triple Strength Myomer", "Triple-Strength Myomer"],
    category: "musculature",
    techRating: "E",
    availability: "X-X-D",
    cost: { type: "unitTonnage", multiplier: 16_000 },
  },
  industrialTripleStrengthMyomer: {
    id: "industrialTripleStrengthMyomer",
    name: "Industrial Triple-Strength Myomer",
    altNames: ["Industrial TSM", "Industrial Triple Strength Myomer"],
    category: "musculature",
    techRating: "E",
    availability: "X-X-E",
    cost: { type: "unitTonnage", multiplier: 12_000 },
  },
  standardInternalStructure: {
    id: "standardInternalStructure",
    name: "Standard Internal Structure",
    altNames: ["Standard Structure", "Standard Internal Structure"],
    category: "internalStructure",
    techRating: "D",
    availability: "C-C-C",
    cost: { type: "unitTonnage", multiplier: 400 },
  },
  endoSteelInternalStructure: {
    id: "endoSteelInternalStructure",
    name: "Endo-Steel Internal Structure",
    altNames: ["Endo Steel", "Endo-Steel", "Endo-Steel Structure", "Endo Steel Structure"],
    category: "internalStructure",
    techRating: "E",
    availability: "D-F-E",
    cost: { type: "unitTonnage", multiplier: 1_600 },
  },
  industrialInternalStructure: {
    id: "industrialInternalStructure",
    name: "Industrial Internal Structure",
    altNames: ["Industrial Structure", "Industrial Internal Structure"],
    category: "internalStructure",
    techRating: "C",
    availability: "C-C-C",
    cost: { type: "unitTonnage", multiplier: 300 },
  },
  industrialEnvironmentalSealing: {
    id: "industrialEnvironmentalSealing",
    name: "Environmental Sealing (IndustrialMechs only)",
    altNames: ["Environmental Sealing", "Enviro. Sealing"],
    category: "internalStructure",
    techRating: "C",
    availability: "C-C-C",
    cost: { type: "unitTonnage", multiplier: 225 },
    notes: ["IndustrialMechs only."],
  },

  // Actuators
  upperArmActuator: {
    id: "upperArmActuator",
    name: "Upper Arm Actuator",
    altNames: ["Upper Arm Actuator"],
    category: "actuator",
    techRating: "C",
    availability: "C-C-C",
    cost: { type: "unitTonnage", multiplier: 100 },
  },
  lowerArmActuator: {
    id: "lowerArmActuator",
    name: "Lower Arm Actuator",
    altNames: ["Lower Arm Actuator"],
    category: "actuator",
    techRating: "C",
    availability: "C-C-C",
    cost: { type: "unitTonnage", multiplier: 50 },
  },
  handActuator: {
    id: "handActuator",
    name: "Hand Actuator",
    altNames: ["Hand Actuator"],
    category: "actuator",
    techRating: "C",
    availability: "C-C-C",
    cost: { type: "unitTonnage", multiplier: 80 },
  },
  upperLegActuator: {
    id: "upperLegActuator",
    name: "Upper Leg Actuator",
    altNames: ["Hip", "Upper Leg Actuator"],
    category: "actuator",
    techRating: "C",
    availability: "C-C-C",
    cost: { type: "unitTonnage", multiplier: 150 },
  },
  lowerLegActuator: {
    id: "lowerLegActuator",
    name: "Lower Leg Actuator",
    altNames: ["Lower Leg Actuator"],
    category: "actuator",
    techRating: "C",
    availability: "C-C-C",
    cost: { type: "unitTonnage", multiplier: 80 },
  },
  footActuator: {
    id: "footActuator",
    name: "Foot Actuator",
    altNames: ["Foot Actuator"],
    category: "actuator",
    techRating: "C",
    availability: "C-C-C",
    cost: { type: "unitTonnage", multiplier: 120 },
  },

  // Engines
  standardFusionEngine: {
    id: "standardFusionEngine",
    name: "Standard Fusion Engine",
    altNames: ["Fusion", "Standard Fusion", "Fusion Engine", "Standard Engine"],
    category: "engine",
    techRating: "D",
    availability: "C-E-D",
    cost: { type: "engineRatingUnitTonnageDiv75", multiplier: 5_000 },
  },
  lightFusionEngine: {
    id: "lightFusionEngine",
    name: "Light Fusion Engine",
    altNames: ["Light", "Light Fusion", "Light Engine"],
    category: "engine",
    techRating: "E",
    availability: "X-X-E",
    cost: { type: "engineRatingUnitTonnageDiv75", multiplier: 15_000 },
  },
  xlFusionEngine: {
    id: "xlFusionEngine",
    name: "XL Fusion Engine",
    altNames: ["XL", "XL Fusion", "Extra-Light", "Extralight", "XL Engine"],
    category: "engine",
    techRating: "E",
    availability: "D-F-E",
    cost: { type: "engineRatingUnitTonnageDiv75", multiplier: 20_000 },
  },
  compactFusionEngine: {
    id: "compactFusionEngine",
    name: "Compact Fusion Engine",
    altNames: ["Compact", "Compact Fusion", "Compact Engine"],
    category: "engine",
    techRating: "E",
    availability: "X-X-E",
    cost: { type: "engineRatingUnitTonnageDiv75", multiplier: 10_000 },
  },
  internalCombustionEngine: {
    id: "internalCombustionEngine",
    name: "Internal Combustion Engine",
    altNames: ["ICE", "Internal Combustion", "Combustion Engine"],
    category: "engine",
    techRating: "C",
    availability: "A-A-A",
    cost: { type: "engineRatingUnitTonnageDiv75", multiplier: 1_250 },
  },
  fuelCellEngine: {
    id: "fuelCellEngine",
    name: "Fuel Cell Engine",
    altNames: ["Fuel Cell"],
    category: "engine",
    techRating: "D",
    availability: "C-D-D",
    cost: { type: "engineRatingUnitTonnageDiv75", multiplier: 3_500 },
  },
  fissionEngine: {
    id: "fissionEngine",
    name: "Fission Engine",
    altNames: ["Fission"],
    category: "engine",
    techRating: "D",
    availability: "E-E-D",
    cost: { type: "engineRatingUnitTonnageDiv75", multiplier: 7_500 },
  },

  // Gyros
  standardGyro: {
    id: "standardGyro",
    name: "Standard Gyro",
    altNames: ["Gyro", "Standard Gyro"],
    category: "gyro",
    techRating: "D",
    availability: "C-C-C",
    cost: { type: "gyroTonnage", multiplier: 300_000 },
  },
  compactGyro: {
    id: "compactGyro",
    name: "Compact Gyro",
    altNames: ["Compact Gyro"],
    category: "gyro",
    techRating: "E",
    availability: "X-X-E",
    cost: { type: "gyroTonnage", multiplier: 400_000 },
  },
  heavyDutyGyro: {
    id: "heavyDutyGyro",
    name: "Heavy Duty Gyro",
    altNames: ["Heavy-Duty Gyro", "Heavy Duty Gyro"],
    category: "gyro",
    techRating: "E",
    availability: "X-X-E",
    cost: { type: "gyroTonnage", multiplier: 500_000 },
  },
  xlGyro: {
    id: "xlGyro",
    name: "XL Gyro",
    altNames: ["XL Gyro", "Extra-Light Gyro", "Extralight Gyro"],
    category: "gyro",
    techRating: "E",
    availability: "X-X-E",
    cost: { type: "gyroTonnage", multiplier: 750_000 },
  },

  // Movement / heat / armor
  standardJumpJet: {
    id: "standardJumpJet",
    name: "Standard Jump Jets",
    altNames: ["Jump Jet", "Jump Jets", "Standard Jump Jet", "Standard Jump Jets"],
    category: "jumpJet",
    techRating: "D",
    availability: "C-C-C",
    cost: { type: "jumpJetsSquaredUnitTonnage", multiplier: 200 },
  },
  improvedJumpJet: {
    id: "improvedJumpJet",
    name: "Improved Jump Jets",
    altNames: ["Improved Jump Jet", "Improved Jump Jets", "Improved JJ"],
    category: "jumpJet",
    techRating: "E",
    availability: "X-X-E",
    cost: { type: "jumpJetsSquaredUnitTonnage", multiplier: 500 },
  },
  masc: {
    id: "masc",
    name: "MASC",
    altNames: ["MASC", "Myomer Accelerator Signal Circuitry"],
    category: "masc",
    techRating: "E",
    availability: "D-F-E",
    cost: { type: "masc", multiplier: 1_000 },
  },
  standardSingleHeatSinkFusion: {
    id: "standardSingleHeatSinkFusion",
    name: "Standard Single Heat Sink with Fusion Engine",
    altNames: ["Single Heat Sink", "Standard Heat Sink", "Heat Sink"],
    category: "heatSink",
    techRating: "C",
    availability: "B-B-B",
    cost: { type: "heatSinksOverFreeFusionSinks", multiplier: 2_000, freeFusionSinks: 10 },
    notes: ["Only heat sinks over the 10 free fusion-engine heat sinks are charged."],
  },
  standardSingleHeatSinkNonFusion: {
    id: "standardSingleHeatSinkNonFusion",
    name: "Standard Single Heat Sink with Non-Fusion Engine",
    altNames: ["Single Heat Sink", "Standard Heat Sink", "Heat Sink"],
    category: "heatSink",
    techRating: "C",
    availability: "B-B-B",
    cost: { type: "totalHeatSinks", multiplier: 2_000 },
  },
  doubleHeatSink: {
    id: "doubleHeatSink",
    name: "Double Heat Sink",
    altNames: ["Double Heat Sink", "Double Heat Sinks", "DHS"],
    category: "heatSink",
    techRating: "E",
    availability: "C-E-D",
    cost: { type: "totalHeatSinks", multiplier: 6_000 },
  },
  powerAmplifier: {
    id: "powerAmplifier",
    name: "Power Amplifiers",
    altNames: ["Power Amplifier", "Power Amplifiers"],
    category: "powerAmplifier",
    techRating: "D",
    availability: "B-C-B",
    cost: { type: "amplifierTonnage", multiplier: 20_000 },
  },
  tracks: {
    id: "tracks",
    name: "Tracks",
    altNames: ["Tracks", "Track"],
    category: "track",
    techRating: "C",
    availability: "D-E-E",
    cost: { type: "track", multiplier: 500 },
  },

  // Armor
  standardArmor: {
    id: "standardArmor",
    name: "Standard Armor",
    altNames: ["Standard", "Standard Armor"],
    category: "armor",
    techRating: "D",
    availability: "C-C-C",
    cost: { type: "armorTonnage", multiplier: 10_000 },
  },
  heavyIndustrialArmor: {
    id: "heavyIndustrialArmor",
    name: "Heavy Industrial Armor",
    altNames: ["Heavy Industrial", "Heavy Industrial Armor"],
    category: "armor",
    techRating: "D",
    availability: "C-C-C",
    cost: { type: "armorTonnage", multiplier: 10_000 },
  },
  ferroFibrousArmor: {
    id: "ferroFibrousArmor",
    name: "Ferro-Fibrous Armor",
    altNames: ["Ferro-Fibrous", "Ferro Fibrous", "Ferro"],
    category: "armor",
    techRating: "E",
    availability: "D-F-D",
    cost: { type: "armorTonnage", multiplier: 20_000 },
  },
  lightFerroFibrousArmor: {
    id: "lightFerroFibrousArmor",
    name: "Light Ferro-Fibrous Armor",
    altNames: ["Light Ferro-Fibrous", "Light Ferro Fibrous"],
    category: "armor",
    techRating: "E",
    availability: "X-X-E",
    cost: { type: "armorTonnage", multiplier: 15_000 },
  },
  heavyFerroFibrousArmor: {
    id: "heavyFerroFibrousArmor",
    name: "Heavy Ferro-Fibrous Armor",
    altNames: ["Heavy Ferro-Fibrous", "Heavy Ferro Fibrous"],
    category: "armor",
    techRating: "E",
    availability: "X-X-E",
    cost: { type: "armorTonnage", multiplier: 25_000 },
  },
  stealthArmor: {
    id: "stealthArmor",
    name: "Stealth Armor",
    altNames: ["Stealth", "Stealth Armor"],
    category: "armor",
    techRating: "E",
    availability: "X-X-E",
    cost: { type: "armorTonnage", multiplier: 50_000 },
  },
  commercialArmor: {
    id: "commercialArmor",
    name: "Commercial Armor",
    altNames: ["Commercial", "Commercial Armor"],
    category: "armor",
    techRating: "B",
    availability: "B-B-A",
    cost: { type: "armorTonnage", multiplier: 3_000 },
  },
  industrialArmor: {
    id: "industrialArmor",
    name: "Industrial Armor",
    altNames: ["Industrial", "Industrial Armor"],
    category: "armor",
    techRating: "C",
    availability: "B-C-B",
    cost: { type: "armorTonnage", multiplier: 5_000 },
  },
} satisfies Record<string, ComponentDefinition>;

export type ComponentId = keyof typeof COMPONENTS;

export type ComponentCostContext = {
  unitTonnage: number;
  engineRating?: number;
  gyroTonnage?: number;
  jumpJetCount?: number;
  heatSinkCount?: number;
  armorTonnage?: number;
  amplifierTonnage?: number;
  mascTonnage?: number;
};

function requireNumber(value: number | undefined, field: string, componentId: string): number {
  if (typeof value !== "number" || Number.isNaN(value)) {
    throw new Error(`Missing ${field} for component cost calculation: ${componentId}`);
  }
  return value;
}

export function calculateComponentCost(
  component: ComponentDefinition,
  context: ComponentCostContext,
): number {
  const { cost } = component;

  switch (cost.type) {
    case "fixed":
      return cost.amount;

    case "unitTonnage":
      return cost.multiplier * context.unitTonnage;

    case "engineRatingUnitTonnageDiv75": {
      const engineRating = requireNumber(context.engineRating, "engineRating", component.id);
      return (cost.multiplier * engineRating * context.unitTonnage) / 75;
    }

    case "gyroTonnage": {
      const gyroTonnage = requireNumber(context.gyroTonnage, "gyroTonnage", component.id);
      return cost.multiplier * gyroTonnage;
    }

    case "jumpJetsSquaredUnitTonnage": {
      const jumpJetCount = requireNumber(context.jumpJetCount, "jumpJetCount", component.id);
      return cost.multiplier * Math.pow(jumpJetCount, 2) * context.unitTonnage;
    }

    case "heatSinksOverFreeFusionSinks": {
      const heatSinkCount = requireNumber(context.heatSinkCount, "heatSinkCount", component.id);
      return cost.multiplier * Math.max(0, heatSinkCount - cost.freeFusionSinks);
    }

    case "totalHeatSinks": {
      const heatSinkCount = requireNumber(context.heatSinkCount, "heatSinkCount", component.id);
      return cost.multiplier * heatSinkCount;
    }

    case "armorTonnage": {
      const armorTonnage = requireNumber(context.armorTonnage, "armorTonnage", component.id);
      return cost.multiplier * armorTonnage;
    }

    case "amplifierTonnage": {
      const amplifierTonnage = requireNumber(context.amplifierTonnage, "amplifierTonnage", component.id);
      return cost.multiplier * amplifierTonnage;
    }

    case "masc": {
      const engineRating = requireNumber(context.engineRating, "engineRating", component.id);
      const mascTonnage = requireNumber(context.mascTonnage, "mascTonnage", component.id);
      return cost.multiplier * engineRating * mascTonnage;
    }

    case "track": {
      const engineRating = requireNumber(context.engineRating, "engineRating", component.id);
      return (cost.multiplier * engineRating * context.unitTonnage) / 75;
    }

    default: {
      const exhaustiveCheck: never = cost;
      return exhaustiveCheck;
    }
  }
}

export function getEngineRating(unitTonnage: number, walkMP: number): number {
  return unitTonnage * walkMP;
}

export function isFusionEngineType(engineType: string): boolean {
  const normalized = engineType.toLowerCase();
  return normalized.includes("fusion") || normalized === "xl" || normalized === "light" || normalized === "compact";
}

export function resolveEngineComponentId(engineType: string): ComponentId {
  const normalized = engineType.toLowerCase().replace(/[\s_-]+/g, " ").trim();

  if (normalized.includes("internal combustion") || normalized === "ice") return "internalCombustionEngine";
  if (normalized.includes("fuel cell")) return "fuelCellEngine";
  if (normalized.includes("fission")) return "fissionEngine";
  if (normalized.includes("compact")) return "compactFusionEngine";
  if (normalized.includes("light") && !normalized.includes("extra")) return "lightFusionEngine";
  if (normalized.includes("xl") || normalized.includes("extra light") || normalized.includes("extralight")) return "xlFusionEngine";
  if (normalized.includes("fusion") || normalized === "standard" || normalized === "") return "standardFusionEngine";

  throw new Error(`Unknown engine type: ${engineType}`);
}

export function resolveGyroComponentId(gyroType: string): ComponentId {
  const normalized = gyroType.toLowerCase().replace(/[\s_-]+/g, " ").trim();

  if (normalized.includes("compact")) return "compactGyro";
  if (normalized.includes("heavy")) return "heavyDutyGyro";
  if (normalized.includes("xl") || normalized.includes("extra light") || normalized.includes("extralight")) return "xlGyro";
  if (normalized.includes("standard") || normalized === "gyro" || normalized === "") return "standardGyro";

  throw new Error(`Unknown gyro type: ${gyroType}`);
}

export function resolveCockpitComponentId(cockpitType: string): ComponentId {
  const normalized = cockpitType.toLowerCase().replace(/[\s_-]+/g, " ").trim();

  if (normalized.includes("small")) return "smallCockpit";
  if (normalized.includes("industrial") && normalized.includes("advanced")) return "industrialCockpitAdvancedFireControl";
  if (normalized.includes("industrial")) return "industrialCockpitNoFireControl";
  if (normalized.includes("standard") || normalized === "cockpit" || normalized === "") return "standardCockpit";

  throw new Error(`Unknown cockpit type: ${cockpitType}`);
}

export function resolveArmorComponentId(armorType: string): ComponentId {
  const normalized = armorType.toLowerCase().replace(/[\s_-]+/g, " ").trim();

  if (normalized.includes("heavy ferro")) return "heavyFerroFibrousArmor";
  if (normalized.includes("light ferro")) return "lightFerroFibrousArmor";
  if (normalized.includes("ferro")) return "ferroFibrousArmor";
  if (normalized.includes("stealth")) return "stealthArmor";
  if (normalized.includes("commercial")) return "commercialArmor";
  if (normalized.includes("heavy industrial")) return "heavyIndustrialArmor";
  if (normalized.includes("industrial")) return "industrialArmor";
  if (normalized.includes("standard") || normalized === "armor" || normalized === "") return "standardArmor";

  throw new Error(`Unknown armor type: ${armorType}`);
}

export function resolveInternalStructureComponentId(structureType: string): ComponentId {
  const normalized = structureType.toLowerCase().replace(/[\s_-]+/g, " ").trim();

  if (normalized.includes("endo")) return "endoSteelInternalStructure";
  if (normalized.includes("industrial")) return "industrialInternalStructure";
  if (normalized.includes("standard") || normalized.includes("structure") || normalized === "") return "standardInternalStructure";

  throw new Error(`Unknown internal structure type: ${structureType}`);
}

export function resolveHeatSinkComponentId(heatSinkType: string, engineType: string): ComponentId {
  const normalized = heatSinkType.toLowerCase().replace(/[\s_-]+/g, " ").trim();

  if (normalized.includes("double")) return "doubleHeatSink";
  if (isFusionEngineType(engineType)) return "standardSingleHeatSinkFusion";
  return "standardSingleHeatSinkNonFusion";
}
