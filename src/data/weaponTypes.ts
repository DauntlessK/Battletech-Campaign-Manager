export type WeaponCategory = "Energy" | "Ballistic" | "Missile" | "Equipment" | "Artillery";

export type TechBase = "Inner Sphere" | "Clan" | "Mixed";
export type RulesLevel = "Introductory" | "Standard" | "Advanced" | "Experimental";

export type AvailabilityByEra = {
    starLeague: string;
    successionWars: string;
    clanInvasion: string;
    darkAge?: string;
};

export type WeaponAvailability = AvailabilityByEra & {
    introduced?: string;
    extinct?: string;
    reintroduced?: string;
};

export type WeaponCost =
    | number
    | { type: "fixed"; amount: number }
    | { type: "equipmentTonnage"; multiplier: number }
    | { type: "unitTonnage"; multiplier: number }
    | { type: "none"; reason?: string };


export type WeaponRange = {
    min?: number;
    short?: number;
    medium?: number;
    long?: number;
    extreme?: number;
};


export type AmmoDefinition = {
    id: string;
    name: string;
    ammoType: string;
    weaponIds: string[];
    compatibleWeaponNames?: string[];
    mode?: string;
    techBase: TechBase;
    rulesLevel?: RulesLevel;
    shotsPerTon?: number | string;
    costPerTon?: number;
    bv?: number | string;
    availability?: WeaponAvailability;
    source?: {
        totalWarfarePage?: number;
        weightSpacePage?: number;
        costAvailabilityPage?: number;
        battleValuePage?: number;
    };
};

export type AmmoReference = {
    ammoId: string;
};

export type AmmoOptionReference = AmmoReference & {
    mode: string;
};

export type WeaponDefinition = {
    id: string;
    name: string;
    altNames: string[];
    category: WeaponCategory;
    techBase: TechBase;
    rulesLevel?: RulesLevel;
    variant?: string;
    family?: string;
    typeCodes?: string[];

    /** Values like "1/Msl", "2/Shot", "25/20/10", "special", or "C5/20" are intentionally kept as strings. */
    damage: number | string;
    rackSize?: number;
    heat: number | string;

    /** BattleMech/IndustrialMech critical slots from the M column of the construction table. */
    tons: number | string;
    critSlots: number | string;
    spaceSlots?: number | string;

    /** Reference to the primary ammunition definition in AMMO. */
    ammo?: AmmoReference;

    /** Optional ammunition-mode references for launchers that can use more than one ammo family, such as MMLs. */
    ammoOptions?: AmmoOptionReference[];

    range?: WeaponRange;

    /** Weapon purchase cost. Present only where already verified in the existing file/source data. */
    cost?: WeaponCost;

    /** Weapon BV/WBR from the Weapons and Equipment Battle Value tables. Some equipment uses rule-code values (A-F) from table notes instead of standalone numeric BV. */
    bv: number | string;
    /** Single-shot/one-shot missile launcher BV, when the BV table lists a second value after a slash. */
    oneShotBV?: number;
    /** Standalone ammo BV for equipment entries that do not have an ammo object. */
    ammoBV?: number | string;

    techRating?: string;
    availability?: WeaponAvailability;

    source?: {
        totalWarfarePage?: number;
        weightSpacePage?: number;
        costAvailabilityPage?: number;
        battleValuePage?: number;
    };

    flags?: string[];
    notes?: string[];
};
