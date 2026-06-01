export type TechRating = "A" | "B" | "C" | "D" | "E" | "F" | "X";

export type AvailabilityByEra = {
  starLeague: string;
  successionWars: string;
  clanInvasion: string;
  darkAge?: string;
};


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
  | "armor"
  | "weaponEnhancement"
  | "flightEquipment";

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
  availability: AvailabilityByEra;
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

export type InternalStructureType = "Standard" | "Endo-Steel" | "Endo-Composite" | "Industrial";

export const COMPONENTS = {
  // Cockpit / Control Systems
  standardCockpit: {
    id: "standardCockpit",
    name: "Standard Cockpit",
    altNames: ["Cockpit", "Standard"],
    category: "cockpit",
    techRating: "D",
    availability: {
      starLeague: "C",
      successionWars: "C",
      clanInvasion: "C",
    },
    cost: { type: "fixed", amount: 200_000 },
  },
  smallCockpit: {
    id: "smallCockpit",
    name: "Small Cockpit",
    altNames: ["Small Cockpit", "Small"],
    category: "cockpit",
    techRating: "E",
    availability: {
      starLeague: "X",
      successionWars: "X",
      clanInvasion: "E",
    },
    cost: { type: "fixed", amount: 175_000 },
  },
  industrialCockpitNoFireControl: {
    id: "industrialCockpitNoFireControl",
    name: "Industrial Cockpit (No Fire Control)",
    altNames: ["Industrial Cockpit", "Industrial (No Fire Control)", "No Fire Control"],
    category: "cockpit",
    techRating: "C",
    availability: {
      starLeague: "B",
      successionWars: "C",
      clanInvasion: "C",
    },
    cost: { type: "fixed", amount: 100_000 },
  },
  industrialCockpitAdvancedFireControl: {
    id: "industrialCockpitAdvancedFireControl",
    name: "Industrial Cockpit (Advanced Fire Control)",
    altNames: ["Industrial Advanced Fire Control", "Industrial (Advanced Fire Control)", "Advanced Fire Control"],
    category: "cockpit",
    techRating: "D",
    availability: {
      starLeague: "D",
      successionWars: "E",
      clanInvasion: "E",
    },
    cost: { type: "fixed", amount: 200_000 },
  },
  lifeSupport: {
    id: "lifeSupport",
    name: "Life Support",
    altNames: ["Life Support"],
    category: "lifeSupport",
    techRating: "C",
    availability: {
      starLeague: "C",
      successionWars: "C",
      clanInvasion: "C",
    },
    cost: { type: "fixed", amount: 50_000 },
  },
  sensors: {
    id: "sensors",
    name: "Sensors",
    altNames: ["Sensors"],
    category: "sensors",
    techRating: "C",
    availability: {
      starLeague: "C",
      successionWars: "C",
      clanInvasion: "C",
    },
    cost: { type: "unitTonnage", multiplier: 2_000 },
  },

  // Musculature / structure
  standardMusculature: {
    id: "standardMusculature",
    name: "Standard Musculature",
    altNames: ["Musculature", "Standard Myomer", "Standard Musculature"],
    category: "musculature",
    techRating: "D",
    availability: {
      starLeague: "C",
      successionWars: "C",
      clanInvasion: "C",
    },
    cost: { type: "unitTonnage", multiplier: 2_000 },
  },
  tripleStrengthMyomer: {
    id: "tripleStrengthMyomer",
    name: "Triple-Strength Myomer",
    altNames: ["TSM", "Triple Strength Myomer", "Triple-Strength Myomer"],
    category: "musculature",
    techRating: "E",
    availability: {
      starLeague: "X",
      successionWars: "X",
      clanInvasion: "D",
    },
    cost: { type: "unitTonnage", multiplier: 16_000 },
  },
  industrialTripleStrengthMyomer: {
    id: "industrialTripleStrengthMyomer",
    name: "Industrial Triple-Strength Myomer",
    altNames: ["Industrial TSM", "Industrial Triple Strength Myomer"],
    category: "musculature",
    techRating: "E",
    availability: {
      starLeague: "X",
      successionWars: "X",
      clanInvasion: "E",
    },
    cost: { type: "unitTonnage", multiplier: 12_000 },
  },
  standardInternalStructure: {
    id: "standardInternalStructure",
    name: "Standard Internal Structure",
    altNames: ["Standard Structure", "Standard Internal Structure"],
    category: "internalStructure",
    techRating: "D",
    availability: {
      starLeague: "C",
      successionWars: "C",
      clanInvasion: "C",
    },
    cost: { type: "unitTonnage", multiplier: 400 },
  },
  endoSteelInternalStructure: {
    id: "endoSteelInternalStructure",
    name: "Endo-Steel Internal Structure",
    altNames: ["Endo Steel", "Endo-Steel", "Endo-Steel Structure", "Endo Steel Structure"],
    category: "internalStructure",
    techRating: "E",
    availability: {
      starLeague: "D",
      successionWars: "F",
      clanInvasion: "E",
    },
    cost: { type: "unitTonnage", multiplier: 1_600 },
  },
  endoCompositeInternalStructure: {
    id: "endoCompositeInternalStructure",
    name: "Endo-Composite Internal Structure",
    altNames: [
      "Endo-Composite",
      "Endo Composite",
      "Endo-Composite Structure",
      "Endo Composite Structure",
      "Endo-Composite Internal Structure",
      "Endo Composite Internal Structure",
      "ISEndoComposite",
      "CLEndoComposite",
      "IS Endo-Composite",
      "Clan Endo-Composite",
      "IS Endo Composite",
      "Clan Endo Composite"
    ],
    category: "internalStructure",
    techRating: "E",
    availability: {
      starLeague: "X",
      successionWars: "X",
      clanInvasion: "E",
    },
    cost: { type: "unitTonnage", multiplier: 800 },
  },

  industrialInternalStructure: {
    id: "industrialInternalStructure",
    name: "Industrial Internal Structure",
    altNames: ["Industrial Structure", "Industrial Internal Structure"],
    category: "internalStructure",
    techRating: "C",
    availability: {
      starLeague: "C",
      successionWars: "C",
      clanInvasion: "C",
    },
    cost: { type: "unitTonnage", multiplier: 300 },
  },
  industrialEnvironmentalSealing: {
    id: "industrialEnvironmentalSealing",
    name: "Environmental Sealing (IndustrialMechs only)",
    altNames: ["Environmental Sealing", "Enviro. Sealing"],
    category: "internalStructure",
    techRating: "C",
    availability: {
      starLeague: "C",
      successionWars: "C",
      clanInvasion: "C",
    },
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
    availability: {
      starLeague: "C",
      successionWars: "C",
      clanInvasion: "C",
    },
    cost: { type: "unitTonnage", multiplier: 100 },
  },
  lowerArmActuator: {
    id: "lowerArmActuator",
    name: "Lower Arm Actuator",
    altNames: ["Lower Arm Actuator"],
    category: "actuator",
    techRating: "C",
    availability: {
      starLeague: "C",
      successionWars: "C",
      clanInvasion: "C",
    },
    cost: { type: "unitTonnage", multiplier: 50 },
  },
  handActuator: {
    id: "handActuator",
    name: "Hand Actuator",
    altNames: ["Hand Actuator"],
    category: "actuator",
    techRating: "C",
    availability: {
      starLeague: "C",
      successionWars: "C",
      clanInvasion: "C",
    },
    cost: { type: "unitTonnage", multiplier: 80 },
  },
  upperLegActuator: {
    id: "upperLegActuator",
    name: "Upper Leg Actuator",
    altNames: ["Hip", "Upper Leg Actuator"],
    category: "actuator",
    techRating: "C",
    availability: {
      starLeague: "C",
      successionWars: "C",
      clanInvasion: "C",
    },
    cost: { type: "unitTonnage", multiplier: 150 },
  },
  lowerLegActuator: {
    id: "lowerLegActuator",
    name: "Lower Leg Actuator",
    altNames: ["Lower Leg Actuator"],
    category: "actuator",
    techRating: "C",
    availability: {
      starLeague: "C",
      successionWars: "C",
      clanInvasion: "C",
    },
    cost: { type: "unitTonnage", multiplier: 80 },
  },
  footActuator: {
    id: "footActuator",
    name: "Foot Actuator",
    altNames: ["Foot Actuator"],
    category: "actuator",
    techRating: "C",
    availability: {
      starLeague: "C",
      successionWars: "C",
      clanInvasion: "C",
    },
    cost: { type: "unitTonnage", multiplier: 120 },
  },
    actuatorEnhancementSystem: {
    id: "actuatorEnhancementSystem",
    name: "Actuator Enhancement System",
    altNames: [
      "Actuator Enhancement System",
      "AES",
      "IS AES",
      "ISAES",
      "CL AES",
      "CLAES",
      "Actuator Enhancement",
      "IS Actuator Enhancement System",
      "Clan Actuator Enhancement System",
      "Actuator Enhancement System (OMNIPOD)",
      "ISAES (OMNIPOD)",
      "CLAES (OMNIPOD)"
    ],
    category: "actuator",
    techRating: "E",
    availability: {
      starLeague: "X",
      successionWars: "X",
      clanInvasion: "E",
    },
    cost: { type: "fixed", amount: 0 },
    notes: [
      "Critical-slot component for Actuator Enhancement System. Usually installed in a limb and handled as mounted equipment; verify final cost formula before using for C-bill calculations."
    ],
  },

  // Engines
  standardFusionEngine: {
    id: "standardFusionEngine",
    name: "Standard Fusion Engine",
    altNames: ["Fusion", "Standard Fusion", "Fusion Engine", "Standard Engine"],
    category: "engine",
    techRating: "D",
    availability: {
      starLeague: "C",
      successionWars: "E",
      clanInvasion: "D",
    },
    cost: { type: "engineRatingUnitTonnageDiv75", multiplier: 5_000 },
  },
  lightFusionEngine: {
    id: "lightFusionEngine",
    name: "Light Fusion Engine",
    altNames: ["Light", "Light Fusion", "Light Engine"],
    category: "engine",
    techRating: "E",
    availability: {
      starLeague: "X",
      successionWars: "X",
      clanInvasion: "E",
    },
    cost: { type: "engineRatingUnitTonnageDiv75", multiplier: 15_000 },
  },
  xlFusionEngine: {
    id: "xlFusionEngine",
    name: "XL Fusion Engine",
    altNames: ["XL", "XL Fusion", "Extra-Light", "Extralight", "XL Engine"],
    category: "engine",
    techRating: "E",
    availability: {
      starLeague: "D",
      successionWars: "F",
      clanInvasion: "E",
    },
    cost: { type: "engineRatingUnitTonnageDiv75", multiplier: 20_000 },
  },
  compactFusionEngine: {
    id: "compactFusionEngine",
    name: "Compact Fusion Engine",
    altNames: ["Compact", "Compact Fusion", "Compact Engine"],
    category: "engine",
    techRating: "E",
    availability: {
      starLeague: "X",
      successionWars: "X",
      clanInvasion: "E",
    },
    cost: { type: "engineRatingUnitTonnageDiv75", multiplier: 10_000 },
  },
  internalCombustionEngine: {
    id: "internalCombustionEngine",
    name: "Internal Combustion Engine",
    altNames: ["ICE", "Internal Combustion", "Combustion Engine"],
    category: "engine",
    techRating: "C",
    availability: {
      starLeague: "A",
      successionWars: "A",
      clanInvasion: "A",
    },
    cost: { type: "engineRatingUnitTonnageDiv75", multiplier: 1_250 },
  },
  fuelCellEngine: {
    id: "fuelCellEngine",
    name: "Fuel Cell Engine",
    altNames: ["Fuel Cell"],
    category: "engine",
    techRating: "D",
    availability: {
      starLeague: "C",
      successionWars: "D",
      clanInvasion: "D",
    },
    cost: { type: "engineRatingUnitTonnageDiv75", multiplier: 3_500 },
  },
  fissionEngine: {
    id: "fissionEngine",
    name: "Fission Engine",
    altNames: ["Fission"],
    category: "engine",
    techRating: "D",
    availability: {
      starLeague: "E",
      successionWars: "E",
      clanInvasion: "D",
    },
    cost: { type: "engineRatingUnitTonnageDiv75", multiplier: 7_500 },
  },

  // Gyros
  standardGyro: {
    id: "standardGyro",
    name: "Standard Gyro",
    altNames: ["Gyro", "Standard Gyro"],
    category: "gyro",
    techRating: "D",
    availability: {
      starLeague: "C",
      successionWars: "C",
      clanInvasion: "C",
    },
    cost: { type: "gyroTonnage", multiplier: 300_000 },
  },
  compactGyro: {
    id: "compactGyro",
    name: "Compact Gyro",
    altNames: ["Compact Gyro"],
    category: "gyro",
    techRating: "E",
    availability: {
      starLeague: "X",
      successionWars: "X",
      clanInvasion: "E",
    },
    cost: { type: "gyroTonnage", multiplier: 400_000 },
  },
  heavyDutyGyro: {
    id: "heavyDutyGyro",
    name: "Heavy Duty Gyro",
    altNames: ["Heavy-Duty Gyro", "Heavy Duty Gyro"],
    category: "gyro",
    techRating: "E",
    availability: {
      starLeague: "X",
      successionWars: "X",
      clanInvasion: "E",
    },
    cost: { type: "gyroTonnage", multiplier: 500_000 },
  },
  xlGyro: {
    id: "xlGyro",
    name: "XL Gyro",
    altNames: ["XL Gyro", "Extra-Light Gyro", "Extralight Gyro"],
    category: "gyro",
    techRating: "E",
    availability: {
      starLeague: "X",
      successionWars: "X",
      clanInvasion: "E",
    },
    cost: { type: "gyroTonnage", multiplier: 750_000 },
  },

  // Movement / heat / armor
  standardJumpJet: {
    id: "standardJumpJet",
    name: "Standard Jump Jets",
    altNames: ["Jump Jet", "Jump Jets", "Standard Jump Jet", "Standard Jump Jets"],
    category: "jumpJet",
    techRating: "D",
    availability: {
      starLeague: "C",
      successionWars: "C",
      clanInvasion: "C",
    },
    cost: { type: "jumpJetsSquaredUnitTonnage", multiplier: 200 },
  },
  improvedJumpJet: {
    id: "improvedJumpJet",
    name: "Improved Jump Jets",
    altNames: ["Improved Jump Jet", "Improved Jump Jets", "Improved JJ"],
    category: "jumpJet",
    techRating: "E",
    availability: {
      starLeague: "X",
      successionWars: "X",
      clanInvasion: "E",
    },
    cost: { type: "jumpJetsSquaredUnitTonnage", multiplier: 500 },
  },
  masc: {
    id: "masc",
    name: "MASC",
    altNames: ["MASC", "Myomer Accelerator Signal Circuitry"],
    category: "masc",
    techRating: "E",
    availability: {
      starLeague: "D",
      successionWars: "F",
      clanInvasion: "E",
    },
    cost: { type: "masc", multiplier: 1_000 },
  },
  standardSingleHeatSinkFusion: {
    id: "standardSingleHeatSinkFusion",
    name: "Heat Sink",
    altNames: ["Single Heat Sink", "Standard Heat Sink", "Heat Sink"],
    category: "heatSink",
    techRating: "C",
    availability: {
      starLeague: "B",
      successionWars: "B",
      clanInvasion: "B",
    },
    cost: { type: "heatSinksOverFreeFusionSinks", multiplier: 2_000, freeFusionSinks: 10 },
    notes: ["Only heat sinks over the 10 free fusion-engine heat sinks are charged."],
  },
  standardSingleHeatSinkNonFusion: {
    id: "standardSingleHeatSinkNonFusion",
    name: "Heat Sink",
    altNames: ["Single Heat Sink", "Standard Heat Sink", "Heat Sink"],
    category: "heatSink",
    techRating: "C",
    availability: {
      starLeague: "B",
      successionWars: "B",
      clanInvasion: "B",
    },
    cost: { type: "totalHeatSinks", multiplier: 2_000 },
  },
  doubleHeatSink: {
    id: "doubleHeatSink",
    name: "Double Heat Sink",
    altNames: ["Double Heat Sink", "Double Heat Sinks", "DHS"],
    category: "heatSink",
    techRating: "E",
    availability: {
      starLeague: "C",
      successionWars: "E",
      clanInvasion: "D",
    },
    cost: { type: "totalHeatSinks", multiplier: 6_000 },
  },
  powerAmplifier: {
    id: "powerAmplifier",
    name: "Power Amplifiers",
    altNames: ["Power Amplifier", "Power Amplifiers"],
    category: "powerAmplifier",
    techRating: "D",
    availability: {
      starLeague: "B",
      successionWars: "C",
      clanInvasion: "B",
    },
    cost: { type: "amplifierTonnage", multiplier: 20_000 },
  },
  tracks: {
    id: "tracks",
    name: "Tracks",
    altNames: ["Tracks", "Track"],
    category: "track",
    techRating: "C",
    availability: {
      starLeague: "D",
      successionWars: "E",
      clanInvasion: "E",
    },
    cost: { type: "track", multiplier: 500 },
  },

  // Armor
  standardArmor: {
    id: "standardArmor",
    name: "Standard Armor",
    altNames: ["Standard", "Standard Armor"],
    category: "armor",
    techRating: "D",
    availability: {
      starLeague: "C",
      successionWars: "C",
      clanInvasion: "C",
    },
    cost: { type: "armorTonnage", multiplier: 10_000 },
  },
  heavyIndustrialArmor: {
    id: "heavyIndustrialArmor",
    name: "Heavy Industrial Armor",
    altNames: ["Heavy Industrial", "Heavy Industrial Armor"],
    category: "armor",
    techRating: "D",
    availability: {
      starLeague: "C",
      successionWars: "C",
      clanInvasion: "C",
    },
    cost: { type: "armorTonnage", multiplier: 10_000 },
  },
  ferroFibrousArmor: {
    id: "ferroFibrousArmor",
    name: "Ferro-Fibrous Armor",
    altNames: ["Ferro-Fibrous", "Ferro Fibrous", "Ferro"],
    category: "armor",
    techRating: "E",
    availability: {
      starLeague: "D",
      successionWars: "F",
      clanInvasion: "D",
    },
    cost: { type: "armorTonnage", multiplier: 20_000 },
  },
  lightFerroFibrousArmor: {
    id: "lightFerroFibrousArmor",
    name: "Light Ferro-Fibrous Armor",
    altNames: ["Light Ferro-Fibrous", "Light Ferro Fibrous"],
    category: "armor",
    techRating: "E",
    availability: {
      starLeague: "X",
      successionWars: "X",
      clanInvasion: "E",
    },
    cost: { type: "armorTonnage", multiplier: 15_000 },
  },
  heavyFerroFibrousArmor: {
    id: "heavyFerroFibrousArmor",
    name: "Heavy Ferro-Fibrous Armor",
    altNames: ["Heavy Ferro-Fibrous", "Heavy Ferro Fibrous"],
    category: "armor",
    techRating: "E",
    availability: {
      starLeague: "X",
      successionWars: "X",
      clanInvasion: "E",
    },
    cost: { type: "armorTonnage", multiplier: 25_000 },
  },
  stealthArmor: {
    id: "stealthArmor",
    name: "Stealth Armor",
    altNames: ["Stealth", "Stealth Armor"],
    category: "armor",
    techRating: "E",
    availability: {
      starLeague: "X",
      successionWars: "X",
      clanInvasion: "E",
    },
    cost: { type: "armorTonnage", multiplier: 50_000 },
  },
  commercialArmor: {
    id: "commercialArmor",
    name: "Commercial Armor",
    altNames: ["Commercial", "Commercial Armor"],
    category: "armor",
    techRating: "B",
    availability: {
      starLeague: "B",
      successionWars: "B",
      clanInvasion: "A",
    },
    cost: { type: "armorTonnage", multiplier: 3_000 },
  },
  industrialArmor: {
    id: "industrialArmor",
    name: "Industrial Armor",
    altNames: ["Industrial", "Industrial Armor"],
    category: "armor",
    techRating: "C",
    availability: {
      starLeague: "B",
      successionWars: "C",
      clanInvasion: "B",
    },
    cost: { type: "armorTonnage", multiplier: 5_000 },
  },
  antiPenetrativeAblationArmor: {
    id: "antiPenetrativeAblationArmor",
    name: "Anti-Penetrative Ablation Armor",
    altNames: [
      "Anti-Penetrative Ablation",
      "Anti Penetrative Ablation",
      "Anti-Penetrative Ablation Armor",
      "Anti Penetrative Ablation Armor",
      "IS Anti-Penetrative Ablation",
      "IS Anti Penetrative Ablation",
      "ISAntiPenetrativeAblation",
      "ISAntiPenetrativeAblationArmor",
      "Clan Anti-Penetrative Ablation",
      "Clan Anti Penetrative Ablation",
      "CLAntiPenetrativeAblation",
      "CLAntiPenetrativeAblationArmor"
    ],
    category: "armor",
    techRating: "F",
    availability: {
      starLeague: "X",
      successionWars: "X",
      clanInvasion: "F",
    },
    cost: { type: "armorTonnage", multiplier: 120000 },
  },
  reflectiveArmor: {
    id: "reflectiveArmor",
    name: "Reflective Armor",
    altNames: [
      "Reflective",
      "Reflective Armor",
      "IS Reflective",
      "IS Reflective Armor",
      "ISReflective",
      "ISReflectiveArmor",
      "Clan Reflective",
      "Clan Reflective Armor",
      "CLReflective",
      "CLReflectiveArmor"
    ],
    category: "armor",
    techRating: "F",
    availability: {
      starLeague: "X",
      successionWars: "X",
      clanInvasion: "F",
    },
    cost: { type: "armorTonnage", multiplier: 150000 },
    notes: [
      "Critical-slot component for Reflective armor. Used for slot resolution and armor type metadata."
    ],
  },

  // Weapon Enhancement
  ppcCapacitor: {
    id: "ppcCapacitor",
    name: "PPC Capacitor",
    altNames: [
      "PPC Capacitor",
      "ISPPC Capacitor",
      "CLPPC Capacitor",
      "ISPPC Capacitor",
      "CLPPC Capacitor",
      "ISPPCcapacitor",
      "CLPPCcapacitor",
      "IS PPC Capacitor",
      "Clan PPC Capacitor",
      "PPC Capacitor (OMNIPOD)",
      "CLPPC Capacitor (OMNIPOD)",
      "ISPPC Capacitor (OMNIPOD)"
    ],
    category: "weaponEnhancement",
    techRating: "E",
    availability: {
      starLeague: "X",
      successionWars: "X",
      clanInvasion: "E",
    },
    cost: { type: "fixed", amount: 45000 },
  },

  //Flight Equipment
    avionics: {
    id: "avionics",
    name: "Avionics",
    altNames: [
      "Avionics",
      "IS Avionics",
      "Clan Avionics",
      "ISAvionics",
      "CLAvionics",
      "LAM Avionics",
      "IS LAM Avionics",
      "Clan LAM Avionics"
    ],
    category: "flightEquipment",
    techRating: "D",
    availability: {
      starLeague: "D",
      successionWars: "F",
      clanInvasion: "E",
    },
    cost: { type: "fixed", amount: 0 },
    notes: [
      "LAM-specific critical slot component. Cost is handled as part of the LAM/conversion system if applicable."
    ],
  },

  landingGear: {
    id: "landingGear",
    name: "Landing Gear",
    altNames: [
      "Landing Gear",
      "IS Landing Gear",
      "Clan Landing Gear",
      "ISLandingGear",
      "CLLandingGear",
      "LAM Landing Gear",
      "IS LAM Landing Gear",
      "Clan LAM Landing Gear"
    ],
    category: "flightEquipment",
    techRating: "D",
    availability: {
      starLeague: "D",
      successionWars: "F",
      clanInvasion: "E",
    },
    cost: { type: "fixed", amount: 0 },
    notes: [
      "LAM-specific critical slot component. Cost is handled as part of the LAM/conversion system if applicable."
    ],
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

  // Slot auditor additions / advanced and industrial equipment
  artemisIVFCS: {
    id: "artemisIVFCS",
    name: "Artemis IV FCS",
    altNames: [
      "Artemis IV",
      "Artemis IV FCS",
      "ISArtemisIV",
      "CLArtemisIV",
      "CLArtemisIV (OMNIPOD)",
      "IS Artemis IV",
      "Clan Artemis IV"
    ],
    category: "fireControl",
    techRating: "E",
    availability: {
      starLeague: "E",
      successionWars: "F",
      clanInvasion: "D",
    },
    cost: { type: "fixed", amount: 100_000 },
  },

  hatchet: {
    id: "hatchet",
    name: "Hatchet",
    altNames: [
      "Hatchet",
      "ISHatchet",
      "CLHatchet"
    ],
    category: "physicalWeapon",
    techRating: "C",
    availability: {
      starLeague: "X",
      successionWars: "F",
      clanInvasion: "D",
    },
    cost: { type: "equipmentTonnage", multiplier: 5_000 },
  },

  sword: {
    id: "sword",
    name: "Sword",
    altNames: [
      "Sword",
      "ISSword",
      "CLSword"
    ],
    category: "physicalWeapon",
    techRating: "D",
    availability: {
      starLeague: "X",
      successionWars: "X",
      clanInvasion: "D",
    },
    cost: { type: "equipmentTonnage", multiplier: 10_000 },
  },

  mace: {
    id: "mace",
    name: "Mace",
    altNames: [
      "Mace",
      "ISMace",
      "CLMace"
    ],
    category: "physicalWeapon",
    techRating: "B",
    availability: {
      starLeague: "X",
      successionWars: "F",
      clanInvasion: "D",
    },
    cost: { type: "fixed", amount: 130_000 },
  },

  claws: {
    id: "claws",
    name: "Claws",
    altNames: [
      "Claw",
      "Claws",
      "ISClaw",
      "ISClaws",
      "CLClaw",
      "CLClaws"
    ],
    category: "physicalWeapon",
    techRating: "B",
    availability: {
      starLeague: "X",
      successionWars: "F",
      clanInvasion: "E",
    },
    cost: { type: "unitTonnage", multiplier: 200 },
  },

  retractableBlade: {
    id: "retractableBlade",
    name: "Retractable Blade",
    altNames: [
      "Retractable Blade",
      "Retractable Blade (OMNIPOD)",
      "ISRetractableBlade",
      "CLRetractableBlade"
    ],
    category: "physicalWeapon",
    techRating: "D",
    availability: {
      starLeague: "X",
      successionWars: "X",
      clanInvasion: "E",
    },
    cost: { type: "equipmentTonnage", multiplier: 10_000 },
  },

  chainsaw: {
    id: "chainsaw",
    name: "Chainsaw",
    altNames: [
      "Chainsaw",
      "ISChainsaw",
      "CLChainsaw"
    ],
    category: "industrialEquipment",
    techRating: "D",
    availability: {
      starLeague: "D",
      successionWars: "D",
      clanInvasion: "D",
    },
    cost: { type: "fixed", amount: 100_000 },
  },

  dualSaw: {
    id: "dualSaw",
    name: "Dual Saw",
    altNames: [
      "Dual Saw",
      "DualSaw",
      "ISDualSaw",
      "CLDualSaw"
    ],
    category: "industrialEquipment",
    techRating: "D",
    availability: {
      starLeague: "D",
      successionWars: "D",
      clanInvasion: "D",
    },
    cost: { type: "fixed", amount: 100_000 },
  },

  miningDrill: {
    id: "miningDrill",
    name: "Mining Drill",
    altNames: [
      "Mining Drill",
      "MiningDrill",
      "ISMiningDrill",
      "CLMiningDrill"
    ],
    category: "industrialEquipment",
    techRating: "D",
    availability: {
      starLeague: "D",
      successionWars: "D",
      clanInvasion: "D",
    },
    cost: { type: "fixed", amount: 150_000 },
  },

  rockCutter: {
    id: "rockCutter",
    name: "Rock Cutter",
    altNames: [
      "Rock Cutter",
      "RockCutter",
      "ISRockCutter",
      "CLRockCutter"
    ],
    category: "industrialEquipment",
    techRating: "D",
    availability: {
      starLeague: "D",
      successionWars: "D",
      clanInvasion: "D",
    },
    cost: { type: "fixed", amount: 150_000 },
  },

  backhoe: {
    id: "backhoe",
    name: "Backhoe",
    altNames: [
      "Backhoe",
      "ISBackhoe",
      "CLBackhoe"
    ],
    category: "industrialEquipment",
    techRating: "B",
    availability: {
      starLeague: "B",
      successionWars: "B",
      clanInvasion: "B",
    },
    cost: { type: "fixed", amount: 50_000 },
  },

  liftHoist: {
    id: "liftHoist",
    name: "Lift Hoist",
    altNames: [
      "Lift Hoist",
      "LiftHoist",
      "Lift Hoist/Arresting Hoist",
      "Arresting Hoist",
      "ISLiftHoist",
      "CLLiftHoist"
    ],
    category: "industrialEquipment",
    techRating: "A",
    availability: {
      starLeague: "A",
      successionWars: "A",
      clanInvasion: "A",
    },
    cost: { type: "fixed", amount: 50_000 },
  },

  arrestingHoist: {
    id: "arrestingHoist",
    name: "Arresting Hoist",
    altNames: [
      "Arresting Hoist",
      "ArrestingHoist"
    ],
    category: "industrialEquipment",
    techRating: "C",
    availability: {
      starLeague: "C",
      successionWars: "F",
      clanInvasion: "E",
    },
    cost: { type: "fixed", amount: 90_000 },
  },

  cargoOneTon: {
    id: "cargoOneTon",
    name: "Cargo (1 ton)",
    altNames: [
      "Cargo (1 ton)",
      "Cargo",
      "CargoOneTon"
    ],
    category: "cargo",
    techRating: "A",
    availability: {
      starLeague: "A",
      successionWars: "A",
      clanInvasion: "A",
    },
    cost: { type: "fixed", amount: 0 },
  },

  partialWing: {
    id: "partialWing",
    name: "Partial Wing",
    altNames: [
      "Partial Wing",
      "ISPartialWing",
      "CLPartialWing",
      "PartialWing",
      "Partial Wing (\u2019Mech)",
      "Partial Wing ('Mech)"
    ],
    category: "motiveSystem",
    techRating: "F",
    availability: {
      starLeague: "X",
      successionWars: "X",
      clanInvasion: "E",
    },
    cost: { type: "internalStructure", multiplier: 50_000 },
  },

  actuatorEnhancementSystem: {
    id: "actuatorEnhancementSystem",
    name: "Actuator Enhancement System",
    altNames: [
      "Actuator Enhancement System",
      "AES",
      "ISAES",
      "CLAES",
      "Actuator Enhancement Sys. (Arm)",
      "Actuator Enhancement Sys. (Leg)"
    ],
    category: "actuatorEnhancement",
    techRating: "E",
    availability: {
      starLeague: "X",
      successionWars: "X",
      clanInvasion: "F",
    },
    cost: { type: "unitTonnage", multiplier: 500 },
  },

  ballisticReinforcedArmor: {
    id: "ballisticReinforcedArmor",
    name: "Ballistic-Reinforced Armor",
    altNames: [
      "Ballistic-Reinforced",
      "Ballistic Reinforced",
      "IS Ballistic-Reinforced",
      "Clan Ballistic-Reinforced",
      "ISBallisticReinforced",
      "CLBallisticReinforced"
    ],
    category: "armor",
    techRating: "E",
    availability: {
      starLeague: "X",
      successionWars: "X",
      clanInvasion: "F",
    },
    cost: { type: "armorTonnage", multiplier: 35_000 },
  },

  impactResistantArmor: {
    id: "impactResistantArmor",
    name: "Impact-Resistant Armor",
    altNames: [
      "Impact-Resistant",
      "Impact Resistant",
      "IS Impact-Resistant",
      "Clan Impact-Resistant",
      "ISImpactResistant",
      "CLImpactResistant"
    ],
    category: "armor",
    techRating: "E",
    availability: {
      starLeague: "X",
      successionWars: "X",
      clanInvasion: "F",
    },
    cost: { type: "armorTonnage", multiplier: 35_000 },
  },

  avionics: {
    id: "avionics",
    name: "Avionics",
    altNames: [
      "Avionics",
      "ISAvionics",
      "CLAvionics"
    ],
    category: "lamSystem",
    techRating: "E",
    availability: {
      starLeague: "E",
      successionWars: "F",
      clanInvasion: "D",
    },
    cost: { type: "fixed", amount: 0 },
  },

  landingGear: {
    id: "landingGear",
    name: "Landing Gear",
    altNames: [
      "Landing Gear",
      "LandingGear",
      "ISLandingGear",
      "CLLandingGear"
    ],
    category: "lamSystem",
    techRating: "E",
    availability: {
      starLeague: "E",
      successionWars: "F",
      clanInvasion: "D",
    },
    cost: { type: "fixed", amount: 0 },
  },

  rl10: {
    id: "rl10",
    name: "Rocket Launcher 10",
    altNames: [
      "RL10",
      "Rocket Launcher 10",
      "RocketLauncher10",
      "ISRL10",
      "CLRL10"
    ],
    category: "oneShotLauncher",
    techRating: "B",
    availability: {
      starLeague: "X",
      successionWars: "X",
      clanInvasion: "B",
    },
    cost: { type: "fixed", amount: 15_000 },
  },
  vehicularGrenadeLauncher: {
    id: "vehicularGrenadeLauncher",
    name: "Vehicular Grenade Launcher",
    altNames: [
      "Vehicular Grenade Launcher",
      "ISVehicularGrenadeLauncher",
      "CLVehicularGrenadeLauncher"
    ],
    category: "weapon",
    techRating: "C",
    availability: {
      starLeague: "D",
      successionWars: "E",
      clanInvasion: "F",
    },
    cost: { type: "fixed", amount: 10_000 },
  },

  mekTaser: {
    id: "mekTaser",
    name: "Mek Taser",
    altNames: [
      "Mek Taser",
      "BattleMech Taser",
      "Taser (BattleMech)",
      "ISMekTaser",
      "CLMekTaser"
    ],
    category: "weapon",
    techRating: "E",
    availability: {
      starLeague: "X",
      successionWars: "X",
      clanInvasion: "E",
    },
    cost: { type: "fixed", amount: 200_000 },
  },

  mechMortar4: {
    id: "mechMortar4",
    name: "Mech Mortar/4",
    altNames: [
      "Mech Mortar-4",
      "Clan Mech Mortar-4",
      "Clan Mech Mortar-4 (OMNIPOD)",
      "ISMechMortar4",
      "CLMechMortar4"
    ],
    category: "weapon",
    techRating: "B",
    availability: {
      starLeague: "C",
      successionWars: "C",
      clanInvasion: "C",
    },
    cost: { type: "fixed", amount: 75_000 },
  },

  mechMortar8: {
    id: "mechMortar8",
    name: "Mech Mortar/8",
    altNames: [
      "Mech Mortar-8",
      "Clan Mech Mortar-8",
      "Clan Mech Mortar-8 (OMNIPOD)",
      "ISMechMortar8",
      "CLMechMortar8"
    ],
    category: "weapon",
    techRating: "B",
    availability: {
      starLeague: "C",
      successionWars: "C",
      clanInvasion: "C",
    },
    cost: { type: "fixed", amount: 150_000 },
  },

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
