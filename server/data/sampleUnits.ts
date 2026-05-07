import type { CriticalSlot, Unit, UnitLocation } from "../types/unit";

function makeMekLocations(config: {
  head: [number, number, string[]];
  ct: [number, number, number, string[]];
  rt: [number, number, number, string[]];
  lt: [number, number, number, string[]];
  ra: [number, number, string[]];
  la: [number, number, string[]];
  rl: [number, number, string[]];
  ll: [number, number, string[]];
}): UnitLocation[] {
  const slotType = (item: string): CriticalSlot["type"] => {
    const lower = item.toLowerCase();

    if (lower === "empty") return "empty";
    if (lower.includes("ammo")) return "ammo";

    if (
      ["engine", "gyro", "cockpit", "life support", "sensors"].some((part) =>
        lower.includes(part)
      )
    ) {
      return "engine";
    }

    if (
      ["shoulder", "upper", "lower", "hand", "hip", "foot"].some((part) =>
        lower.includes(part)
      )
    ) {
      return "structure";
    }

    if (
      ["laser", "ac/", "rifle", "lrm", "srm", "machine gun", "ppc"].some((part) =>
        lower.includes(part)
      )
    ) {
      return "weapon";
    }

    return "equipment";
  };

  const slots = (items: string[]) =>
    items.map((item, index) => ({
      slot: index + 1,
      item,
      type: slotType(item),
    }));

  return [
    {
      id: "head",
      name: "Head",
      armor: config.head[0],
      structure: config.head[1],
      slots: slots(config.head[2]),
    },
    {
      id: "ct",
      name: "Center Torso",
      armor: config.ct[0],
      rearArmor: config.ct[1],
      structure: config.ct[2],
      slots: slots(config.ct[3]),
    },
    {
      id: "rt",
      name: "Right Torso",
      armor: config.rt[0],
      rearArmor: config.rt[1],
      structure: config.rt[2],
      slots: slots(config.rt[3]),
    },
    {
      id: "lt",
      name: "Left Torso",
      armor: config.lt[0],
      rearArmor: config.lt[1],
      structure: config.lt[2],
      slots: slots(config.lt[3]),
    },
    {
      id: "ra",
      name: "Right Arm",
      armor: config.ra[0],
      structure: config.ra[1],
      slots: slots(config.ra[2]),
    },
    {
      id: "la",
      name: "Left Arm",
      armor: config.la[0],
      structure: config.la[1],
      slots: slots(config.la[2]),
    },
    {
      id: "rl",
      name: "Right Leg",
      armor: config.rl[0],
      structure: config.rl[1],
      slots: slots(config.rl[2]),
    },
    {
      id: "ll",
      name: "Left Leg",
      armor: config.ll[0],
      structure: config.ll[1],
      slots: slots(config.ll[2]),
    },
  ];
}

export const sampleUnits: Unit[] = [
  {
    id: "pxh-1",
    name: "Phoenix Hawk",
    model: "PXH-1",
    chassis: "Earthwerks PXH",
    type: "BattleMech",
    techBase: "Inner Sphere",
    era: "IntroTech / 3025",
    year: 3025,
    tonnage: 45,
    weightClass: "Medium",
    costCBills: 3834700,
    rulesLevel: "Introductory",
    walk: 6,
    run: 9,
    jump: 6,
    heatSinks: 10,
    armor: 120,
    structure: 75,
    offensiveBV: 469,
    defensiveBV: 572,
    totalBV: 1041,
    role: "Mobile striker",
    engine: "270 Fusion",
    gyro: "Standard",
    cockpit: "Standard",
    sourceFile: "Phoenix Hawk PXH-1.rtf",
    weapons: [
      { id: "pxh-ll", name: "Large Laser", location: "Right Arm", damage: 8, heat: 8, range: "5 / 10 / 15", slots: 2, shots: "∞" },
      { id: "pxh-ml-1", name: "Medium Laser", location: "Left Arm", damage: 5, heat: 3, range: "3 / 6 / 9", slots: 1, shots: "∞" },
      { id: "pxh-ml-2", name: "Medium Laser", location: "Center Torso", damage: 5, heat: 3, range: "3 / 6 / 9", slots: 1, shots: "∞" },
      { id: "pxh-mg-1", name: "Machine Gun", location: "Left Arm", damage: 2, heat: 0, range: "1 / 2 / 3", slots: 1, ammo: "MG Ammo", shots: 200 },
      { id: "pxh-mg-2", name: "Machine Gun", location: "Right Arm", damage: 2, heat: 0, range: "1 / 2 / 3", slots: 1, ammo: "MG Ammo", shots: 200 },
    ],
    locations: makeMekLocations({
      head: [9, 3, ["Life Support", "Sensors", "Cockpit", "Sensors", "Life Support", "Empty"]],
      ct: [24, 15, 16, ["Engine", "Engine", "Engine", "Gyro", "Gyro", "Gyro", "Gyro", "Engine", "Engine", "Engine", "Medium Laser", "MG Ammo"]],
      rt: [18, 6, 12, ["Jump Jet", "Jump Jet", "Heat Sink", "Empty", "Empty", "Empty", "Empty", "Empty", "Empty", "Empty", "Empty", "Empty"]],
      lt: [18, 6, 12, ["Jump Jet", "Jump Jet", "Heat Sink", "Empty", "Empty", "Empty", "Empty", "Empty", "Empty", "Empty", "Empty", "Empty"]],
      ra: [14, 8, ["Large Laser", "Large Laser", "Machine Gun", "Shoulder", "Upper Arm", "Lower Arm", "Hand", "Empty", "Empty", "Empty", "Empty", "Empty"]],
      la: [14, 8, ["Medium Laser", "Machine Gun", "Shoulder", "Upper Arm", "Lower Arm", "Hand", "Empty", "Empty", "Empty", "Empty", "Empty", "Empty"]],
      rl: [12, 8, ["Hip", "Upper Leg", "Lower Leg", "Foot", "Jump Jet", "Empty"]],
      ll: [12, 8, ["Hip", "Upper Leg", "Lower Leg", "Foot", "Jump Jet", "Empty"]],
    }),
  },
  {
    id: "hgn-733",
    name: "Highlander",
    model: "HGN-733",
    chassis: "Star League XT",
    type: "BattleMech",
    techBase: "Inner Sphere",
    era: "IntroTech / 3025",
    year: 3025,
    tonnage: 90,
    weightClass: "Assault",
    costCBills: 8950000,
    rulesLevel: "Introductory",
    walk: 3,
    run: 5,
    jump: 3,
    heatSinks: 13,
    armor: 272,
    structure: 138,
    offensiveBV: 787,
    defensiveBV: 1013,
    totalBV: 1801,
    role: "Assault anchor",
    engine: "270 Fusion",
    gyro: "Standard",
    cockpit: "Standard",
    sourceFile: "Highlander HGN-733.rtf",
    weapons: [
      { id: "hgn-gauss", name: "Gauss Rifle", location: "Right Arm", damage: 15, heat: 1, range: "7 / 15 / 22", slots: 7, ammo: "Gauss Ammo", shots: 16 },
      { id: "hgn-lrm", name: "LRM 20", location: "Left Torso", damage: "20/m", heat: 6, range: "7 / 14 / 21", slots: 5, ammo: "LRM 20 Ammo", shots: 12 },
      { id: "hgn-srm", name: "SRM 6", location: "Right Torso", damage: "2/m", heat: 4, range: "3 / 6 / 9", slots: 2, ammo: "SRM 6 Ammo", shots: 15 },
      { id: "hgn-ml-1", name: "Medium Laser", location: "Left Arm", damage: 5, heat: 3, range: "3 / 6 / 9", slots: 1, shots: "∞" },
      { id: "hgn-ml-2", name: "Medium Laser", location: "Left Arm", damage: 5, heat: 3, range: "3 / 6 / 9", slots: 1, shots: "∞" },
    ],
    locations: makeMekLocations({
      head: [9, 3, ["Life Support", "Sensors", "Cockpit", "Sensors", "Life Support", "Empty"]],
      ct: [47, 15, 29, ["Engine", "Engine", "Engine", "Gyro", "Gyro", "Gyro", "Gyro", "Engine", "Engine", "Engine", "Jump Jet", "Empty"]],
      rt: [32, 10, 19, ["SRM 6", "SRM 6", "SRM Ammo", "Heat Sink", "Heat Sink", "Jump Jet", "Empty", "Empty", "Empty", "Empty", "Empty", "Empty"]],
      lt: [32, 10, 19, ["LRM 20", "LRM 20", "LRM 20", "LRM 20", "LRM 20", "LRM Ammo", "LRM Ammo", "Jump Jet", "Empty", "Empty", "Empty", "Empty"]],
      ra: [30, 15, ["Gauss Rifle", "Gauss Rifle", "Gauss Rifle", "Gauss Rifle", "Gauss Rifle", "Gauss Rifle", "Gauss Rifle", "Gauss Ammo", "Shoulder", "Upper Arm", "Lower Arm", "Hand"]],
      la: [30, 15, ["Medium Laser", "Medium Laser", "Shoulder", "Upper Arm", "Lower Arm", "Hand", "Heat Sink", "Empty", "Empty", "Empty", "Empty", "Empty"]],
      rl: [30, 15, ["Hip", "Upper Leg", "Lower Leg", "Foot", "Empty", "Empty"]],
      ll: [30, 15, ["Hip", "Upper Leg", "Lower Leg", "Foot", "Empty", "Empty"]],
    }),
  },
  {
    id: "hbkd-4g",
    name: "Hunchback",
    model: "HBK-4G",
    chassis: "Komiyaba Type VIII",
    type: "BattleMech",
    techBase: "Inner Sphere",
    era: "IntroTech / 3025",
    year: 3025,
    tonnage: 50,
    weightClass: "Medium",
    costCBills: 3437500,
    rulesLevel: "Introductory",
    walk: 4,
    run: 6,
    jump: 0,
    heatSinks: 13,
    armor: 160,
    structure: 83,
    offensiveBV: 620,
    defensiveBV: 421,
    totalBV: 1041,
    role: "Urban brawler",
    engine: "200 Fusion",
    gyro: "Standard",
    cockpit: "Standard",
    sourceFile: "Hunchback HBK-4G.rtf",
    weapons: [
      { id: "hbk-ac20", name: "AC/20", location: "Right Torso", damage: 20, heat: 7, range: "3 / 6 / 9", slots: 10, ammo: "AC/20 Ammo", shots: 10 },
      { id: "hbk-ml-1", name: "Medium Laser", location: "Right Arm", damage: 5, heat: 3, range: "3 / 6 / 9", slots: 1, shots: "∞" },
      { id: "hbk-ml-2", name: "Medium Laser", location: "Left Arm", damage: 5, heat: 3, range: "3 / 6 / 9", slots: 1, shots: "∞" },
      { id: "hbk-sl", name: "Small Laser", location: "Head", damage: 3, heat: 1, range: "1 / 2 / 3", slots: 1, shots: "∞" },
    ],
    locations: makeMekLocations({
      head: [9, 3, ["Life Support", "Sensors", "Cockpit", "Sensors", "Life Support", "Small Laser"]],
      ct: [23, 8, 16, ["Engine", "Engine", "Engine", "Gyro", "Gyro", "Gyro", "Gyro", "Engine", "Engine", "Engine", "Empty", "Empty"]],
      rt: [22, 8, 12, ["AC/20", "AC/20", "AC/20", "AC/20", "AC/20", "AC/20", "AC/20", "AC/20", "AC/20", "AC/20", "AC/20 Ammo", "AC/20 Ammo"]],
      lt: [18, 6, 12, ["Heat Sink", "Heat Sink", "Heat Sink", "Empty", "Empty", "Empty", "Empty", "Empty", "Empty", "Empty", "Empty", "Empty"]],
      ra: [16, 8, ["Medium Laser", "Shoulder", "Upper Arm", "Lower Arm", "Hand", "Empty", "Empty", "Empty", "Empty", "Empty", "Empty", "Empty"]],
      la: [16, 8, ["Medium Laser", "Shoulder", "Upper Arm", "Lower Arm", "Hand", "Empty", "Empty", "Empty", "Empty", "Empty", "Empty", "Empty"]],
      rl: [19, 8, ["Hip", "Upper Leg", "Lower Leg", "Foot", "Empty", "Empty"]],
      ll: [19, 8, ["Hip", "Upper Leg", "Lower Leg", "Foot", "Empty", "Empty"]],
    }),
  },
  {
    id: "wvr-6r",
    name: "Wolverine",
    model: "WVR-6R",
    chassis: "Crucis-A",
    type: "BattleMech",
    techBase: "Inner Sphere",
    era: "IntroTech / 3025",
    year: 3025,
    tonnage: 55,
    weightClass: "Medium",
    costCBills: 4810000,
    rulesLevel: "Introductory",
    walk: 5,
    run: 8,
    jump: 5,
    heatSinks: 12,
    armor: 169,
    structure: 91,
    offensiveBV: 492,
    defensiveBV: 609,
    totalBV: 1101,
    role: "Skirmisher",
    engine: "275 Fusion",
    gyro: "Standard",
    cockpit: "Standard",
    sourceFile: "Wolverine WVR-6R.rtf",
    weapons: [
      { id: "wvr-ac5", name: "AC/5", location: "Right Arm", damage: 5, heat: 1, range: "6 / 12 / 18", slots: 4, ammo: "AC/5 Ammo", shots: 20 },
      { id: "wvr-ml", name: "Medium Laser", location: "Left Arm", damage: 5, heat: 3, range: "3 / 6 / 9", slots: 1, shots: "∞" },
      { id: "wvr-srm", name: "SRM 6", location: "Left Torso", damage: "2/m", heat: 4, range: "3 / 6 / 9", slots: 2, ammo: "SRM 6 Ammo", shots: 15 },
    ],
    locations: makeMekLocations({
      head: [9, 3, ["Life Support", "Sensors", "Cockpit", "Sensors", "Life Support", "Empty"]],
      ct: [26, 8, 18, ["Engine", "Engine", "Engine", "Gyro", "Gyro", "Gyro", "Gyro", "Engine", "Engine", "Engine", "Jump Jet", "Empty"]],
      rt: [20, 6, 13, ["AC/5 Ammo", "Jump Jet", "Jump Jet", "Heat Sink", "Empty", "Empty", "Empty", "Empty", "Empty", "Empty", "Empty", "Empty"]],
      lt: [20, 6, 13, ["SRM 6", "SRM 6", "SRM Ammo", "Jump Jet", "Jump Jet", "Heat Sink", "Empty", "Empty", "Empty", "Empty", "Empty", "Empty"]],
      ra: [18, 9, ["AC/5", "AC/5", "AC/5", "AC/5", "Shoulder", "Upper Arm", "Lower Arm", "Hand", "Empty", "Empty", "Empty", "Empty"]],
      la: [18, 9, ["Medium Laser", "Shoulder", "Upper Arm", "Lower Arm", "Hand", "Empty", "Empty", "Empty", "Empty", "Empty", "Empty", "Empty"]],
      rl: [20, 9, ["Hip", "Upper Leg", "Lower Leg", "Foot", "Empty", "Empty"]],
      ll: [20, 9, ["Hip", "Upper Leg", "Lower Leg", "Foot", "Empty", "Empty"]],
    }),
  },
];

//export { sampleUnits };