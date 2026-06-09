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
  | "flightEquipment"
  | "mekLocation";

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
  commandConsole: {
    id: "commandConsole",
    name: "Command Console",
    altNames: ["Command Console"],
    category: "cockpit",
    techRating: "E",
    availability: {
      starLeague: "E",
      successionWars: "F",
      clanInvasion: "E",
    },
    cost: { type: "fixed", amount: 700_000 },
  },
  primitiveCockpit: {
    id: "primitiveCockpit",
    name: "Primitive Cockpit",
    altNames: ["Primitive Cockpit"],
    category: "cockpit",
    techRating: "D",
    availability: {
      starLeague: "X",
      successionWars: "X",
      clanInvasion: "X",
    },
    cost: { type: "fixed", amount: 200_000 },
  },
  primitiveIndustrialCockpit: {
    id: "primitiveIndustrialCockpit",
    name: "Primitive Industrial Cockpit",
    altNames: ["Primitive Industrial Cockpit"],
    category: "cockpit",
    techRating: "C",
    availability: {
      starLeague: "X",
      successionWars: "X",
      clanInvasion: "X",
    },
    cost: { type: "fixed", amount: 100_000 },
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

  // Mek location replacement parts
  mekHead: {
    id: "mekHead",
    name: "Mek Head",
    altNames: ['Mek Head', 'Head', 'HD'].map((name) => name),
    category: "mekLocation",
    techRating: "D",
    availability: {
      starLeague: "C",
      successionWars: "C",
      clanInvasion: "C",
    },
    cost: { type: "unitTonnage", multiplier: 240 },
    notes: ["This is the bare head location replacement part; sensors/life support are separate components."],
  },
  mekHeadTsm: {
    id: "mekHeadTsm",
    name: "Mek Head (TSM)",
    altNames: ['Mek Head (TSM)', 'Head (TSM)', 'HD (TSM)'].map((name) => name),
    category: "mekLocation",
    techRating: "E",
    availability: {
      starLeague: "D",
      successionWars: "D",
      clanInvasion: "D",
    },
    cost: { type: "unitTonnage", multiplier: 1_640 },
    notes: ["Includes Triple-Strength Myomer surcharge from MekHQ replacement part export.", "This is the bare head location replacement part; sensors/life support are separate components."],
  },
  mekHeadIndustrial: {
    id: "mekHeadIndustrial",
    name: "Mek Head (Industrial)",
    altNames: ['Mek Head (Industrial)', 'Head (Industrial)', 'HD (Industrial)'].map((name) => name),
    category: "mekLocation",
    techRating: "C",
    availability: {
      starLeague: "C",
      successionWars: "C",
      clanInvasion: "C",
    },
    cost: { type: "unitTonnage", multiplier: 230 },
    notes: ["This is the bare head location replacement part; sensors/life support are separate components."],
  },
  mekHeadIndustrialTsm: {
    id: "mekHeadIndustrialTsm",
    name: "Mek Head (Industrial) (TSM)",
    altNames: ['Mek Head (Industrial) (TSM)', 'Head (Industrial) (TSM)', 'HD (Industrial) (TSM)'].map((name) => name),
    category: "mekLocation",
    techRating: "E",
    availability: {
      starLeague: "E",
      successionWars: "E",
      clanInvasion: "E",
    },
    cost: { type: "unitTonnage", multiplier: 1_630 },
    notes: ["Industrial structure with TSM surcharge from MekHQ replacement part export.", "This is the bare head location replacement part; sensors/life support are separate components."],
  },
  mekHeadIsEndoSteel: {
    id: "mekHeadIsEndoSteel",
    name: "Mek Head (IS Endo Steel)",
    altNames: ['Mek Head (IS Endo Steel)', 'Head (IS Endo Steel)', 'HD (IS Endo Steel)'].map((name) => name),
    category: "mekLocation",
    techRating: "E",
    availability: {
      starLeague: "E",
      successionWars: "E",
      clanInvasion: "E",
    },
    cost: { type: "unitTonnage", multiplier: 360 },
    notes: ["This is the bare head location replacement part; sensors/life support are separate components."],
  },
  mekHeadIsEndoSteelTsm: {
    id: "mekHeadIsEndoSteelTsm",
    name: "Mek Head (IS Endo Steel) (TSM)",
    altNames: ['Mek Head (IS Endo Steel) (TSM)', 'Head (IS Endo Steel) (TSM)', 'HD (IS Endo Steel) (TSM)'].map((name) => name),
    category: "mekLocation",
    techRating: "E",
    availability: {
      starLeague: "E",
      successionWars: "E",
      clanInvasion: "E",
    },
    cost: { type: "unitTonnage", multiplier: 1_760 },
    notes: ["Includes Triple-Strength Myomer surcharge from MekHQ replacement part export.", "This is the bare head location replacement part; sensors/life support are separate components."],
  },
  mekHeadClanEndoSteel: {
    id: "mekHeadClanEndoSteel",
    name: "Mek Head (Clan Endo Steel)",
    altNames: ['Mek Head (Clan Endo Steel)', 'Head (Clan Endo Steel)', 'HD (Clan Endo Steel)'].map((name) => name),
    category: "mekLocation",
    techRating: "E",
    availability: {
      starLeague: "E",
      successionWars: "E",
      clanInvasion: "E",
    },
    cost: { type: "unitTonnage", multiplier: 360 },
    notes: ["This is the bare head location replacement part; sensors/life support are separate components."],
  },
  mekHeadClanEndoSteelTsm: {
    id: "mekHeadClanEndoSteelTsm",
    name: "Mek Head (Clan Endo Steel) (TSM)",
    altNames: ['Mek Head (Clan Endo Steel) (TSM)', 'Head (Clan Endo Steel) (TSM)', 'HD (Clan Endo Steel) (TSM)'].map((name) => name),
    category: "mekLocation",
    techRating: "E",
    availability: {
      starLeague: "E",
      successionWars: "E",
      clanInvasion: "E",
    },
    cost: { type: "unitTonnage", multiplier: 1_760 },
    notes: ["Includes Triple-Strength Myomer surcharge from MekHQ replacement part export.", "This is the bare head location replacement part; sensors/life support are separate components."],
  },
  mekHeadEndoSteelPrototype: {
    id: "mekHeadEndoSteelPrototype",
    name: "Mek Head (Endo Steel Prototype)",
    altNames: ['Mek Head (Endo Steel Prototype)', 'Head (Endo Steel Prototype)', 'HD (Endo Steel Prototype)'].map((name) => name),
    category: "mekLocation",
    techRating: "F",
    availability: {
      starLeague: "F",
      successionWars: "F",
      clanInvasion: "F",
    },
    cost: { type: "unitTonnage", multiplier: 680 },
    notes: ["This is the bare head location replacement part; sensors/life support are separate components."],
  },
  mekHeadEndoSteelPrototypeTsm: {
    id: "mekHeadEndoSteelPrototypeTsm",
    name: "Mek Head (Endo Steel Prototype) (TSM)",
    altNames: ['Mek Head (Endo Steel Prototype) (TSM)', 'Head (Endo Steel Prototype) (TSM)', 'HD (Endo Steel Prototype) (TSM)'].map((name) => name),
    category: "mekLocation",
    techRating: "F",
    availability: {
      starLeague: "F",
      successionWars: "F",
      clanInvasion: "F",
    },
    cost: { type: "unitTonnage", multiplier: 2_080 },
    notes: ["Includes Triple-Strength Myomer surcharge from MekHQ replacement part export.", "This is the bare head location replacement part; sensors/life support are separate components."],
  },
  mekCenterTorso: {
    id: "mekCenterTorso",
    name: "Mek Center Torso",
    altNames: ['Mek Center Torso', 'Center Torso', 'CT'].map((name) => name),
    category: "mekLocation",
    techRating: "D",
    availability: {
      starLeague: "C",
      successionWars: "C",
      clanInvasion: "C",
    },
    cost: { type: "unitTonnage", multiplier: 240 },
  },
  mekCenterTorsoTsm: {
    id: "mekCenterTorsoTsm",
    name: "Mek Center Torso (TSM)",
    altNames: ['Mek Center Torso (TSM)', 'Center Torso (TSM)', 'CT (TSM)'].map((name) => name),
    category: "mekLocation",
    techRating: "E",
    availability: {
      starLeague: "D",
      successionWars: "D",
      clanInvasion: "D",
    },
    cost: { type: "unitTonnage", multiplier: 1_640 },
    notes: ["Includes Triple-Strength Myomer surcharge from MekHQ replacement part export."],
  },
  mekCenterTorsoIndustrial: {
    id: "mekCenterTorsoIndustrial",
    name: "Mek Center Torso (Industrial)",
    altNames: ['Mek Center Torso (Industrial)', 'Center Torso (Industrial)', 'CT (Industrial)'].map((name) => name),
    category: "mekLocation",
    techRating: "C",
    availability: {
      starLeague: "C",
      successionWars: "C",
      clanInvasion: "C",
    },
    cost: { type: "unitTonnage", multiplier: 230 },
  },
  mekCenterTorsoIndustrialTsm: {
    id: "mekCenterTorsoIndustrialTsm",
    name: "Mek Center Torso (Industrial) (TSM)",
    altNames: ['Mek Center Torso (Industrial) (TSM)', 'Center Torso (Industrial) (TSM)', 'CT (Industrial) (TSM)'].map((name) => name),
    category: "mekLocation",
    techRating: "E",
    availability: {
      starLeague: "E",
      successionWars: "E",
      clanInvasion: "E",
    },
    cost: { type: "unitTonnage", multiplier: 1_630 },
    notes: ["Industrial structure with TSM surcharge from MekHQ replacement part export."],
  },
  mekCenterTorsoIsEndoSteel: {
    id: "mekCenterTorsoIsEndoSteel",
    name: "Mek Center Torso (IS Endo Steel)",
    altNames: ['Mek Center Torso (IS Endo Steel)', 'Center Torso (IS Endo Steel)', 'CT (IS Endo Steel)'].map((name) => name),
    category: "mekLocation",
    techRating: "E",
    availability: {
      starLeague: "E",
      successionWars: "E",
      clanInvasion: "E",
    },
    cost: { type: "unitTonnage", multiplier: 360 },
  },
  mekCenterTorsoIsEndoSteelTsm: {
    id: "mekCenterTorsoIsEndoSteelTsm",
    name: "Mek Center Torso (IS Endo Steel) (TSM)",
    altNames: ['Mek Center Torso (IS Endo Steel) (TSM)', 'Center Torso (IS Endo Steel) (TSM)', 'CT (IS Endo Steel) (TSM)'].map((name) => name),
    category: "mekLocation",
    techRating: "E",
    availability: {
      starLeague: "E",
      successionWars: "E",
      clanInvasion: "E",
    },
    cost: { type: "unitTonnage", multiplier: 1_760 },
    notes: ["Includes Triple-Strength Myomer surcharge from MekHQ replacement part export."],
  },
  mekCenterTorsoClanEndoSteel: {
    id: "mekCenterTorsoClanEndoSteel",
    name: "Mek Center Torso (Clan Endo Steel)",
    altNames: ['Mek Center Torso (Clan Endo Steel)', 'Center Torso (Clan Endo Steel)', 'CT (Clan Endo Steel)'].map((name) => name),
    category: "mekLocation",
    techRating: "E",
    availability: {
      starLeague: "E",
      successionWars: "E",
      clanInvasion: "E",
    },
    cost: { type: "unitTonnage", multiplier: 360 },
  },
  mekCenterTorsoClanEndoSteelTsm: {
    id: "mekCenterTorsoClanEndoSteelTsm",
    name: "Mek Center Torso (Clan Endo Steel) (TSM)",
    altNames: ['Mek Center Torso (Clan Endo Steel) (TSM)', 'Center Torso (Clan Endo Steel) (TSM)', 'CT (Clan Endo Steel) (TSM)'].map((name) => name),
    category: "mekLocation",
    techRating: "E",
    availability: {
      starLeague: "E",
      successionWars: "E",
      clanInvasion: "E",
    },
    cost: { type: "unitTonnage", multiplier: 1_760 },
    notes: ["Includes Triple-Strength Myomer surcharge from MekHQ replacement part export."],
  },
  mekCenterTorsoEndoSteelPrototype: {
    id: "mekCenterTorsoEndoSteelPrototype",
    name: "Mek Center Torso (Endo Steel Prototype)",
    altNames: ['Mek Center Torso (Endo Steel Prototype)', 'Center Torso (Endo Steel Prototype)', 'CT (Endo Steel Prototype)'].map((name) => name),
    category: "mekLocation",
    techRating: "F",
    availability: {
      starLeague: "F",
      successionWars: "F",
      clanInvasion: "F",
    },
    cost: { type: "unitTonnage", multiplier: 680 },
  },
  mekCenterTorsoEndoSteelPrototypeTsm: {
    id: "mekCenterTorsoEndoSteelPrototypeTsm",
    name: "Mek Center Torso (Endo Steel Prototype) (TSM)",
    altNames: ['Mek Center Torso (Endo Steel Prototype) (TSM)', 'Center Torso (Endo Steel Prototype) (TSM)', 'CT (Endo Steel Prototype) (TSM)'].map((name) => name),
    category: "mekLocation",
    techRating: "F",
    availability: {
      starLeague: "F",
      successionWars: "F",
      clanInvasion: "F",
    },
    cost: { type: "unitTonnage", multiplier: 2_080 },
    notes: ["Includes Triple-Strength Myomer surcharge from MekHQ replacement part export."],
  },
  mekLeftTorso: {
    id: "mekLeftTorso",
    name: "Mek Left Torso",
    altNames: ['Mek Left Torso', 'Left Torso', 'LT'].map((name) => name),
    category: "mekLocation",
    techRating: "D",
    availability: {
      starLeague: "C",
      successionWars: "C",
      clanInvasion: "C",
    },
    cost: { type: "unitTonnage", multiplier: 240 },
  },
  mekLeftTorsoTsm: {
    id: "mekLeftTorsoTsm",
    name: "Mek Left Torso (TSM)",
    altNames: ['Mek Left Torso (TSM)', 'Left Torso (TSM)', 'LT (TSM)'].map((name) => name),
    category: "mekLocation",
    techRating: "E",
    availability: {
      starLeague: "D",
      successionWars: "D",
      clanInvasion: "D",
    },
    cost: { type: "unitTonnage", multiplier: 1_640 },
    notes: ["Includes Triple-Strength Myomer surcharge from MekHQ replacement part export."],
  },
  mekLeftTorsoIndustrial: {
    id: "mekLeftTorsoIndustrial",
    name: "Mek Left Torso (Industrial)",
    altNames: ['Mek Left Torso (Industrial)', 'Left Torso (Industrial)', 'LT (Industrial)'].map((name) => name),
    category: "mekLocation",
    techRating: "C",
    availability: {
      starLeague: "C",
      successionWars: "C",
      clanInvasion: "C",
    },
    cost: { type: "unitTonnage", multiplier: 230 },
  },
  mekLeftTorsoIndustrialTsm: {
    id: "mekLeftTorsoIndustrialTsm",
    name: "Mek Left Torso (Industrial) (TSM)",
    altNames: ['Mek Left Torso (Industrial) (TSM)', 'Left Torso (Industrial) (TSM)', 'LT (Industrial) (TSM)'].map((name) => name),
    category: "mekLocation",
    techRating: "E",
    availability: {
      starLeague: "E",
      successionWars: "E",
      clanInvasion: "E",
    },
    cost: { type: "unitTonnage", multiplier: 1_630 },
    notes: ["Industrial structure with TSM surcharge from MekHQ replacement part export."],
  },
  mekLeftTorsoIsEndoSteel: {
    id: "mekLeftTorsoIsEndoSteel",
    name: "Mek Left Torso (IS Endo Steel)",
    altNames: ['Mek Left Torso (IS Endo Steel)', 'Left Torso (IS Endo Steel)', 'LT (IS Endo Steel)'].map((name) => name),
    category: "mekLocation",
    techRating: "E",
    availability: {
      starLeague: "E",
      successionWars: "E",
      clanInvasion: "E",
    },
    cost: { type: "unitTonnage", multiplier: 360 },
  },
  mekLeftTorsoIsEndoSteelTsm: {
    id: "mekLeftTorsoIsEndoSteelTsm",
    name: "Mek Left Torso (IS Endo Steel) (TSM)",
    altNames: ['Mek Left Torso (IS Endo Steel) (TSM)', 'Left Torso (IS Endo Steel) (TSM)', 'LT (IS Endo Steel) (TSM)'].map((name) => name),
    category: "mekLocation",
    techRating: "E",
    availability: {
      starLeague: "E",
      successionWars: "E",
      clanInvasion: "E",
    },
    cost: { type: "unitTonnage", multiplier: 1_760 },
    notes: ["Includes Triple-Strength Myomer surcharge from MekHQ replacement part export."],
  },
  mekLeftTorsoClanEndoSteel: {
    id: "mekLeftTorsoClanEndoSteel",
    name: "Mek Left Torso (Clan Endo Steel)",
    altNames: ['Mek Left Torso (Clan Endo Steel)', 'Left Torso (Clan Endo Steel)', 'LT (Clan Endo Steel)'].map((name) => name),
    category: "mekLocation",
    techRating: "E",
    availability: {
      starLeague: "E",
      successionWars: "E",
      clanInvasion: "E",
    },
    cost: { type: "unitTonnage", multiplier: 360 },
  },
  mekLeftTorsoClanEndoSteelTsm: {
    id: "mekLeftTorsoClanEndoSteelTsm",
    name: "Mek Left Torso (Clan Endo Steel) (TSM)",
    altNames: ['Mek Left Torso (Clan Endo Steel) (TSM)', 'Left Torso (Clan Endo Steel) (TSM)', 'LT (Clan Endo Steel) (TSM)'].map((name) => name),
    category: "mekLocation",
    techRating: "E",
    availability: {
      starLeague: "E",
      successionWars: "E",
      clanInvasion: "E",
    },
    cost: { type: "unitTonnage", multiplier: 1_760 },
    notes: ["Includes Triple-Strength Myomer surcharge from MekHQ replacement part export."],
  },
  mekLeftTorsoEndoSteelPrototype: {
    id: "mekLeftTorsoEndoSteelPrototype",
    name: "Mek Left Torso (Endo Steel Prototype)",
    altNames: ['Mek Left Torso (Endo Steel Prototype)', 'Left Torso (Endo Steel Prototype)', 'LT (Endo Steel Prototype)'].map((name) => name),
    category: "mekLocation",
    techRating: "F",
    availability: {
      starLeague: "F",
      successionWars: "F",
      clanInvasion: "F",
    },
    cost: { type: "unitTonnage", multiplier: 680 },
  },
  mekLeftTorsoEndoSteelPrototypeTsm: {
    id: "mekLeftTorsoEndoSteelPrototypeTsm",
    name: "Mek Left Torso (Endo Steel Prototype) (TSM)",
    altNames: ['Mek Left Torso (Endo Steel Prototype) (TSM)', 'Left Torso (Endo Steel Prototype) (TSM)', 'LT (Endo Steel Prototype) (TSM)'].map((name) => name),
    category: "mekLocation",
    techRating: "F",
    availability: {
      starLeague: "F",
      successionWars: "F",
      clanInvasion: "F",
    },
    cost: { type: "unitTonnage", multiplier: 2_080 },
    notes: ["Includes Triple-Strength Myomer surcharge from MekHQ replacement part export."],
  },
  mekRightTorso: {
    id: "mekRightTorso",
    name: "Mek Right Torso",
    altNames: ['Mek Right Torso', 'Right Torso', 'RT'].map((name) => name),
    category: "mekLocation",
    techRating: "D",
    availability: {
      starLeague: "C",
      successionWars: "C",
      clanInvasion: "C",
    },
    cost: { type: "unitTonnage", multiplier: 240 },
  },
  mekRightTorsoTsm: {
    id: "mekRightTorsoTsm",
    name: "Mek Right Torso (TSM)",
    altNames: ['Mek Right Torso (TSM)', 'Right Torso (TSM)', 'RT (TSM)'].map((name) => name),
    category: "mekLocation",
    techRating: "E",
    availability: {
      starLeague: "D",
      successionWars: "D",
      clanInvasion: "D",
    },
    cost: { type: "unitTonnage", multiplier: 1_640 },
    notes: ["Includes Triple-Strength Myomer surcharge from MekHQ replacement part export."],
  },
  mekRightTorsoIndustrial: {
    id: "mekRightTorsoIndustrial",
    name: "Mek Right Torso (Industrial)",
    altNames: ['Mek Right Torso (Industrial)', 'Right Torso (Industrial)', 'RT (Industrial)'].map((name) => name),
    category: "mekLocation",
    techRating: "C",
    availability: {
      starLeague: "C",
      successionWars: "C",
      clanInvasion: "C",
    },
    cost: { type: "unitTonnage", multiplier: 230 },
  },
  mekRightTorsoIndustrialTsm: {
    id: "mekRightTorsoIndustrialTsm",
    name: "Mek Right Torso (Industrial) (TSM)",
    altNames: ['Mek Right Torso (Industrial) (TSM)', 'Right Torso (Industrial) (TSM)', 'RT (Industrial) (TSM)'].map((name) => name),
    category: "mekLocation",
    techRating: "E",
    availability: {
      starLeague: "E",
      successionWars: "E",
      clanInvasion: "E",
    },
    cost: { type: "unitTonnage", multiplier: 1_630 },
    notes: ["Industrial structure with TSM surcharge from MekHQ replacement part export."],
  },
  mekRightTorsoIsEndoSteel: {
    id: "mekRightTorsoIsEndoSteel",
    name: "Mek Right Torso (IS Endo Steel)",
    altNames: ['Mek Right Torso (IS Endo Steel)', 'Right Torso (IS Endo Steel)', 'RT (IS Endo Steel)'].map((name) => name),
    category: "mekLocation",
    techRating: "E",
    availability: {
      starLeague: "E",
      successionWars: "E",
      clanInvasion: "E",
    },
    cost: { type: "unitTonnage", multiplier: 360 },
  },
  mekRightTorsoIsEndoSteelTsm: {
    id: "mekRightTorsoIsEndoSteelTsm",
    name: "Mek Right Torso (IS Endo Steel) (TSM)",
    altNames: ['Mek Right Torso (IS Endo Steel) (TSM)', 'Right Torso (IS Endo Steel) (TSM)', 'RT (IS Endo Steel) (TSM)'].map((name) => name),
    category: "mekLocation",
    techRating: "E",
    availability: {
      starLeague: "E",
      successionWars: "E",
      clanInvasion: "E",
    },
    cost: { type: "unitTonnage", multiplier: 1_760 },
    notes: ["Includes Triple-Strength Myomer surcharge from MekHQ replacement part export."],
  },
  mekRightTorsoClanEndoSteel: {
    id: "mekRightTorsoClanEndoSteel",
    name: "Mek Right Torso (Clan Endo Steel)",
    altNames: ['Mek Right Torso (Clan Endo Steel)', 'Right Torso (Clan Endo Steel)', 'RT (Clan Endo Steel)'].map((name) => name),
    category: "mekLocation",
    techRating: "E",
    availability: {
      starLeague: "E",
      successionWars: "E",
      clanInvasion: "E",
    },
    cost: { type: "unitTonnage", multiplier: 360 },
  },
  mekRightTorsoClanEndoSteelTsm: {
    id: "mekRightTorsoClanEndoSteelTsm",
    name: "Mek Right Torso (Clan Endo Steel) (TSM)",
    altNames: ['Mek Right Torso (Clan Endo Steel) (TSM)', 'Right Torso (Clan Endo Steel) (TSM)', 'RT (Clan Endo Steel) (TSM)'].map((name) => name),
    category: "mekLocation",
    techRating: "E",
    availability: {
      starLeague: "E",
      successionWars: "E",
      clanInvasion: "E",
    },
    cost: { type: "unitTonnage", multiplier: 1_760 },
    notes: ["Includes Triple-Strength Myomer surcharge from MekHQ replacement part export."],
  },
  mekRightTorsoEndoSteelPrototype: {
    id: "mekRightTorsoEndoSteelPrototype",
    name: "Mek Right Torso (Endo Steel Prototype)",
    altNames: ['Mek Right Torso (Endo Steel Prototype)', 'Right Torso (Endo Steel Prototype)', 'RT (Endo Steel Prototype)'].map((name) => name),
    category: "mekLocation",
    techRating: "F",
    availability: {
      starLeague: "F",
      successionWars: "F",
      clanInvasion: "F",
    },
    cost: { type: "unitTonnage", multiplier: 680 },
  },
  mekRightTorsoEndoSteelPrototypeTsm: {
    id: "mekRightTorsoEndoSteelPrototypeTsm",
    name: "Mek Right Torso (Endo Steel Prototype) (TSM)",
    altNames: ['Mek Right Torso (Endo Steel Prototype) (TSM)', 'Right Torso (Endo Steel Prototype) (TSM)', 'RT (Endo Steel Prototype) (TSM)'].map((name) => name),
    category: "mekLocation",
    techRating: "F",
    availability: {
      starLeague: "F",
      successionWars: "F",
      clanInvasion: "F",
    },
    cost: { type: "unitTonnage", multiplier: 2_080 },
    notes: ["Includes Triple-Strength Myomer surcharge from MekHQ replacement part export."],
  },
  mekLeftArm: {
    id: "mekLeftArm",
    name: "Mek Left Arm",
    altNames: ['Mek Left Arm', 'Left Arm', 'LA'].map((name) => name),
    category: "mekLocation",
    techRating: "D",
    availability: {
      starLeague: "C",
      successionWars: "C",
      clanInvasion: "C",
    },
    cost: { type: "unitTonnage", multiplier: 240 },
  },
  mekLeftArmTsm: {
    id: "mekLeftArmTsm",
    name: "Mek Left Arm (TSM)",
    altNames: ['Mek Left Arm (TSM)', 'Left Arm (TSM)', 'LA (TSM)'].map((name) => name),
    category: "mekLocation",
    techRating: "E",
    availability: {
      starLeague: "D",
      successionWars: "D",
      clanInvasion: "D",
    },
    cost: { type: "unitTonnage", multiplier: 1_640 },
    notes: ["Includes Triple-Strength Myomer surcharge from MekHQ replacement part export."],
  },
  mekLeftArmIndustrial: {
    id: "mekLeftArmIndustrial",
    name: "Mek Left Arm (Industrial)",
    altNames: ['Mek Left Arm (Industrial)', 'Left Arm (Industrial)', 'LA (Industrial)'].map((name) => name),
    category: "mekLocation",
    techRating: "C",
    availability: {
      starLeague: "C",
      successionWars: "C",
      clanInvasion: "C",
    },
    cost: { type: "unitTonnage", multiplier: 230 },
  },
  mekLeftArmIndustrialTsm: {
    id: "mekLeftArmIndustrialTsm",
    name: "Mek Left Arm (Industrial) (TSM)",
    altNames: ['Mek Left Arm (Industrial) (TSM)', 'Left Arm (Industrial) (TSM)', 'LA (Industrial) (TSM)'].map((name) => name),
    category: "mekLocation",
    techRating: "E",
    availability: {
      starLeague: "E",
      successionWars: "E",
      clanInvasion: "E",
    },
    cost: { type: "unitTonnage", multiplier: 1_630 },
    notes: ["Industrial structure with TSM surcharge from MekHQ replacement part export."],
  },
  mekLeftArmIsEndoSteel: {
    id: "mekLeftArmIsEndoSteel",
    name: "Mek Left Arm (IS Endo Steel)",
    altNames: ['Mek Left Arm (IS Endo Steel)', 'Left Arm (IS Endo Steel)', 'LA (IS Endo Steel)'].map((name) => name),
    category: "mekLocation",
    techRating: "E",
    availability: {
      starLeague: "E",
      successionWars: "E",
      clanInvasion: "E",
    },
    cost: { type: "unitTonnage", multiplier: 360 },
  },
  mekLeftArmIsEndoSteelTsm: {
    id: "mekLeftArmIsEndoSteelTsm",
    name: "Mek Left Arm (IS Endo Steel) (TSM)",
    altNames: ['Mek Left Arm (IS Endo Steel) (TSM)', 'Left Arm (IS Endo Steel) (TSM)', 'LA (IS Endo Steel) (TSM)'].map((name) => name),
    category: "mekLocation",
    techRating: "E",
    availability: {
      starLeague: "E",
      successionWars: "E",
      clanInvasion: "E",
    },
    cost: { type: "unitTonnage", multiplier: 1_760 },
    notes: ["Includes Triple-Strength Myomer surcharge from MekHQ replacement part export."],
  },
  mekLeftArmClanEndoSteel: {
    id: "mekLeftArmClanEndoSteel",
    name: "Mek Left Arm (Clan Endo Steel)",
    altNames: ['Mek Left Arm (Clan Endo Steel)', 'Left Arm (Clan Endo Steel)', 'LA (Clan Endo Steel)'].map((name) => name),
    category: "mekLocation",
    techRating: "E",
    availability: {
      starLeague: "E",
      successionWars: "E",
      clanInvasion: "E",
    },
    cost: { type: "unitTonnage", multiplier: 360 },
  },
  mekLeftArmClanEndoSteelTsm: {
    id: "mekLeftArmClanEndoSteelTsm",
    name: "Mek Left Arm (Clan Endo Steel) (TSM)",
    altNames: ['Mek Left Arm (Clan Endo Steel) (TSM)', 'Left Arm (Clan Endo Steel) (TSM)', 'LA (Clan Endo Steel) (TSM)'].map((name) => name),
    category: "mekLocation",
    techRating: "E",
    availability: {
      starLeague: "E",
      successionWars: "E",
      clanInvasion: "E",
    },
    cost: { type: "unitTonnage", multiplier: 1_760 },
    notes: ["Includes Triple-Strength Myomer surcharge from MekHQ replacement part export."],
  },
  mekLeftArmEndoSteelPrototype: {
    id: "mekLeftArmEndoSteelPrototype",
    name: "Mek Left Arm (Endo Steel Prototype)",
    altNames: ['Mek Left Arm (Endo Steel Prototype)', 'Left Arm (Endo Steel Prototype)', 'LA (Endo Steel Prototype)'].map((name) => name),
    category: "mekLocation",
    techRating: "F",
    availability: {
      starLeague: "F",
      successionWars: "F",
      clanInvasion: "F",
    },
    cost: { type: "unitTonnage", multiplier: 680 },
  },
  mekLeftArmEndoSteelPrototypeTsm: {
    id: "mekLeftArmEndoSteelPrototypeTsm",
    name: "Mek Left Arm (Endo Steel Prototype) (TSM)",
    altNames: ['Mek Left Arm (Endo Steel Prototype) (TSM)', 'Left Arm (Endo Steel Prototype) (TSM)', 'LA (Endo Steel Prototype) (TSM)'].map((name) => name),
    category: "mekLocation",
    techRating: "F",
    availability: {
      starLeague: "F",
      successionWars: "F",
      clanInvasion: "F",
    },
    cost: { type: "unitTonnage", multiplier: 2_080 },
    notes: ["Includes Triple-Strength Myomer surcharge from MekHQ replacement part export."],
  },
  mekRightArm: {
    id: "mekRightArm",
    name: "Mek Right Arm",
    altNames: ['Mek Right Arm', 'Right Arm', 'RA'].map((name) => name),
    category: "mekLocation",
    techRating: "D",
    availability: {
      starLeague: "C",
      successionWars: "C",
      clanInvasion: "C",
    },
    cost: { type: "unitTonnage", multiplier: 240 },
  },
  mekRightArmTsm: {
    id: "mekRightArmTsm",
    name: "Mek Right Arm (TSM)",
    altNames: ['Mek Right Arm (TSM)', 'Right Arm (TSM)', 'RA (TSM)'].map((name) => name),
    category: "mekLocation",
    techRating: "E",
    availability: {
      starLeague: "D",
      successionWars: "D",
      clanInvasion: "D",
    },
    cost: { type: "unitTonnage", multiplier: 1_640 },
    notes: ["Includes Triple-Strength Myomer surcharge from MekHQ replacement part export."],
  },
  mekRightArmIndustrial: {
    id: "mekRightArmIndustrial",
    name: "Mek Right Arm (Industrial)",
    altNames: ['Mek Right Arm (Industrial)', 'Right Arm (Industrial)', 'RA (Industrial)'].map((name) => name),
    category: "mekLocation",
    techRating: "C",
    availability: {
      starLeague: "C",
      successionWars: "C",
      clanInvasion: "C",
    },
    cost: { type: "unitTonnage", multiplier: 230 },
  },
  mekRightArmIndustrialTsm: {
    id: "mekRightArmIndustrialTsm",
    name: "Mek Right Arm (Industrial) (TSM)",
    altNames: ['Mek Right Arm (Industrial) (TSM)', 'Right Arm (Industrial) (TSM)', 'RA (Industrial) (TSM)'].map((name) => name),
    category: "mekLocation",
    techRating: "E",
    availability: {
      starLeague: "E",
      successionWars: "E",
      clanInvasion: "E",
    },
    cost: { type: "unitTonnage", multiplier: 1_630 },
    notes: ["Industrial structure with TSM surcharge from MekHQ replacement part export."],
  },
  mekRightArmIsEndoSteel: {
    id: "mekRightArmIsEndoSteel",
    name: "Mek Right Arm (IS Endo Steel)",
    altNames: ['Mek Right Arm (IS Endo Steel)', 'Right Arm (IS Endo Steel)', 'RA (IS Endo Steel)'].map((name) => name),
    category: "mekLocation",
    techRating: "E",
    availability: {
      starLeague: "E",
      successionWars: "E",
      clanInvasion: "E",
    },
    cost: { type: "unitTonnage", multiplier: 360 },
  },
  mekRightArmIsEndoSteelTsm: {
    id: "mekRightArmIsEndoSteelTsm",
    name: "Mek Right Arm (IS Endo Steel) (TSM)",
    altNames: ['Mek Right Arm (IS Endo Steel) (TSM)', 'Right Arm (IS Endo Steel) (TSM)', 'RA (IS Endo Steel) (TSM)'].map((name) => name),
    category: "mekLocation",
    techRating: "E",
    availability: {
      starLeague: "E",
      successionWars: "E",
      clanInvasion: "E",
    },
    cost: { type: "unitTonnage", multiplier: 1_760 },
    notes: ["Includes Triple-Strength Myomer surcharge from MekHQ replacement part export."],
  },
  mekRightArmClanEndoSteel: {
    id: "mekRightArmClanEndoSteel",
    name: "Mek Right Arm (Clan Endo Steel)",
    altNames: ['Mek Right Arm (Clan Endo Steel)', 'Right Arm (Clan Endo Steel)', 'RA (Clan Endo Steel)'].map((name) => name),
    category: "mekLocation",
    techRating: "E",
    availability: {
      starLeague: "E",
      successionWars: "E",
      clanInvasion: "E",
    },
    cost: { type: "unitTonnage", multiplier: 360 },
  },
  mekRightArmClanEndoSteelTsm: {
    id: "mekRightArmClanEndoSteelTsm",
    name: "Mek Right Arm (Clan Endo Steel) (TSM)",
    altNames: ['Mek Right Arm (Clan Endo Steel) (TSM)', 'Right Arm (Clan Endo Steel) (TSM)', 'RA (Clan Endo Steel) (TSM)'].map((name) => name),
    category: "mekLocation",
    techRating: "E",
    availability: {
      starLeague: "E",
      successionWars: "E",
      clanInvasion: "E",
    },
    cost: { type: "unitTonnage", multiplier: 1_760 },
    notes: ["Includes Triple-Strength Myomer surcharge from MekHQ replacement part export."],
  },
  mekRightArmEndoSteelPrototype: {
    id: "mekRightArmEndoSteelPrototype",
    name: "Mek Right Arm (Endo Steel Prototype)",
    altNames: ['Mek Right Arm (Endo Steel Prototype)', 'Right Arm (Endo Steel Prototype)', 'RA (Endo Steel Prototype)'].map((name) => name),
    category: "mekLocation",
    techRating: "F",
    availability: {
      starLeague: "F",
      successionWars: "F",
      clanInvasion: "F",
    },
    cost: { type: "unitTonnage", multiplier: 680 },
  },
  mekRightArmEndoSteelPrototypeTsm: {
    id: "mekRightArmEndoSteelPrototypeTsm",
    name: "Mek Right Arm (Endo Steel Prototype) (TSM)",
    altNames: ['Mek Right Arm (Endo Steel Prototype) (TSM)', 'Right Arm (Endo Steel Prototype) (TSM)', 'RA (Endo Steel Prototype) (TSM)'].map((name) => name),
    category: "mekLocation",
    techRating: "F",
    availability: {
      starLeague: "F",
      successionWars: "F",
      clanInvasion: "F",
    },
    cost: { type: "unitTonnage", multiplier: 2_080 },
    notes: ["Includes Triple-Strength Myomer surcharge from MekHQ replacement part export."],
  },
  mekLeftLeg: {
    id: "mekLeftLeg",
    name: "Mek Left Leg",
    altNames: ['Mek Left Leg', 'Left Leg', 'LL'].map((name) => name),
    category: "mekLocation",
    techRating: "D",
    availability: {
      starLeague: "C",
      successionWars: "C",
      clanInvasion: "C",
    },
    cost: { type: "unitTonnage", multiplier: 240 },
  },
  mekLeftLegTsm: {
    id: "mekLeftLegTsm",
    name: "Mek Left Leg (TSM)",
    altNames: ['Mek Left Leg (TSM)', 'Left Leg (TSM)', 'LL (TSM)'].map((name) => name),
    category: "mekLocation",
    techRating: "E",
    availability: {
      starLeague: "D",
      successionWars: "D",
      clanInvasion: "D",
    },
    cost: { type: "unitTonnage", multiplier: 1_640 },
    notes: ["Includes Triple-Strength Myomer surcharge from MekHQ replacement part export."],
  },
  mekLeftLegIndustrial: {
    id: "mekLeftLegIndustrial",
    name: "Mek Left Leg (Industrial)",
    altNames: ['Mek Left Leg (Industrial)', 'Left Leg (Industrial)', 'LL (Industrial)'].map((name) => name),
    category: "mekLocation",
    techRating: "C",
    availability: {
      starLeague: "C",
      successionWars: "C",
      clanInvasion: "C",
    },
    cost: { type: "unitTonnage", multiplier: 230 },
  },
  mekLeftLegIndustrialTsm: {
    id: "mekLeftLegIndustrialTsm",
    name: "Mek Left Leg (Industrial) (TSM)",
    altNames: ['Mek Left Leg (Industrial) (TSM)', 'Left Leg (Industrial) (TSM)', 'LL (Industrial) (TSM)'].map((name) => name),
    category: "mekLocation",
    techRating: "E",
    availability: {
      starLeague: "E",
      successionWars: "E",
      clanInvasion: "E",
    },
    cost: { type: "unitTonnage", multiplier: 1_630 },
    notes: ["Industrial structure with TSM surcharge from MekHQ replacement part export."],
  },
  mekLeftLegIsEndoSteel: {
    id: "mekLeftLegIsEndoSteel",
    name: "Mek Left Leg (IS Endo Steel)",
    altNames: ['Mek Left Leg (IS Endo Steel)', 'Left Leg (IS Endo Steel)', 'LL (IS Endo Steel)'].map((name) => name),
    category: "mekLocation",
    techRating: "E",
    availability: {
      starLeague: "E",
      successionWars: "E",
      clanInvasion: "E",
    },
    cost: { type: "unitTonnage", multiplier: 360 },
  },
  mekLeftLegIsEndoSteelTsm: {
    id: "mekLeftLegIsEndoSteelTsm",
    name: "Mek Left Leg (IS Endo Steel) (TSM)",
    altNames: ['Mek Left Leg (IS Endo Steel) (TSM)', 'Left Leg (IS Endo Steel) (TSM)', 'LL (IS Endo Steel) (TSM)'].map((name) => name),
    category: "mekLocation",
    techRating: "E",
    availability: {
      starLeague: "E",
      successionWars: "E",
      clanInvasion: "E",
    },
    cost: { type: "unitTonnage", multiplier: 1_760 },
    notes: ["Includes Triple-Strength Myomer surcharge from MekHQ replacement part export."],
  },
  mekLeftLegClanEndoSteel: {
    id: "mekLeftLegClanEndoSteel",
    name: "Mek Left Leg (Clan Endo Steel)",
    altNames: ['Mek Left Leg (Clan Endo Steel)', 'Left Leg (Clan Endo Steel)', 'LL (Clan Endo Steel)'].map((name) => name),
    category: "mekLocation",
    techRating: "E",
    availability: {
      starLeague: "E",
      successionWars: "E",
      clanInvasion: "E",
    },
    cost: { type: "unitTonnage", multiplier: 360 },
  },
  mekLeftLegClanEndoSteelTsm: {
    id: "mekLeftLegClanEndoSteelTsm",
    name: "Mek Left Leg (Clan Endo Steel) (TSM)",
    altNames: ['Mek Left Leg (Clan Endo Steel) (TSM)', 'Left Leg (Clan Endo Steel) (TSM)', 'LL (Clan Endo Steel) (TSM)'].map((name) => name),
    category: "mekLocation",
    techRating: "E",
    availability: {
      starLeague: "E",
      successionWars: "E",
      clanInvasion: "E",
    },
    cost: { type: "unitTonnage", multiplier: 1_760 },
    notes: ["Includes Triple-Strength Myomer surcharge from MekHQ replacement part export."],
  },
  mekLeftLegEndoSteelPrototype: {
    id: "mekLeftLegEndoSteelPrototype",
    name: "Mek Left Leg (Endo Steel Prototype)",
    altNames: ['Mek Left Leg (Endo Steel Prototype)', 'Left Leg (Endo Steel Prototype)', 'LL (Endo Steel Prototype)'].map((name) => name),
    category: "mekLocation",
    techRating: "F",
    availability: {
      starLeague: "F",
      successionWars: "F",
      clanInvasion: "F",
    },
    cost: { type: "unitTonnage", multiplier: 680 },
  },
  mekLeftLegEndoSteelPrototypeTsm: {
    id: "mekLeftLegEndoSteelPrototypeTsm",
    name: "Mek Left Leg (Endo Steel Prototype) (TSM)",
    altNames: ['Mek Left Leg (Endo Steel Prototype) (TSM)', 'Left Leg (Endo Steel Prototype) (TSM)', 'LL (Endo Steel Prototype) (TSM)'].map((name) => name),
    category: "mekLocation",
    techRating: "F",
    availability: {
      starLeague: "F",
      successionWars: "F",
      clanInvasion: "F",
    },
    cost: { type: "unitTonnage", multiplier: 2_080 },
    notes: ["Includes Triple-Strength Myomer surcharge from MekHQ replacement part export."],
  },
  mekRightLeg: {
    id: "mekRightLeg",
    name: "Mek Right Leg",
    altNames: ['Mek Right Leg', 'Right Leg', 'RL'].map((name) => name),
    category: "mekLocation",
    techRating: "D",
    availability: {
      starLeague: "C",
      successionWars: "C",
      clanInvasion: "C",
    },
    cost: { type: "unitTonnage", multiplier: 240 },
  },
  mekRightLegTsm: {
    id: "mekRightLegTsm",
    name: "Mek Right Leg (TSM)",
    altNames: ['Mek Right Leg (TSM)', 'Right Leg (TSM)', 'RL (TSM)'].map((name) => name),
    category: "mekLocation",
    techRating: "E",
    availability: {
      starLeague: "D",
      successionWars: "D",
      clanInvasion: "D",
    },
    cost: { type: "unitTonnage", multiplier: 1_640 },
    notes: ["Includes Triple-Strength Myomer surcharge from MekHQ replacement part export."],
  },
  mekRightLegIndustrial: {
    id: "mekRightLegIndustrial",
    name: "Mek Right Leg (Industrial)",
    altNames: ['Mek Right Leg (Industrial)', 'Right Leg (Industrial)', 'RL (Industrial)'].map((name) => name),
    category: "mekLocation",
    techRating: "C",
    availability: {
      starLeague: "C",
      successionWars: "C",
      clanInvasion: "C",
    },
    cost: { type: "unitTonnage", multiplier: 230 },
  },
  mekRightLegIndustrialTsm: {
    id: "mekRightLegIndustrialTsm",
    name: "Mek Right Leg (Industrial) (TSM)",
    altNames: ['Mek Right Leg (Industrial) (TSM)', 'Right Leg (Industrial) (TSM)', 'RL (Industrial) (TSM)'].map((name) => name),
    category: "mekLocation",
    techRating: "E",
    availability: {
      starLeague: "E",
      successionWars: "E",
      clanInvasion: "E",
    },
    cost: { type: "unitTonnage", multiplier: 1_630 },
    notes: ["Industrial structure with TSM surcharge from MekHQ replacement part export."],
  },
  mekRightLegIsEndoSteel: {
    id: "mekRightLegIsEndoSteel",
    name: "Mek Right Leg (IS Endo Steel)",
    altNames: ['Mek Right Leg (IS Endo Steel)', 'Right Leg (IS Endo Steel)', 'RL (IS Endo Steel)'].map((name) => name),
    category: "mekLocation",
    techRating: "E",
    availability: {
      starLeague: "E",
      successionWars: "E",
      clanInvasion: "E",
    },
    cost: { type: "unitTonnage", multiplier: 360 },
  },
  mekRightLegIsEndoSteelTsm: {
    id: "mekRightLegIsEndoSteelTsm",
    name: "Mek Right Leg (IS Endo Steel) (TSM)",
    altNames: ['Mek Right Leg (IS Endo Steel) (TSM)', 'Right Leg (IS Endo Steel) (TSM)', 'RL (IS Endo Steel) (TSM)'].map((name) => name),
    category: "mekLocation",
    techRating: "E",
    availability: {
      starLeague: "E",
      successionWars: "E",
      clanInvasion: "E",
    },
    cost: { type: "unitTonnage", multiplier: 1_760 },
    notes: ["Includes Triple-Strength Myomer surcharge from MekHQ replacement part export."],
  },
  mekRightLegClanEndoSteel: {
    id: "mekRightLegClanEndoSteel",
    name: "Mek Right Leg (Clan Endo Steel)",
    altNames: ['Mek Right Leg (Clan Endo Steel)', 'Right Leg (Clan Endo Steel)', 'RL (Clan Endo Steel)'].map((name) => name),
    category: "mekLocation",
    techRating: "E",
    availability: {
      starLeague: "E",
      successionWars: "E",
      clanInvasion: "E",
    },
    cost: { type: "unitTonnage", multiplier: 360 },
  },
  mekRightLegClanEndoSteelTsm: {
    id: "mekRightLegClanEndoSteelTsm",
    name: "Mek Right Leg (Clan Endo Steel) (TSM)",
    altNames: ['Mek Right Leg (Clan Endo Steel) (TSM)', 'Right Leg (Clan Endo Steel) (TSM)', 'RL (Clan Endo Steel) (TSM)'].map((name) => name),
    category: "mekLocation",
    techRating: "E",
    availability: {
      starLeague: "E",
      successionWars: "E",
      clanInvasion: "E",
    },
    cost: { type: "unitTonnage", multiplier: 1_760 },
    notes: ["Includes Triple-Strength Myomer surcharge from MekHQ replacement part export."],
  },
  mekRightLegEndoSteelPrototype: {
    id: "mekRightLegEndoSteelPrototype",
    name: "Mek Right Leg (Endo Steel Prototype)",
    altNames: ['Mek Right Leg (Endo Steel Prototype)', 'Right Leg (Endo Steel Prototype)', 'RL (Endo Steel Prototype)'].map((name) => name),
    category: "mekLocation",
    techRating: "F",
    availability: {
      starLeague: "F",
      successionWars: "F",
      clanInvasion: "F",
    },
    cost: { type: "unitTonnage", multiplier: 680 },
  },
  mekRightLegEndoSteelPrototypeTsm: {
    id: "mekRightLegEndoSteelPrototypeTsm",
    name: "Mek Right Leg (Endo Steel Prototype) (TSM)",
    altNames: ['Mek Right Leg (Endo Steel Prototype) (TSM)', 'Right Leg (Endo Steel Prototype) (TSM)', 'RL (Endo Steel Prototype) (TSM)'].map((name) => name),
    category: "mekLocation",
    techRating: "F",
    availability: {
      starLeague: "F",
      successionWars: "F",
      clanInvasion: "F",
    },
    cost: { type: "unitTonnage", multiplier: 2_080 },
    notes: ["Includes Triple-Strength Myomer surcharge from MekHQ replacement part export."],
  },
  mekCenterLeg: {
    id: "mekCenterLeg",
    name: "Mek Center Leg",
    altNames: ['Mek Center Leg', 'Center Leg', 'CL'].map((name) => name),
    category: "mekLocation",
    techRating: "D",
    availability: {
      starLeague: "C",
      successionWars: "C",
      clanInvasion: "C",
    },
    cost: { type: "unitTonnage", multiplier: 240 },
    notes: ["Non-standard biped location; included from MekHQ location replacement export."],
  },
  mekCenterLegTsm: {
    id: "mekCenterLegTsm",
    name: "Mek Center Leg (TSM)",
    altNames: ['Mek Center Leg (TSM)', 'Center Leg (TSM)', 'CL (TSM)'].map((name) => name),
    category: "mekLocation",
    techRating: "E",
    availability: {
      starLeague: "D",
      successionWars: "D",
      clanInvasion: "D",
    },
    cost: { type: "unitTonnage", multiplier: 1_640 },
    notes: ["Includes Triple-Strength Myomer surcharge from MekHQ replacement part export.", "Non-standard biped location; included from MekHQ location replacement export."],
  },
  mekCenterLegIndustrial: {
    id: "mekCenterLegIndustrial",
    name: "Mek Center Leg (Industrial)",
    altNames: ['Mek Center Leg (Industrial)', 'Center Leg (Industrial)', 'CL (Industrial)'].map((name) => name),
    category: "mekLocation",
    techRating: "C",
    availability: {
      starLeague: "C",
      successionWars: "C",
      clanInvasion: "C",
    },
    cost: { type: "unitTonnage", multiplier: 230 },
    notes: ["Non-standard biped location; included from MekHQ location replacement export."],
  },
  mekCenterLegIndustrialTsm: {
    id: "mekCenterLegIndustrialTsm",
    name: "Mek Center Leg (Industrial) (TSM)",
    altNames: ['Mek Center Leg (Industrial) (TSM)', 'Center Leg (Industrial) (TSM)', 'CL (Industrial) (TSM)'].map((name) => name),
    category: "mekLocation",
    techRating: "E",
    availability: {
      starLeague: "E",
      successionWars: "E",
      clanInvasion: "E",
    },
    cost: { type: "unitTonnage", multiplier: 1_630 },
    notes: ["Industrial structure with TSM surcharge from MekHQ replacement part export.", "Non-standard biped location; included from MekHQ location replacement export."],
  },
  mekCenterLegIsEndoSteel: {
    id: "mekCenterLegIsEndoSteel",
    name: "Mek Center Leg (IS Endo Steel)",
    altNames: ['Mek Center Leg (IS Endo Steel)', 'Center Leg (IS Endo Steel)', 'CL (IS Endo Steel)'].map((name) => name),
    category: "mekLocation",
    techRating: "E",
    availability: {
      starLeague: "E",
      successionWars: "E",
      clanInvasion: "E",
    },
    cost: { type: "unitTonnage", multiplier: 360 },
    notes: ["Non-standard biped location; included from MekHQ location replacement export."],
  },
  mekCenterLegIsEndoSteelTsm: {
    id: "mekCenterLegIsEndoSteelTsm",
    name: "Mek Center Leg (IS Endo Steel) (TSM)",
    altNames: ['Mek Center Leg (IS Endo Steel) (TSM)', 'Center Leg (IS Endo Steel) (TSM)', 'CL (IS Endo Steel) (TSM)'].map((name) => name),
    category: "mekLocation",
    techRating: "E",
    availability: {
      starLeague: "E",
      successionWars: "E",
      clanInvasion: "E",
    },
    cost: { type: "unitTonnage", multiplier: 1_760 },
    notes: ["Includes Triple-Strength Myomer surcharge from MekHQ replacement part export.", "Non-standard biped location; included from MekHQ location replacement export."],
  },
  mekCenterLegClanEndoSteel: {
    id: "mekCenterLegClanEndoSteel",
    name: "Mek Center Leg (Clan Endo Steel)",
    altNames: ['Mek Center Leg (Clan Endo Steel)', 'Center Leg (Clan Endo Steel)', 'CL (Clan Endo Steel)'].map((name) => name),
    category: "mekLocation",
    techRating: "E",
    availability: {
      starLeague: "E",
      successionWars: "E",
      clanInvasion: "E",
    },
    cost: { type: "unitTonnage", multiplier: 360 },
    notes: ["Non-standard biped location; included from MekHQ location replacement export."],
  },
  mekCenterLegClanEndoSteelTsm: {
    id: "mekCenterLegClanEndoSteelTsm",
    name: "Mek Center Leg (Clan Endo Steel) (TSM)",
    altNames: ['Mek Center Leg (Clan Endo Steel) (TSM)', 'Center Leg (Clan Endo Steel) (TSM)', 'CL (Clan Endo Steel) (TSM)'].map((name) => name),
    category: "mekLocation",
    techRating: "E",
    availability: {
      starLeague: "E",
      successionWars: "E",
      clanInvasion: "E",
    },
    cost: { type: "unitTonnage", multiplier: 1_760 },
    notes: ["Includes Triple-Strength Myomer surcharge from MekHQ replacement part export.", "Non-standard biped location; included from MekHQ location replacement export."],
  },
  mekCenterLegEndoSteelPrototype: {
    id: "mekCenterLegEndoSteelPrototype",
    name: "Mek Center Leg (Endo Steel Prototype)",
    altNames: ['Mek Center Leg (Endo Steel Prototype)', 'Center Leg (Endo Steel Prototype)', 'CL (Endo Steel Prototype)'].map((name) => name),
    category: "mekLocation",
    techRating: "F",
    availability: {
      starLeague: "F",
      successionWars: "F",
      clanInvasion: "F",
    },
    cost: { type: "unitTonnage", multiplier: 680 },
    notes: ["Non-standard biped location; included from MekHQ location replacement export."],
  },
  mekCenterLegEndoSteelPrototypeTsm: {
    id: "mekCenterLegEndoSteelPrototypeTsm",
    name: "Mek Center Leg (Endo Steel Prototype) (TSM)",
    altNames: ['Mek Center Leg (Endo Steel Prototype) (TSM)', 'Center Leg (Endo Steel Prototype) (TSM)', 'CL (Endo Steel Prototype) (TSM)'].map((name) => name),
    category: "mekLocation",
    techRating: "F",
    availability: {
      starLeague: "F",
      successionWars: "F",
      clanInvasion: "F",
    },
    cost: { type: "unitTonnage", multiplier: 2_080 },
    notes: ["Includes Triple-Strength Myomer surcharge from MekHQ replacement part export.", "Non-standard biped location; included from MekHQ location replacement export."],
  },
  mekFrontLeftLeg: {
    id: "mekFrontLeftLeg",
    name: "Mek Front Left Leg",
    altNames: ['Mek Front Left Leg', 'Front Left Leg', 'FLL'].map((name) => name),
    category: "mekLocation",
    techRating: "D",
    availability: {
      starLeague: "C",
      successionWars: "C",
      clanInvasion: "C",
    },
    cost: { type: "unitTonnage", multiplier: 240 },
    notes: ["Non-standard biped location; included from MekHQ location replacement export."],
  },
  mekFrontLeftLegTsm: {
    id: "mekFrontLeftLegTsm",
    name: "Mek Front Left Leg (TSM)",
    altNames: ['Mek Front Left Leg (TSM)', 'Front Left Leg (TSM)', 'FLL (TSM)'].map((name) => name),
    category: "mekLocation",
    techRating: "E",
    availability: {
      starLeague: "D",
      successionWars: "D",
      clanInvasion: "D",
    },
    cost: { type: "unitTonnage", multiplier: 1_640 },
    notes: ["Includes Triple-Strength Myomer surcharge from MekHQ replacement part export.", "Non-standard biped location; included from MekHQ location replacement export."],
  },
  mekFrontLeftLegIndustrial: {
    id: "mekFrontLeftLegIndustrial",
    name: "Mek Front Left Leg (Industrial)",
    altNames: ['Mek Front Left Leg (Industrial)', 'Front Left Leg (Industrial)', 'FLL (Industrial)'].map((name) => name),
    category: "mekLocation",
    techRating: "C",
    availability: {
      starLeague: "C",
      successionWars: "C",
      clanInvasion: "C",
    },
    cost: { type: "unitTonnage", multiplier: 230 },
    notes: ["Non-standard biped location; included from MekHQ location replacement export."],
  },
  mekFrontLeftLegIndustrialTsm: {
    id: "mekFrontLeftLegIndustrialTsm",
    name: "Mek Front Left Leg (Industrial) (TSM)",
    altNames: ['Mek Front Left Leg (Industrial) (TSM)', 'Front Left Leg (Industrial) (TSM)', 'FLL (Industrial) (TSM)'].map((name) => name),
    category: "mekLocation",
    techRating: "E",
    availability: {
      starLeague: "E",
      successionWars: "E",
      clanInvasion: "E",
    },
    cost: { type: "unitTonnage", multiplier: 1_630 },
    notes: ["Industrial structure with TSM surcharge from MekHQ replacement part export.", "Non-standard biped location; included from MekHQ location replacement export."],
  },
  mekFrontLeftLegIsEndoSteel: {
    id: "mekFrontLeftLegIsEndoSteel",
    name: "Mek Front Left Leg (IS Endo Steel)",
    altNames: ['Mek Front Left Leg (IS Endo Steel)', 'Front Left Leg (IS Endo Steel)', 'FLL (IS Endo Steel)'].map((name) => name),
    category: "mekLocation",
    techRating: "E",
    availability: {
      starLeague: "E",
      successionWars: "E",
      clanInvasion: "E",
    },
    cost: { type: "unitTonnage", multiplier: 360 },
    notes: ["Non-standard biped location; included from MekHQ location replacement export."],
  },
  mekFrontLeftLegIsEndoSteelTsm: {
    id: "mekFrontLeftLegIsEndoSteelTsm",
    name: "Mek Front Left Leg (IS Endo Steel) (TSM)",
    altNames: ['Mek Front Left Leg (IS Endo Steel) (TSM)', 'Front Left Leg (IS Endo Steel) (TSM)', 'FLL (IS Endo Steel) (TSM)'].map((name) => name),
    category: "mekLocation",
    techRating: "E",
    availability: {
      starLeague: "E",
      successionWars: "E",
      clanInvasion: "E",
    },
    cost: { type: "unitTonnage", multiplier: 1_760 },
    notes: ["Includes Triple-Strength Myomer surcharge from MekHQ replacement part export.", "Non-standard biped location; included from MekHQ location replacement export."],
  },
  mekFrontLeftLegClanEndoSteel: {
    id: "mekFrontLeftLegClanEndoSteel",
    name: "Mek Front Left Leg (Clan Endo Steel)",
    altNames: ['Mek Front Left Leg (Clan Endo Steel)', 'Front Left Leg (Clan Endo Steel)', 'FLL (Clan Endo Steel)'].map((name) => name),
    category: "mekLocation",
    techRating: "E",
    availability: {
      starLeague: "E",
      successionWars: "E",
      clanInvasion: "E",
    },
    cost: { type: "unitTonnage", multiplier: 360 },
    notes: ["Non-standard biped location; included from MekHQ location replacement export."],
  },
  mekFrontLeftLegClanEndoSteelTsm: {
    id: "mekFrontLeftLegClanEndoSteelTsm",
    name: "Mek Front Left Leg (Clan Endo Steel) (TSM)",
    altNames: ['Mek Front Left Leg (Clan Endo Steel) (TSM)', 'Front Left Leg (Clan Endo Steel) (TSM)', 'FLL (Clan Endo Steel) (TSM)'].map((name) => name),
    category: "mekLocation",
    techRating: "E",
    availability: {
      starLeague: "E",
      successionWars: "E",
      clanInvasion: "E",
    },
    cost: { type: "unitTonnage", multiplier: 1_760 },
    notes: ["Includes Triple-Strength Myomer surcharge from MekHQ replacement part export.", "Non-standard biped location; included from MekHQ location replacement export."],
  },
  mekFrontLeftLegEndoSteelPrototype: {
    id: "mekFrontLeftLegEndoSteelPrototype",
    name: "Mek Front Left Leg (Endo Steel Prototype)",
    altNames: ['Mek Front Left Leg (Endo Steel Prototype)', 'Front Left Leg (Endo Steel Prototype)', 'FLL (Endo Steel Prototype)'].map((name) => name),
    category: "mekLocation",
    techRating: "F",
    availability: {
      starLeague: "F",
      successionWars: "F",
      clanInvasion: "F",
    },
    cost: { type: "unitTonnage", multiplier: 680 },
    notes: ["Non-standard biped location; included from MekHQ location replacement export."],
  },
  mekFrontLeftLegEndoSteelPrototypeTsm: {
    id: "mekFrontLeftLegEndoSteelPrototypeTsm",
    name: "Mek Front Left Leg (Endo Steel Prototype) (TSM)",
    altNames: ['Mek Front Left Leg (Endo Steel Prototype) (TSM)', 'Front Left Leg (Endo Steel Prototype) (TSM)', 'FLL (Endo Steel Prototype) (TSM)'].map((name) => name),
    category: "mekLocation",
    techRating: "F",
    availability: {
      starLeague: "F",
      successionWars: "F",
      clanInvasion: "F",
    },
    cost: { type: "unitTonnage", multiplier: 2_080 },
    notes: ["Includes Triple-Strength Myomer surcharge from MekHQ replacement part export.", "Non-standard biped location; included from MekHQ location replacement export."],
  },
  mekFrontRightLeg: {
    id: "mekFrontRightLeg",
    name: "Mek Front Right Leg",
    altNames: ['Mek Front Right Leg', 'Front Right Leg', 'FRL'].map((name) => name),
    category: "mekLocation",
    techRating: "D",
    availability: {
      starLeague: "C",
      successionWars: "C",
      clanInvasion: "C",
    },
    cost: { type: "unitTonnage", multiplier: 240 },
    notes: ["Non-standard biped location; included from MekHQ location replacement export."],
  },
  mekFrontRightLegTsm: {
    id: "mekFrontRightLegTsm",
    name: "Mek Front Right Leg (TSM)",
    altNames: ['Mek Front Right Leg (TSM)', 'Front Right Leg (TSM)', 'FRL (TSM)'].map((name) => name),
    category: "mekLocation",
    techRating: "E",
    availability: {
      starLeague: "D",
      successionWars: "D",
      clanInvasion: "D",
    },
    cost: { type: "unitTonnage", multiplier: 1_640 },
    notes: ["Includes Triple-Strength Myomer surcharge from MekHQ replacement part export.", "Non-standard biped location; included from MekHQ location replacement export."],
  },
  mekFrontRightLegIndustrial: {
    id: "mekFrontRightLegIndustrial",
    name: "Mek Front Right Leg (Industrial)",
    altNames: ['Mek Front Right Leg (Industrial)', 'Front Right Leg (Industrial)', 'FRL (Industrial)'].map((name) => name),
    category: "mekLocation",
    techRating: "C",
    availability: {
      starLeague: "C",
      successionWars: "C",
      clanInvasion: "C",
    },
    cost: { type: "unitTonnage", multiplier: 230 },
    notes: ["Non-standard biped location; included from MekHQ location replacement export."],
  },
  mekFrontRightLegIndustrialTsm: {
    id: "mekFrontRightLegIndustrialTsm",
    name: "Mek Front Right Leg (Industrial) (TSM)",
    altNames: ['Mek Front Right Leg (Industrial) (TSM)', 'Front Right Leg (Industrial) (TSM)', 'FRL (Industrial) (TSM)'].map((name) => name),
    category: "mekLocation",
    techRating: "E",
    availability: {
      starLeague: "E",
      successionWars: "E",
      clanInvasion: "E",
    },
    cost: { type: "unitTonnage", multiplier: 1_630 },
    notes: ["Industrial structure with TSM surcharge from MekHQ replacement part export.", "Non-standard biped location; included from MekHQ location replacement export."],
  },
  mekFrontRightLegIsEndoSteel: {
    id: "mekFrontRightLegIsEndoSteel",
    name: "Mek Front Right Leg (IS Endo Steel)",
    altNames: ['Mek Front Right Leg (IS Endo Steel)', 'Front Right Leg (IS Endo Steel)', 'FRL (IS Endo Steel)'].map((name) => name),
    category: "mekLocation",
    techRating: "E",
    availability: {
      starLeague: "E",
      successionWars: "E",
      clanInvasion: "E",
    },
    cost: { type: "unitTonnage", multiplier: 360 },
    notes: ["Non-standard biped location; included from MekHQ location replacement export."],
  },
  mekFrontRightLegIsEndoSteelTsm: {
    id: "mekFrontRightLegIsEndoSteelTsm",
    name: "Mek Front Right Leg (IS Endo Steel) (TSM)",
    altNames: ['Mek Front Right Leg (IS Endo Steel) (TSM)', 'Front Right Leg (IS Endo Steel) (TSM)', 'FRL (IS Endo Steel) (TSM)'].map((name) => name),
    category: "mekLocation",
    techRating: "E",
    availability: {
      starLeague: "E",
      successionWars: "E",
      clanInvasion: "E",
    },
    cost: { type: "unitTonnage", multiplier: 1_760 },
    notes: ["Includes Triple-Strength Myomer surcharge from MekHQ replacement part export.", "Non-standard biped location; included from MekHQ location replacement export."],
  },
  mekFrontRightLegClanEndoSteel: {
    id: "mekFrontRightLegClanEndoSteel",
    name: "Mek Front Right Leg (Clan Endo Steel)",
    altNames: ['Mek Front Right Leg (Clan Endo Steel)', 'Front Right Leg (Clan Endo Steel)', 'FRL (Clan Endo Steel)'].map((name) => name),
    category: "mekLocation",
    techRating: "E",
    availability: {
      starLeague: "E",
      successionWars: "E",
      clanInvasion: "E",
    },
    cost: { type: "unitTonnage", multiplier: 360 },
    notes: ["Non-standard biped location; included from MekHQ location replacement export."],
  },
  mekFrontRightLegClanEndoSteelTsm: {
    id: "mekFrontRightLegClanEndoSteelTsm",
    name: "Mek Front Right Leg (Clan Endo Steel) (TSM)",
    altNames: ['Mek Front Right Leg (Clan Endo Steel) (TSM)', 'Front Right Leg (Clan Endo Steel) (TSM)', 'FRL (Clan Endo Steel) (TSM)'].map((name) => name),
    category: "mekLocation",
    techRating: "E",
    availability: {
      starLeague: "E",
      successionWars: "E",
      clanInvasion: "E",
    },
    cost: { type: "unitTonnage", multiplier: 1_760 },
    notes: ["Includes Triple-Strength Myomer surcharge from MekHQ replacement part export.", "Non-standard biped location; included from MekHQ location replacement export."],
  },
  mekFrontRightLegEndoSteelPrototype: {
    id: "mekFrontRightLegEndoSteelPrototype",
    name: "Mek Front Right Leg (Endo Steel Prototype)",
    altNames: ['Mek Front Right Leg (Endo Steel Prototype)', 'Front Right Leg (Endo Steel Prototype)', 'FRL (Endo Steel Prototype)'].map((name) => name),
    category: "mekLocation",
    techRating: "F",
    availability: {
      starLeague: "F",
      successionWars: "F",
      clanInvasion: "F",
    },
    cost: { type: "unitTonnage", multiplier: 680 },
    notes: ["Non-standard biped location; included from MekHQ location replacement export."],
  },
  mekFrontRightLegEndoSteelPrototypeTsm: {
    id: "mekFrontRightLegEndoSteelPrototypeTsm",
    name: "Mek Front Right Leg (Endo Steel Prototype) (TSM)",
    altNames: ['Mek Front Right Leg (Endo Steel Prototype) (TSM)', 'Front Right Leg (Endo Steel Prototype) (TSM)', 'FRL (Endo Steel Prototype) (TSM)'].map((name) => name),
    category: "mekLocation",
    techRating: "F",
    availability: {
      starLeague: "F",
      successionWars: "F",
      clanInvasion: "F",
    },
    cost: { type: "unitTonnage", multiplier: 2_080 },
    notes: ["Includes Triple-Strength Myomer surcharge from MekHQ replacement part export.", "Non-standard biped location; included from MekHQ location replacement export."],
  },
  mekRearLeftLeg: {
    id: "mekRearLeftLeg",
    name: "Mek Rear Left Leg",
    altNames: ['Mek Rear Left Leg', 'Rear Left Leg', 'RLL'].map((name) => name),
    category: "mekLocation",
    techRating: "D",
    availability: {
      starLeague: "C",
      successionWars: "C",
      clanInvasion: "C",
    },
    cost: { type: "unitTonnage", multiplier: 240 },
    notes: ["Non-standard biped location; included from MekHQ location replacement export."],
  },
  mekRearLeftLegTsm: {
    id: "mekRearLeftLegTsm",
    name: "Mek Rear Left Leg (TSM)",
    altNames: ['Mek Rear Left Leg (TSM)', 'Rear Left Leg (TSM)', 'RLL (TSM)'].map((name) => name),
    category: "mekLocation",
    techRating: "E",
    availability: {
      starLeague: "D",
      successionWars: "D",
      clanInvasion: "D",
    },
    cost: { type: "unitTonnage", multiplier: 1_640 },
    notes: ["Includes Triple-Strength Myomer surcharge from MekHQ replacement part export.", "Non-standard biped location; included from MekHQ location replacement export."],
  },
  mekRearLeftLegIndustrial: {
    id: "mekRearLeftLegIndustrial",
    name: "Mek Rear Left Leg (Industrial)",
    altNames: ['Mek Rear Left Leg (Industrial)', 'Rear Left Leg (Industrial)', 'RLL (Industrial)'].map((name) => name),
    category: "mekLocation",
    techRating: "C",
    availability: {
      starLeague: "C",
      successionWars: "C",
      clanInvasion: "C",
    },
    cost: { type: "unitTonnage", multiplier: 230 },
    notes: ["Non-standard biped location; included from MekHQ location replacement export."],
  },
  mekRearLeftLegIndustrialTsm: {
    id: "mekRearLeftLegIndustrialTsm",
    name: "Mek Rear Left Leg (Industrial) (TSM)",
    altNames: ['Mek Rear Left Leg (Industrial) (TSM)', 'Rear Left Leg (Industrial) (TSM)', 'RLL (Industrial) (TSM)'].map((name) => name),
    category: "mekLocation",
    techRating: "E",
    availability: {
      starLeague: "E",
      successionWars: "E",
      clanInvasion: "E",
    },
    cost: { type: "unitTonnage", multiplier: 1_630 },
    notes: ["Industrial structure with TSM surcharge from MekHQ replacement part export.", "Non-standard biped location; included from MekHQ location replacement export."],
  },
  mekRearLeftLegIsEndoSteel: {
    id: "mekRearLeftLegIsEndoSteel",
    name: "Mek Rear Left Leg (IS Endo Steel)",
    altNames: ['Mek Rear Left Leg (IS Endo Steel)', 'Rear Left Leg (IS Endo Steel)', 'RLL (IS Endo Steel)'].map((name) => name),
    category: "mekLocation",
    techRating: "E",
    availability: {
      starLeague: "E",
      successionWars: "E",
      clanInvasion: "E",
    },
    cost: { type: "unitTonnage", multiplier: 360 },
    notes: ["Non-standard biped location; included from MekHQ location replacement export."],
  },
  mekRearLeftLegIsEndoSteelTsm: {
    id: "mekRearLeftLegIsEndoSteelTsm",
    name: "Mek Rear Left Leg (IS Endo Steel) (TSM)",
    altNames: ['Mek Rear Left Leg (IS Endo Steel) (TSM)', 'Rear Left Leg (IS Endo Steel) (TSM)', 'RLL (IS Endo Steel) (TSM)'].map((name) => name),
    category: "mekLocation",
    techRating: "E",
    availability: {
      starLeague: "E",
      successionWars: "E",
      clanInvasion: "E",
    },
    cost: { type: "unitTonnage", multiplier: 1_760 },
    notes: ["Includes Triple-Strength Myomer surcharge from MekHQ replacement part export.", "Non-standard biped location; included from MekHQ location replacement export."],
  },
  mekRearLeftLegClanEndoSteel: {
    id: "mekRearLeftLegClanEndoSteel",
    name: "Mek Rear Left Leg (Clan Endo Steel)",
    altNames: ['Mek Rear Left Leg (Clan Endo Steel)', 'Rear Left Leg (Clan Endo Steel)', 'RLL (Clan Endo Steel)'].map((name) => name),
    category: "mekLocation",
    techRating: "E",
    availability: {
      starLeague: "E",
      successionWars: "E",
      clanInvasion: "E",
    },
    cost: { type: "unitTonnage", multiplier: 360 },
    notes: ["Non-standard biped location; included from MekHQ location replacement export."],
  },
  mekRearLeftLegClanEndoSteelTsm: {
    id: "mekRearLeftLegClanEndoSteelTsm",
    name: "Mek Rear Left Leg (Clan Endo Steel) (TSM)",
    altNames: ['Mek Rear Left Leg (Clan Endo Steel) (TSM)', 'Rear Left Leg (Clan Endo Steel) (TSM)', 'RLL (Clan Endo Steel) (TSM)'].map((name) => name),
    category: "mekLocation",
    techRating: "E",
    availability: {
      starLeague: "E",
      successionWars: "E",
      clanInvasion: "E",
    },
    cost: { type: "unitTonnage", multiplier: 1_760 },
    notes: ["Includes Triple-Strength Myomer surcharge from MekHQ replacement part export.", "Non-standard biped location; included from MekHQ location replacement export."],
  },
  mekRearLeftLegEndoSteelPrototype: {
    id: "mekRearLeftLegEndoSteelPrototype",
    name: "Mek Rear Left Leg (Endo Steel Prototype)",
    altNames: ['Mek Rear Left Leg (Endo Steel Prototype)', 'Rear Left Leg (Endo Steel Prototype)', 'RLL (Endo Steel Prototype)'].map((name) => name),
    category: "mekLocation",
    techRating: "F",
    availability: {
      starLeague: "F",
      successionWars: "F",
      clanInvasion: "F",
    },
    cost: { type: "unitTonnage", multiplier: 680 },
    notes: ["Non-standard biped location; included from MekHQ location replacement export."],
  },
  mekRearLeftLegEndoSteelPrototypeTsm: {
    id: "mekRearLeftLegEndoSteelPrototypeTsm",
    name: "Mek Rear Left Leg (Endo Steel Prototype) (TSM)",
    altNames: ['Mek Rear Left Leg (Endo Steel Prototype) (TSM)', 'Rear Left Leg (Endo Steel Prototype) (TSM)', 'RLL (Endo Steel Prototype) (TSM)'].map((name) => name),
    category: "mekLocation",
    techRating: "F",
    availability: {
      starLeague: "F",
      successionWars: "F",
      clanInvasion: "F",
    },
    cost: { type: "unitTonnage", multiplier: 2_080 },
    notes: ["Includes Triple-Strength Myomer surcharge from MekHQ replacement part export.", "Non-standard biped location; included from MekHQ location replacement export."],
  },
  mekRearRightLeg: {
    id: "mekRearRightLeg",
    name: "Mek Rear Right Leg",
    altNames: ['Mek Rear Right Leg', 'Rear Right Leg', 'RRL'].map((name) => name),
    category: "mekLocation",
    techRating: "D",
    availability: {
      starLeague: "C",
      successionWars: "C",
      clanInvasion: "C",
    },
    cost: { type: "unitTonnage", multiplier: 240 },
    notes: ["Non-standard biped location; included from MekHQ location replacement export."],
  },
  mekRearRightLegTsm: {
    id: "mekRearRightLegTsm",
    name: "Mek Rear Right Leg (TSM)",
    altNames: ['Mek Rear Right Leg (TSM)', 'Rear Right Leg (TSM)', 'RRL (TSM)'].map((name) => name),
    category: "mekLocation",
    techRating: "E",
    availability: {
      starLeague: "D",
      successionWars: "D",
      clanInvasion: "D",
    },
    cost: { type: "unitTonnage", multiplier: 1_640 },
    notes: ["Includes Triple-Strength Myomer surcharge from MekHQ replacement part export.", "Non-standard biped location; included from MekHQ location replacement export."],
  },
  mekRearRightLegIndustrial: {
    id: "mekRearRightLegIndustrial",
    name: "Mek Rear Right Leg (Industrial)",
    altNames: ['Mek Rear Right Leg (Industrial)', 'Rear Right Leg (Industrial)', 'RRL (Industrial)'].map((name) => name),
    category: "mekLocation",
    techRating: "C",
    availability: {
      starLeague: "C",
      successionWars: "C",
      clanInvasion: "C",
    },
    cost: { type: "unitTonnage", multiplier: 230 },
    notes: ["Non-standard biped location; included from MekHQ location replacement export."],
  },
  mekRearRightLegIndustrialTsm: {
    id: "mekRearRightLegIndustrialTsm",
    name: "Mek Rear Right Leg (Industrial) (TSM)",
    altNames: ['Mek Rear Right Leg (Industrial) (TSM)', 'Rear Right Leg (Industrial) (TSM)', 'RRL (Industrial) (TSM)'].map((name) => name),
    category: "mekLocation",
    techRating: "E",
    availability: {
      starLeague: "E",
      successionWars: "E",
      clanInvasion: "E",
    },
    cost: { type: "unitTonnage", multiplier: 1_630 },
    notes: ["Industrial structure with TSM surcharge from MekHQ replacement part export.", "Non-standard biped location; included from MekHQ location replacement export."],
  },
  mekRearRightLegIsEndoSteel: {
    id: "mekRearRightLegIsEndoSteel",
    name: "Mek Rear Right Leg (IS Endo Steel)",
    altNames: ['Mek Rear Right Leg (IS Endo Steel)', 'Rear Right Leg (IS Endo Steel)', 'RRL (IS Endo Steel)'].map((name) => name),
    category: "mekLocation",
    techRating: "E",
    availability: {
      starLeague: "E",
      successionWars: "E",
      clanInvasion: "E",
    },
    cost: { type: "unitTonnage", multiplier: 360 },
    notes: ["Non-standard biped location; included from MekHQ location replacement export."],
  },
  mekRearRightLegIsEndoSteelTsm: {
    id: "mekRearRightLegIsEndoSteelTsm",
    name: "Mek Rear Right Leg (IS Endo Steel) (TSM)",
    altNames: ['Mek Rear Right Leg (IS Endo Steel) (TSM)', 'Rear Right Leg (IS Endo Steel) (TSM)', 'RRL (IS Endo Steel) (TSM)'].map((name) => name),
    category: "mekLocation",
    techRating: "E",
    availability: {
      starLeague: "E",
      successionWars: "E",
      clanInvasion: "E",
    },
    cost: { type: "unitTonnage", multiplier: 1_760 },
    notes: ["Includes Triple-Strength Myomer surcharge from MekHQ replacement part export.", "Non-standard biped location; included from MekHQ location replacement export."],
  },
  mekRearRightLegClanEndoSteel: {
    id: "mekRearRightLegClanEndoSteel",
    name: "Mek Rear Right Leg (Clan Endo Steel)",
    altNames: ['Mek Rear Right Leg (Clan Endo Steel)', 'Rear Right Leg (Clan Endo Steel)', 'RRL (Clan Endo Steel)'].map((name) => name),
    category: "mekLocation",
    techRating: "E",
    availability: {
      starLeague: "E",
      successionWars: "E",
      clanInvasion: "E",
    },
    cost: { type: "unitTonnage", multiplier: 360 },
    notes: ["Non-standard biped location; included from MekHQ location replacement export."],
  },
  mekRearRightLegClanEndoSteelTsm: {
    id: "mekRearRightLegClanEndoSteelTsm",
    name: "Mek Rear Right Leg (Clan Endo Steel) (TSM)",
    altNames: ['Mek Rear Right Leg (Clan Endo Steel) (TSM)', 'Rear Right Leg (Clan Endo Steel) (TSM)', 'RRL (Clan Endo Steel) (TSM)'].map((name) => name),
    category: "mekLocation",
    techRating: "E",
    availability: {
      starLeague: "E",
      successionWars: "E",
      clanInvasion: "E",
    },
    cost: { type: "unitTonnage", multiplier: 1_760 },
    notes: ["Includes Triple-Strength Myomer surcharge from MekHQ replacement part export.", "Non-standard biped location; included from MekHQ location replacement export."],
  },
  mekRearRightLegEndoSteelPrototype: {
    id: "mekRearRightLegEndoSteelPrototype",
    name: "Mek Rear Right Leg (Endo Steel Prototype)",
    altNames: ['Mek Rear Right Leg (Endo Steel Prototype)', 'Rear Right Leg (Endo Steel Prototype)', 'RRL (Endo Steel Prototype)'].map((name) => name),
    category: "mekLocation",
    techRating: "F",
    availability: {
      starLeague: "F",
      successionWars: "F",
      clanInvasion: "F",
    },
    cost: { type: "unitTonnage", multiplier: 680 },
    notes: ["Non-standard biped location; included from MekHQ location replacement export."],
  },
  mekRearRightLegEndoSteelPrototypeTsm: {
    id: "mekRearRightLegEndoSteelPrototypeTsm",
    name: "Mek Rear Right Leg (Endo Steel Prototype) (TSM)",
    altNames: ['Mek Rear Right Leg (Endo Steel Prototype) (TSM)', 'Rear Right Leg (Endo Steel Prototype) (TSM)', 'RRL (Endo Steel Prototype) (TSM)'].map((name) => name),
    category: "mekLocation",
    techRating: "F",
    availability: {
      starLeague: "F",
      successionWars: "F",
      clanInvasion: "F",
    },
    cost: { type: "unitTonnage", multiplier: 2_080 },
    notes: ["Includes Triple-Strength Myomer surcharge from MekHQ replacement part export.", "Non-standard biped location; included from MekHQ location replacement export."],
  },
  mekRotor: {
    id: "mekRotor",
    name: "Rotor",
    altNames: ['Rotor', 'Rotor', 'Rotor'].map((name) => name),
    category: "mekLocation",
    techRating: "D",
    availability: {
      starLeague: "C",
      successionWars: "C",
      clanInvasion: "C",
    },
    cost: { type: "unitTonnage", multiplier: 4_000 },
    notes: ["Non-standard biped location; included from MekHQ location replacement export."],
  },
  mekTurret: {
    id: "mekTurret",
    name: "Turret",
    altNames: ['Turret', 'Turret', 'Turret'].map((name) => name),
    category: "mekLocation",
    techRating: "D",
    availability: {
      starLeague: "C",
      successionWars: "C",
      clanInvasion: "C",
    },
    cost: { type: "unitTonnage", multiplier: 0 },
    notes: ["Non-standard biped location; included from MekHQ location replacement export."],
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

  if (normalized.includes("command console")) return "commandConsole";
  if (normalized.includes("primitive") && normalized.includes("industrial")) return "primitiveIndustrialCockpit";
  if (normalized.includes("primitive")) return "primitiveCockpit";
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

  if (normalized.includes("endo composite")) return "endoCompositeInternalStructure";
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
