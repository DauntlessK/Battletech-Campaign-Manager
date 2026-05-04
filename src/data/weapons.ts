export type WeaponCategory = "Energy" | "Ballistic" | "Missile";

export type WeaponDefinition = {
    id: string;
    name: string;
    altNames: string[];
    category: WeaponCategory;
    techBase: "Inner Sphere" | "Clan" | "Mixed";
    rulesLevel?: "Introductory" | "Standard" | "Advanced" | "Experimental";
    variant?: string;
    family?: string;

    damage: number | "cluster" | "variable" | "special";
    rackSize?: number;

    heat: number;
    tons: number;
    critSlots: number;
    spaceSlots?: number;

    ammo?: {
        ammoType: string;
        ammoPerTon: number;
        ammoCostPerTon?: number;
        ammoBV?: number;
    };

    range: {
        min?: number;
        short: number;
        medium: number;
        long: number;
        extreme?: number;
    };

    cost: number;
    bv: number;

    techRating?: string;
    availability?: {
        starLeague?: string;
        successionWars?: string;
        clanInvasion?: string;
        darkAge?: string;
    };

    flags?: string[];
};

//TODO: Ammo cost per ton, tech rating, availability need verification / fixes

export const WEAPONS: Record<string, WeaponDefinition> = {
    smallLaser: {
        id: "smallLaser",
        name: "Small Laser",
        altNames: ["IS Small Laser", "ISSmallLaser"],
        family: "smallLaser",
        variant: "IS",
        techBase: "Inner Sphere",
        rulesLevel: "Introductory",
        category: "Energy",
        damage: 3,
        heat: 1,
        tons: 0.5,
        critSlots: 1,
        range: { short: 1, medium: 2, long: 3 },
        cost: 11250,
        bv: 9,
        techRating: "C",
        availability: { starLeague: "C", successionWars: "C", clanInvasion: "C", darkAge: "C" },
        flags: ["directFire"],
    },

    mediumLaser: {
        id: "mediumLaser",
        name: "Medium Laser",
        altNames: ["IS Medium Laser", "ISMediumLaser"],
        family: "mediumLaser",
        variant: "IS",
        techBase: "Inner Sphere",
        rulesLevel: "Introductory",
        category: "Energy",
        damage: 5,
        heat: 3,
        tons: 1,
        critSlots: 1,
        range: { short: 3, medium: 6, long: 9 },
        cost: 40000,
        bv: 46,
        techRating: "C",
        availability: { starLeague: "C", successionWars: "C", clanInvasion: "C", darkAge: "C" },
        flags: ["directFire"],
    },

    largeLaser: {
        id: "largeLaser",
        name: "Large Laser",
        altNames: ["IS Large Laser", "ISLargeLaser"],
        family: "largeLaser",
        variant: "IS",
        techBase: "Inner Sphere",
        rulesLevel: "Introductory",
        category: "Energy",
        damage: 8,
        heat: 8,
        tons: 5,
        critSlots: 2,
        range: { short: 5, medium: 10, long: 15 },
        cost: 100000,
        bv: 123,
        techRating: "C",
        availability: { starLeague: "C", successionWars: "C", clanInvasion: "C", darkAge: "C" },
        flags: ["directFire"],
    },

    ppc: {
        id: "ppc",
        name: "PPC",
        altNames: ["IS PPC", "ISPPC"],
        family: "ppc",
        variant: "IS",
        techBase: "Inner Sphere",
        rulesLevel: "Introductory",
        category: "Energy",
        damage: 10,
        heat: 10,
        tons: 7,
        critSlots: 3,
        range: { min: 3, short: 6, medium: 12, long: 18 },
        cost: 200000,
        bv: 176,
        techRating: "C",
        availability: { starLeague: "C", successionWars: "C", clanInvasion: "C", darkAge: "C" },
        flags: ["directFire", "minimumRange"],
    },

    flamer: {
        id: "flamer",
        name: "Flamer",
        altNames: ["IS Flamer", "ISFlamer"],
        family: "flamer",
        variant: "IS",
        techBase: "Inner Sphere",
        rulesLevel: "Introductory",
        category: "Energy",
        damage: 2,
        heat: 3,
        tons: 1,
        critSlots: 1,
        range: { short: 1, medium: 2, long: 3 },
        cost: 7500,
        bv: 6,
        techRating: "C",
        availability: { starLeague: "C", successionWars: "C", clanInvasion: "C", darkAge: "C" },
        flags: ["heatDamage", "antiInfantry"],
    },

    machineGun: {
        id: "machineGun",
        name: "Machine Gun",
        altNames: ["IS Machine Gun", "ISMachineGun", "MG"],
        family: "machineGun",
        variant: "IS",
        techBase: "Inner Sphere",
        rulesLevel: "Introductory",
        category: "Ballistic",
        damage: 2,
        heat: 0,
        tons: 0.5,
        critSlots: 1,
        ammo: { ammoType: "machineGun", ammoPerTon: 200, ammoCostPerTon: 1000, ammoBV: 1 },
        range: { short: 1, medium: 2, long: 3 },
        cost: 5000,
        bv: 5,
        techRating: "C",
        availability: { starLeague: "C", successionWars: "C", clanInvasion: "C", darkAge: "C" },
        flags: ["directFire", "antiInfantry", "requiresAmmo"],
    },

    ac2: {
        id: "ac2",
        name: "AC/2",
        altNames: ["Autocannon/2", "IS AC/2", "ISAC2"],
        family: "autocannon",
        variant: "IS AC/2",
        techBase: "Inner Sphere",
        rulesLevel: "Introductory",
        category: "Ballistic",
        damage: 2,
        heat: 1,
        tons: 6,
        critSlots: 1,
        ammo: { ammoType: "ac2", ammoPerTon: 45, ammoCostPerTon: 1000, ammoBV: 5 },
        range: { short: 8, medium: 16, long: 24 },
        cost: 75000,
        bv: 37,
        techRating: "C",
        availability: { starLeague: "C", successionWars: "C", clanInvasion: "C", darkAge: "C" },
        flags: ["directFire", "requiresAmmo"],
    },

    ac5: {
        id: "ac5",
        name: "AC/5",
        altNames: ["Autocannon/5", "IS AC/5", "ISAC5"],
        family: "autocannon",
        variant: "IS AC/5",
        techBase: "Inner Sphere",
        rulesLevel: "Introductory",
        category: "Ballistic",
        damage: 5,
        heat: 1,
        tons: 8,
        critSlots: 4,
        ammo: { ammoType: "ac5", ammoPerTon: 20, ammoCostPerTon: 4500, ammoBV: 9 },
        range: { short: 6, medium: 12, long: 18 },
        cost: 125000,
        bv: 70,
        techRating: "C",
        availability: { starLeague: "C", successionWars: "C", clanInvasion: "C", darkAge: "C" },
        flags: ["directFire", "requiresAmmo"],
    },

    ac10: {
        id: "ac10",
        name: "AC/10",
        altNames: ["Autocannon/10", "IS AC/10", "ISAC10"],
        family: "autocannon",
        variant: "IS AC/10",
        techBase: "Inner Sphere",
        rulesLevel: "Introductory",
        category: "Ballistic",
        damage: 10,
        heat: 3,
        tons: 12,
        critSlots: 7,
        ammo: { ammoType: "ac10", ammoPerTon: 10, ammoCostPerTon: 6000, ammoBV: 15 },
        range: { short: 5, medium: 10, long: 15 },
        cost: 200000,
        bv: 124,
        techRating: "C",
        availability: { starLeague: "C", successionWars: "C", clanInvasion: "C", darkAge: "C" },
        flags: ["directFire", "requiresAmmo"],
    },

    ac20: {
        id: "ac20",
        name: "AC/20",
        altNames: ["Autocannon/20", "IS AC/20", "ISAC20"],
        family: "autocannon",
        variant: "IS AC/20",
        techBase: "Inner Sphere",
        rulesLevel: "Introductory",
        category: "Ballistic",
        damage: 20,
        heat: 7,
        tons: 14,
        critSlots: 10,
        ammo: { ammoType: "ac20", ammoPerTon: 5, ammoCostPerTon: 10000, ammoBV: 22 },
        range: { short: 3, medium: 6, long: 9 },
        cost: 300000,
        bv: 178,
        techRating: "C",
        availability: { starLeague: "C", successionWars: "C", clanInvasion: "C", darkAge: "C" },
        flags: ["directFire", "requiresAmmo"],
    },

    srm2: {
        id: "srm2",
        name: "SRM 2",
        altNames: ["SRM-2", "IS SRM 2", "ISSRM2"],
        family: "srm",
        variant: "IS SRM 2",
        techBase: "Inner Sphere",
        rulesLevel: "Introductory",
        category: "Missile",
        damage: "cluster",
        rackSize: 2,
        heat: 2,
        tons: 1,
        critSlots: 1,
        ammo: { ammoType: "srm", ammoPerTon: 50, ammoCostPerTon: 27000, ammoBV: 3 },
        range: { short: 3, medium: 6, long: 9 },
        cost: 10000,
        bv: 21,
        techRating: "C",
        availability: { starLeague: "C", successionWars: "C", clanInvasion: "C", darkAge: "C" },
        flags: ["cluster", "requiresAmmo"],
    },

    srm4: {
        id: "srm4",
        name: "SRM 4",
        altNames: ["SRM-4", "IS SRM 4", "ISSRM4"],
        family: "srm",
        variant: "IS SRM 4",
        techBase: "Inner Sphere",
        rulesLevel: "Introductory",
        category: "Missile",
        damage: "cluster",
        rackSize: 4,
        heat: 3,
        tons: 2,
        critSlots: 1,
        ammo: { ammoType: "srm", ammoPerTon: 25, ammoCostPerTon: 27000, ammoBV: 5 },
        range: { short: 3, medium: 6, long: 9 },
        cost: 60000,
        bv: 39,
        techRating: "C",
        availability: { starLeague: "C", successionWars: "C", clanInvasion: "C", darkAge: "C" },
        flags: ["cluster", "requiresAmmo"],
    },

    srm6: {
        id: "srm6",
        name: "SRM 6",
        altNames: ["SRM-6", "IS SRM 6", "ISSRM6"],
        family: "srm",
        variant: "IS SRM 6",
        techBase: "Inner Sphere",
        rulesLevel: "Introductory",
        category: "Missile",
        damage: "cluster",
        rackSize: 6,
        heat: 4,
        tons: 3,
        critSlots: 2,
        ammo: { ammoType: "srm", ammoPerTon: 15, ammoCostPerTon: 27000, ammoBV: 7 },
        range: { short: 3, medium: 6, long: 9, extreme: 12 },
        cost: 80000,
        bv: 59,
        techRating: "C",
        availability: { starLeague: "C", successionWars: "C", clanInvasion: "C", darkAge: "C" },
        flags: ["cluster", "requiresAmmo"],
    },

    lrm5: {
        id: "lrm5",
        name: "LRM 5",
        altNames: ["LRM-5", "IS LRM 5", "ISLRM5"],
        family: "lrm",
        variant: "IS LRM 5",
        techBase: "Inner Sphere",
        rulesLevel: "Introductory",
        category: "Missile",
        damage: "cluster",
        rackSize: 5,
        heat: 2,
        tons: 2,
        critSlots: 1,
        ammo: { ammoType: "lrm", ammoPerTon: 24, ammoCostPerTon: 30000, ammoBV: 6 },
        range: { min: 6, short: 7, medium: 14, long: 21 },
        cost: 30000,
        bv: 45,
        techRating: "C",
        availability: { starLeague: "C", successionWars: "C", clanInvasion: "C", darkAge: "C" },
        flags: ["cluster", "indirectFire", "minimumRange", "requiresAmmo"],
    },

    lrm10: {
        id: "lrm10",
        name: "LRM 10",
        altNames: ["LRM-10", "IS LRM 10", "ISLRM10"],
        family: "lrm",
        variant: "IS LRM 10",
        techBase: "Inner Sphere",
        rulesLevel: "Introductory",
        category: "Missile",
        damage: "cluster",
        rackSize: 10,
        heat: 4,
        tons: 5,
        critSlots: 2,
        ammo: { ammoType: "lrm", ammoPerTon: 12, ammoCostPerTon: 30000, ammoBV: 11 },
        range: { min: 6, short: 7, medium: 14, long: 21 },
        cost: 100000,
        bv: 90,
        techRating: "C",
        availability: { starLeague: "C", successionWars: "C", clanInvasion: "C", darkAge: "C" },
        flags: ["cluster", "indirectFire", "minimumRange", "requiresAmmo"],
    },

    lrm15: {
        id: "lrm15",
        name: "LRM 15",
        altNames: ["LRM-15", "IS LRM 15", "ISLRM15"],
        family: "lrm",
        variant: "IS LRM 15",
        techBase: "Inner Sphere",
        rulesLevel: "Introductory",
        category: "Missile",
        damage: "cluster",
        rackSize: 15,
        heat: 5,
        tons: 7,
        critSlots: 3,
        ammo: { ammoType: "lrm", ammoPerTon: 8, ammoCostPerTon: 30000, ammoBV: 17 },
        range: { min: 6, short: 7, medium: 14, long: 21 },
        cost: 175000,
        bv: 136,
        techRating: "C",
        availability: { starLeague: "C", successionWars: "C", clanInvasion: "C", darkAge: "C" },
        flags: ["cluster", "indirectFire", "minimumRange", "requiresAmmo"],
    },

    lrm20: {
        id: "lrm20",
        name: "LRM 20",
        altNames: ["LRM-20", "IS LRM 20", "ISLRM20"],
        family: "lrm",
        variant: "IS LRM 20",
        techBase: "Inner Sphere",
        rulesLevel: "Introductory",
        category: "Missile",
        damage: "cluster",
        rackSize: 20,
        heat: 6,
        tons: 10,
        critSlots: 5,
        ammo: { ammoType: "lrm", ammoPerTon: 6, ammoCostPerTon: 30000, ammoBV: 23 },
        range: { min: 6, short: 7, medium: 14, long: 21 },
        cost: 250000,
        bv: 181,
        techRating: "C",
        availability: { starLeague: "C", successionWars: "C", clanInvasion: "C", darkAge: "C" },
        flags: ["cluster", "indirectFire", "minimumRange", "requiresAmmo"],
    },
};