export type WeaponCategory = "Energy" | "Ballistic" | "Missile" | "Equipment";

export type TechBase = "Inner Sphere" | "Clan" | "Mixed";
export type RulesLevel = "Introductory" | "Standard" | "Advanced" | "Experimental";

export type WeaponRange = {
    min?: number;
    short?: number;
    medium?: number;
    long?: number;
    extreme?: number;
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

    ammo?: {
        ammoType: string;
        ammoPerTon: number | string;
        ammoCostPerTon?: number;
        ammoBV?: number;
    };

    range?: WeaponRange;

    /** Weapon purchase cost. Present only where already verified in the existing file/source data. */
    cost?: number;

    /** Weapon BV/WBR from the Weapons and Equipment Battle Value tables. Some equipment uses rule-code values (A-F) from table notes instead of standalone numeric BV. */
    bv: number | string;
    /** Single-shot/one-shot missile launcher BV, when the BV table lists a second value after a slash. */
    oneShotBV?: number;
    /** Standalone ammo BV for equipment entries that do not have an ammo object. */
    ammoBV?: number | string;

    techRating?: string;
    availability?: {
        code?: string;
        introduced?: string;
        extinct?: string;
        reintroduced?: string;
    };

    aerospace?: {
        attackValue?: number | string;
        range?: string;
        toHitModifier?: number | string;
    };

    source?: {
        totalWarfarePage?: number;
        weightSpacePage?: number;
        costAvailabilityPage?: number;
        battleValuePage?: number;
    };

    flags?: string[];
    notes?: string[];
};

export const WEAPONS = {
    "is_autocannon_2": {
        "id": "is_autocannon_2",
        "name": "Autocannon/2",
        "altNames": [
            "IS Autocannon/2",
            "ISAutocannon2"
        ],
        "category": "Ballistic",
        "techBase": "Inner Sphere",
        "rulesLevel": "Introductory",
        "variant": "IS",
        "family": "autocannon",
        "damage": 2,
        "heat": 1,
        "tons": 6,
        "critSlots": 1,
        "spaceSlots": 1,
        "range": {
            "min": 4,
            "short": 8,
            "medium": 16,
            "long": 24
        },
        "techRating": "C",
        "flags": [
            "directFire"
        ],
        "source": {
            "weightSpacePage": 341,
            "battleValuePage": 317
        },
        "typeCodes": [
            "DB",
            "S"
        ],
        "aerospace": {
            "attackValue": "2",
            "range": "Long",
            "toHitModifier": 0
        },
        "ammo": {
            "ammoType": "is_standard_ac",
            "ammoPerTon": 45,
            "ammoCostPerTon": 1000,
            "ammoBV": 5
        },
        "cost": 75000,
        "bv": 37
    },
    "is_autocannon_5": {
        "id": "is_autocannon_5",
        "name": "Autocannon/5",
        "altNames": [
            "IS Autocannon/5",
            "ISAutocannon5"
        ],
        "category": "Ballistic",
        "techBase": "Inner Sphere",
        "rulesLevel": "Introductory",
        "variant": "IS",
        "family": "autocannon",
        "damage": 5,
        "heat": 1,
        "tons": 8,
        "critSlots": 4,
        "spaceSlots": 4,
        "range": {
            "min": 3,
            "short": 6,
            "medium": 12,
            "long": 18
        },
        "techRating": "C",
        "flags": [
            "directFire"
        ],
        "source": {
            "weightSpacePage": 341,
            "battleValuePage": 317
        },
        "typeCodes": [
            "DB",
            "S"
        ],
        "aerospace": {
            "attackValue": "5",
            "range": "Medium",
            "toHitModifier": 0
        },
        "ammo": {
            "ammoType": "is_standard_ac",
            "ammoPerTon": 20,
            "ammoCostPerTon": 1000,
            "ammoBV": 9
        },
        "cost": 125000,
        "bv": 70
    },
    "is_autocannon_10": {
        "id": "is_autocannon_10",
        "name": "Autocannon/10",
        "altNames": [
            "IS Autocannon/10",
            "ISAutocannon10"
        ],
        "category": "Ballistic",
        "techBase": "Inner Sphere",
        "rulesLevel": "Introductory",
        "variant": "IS",
        "family": "autocannon",
        "damage": 10,
        "heat": 3,
        "tons": 12,
        "critSlots": 7,
        "spaceSlots": 7,
        "range": {
            "min": 0,
            "short": 5,
            "medium": 10,
            "long": 15
        },
        "techRating": "C",
        "flags": [
            "directFire"
        ],
        "source": {
            "weightSpacePage": 341,
            "battleValuePage": 317
        },
        "typeCodes": [
            "DB",
            "S"
        ],
        "aerospace": {
            "attackValue": "10",
            "range": "Medium",
            "toHitModifier": 0
        },
        "ammo": {
            "ammoType": "is_standard_ac",
            "ammoPerTon": 10,
            "ammoCostPerTon": 1000,
            "ammoBV": 15
        },
        "cost": 200000,
        "bv": 123
    },
    "is_autocannon_20": {
        "id": "is_autocannon_20",
        "name": "Autocannon/20",
        "altNames": [
            "IS Autocannon/20",
            "ISAutocannon20"
        ],
        "category": "Ballistic",
        "techBase": "Inner Sphere",
        "rulesLevel": "Introductory",
        "variant": "IS",
        "family": "autocannon",
        "damage": 20,
        "heat": 7,
        "tons": 14,
        "critSlots": 10,
        "spaceSlots": 10,
        "range": {
            "min": 0,
            "short": 3,
            "medium": 6,
            "long": 9
        },
        "techRating": "C",
        "flags": [
            "directFire"
        ],
        "source": {
            "weightSpacePage": 341,
            "battleValuePage": 317
        },
        "typeCodes": [
            "DB",
            "S"
        ],
        "aerospace": {
            "attackValue": "20",
            "range": "Short",
            "toHitModifier": 0
        },
        "ammo": {
            "ammoType": "is_standard_ac",
            "ammoPerTon": 5,
            "ammoCostPerTon": 1000,
            "ammoBV": 22
        },
        "cost": 300000,
        "bv": 178
    },
    "is_lb_2_x_ac": {
        "id": "is_lb_2_x_ac",
        "name": "LB 2-X AC",
        "altNames": [
            "IS LB 2-X AC",
            "ISLB2XAC",
            "LB2XAC"
        ],
        "category": "Ballistic",
        "techBase": "Inner Sphere",
        "rulesLevel": "Standard",
        "variant": "IS",
        "family": "lbXAutocannon",
        "damage": 2,
        "heat": 1,
        "tons": 6,
        "critSlots": 4,
        "spaceSlots": 4,
        "range": {
            "min": 4,
            "short": 9,
            "medium": 18,
            "long": 27
        },
        "techRating": "E",
        "flags": [
            "directFire",
            "requiresAmmo",
            "clusterAmmo",
            "flak",
            "switchableAmmo"
        ],
        "source": {
            "weightSpacePage": 341,
            "battleValuePage": 317
        },
        "typeCodes": [
            "DB",
            "C",
            "S",
            "F"
        ],
        "aerospace": {
            "attackValue": "2",
            "range": "Extreme",
            "toHitModifier": "0/-1"
        },
        "ammo": {
            "ammoType": "is_lb_x_ac",
            "ammoPerTon": 45,
            "ammoCostPerTon": 2000,
            "ammoBV": 5
        },
        "bv": 42
    },
    "is_lb_5_x_ac": {
        "id": "is_lb_5_x_ac",
        "name": "LB 5-X AC",
        "altNames": [
            "IS LB 5-X AC",
            "ISLB5XAC",
            "LB5XAC"
        ],
        "category": "Ballistic",
        "techBase": "Inner Sphere",
        "rulesLevel": "Standard",
        "variant": "IS",
        "family": "lbXAutocannon",
        "damage": 5,
        "heat": 1,
        "tons": 8,
        "critSlots": 5,
        "spaceSlots": 5,
        "range": {
            "min": 3,
            "short": 7,
            "medium": 14,
            "long": 21
        },
        "techRating": "E",
        "flags": [
            "directFire",
            "requiresAmmo",
            "clusterAmmo",
            "flak",
            "switchableAmmo"
        ],
        "source": {
            "weightSpacePage": 341,
            "battleValuePage": 317
        },
        "typeCodes": [
            "DB",
            "C",
            "S",
            "F"
        ],
        "aerospace": {
            "attackValue": "3",
            "range": "Long",
            "toHitModifier": "0/-1"
        },
        "ammo": {
            "ammoType": "is_lb_x_ac",
            "ammoPerTon": 20,
            "ammoCostPerTon": 2000,
            "ammoBV": 10
        },
        "bv": 83
    },
    "is_lb_10_x_ac": {
        "id": "is_lb_10_x_ac",
        "name": "LB 10-X AC",
        "altNames": [
            "IS LB 10-X AC",
            "ISLB10XAC",
            "LB10XAC"
        ],
        "category": "Ballistic",
        "techBase": "Inner Sphere",
        "rulesLevel": "Standard",
        "variant": "IS",
        "family": "lbXAutocannon",
        "damage": 10,
        "heat": 2,
        "tons": 11,
        "critSlots": 6,
        "spaceSlots": 6,
        "range": {
            "min": 0,
            "short": 6,
            "medium": 12,
            "long": 18
        },
        "techRating": "E",
        "flags": [
            "directFire",
            "requiresAmmo",
            "clusterAmmo",
            "flak",
            "switchableAmmo"
        ],
        "source": {
            "weightSpacePage": 341,
            "battleValuePage": 317
        },
        "typeCodes": [
            "DB",
            "C",
            "S",
            "F"
        ],
        "aerospace": {
            "attackValue": "6",
            "range": "Medium",
            "toHitModifier": "0/-1"
        },
        "ammo": {
            "ammoType": "is_lb_x_ac",
            "ammoPerTon": 10,
            "ammoCostPerTon": 2000,
            "ammoBV": 19
        },
        "bv": 148
    },
    "is_lb_20_x_ac": {
        "id": "is_lb_20_x_ac",
        "name": "LB 20-X AC",
        "altNames": [
            "IS LB 20-X AC",
            "ISLB20XAC",
            "LB20XAC"
        ],
        "category": "Ballistic",
        "techBase": "Inner Sphere",
        "rulesLevel": "Standard",
        "variant": "IS",
        "family": "lbXAutocannon",
        "damage": 20,
        "heat": 6,
        "tons": 14,
        "critSlots": 11,
        "spaceSlots": 11,
        "range": {
            "min": 0,
            "short": 4,
            "medium": 8,
            "long": 12
        },
        "techRating": "E",
        "flags": [
            "directFire",
            "requiresAmmo",
            "clusterAmmo",
            "flak",
            "switchableAmmo"
        ],
        "source": {
            "weightSpacePage": 341,
            "battleValuePage": 317
        },
        "typeCodes": [
            "DB",
            "C",
            "S",
            "F"
        ],
        "aerospace": {
            "attackValue": "12",
            "range": "Medium",
            "toHitModifier": "0/-1"
        },
        "ammo": {
            "ammoType": "is_lb_x_ac",
            "ammoPerTon": 5,
            "ammoCostPerTon": 2000,
            "ammoBV": 30
        },
        "bv": 237
    },
    "is_light_ac_2": {
        "id": "is_light_ac_2",
        "name": "Light AC/2",
        "altNames": [
            "IS Light AC/2",
            "ISLightAC2",
            "LightAC/2"
        ],
        "category": "Ballistic",
        "techBase": "Inner Sphere",
        "rulesLevel": "Standard",
        "variant": "IS",
        "family": "lightAutocannon",
        "damage": 2,
        "heat": 1,
        "tons": 4,
        "critSlots": 1,
        "spaceSlots": 1,
        "range": {
            "min": 0,
            "short": 6,
            "medium": 12,
            "long": 18
        },
        "techRating": "D",
        "flags": [
            "directFire",
            "requiresAmmo"
        ],
        "source": {
            "weightSpacePage": 341,
            "battleValuePage": 317
        },
        "typeCodes": [
            "DB",
            "S"
        ],
        "aerospace": {
            "attackValue": "2",
            "range": "Medium",
            "toHitModifier": 0
        },
        "ammo": {
            "ammoType": "is_light_ac",
            "ammoPerTon": 45,
            "ammoCostPerTon": 1000,
            "ammoBV": 4
        },
        "bv": 30
    },
    "is_light_ac_5": {
        "id": "is_light_ac_5",
        "name": "Light AC/5",
        "altNames": [
            "IS Light AC/5",
            "ISLightAC5",
            "LightAC/5"
        ],
        "category": "Ballistic",
        "techBase": "Inner Sphere",
        "rulesLevel": "Standard",
        "variant": "IS",
        "family": "lightAutocannon",
        "damage": 5,
        "heat": 1,
        "tons": 5,
        "critSlots": 2,
        "spaceSlots": 2,
        "range": {
            "min": 0,
            "short": 5,
            "medium": 10,
            "long": 15
        },
        "techRating": "D",
        "flags": [
            "directFire",
            "requiresAmmo"
        ],
        "source": {
            "weightSpacePage": 341,
            "battleValuePage": 317
        },
        "typeCodes": [
            "DB",
            "S"
        ],
        "aerospace": {
            "attackValue": "5",
            "range": "Medium",
            "toHitModifier": 0
        },
        "ammo": {
            "ammoType": "is_light_ac",
            "ammoPerTon": 20,
            "ammoCostPerTon": 1000,
            "ammoBV": 8
        },
        "bv": 62
    },
    "is_rotary_ac_2": {
        "id": "is_rotary_ac_2",
        "name": "Rotary AC/2",
        "altNames": [
            "IS Rotary AC/2",
            "ISRotaryAC2",
            "RotaryAC/2"
        ],
        "category": "Ballistic",
        "techBase": "Inner Sphere",
        "rulesLevel": "Standard",
        "variant": "IS",
        "family": "rotaryAutocannon",
        "damage": "2/Shot",
        "heat": 1,
        "tons": 8,
        "critSlots": 3,
        "spaceSlots": 3,
        "range": {
            "min": 0,
            "short": 6,
            "medium": 12,
            "long": 18
        },
        "techRating": "E",
        "flags": [
            "directFire",
            "requiresAmmo",
            "rapidFire"
        ],
        "source": {
            "weightSpacePage": 341,
            "battleValuePage": 317
        },
        "typeCodes": [
            "DB",
            "R",
            "C"
        ],
        "aerospace": {
            "attackValue": "8",
            "range": "Medium",
            "toHitModifier": 0
        },
        "ammo": {
            "ammoType": "is_rotary_ac",
            "ammoPerTon": 45,
            "ammoCostPerTon": 3000,
            "ammoBV": 15
        },
        "bv": 118
    },
    "is_rotary_ac_5": {
        "id": "is_rotary_ac_5",
        "name": "Rotary AC/5",
        "altNames": [
            "IS Rotary AC/5",
            "ISRotaryAC5",
            "RotaryAC/5"
        ],
        "category": "Ballistic",
        "techBase": "Inner Sphere",
        "rulesLevel": "Standard",
        "variant": "IS",
        "family": "rotaryAutocannon",
        "damage": "5/Shot",
        "heat": 1,
        "tons": 10,
        "critSlots": 6,
        "spaceSlots": 6,
        "range": {
            "min": 0,
            "short": 5,
            "medium": 10,
            "long": 15
        },
        "techRating": "E",
        "flags": [
            "directFire",
            "requiresAmmo",
            "rapidFire"
        ],
        "source": {
            "weightSpacePage": 341,
            "battleValuePage": 317
        },
        "typeCodes": [
            "DB",
            "R",
            "C"
        ],
        "aerospace": {
            "attackValue": "20",
            "range": "Medium",
            "toHitModifier": 0
        },
        "ammo": {
            "ammoType": "is_rotary_ac",
            "ammoPerTon": 20,
            "ammoCostPerTon": 3000,
            "ammoBV": 31
        },
        "bv": 247
    },
    "is_ultra_ac_2": {
        "id": "is_ultra_ac_2",
        "name": "Ultra AC/2",
        "altNames": [
            "IS Ultra AC/2",
            "ISUltraAC2",
            "UltraAC/2"
        ],
        "category": "Ballistic",
        "techBase": "Inner Sphere",
        "rulesLevel": "Standard",
        "variant": "IS",
        "family": "ultraAutocannon",
        "damage": "2/Shot",
        "heat": 1,
        "tons": 7,
        "critSlots": 3,
        "spaceSlots": 3,
        "range": {
            "min": 3,
            "short": 8,
            "medium": 17,
            "long": 25
        },
        "techRating": "E",
        "flags": [
            "directFire",
            "requiresAmmo",
            "rapidFire"
        ],
        "source": {
            "weightSpacePage": 341,
            "battleValuePage": 317
        },
        "typeCodes": [
            "DB",
            "R",
            "C"
        ],
        "aerospace": {
            "attackValue": "3",
            "range": "Extreme",
            "toHitModifier": 0
        },
        "ammo": {
            "ammoType": "is_ultra_ac",
            "ammoPerTon": 45,
            "ammoCostPerTon": 1000,
            "ammoBV": 7
        },
        "bv": 56
    },
    "is_ultra_ac_5": {
        "id": "is_ultra_ac_5",
        "name": "Ultra AC/5",
        "altNames": [
            "IS Ultra AC/5",
            "ISUltraAC5",
            "UltraAC/5"
        ],
        "category": "Ballistic",
        "techBase": "Inner Sphere",
        "rulesLevel": "Standard",
        "variant": "IS",
        "family": "ultraAutocannon",
        "damage": "5/Shot",
        "heat": 1,
        "tons": 9,
        "critSlots": 5,
        "spaceSlots": 5,
        "range": {
            "min": 2,
            "short": 6,
            "medium": 13,
            "long": 20
        },
        "techRating": "E",
        "flags": [
            "directFire",
            "requiresAmmo",
            "rapidFire"
        ],
        "source": {
            "weightSpacePage": 341,
            "battleValuePage": 317
        },
        "typeCodes": [
            "DB",
            "R",
            "C"
        ],
        "aerospace": {
            "attackValue": "7",
            "range": "Long",
            "toHitModifier": 0
        },
        "ammo": {
            "ammoType": "is_ultra_ac",
            "ammoPerTon": 20,
            "ammoCostPerTon": 1000,
            "ammoBV": 14
        },
        "bv": 112
    },
    "is_ultra_ac_10": {
        "id": "is_ultra_ac_10",
        "name": "Ultra AC/10",
        "altNames": [
            "IS Ultra AC/10",
            "ISUltraAC10",
            "UltraAC/10"
        ],
        "category": "Ballistic",
        "techBase": "Inner Sphere",
        "rulesLevel": "Standard",
        "variant": "IS",
        "family": "ultraAutocannon",
        "damage": "10/Shot",
        "heat": 4,
        "tons": 13,
        "critSlots": 7,
        "spaceSlots": 7,
        "range": {
            "min": 0,
            "short": 6,
            "medium": 12,
            "long": 18
        },
        "techRating": "E",
        "flags": [
            "directFire",
            "requiresAmmo",
            "rapidFire"
        ],
        "source": {
            "weightSpacePage": 341,
            "battleValuePage": 317
        },
        "typeCodes": [
            "DB",
            "R",
            "C"
        ],
        "aerospace": {
            "attackValue": "15",
            "range": "Medium",
            "toHitModifier": 0
        },
        "ammo": {
            "ammoType": "is_ultra_ac",
            "ammoPerTon": 10,
            "ammoCostPerTon": 1000,
            "ammoBV": 26
        },
        "bv": 210
    },
    "is_ultra_ac_20": {
        "id": "is_ultra_ac_20",
        "name": "Ultra AC/20",
        "altNames": [
            "IS Ultra AC/20",
            "ISUltraAC20",
            "UltraAC/20"
        ],
        "category": "Ballistic",
        "techBase": "Inner Sphere",
        "rulesLevel": "Standard",
        "variant": "IS",
        "family": "ultraAutocannon",
        "damage": "20/Shot",
        "heat": 8,
        "tons": 15,
        "critSlots": 10,
        "spaceSlots": 10,
        "range": {
            "min": 0,
            "short": 3,
            "medium": 7,
            "long": 10
        },
        "techRating": "E",
        "flags": [
            "directFire",
            "requiresAmmo",
            "rapidFire"
        ],
        "source": {
            "weightSpacePage": 341,
            "battleValuePage": 317
        },
        "typeCodes": [
            "DB",
            "R",
            "C"
        ],
        "aerospace": {
            "attackValue": "30",
            "range": "Medium",
            "toHitModifier": 0
        },
        "ammo": {
            "ammoType": "is_ultra_ac",
            "ammoPerTon": 5,
            "ammoCostPerTon": 1000,
            "ammoBV": 35
        },
        "bv": 281
    },
    "is_light_gauss_rifle": {
        "id": "is_light_gauss_rifle",
        "name": "Light Gauss Rifle",
        "altNames": [
            "IS Light Gauss Rifle",
            "ISLightGaussRifle",
            "LightGaussRifle"
        ],
        "category": "Ballistic",
        "techBase": "Inner Sphere",
        "rulesLevel": "Standard",
        "variant": "IS",
        "family": "gauss",
        "damage": 8,
        "heat": 1,
        "tons": 12,
        "critSlots": 5,
        "spaceSlots": 5,
        "range": {
            "min": 3,
            "short": 8,
            "medium": 17,
            "long": 25
        },
        "techRating": "E",
        "flags": [
            "directFire",
            "requiresAmmo"
        ],
        "source": {
            "weightSpacePage": 341,
            "battleValuePage": 317
        },
        "typeCodes": [
            "DB",
            "X"
        ],
        "aerospace": {
            "attackValue": "8",
            "range": "Extreme",
            "toHitModifier": 0
        },
        "ammo": {
            "ammoType": "is_light_gauss",
            "ammoPerTon": 16,
            "ammoCostPerTon": 20000,
            "ammoBV": 20
        },
        "bv": 159,
        "notes": [
            "Ammo BV marked \u00a7 in the BV table; ammunition is not counted as explosive."
        ]
    },
    "is_gauss_rifle": {
        "id": "is_gauss_rifle",
        "name": "Gauss Rifle",
        "altNames": [
            "IS Gauss Rifle",
            "ISGaussRifle",
            "GaussRifle"
        ],
        "category": "Ballistic",
        "techBase": "Inner Sphere",
        "rulesLevel": "Standard",
        "variant": "IS",
        "family": "gauss",
        "damage": 15,
        "heat": 1,
        "tons": 15,
        "critSlots": 7,
        "spaceSlots": 7,
        "range": {
            "min": 2,
            "short": 7,
            "medium": 15,
            "long": 22
        },
        "techRating": "E",
        "flags": [
            "directFire",
            "requiresAmmo"
        ],
        "source": {
            "weightSpacePage": 341,
            "battleValuePage": 317
        },
        "typeCodes": [
            "DB",
            "X"
        ],
        "aerospace": {
            "attackValue": "15",
            "range": "Long",
            "toHitModifier": 0
        },
        "ammo": {
            "ammoType": "is_gauss",
            "ammoPerTon": 8,
            "ammoCostPerTon": 20000,
            "ammoBV": 40
        },
        "bv": 320,
        "notes": [
            "Ammo BV marked \u00a7 in the BV table; ammunition is not counted as explosive."
        ]
    },
    "is_heavy_gauss_rifle": {
        "id": "is_heavy_gauss_rifle",
        "name": "Heavy Gauss Rifle",
        "altNames": [
            "IS Heavy Gauss Rifle",
            "ISHeavyGaussRifle",
            "HeavyGaussRifle"
        ],
        "category": "Ballistic",
        "techBase": "Inner Sphere",
        "rulesLevel": "Standard",
        "variant": "IS",
        "family": "gauss",
        "damage": "25/20/10",
        "heat": 2,
        "tons": 18,
        "critSlots": 11,
        "spaceSlots": 11,
        "range": {
            "min": 4,
            "short": 6,
            "medium": 13,
            "long": 20
        },
        "techRating": "E",
        "flags": [
            "directFire",
            "requiresAmmo"
        ],
        "source": {
            "weightSpacePage": 341,
            "battleValuePage": 317
        },
        "typeCodes": [
            "DB",
            "X",
            "V"
        ],
        "aerospace": {
            "attackValue": "25/20/10",
            "range": "Long",
            "toHitModifier": 0
        },
        "ammo": {
            "ammoType": "is_heavy_gauss",
            "ammoPerTon": 4,
            "ammoCostPerTon": 20000,
            "ammoBV": 43
        },
        "bv": 346,
        "notes": [
            "Ammo BV marked \u00a7 in the BV table; ammunition is not counted as explosive."
        ]
    },
    "is_light_machine_gun": {
        "id": "is_light_machine_gun",
        "name": "Light Machine Gun",
        "altNames": [
            "IS Light Machine Gun",
            "ISLightMachineGun",
            "LightMachineGun"
        ],
        "category": "Ballistic",
        "techBase": "Inner Sphere",
        "rulesLevel": "Standard",
        "variant": "IS",
        "family": "machineGun",
        "damage": 1,
        "heat": 0,
        "tons": 0.5,
        "critSlots": 1,
        "spaceSlots": 1,
        "range": {
            "min": 0,
            "short": 2,
            "medium": 4,
            "long": 6
        },
        "techRating": "B",
        "flags": [
            "directFire",
            "antiInfantry",
            "requiresAmmo"
        ],
        "source": {
            "weightSpacePage": 341,
            "battleValuePage": 317
        },
        "typeCodes": [
            "DB",
            "AI"
        ],
        "aerospace": {
            "attackValue": "1",
            "range": "Short",
            "toHitModifier": 0
        },
        "ammo": {
            "ammoType": "is_machine_gun",
            "ammoPerTon": 200,
            "ammoCostPerTon": 1000,
            "ammoBV": 1
        },
        "bv": 5
    },
    "is_machine_gun": {
        "id": "is_machine_gun",
        "name": "Machine Gun",
        "altNames": [
            "IS Machine Gun",
            "ISMachineGun",
            "MachineGun"
        ],
        "category": "Ballistic",
        "techBase": "Inner Sphere",
        "rulesLevel": "Introductory",
        "variant": "IS",
        "family": "machineGun",
        "damage": 2,
        "heat": 0,
        "tons": 0.5,
        "critSlots": 1,
        "spaceSlots": 1,
        "range": {
            "min": 0,
            "short": 1,
            "medium": 2,
            "long": 3
        },
        "techRating": "B",
        "flags": [
            "directFire",
            "antiInfantry",
            "requiresAmmo"
        ],
        "source": {
            "weightSpacePage": 341,
            "battleValuePage": 317
        },
        "typeCodes": [
            "DB",
            "AI"
        ],
        "aerospace": {
            "attackValue": "2",
            "range": "Short",
            "toHitModifier": 0
        },
        "ammo": {
            "ammoType": "is_machine_gun",
            "ammoPerTon": 200,
            "ammoCostPerTon": 1000,
            "ammoBV": 1
        },
        "cost": 5000,
        "bv": 5
    },
    "is_heavy_machine_gun": {
        "id": "is_heavy_machine_gun",
        "name": "Heavy Machine Gun",
        "altNames": [
            "IS Heavy Machine Gun",
            "ISHeavyMachineGun",
            "HeavyMachineGun"
        ],
        "category": "Ballistic",
        "techBase": "Inner Sphere",
        "rulesLevel": "Standard",
        "variant": "IS",
        "family": "machineGun",
        "damage": 3,
        "heat": 0,
        "tons": 1.0,
        "critSlots": 1,
        "spaceSlots": 1,
        "range": {
            "min": 0,
            "short": 1,
            "medium": 2
        },
        "techRating": "B",
        "flags": [
            "directFire",
            "antiInfantry",
            "requiresAmmo"
        ],
        "source": {
            "weightSpacePage": 341,
            "battleValuePage": 317
        },
        "typeCodes": [
            "DB",
            "AI"
        ],
        "aerospace": {
            "attackValue": "3",
            "range": "Short",
            "toHitModifier": 0
        },
        "ammo": {
            "ammoType": "is_machine_gun",
            "ammoPerTon": 100,
            "ammoCostPerTon": 1000,
            "ammoBV": 1
        },
        "bv": 6
    },
    "is_flamer": {
        "id": "is_flamer",
        "name": "Flamer",
        "altNames": [
            "IS Flamer",
            "ISFlamer"
        ],
        "category": "Energy",
        "techBase": "Inner Sphere",
        "rulesLevel": "Introductory",
        "variant": "IS",
        "family": "flamer",
        "damage": 2,
        "heat": 3,
        "tons": 1,
        "critSlots": 1,
        "spaceSlots": 1,
        "range": {
            "min": 0,
            "short": 1,
            "medium": 2,
            "long": 3
        },
        "techRating": "C",
        "flags": [
            "directFire",
            "antiInfantry"
        ],
        "source": {
            "weightSpacePage": 341,
            "battleValuePage": 317
        },
        "typeCodes": [
            "DE",
            "H",
            "AI"
        ],
        "aerospace": {
            "attackValue": "2",
            "range": "Short",
            "toHitModifier": 0
        },
        "cost": 7500,
        "bv": 6
    },
    "is_flamer_vehicle": {
        "id": "is_flamer_vehicle",
        "name": "Flamer (Vehicle)",
        "altNames": [
            "IS Flamer (Vehicle)",
            "ISFlamer(Vehicle)",
            "Flamer(Vehicle)"
        ],
        "category": "Energy",
        "techBase": "Inner Sphere",
        "rulesLevel": "Standard",
        "variant": "IS",
        "family": "flamer",
        "damage": 2,
        "heat": 3,
        "tons": 0.5,
        "critSlots": 1,
        "spaceSlots": 1,
        "range": {
            "min": 0,
            "short": 1,
            "medium": 2,
            "long": 3
        },
        "techRating": "B",
        "flags": [
            "directFire",
            "antiInfantry",
            "requiresAmmo"
        ],
        "source": {
            "weightSpacePage": 341,
            "battleValuePage": 317
        },
        "typeCodes": [
            "DE",
            "H",
            "AI"
        ],
        "aerospace": {
            "attackValue": "2",
            "range": "Short",
            "toHitModifier": 0
        },
        "ammo": {
            "ammoType": "is_vehicle_flamer",
            "ammoPerTon": 20,
            "ammoCostPerTon": 1000,
            "ammoBV": 1
        },
        "bv": 5
    },
    "is_er_small_laser": {
        "id": "is_er_small_laser",
        "name": "ER Small Laser",
        "altNames": [
            "IS ER Small Laser",
            "ISERSmallLaser",
            "ERSmallLaser"
        ],
        "category": "Energy",
        "techBase": "Inner Sphere",
        "rulesLevel": "Standard",
        "variant": "IS",
        "family": "laser",
        "damage": 3,
        "heat": 2,
        "tons": 0.5,
        "critSlots": 1,
        "spaceSlots": 1,
        "range": {
            "min": 0,
            "short": 2,
            "medium": 4,
            "long": 5
        },
        "techRating": "E",
        "flags": [
            "directFire"
        ],
        "source": {
            "weightSpacePage": 341,
            "battleValuePage": 317
        },
        "typeCodes": [
            "DE"
        ],
        "aerospace": {
            "attackValue": "3",
            "range": "Short",
            "toHitModifier": 0
        },
        "bv": 17
    },
    "is_er_medium_laser": {
        "id": "is_er_medium_laser",
        "name": "ER Medium Laser",
        "altNames": [
            "IS ER Medium Laser",
            "ISERMediumLaser",
            "ERMediumLaser"
        ],
        "category": "Energy",
        "techBase": "Inner Sphere",
        "rulesLevel": "Standard",
        "variant": "IS",
        "family": "laser",
        "damage": 5,
        "heat": 5,
        "tons": 1,
        "critSlots": 1,
        "spaceSlots": 1,
        "range": {
            "min": 0,
            "short": 4,
            "medium": 8,
            "long": 12
        },
        "techRating": "E",
        "flags": [
            "directFire"
        ],
        "source": {
            "weightSpacePage": 341,
            "battleValuePage": 317
        },
        "typeCodes": [
            "DE"
        ],
        "aerospace": {
            "attackValue": "5",
            "range": "Medium",
            "toHitModifier": 0
        },
        "bv": 62
    },
    "is_er_large_laser": {
        "id": "is_er_large_laser",
        "name": "ER Large Laser",
        "altNames": [
            "IS ER Large Laser",
            "ISERLargeLaser",
            "ERLargeLaser"
        ],
        "category": "Energy",
        "techBase": "Inner Sphere",
        "rulesLevel": "Standard",
        "variant": "IS",
        "family": "laser",
        "damage": 8,
        "heat": 12,
        "tons": 5,
        "critSlots": 2,
        "spaceSlots": 2,
        "range": {
            "min": 0,
            "short": 7,
            "medium": 14,
            "long": 19
        },
        "techRating": "E",
        "flags": [
            "directFire"
        ],
        "source": {
            "weightSpacePage": 341,
            "battleValuePage": 317
        },
        "typeCodes": [
            "DE"
        ],
        "aerospace": {
            "attackValue": "8",
            "range": "Long",
            "toHitModifier": 0
        },
        "bv": 163
    },
    "is_small_laser": {
        "id": "is_small_laser",
        "name": "Small Laser",
        "altNames": [
            "IS Small Laser",
            "ISSmallLaser",
            "SmallLaser"
        ],
        "category": "Energy",
        "techBase": "Inner Sphere",
        "rulesLevel": "Introductory",
        "variant": "IS",
        "family": "laser",
        "damage": 3,
        "heat": 1,
        "tons": 0.5,
        "critSlots": 1,
        "spaceSlots": 1,
        "range": {
            "min": 0,
            "short": 1,
            "medium": 2,
            "long": 3
        },
        "techRating": "C",
        "flags": [
            "directFire"
        ],
        "source": {
            "weightSpacePage": 341,
            "battleValuePage": 317
        },
        "typeCodes": [
            "DE"
        ],
        "aerospace": {
            "attackValue": "3",
            "range": "Short",
            "toHitModifier": 0
        },
        "cost": 11250,
        "bv": 9
    },
    "is_medium_laser": {
        "id": "is_medium_laser",
        "name": "Medium Laser",
        "altNames": [
            "IS Medium Laser",
            "ISMediumLaser",
            "MediumLaser"
        ],
        "category": "Energy",
        "techBase": "Inner Sphere",
        "rulesLevel": "Introductory",
        "variant": "IS",
        "family": "laser",
        "damage": 5,
        "heat": 3,
        "tons": 1,
        "critSlots": 1,
        "spaceSlots": 1,
        "range": {
            "min": 0,
            "short": 3,
            "medium": 6,
            "long": 9
        },
        "techRating": "C",
        "flags": [
            "directFire"
        ],
        "source": {
            "weightSpacePage": 341,
            "battleValuePage": 317
        },
        "typeCodes": [
            "DE"
        ],
        "aerospace": {
            "attackValue": "5",
            "range": "Short",
            "toHitModifier": 0
        },
        "cost": 40000,
        "bv": 46
    },
    "is_large_laser": {
        "id": "is_large_laser",
        "name": "Large Laser",
        "altNames": [
            "IS Large Laser",
            "ISLargeLaser",
            "LargeLaser"
        ],
        "category": "Energy",
        "techBase": "Inner Sphere",
        "rulesLevel": "Introductory",
        "variant": "IS",
        "family": "laser",
        "damage": 8,
        "heat": 8,
        "tons": 5,
        "critSlots": 2,
        "spaceSlots": 2,
        "range": {
            "min": 0,
            "short": 5,
            "medium": 10,
            "long": 15
        },
        "techRating": "C",
        "flags": [
            "directFire"
        ],
        "source": {
            "weightSpacePage": 341,
            "battleValuePage": 317
        },
        "typeCodes": [
            "DE"
        ],
        "aerospace": {
            "attackValue": "8",
            "range": "Medium",
            "toHitModifier": 0
        },
        "cost": 100000,
        "bv": 123
    },
    "is_small_pulse_laser": {
        "id": "is_small_pulse_laser",
        "name": "Small Pulse Laser",
        "altNames": [
            "IS Small Pulse Laser",
            "ISSmallPulseLaser",
            "SmallPulseLaser"
        ],
        "category": "Energy",
        "techBase": "Inner Sphere",
        "rulesLevel": "Standard",
        "variant": "IS",
        "family": "pulseLaser",
        "damage": 3,
        "heat": 2,
        "tons": 1,
        "critSlots": 1,
        "spaceSlots": 1,
        "range": {
            "min": 0,
            "short": 1,
            "medium": 2,
            "long": 3
        },
        "techRating": "E",
        "flags": [
            "directFire",
            "pulse"
        ],
        "source": {
            "weightSpacePage": 341,
            "battleValuePage": 317
        },
        "typeCodes": [
            "P",
            "AI"
        ],
        "aerospace": {
            "attackValue": "3",
            "range": "Short",
            "toHitModifier": -2
        },
        "bv": 12
    },
    "is_medium_pulse_laser": {
        "id": "is_medium_pulse_laser",
        "name": "Medium Pulse Laser",
        "altNames": [
            "IS Medium Pulse Laser",
            "ISMediumPulseLaser",
            "MediumPulseLaser"
        ],
        "category": "Energy",
        "techBase": "Inner Sphere",
        "rulesLevel": "Standard",
        "variant": "IS",
        "family": "pulseLaser",
        "damage": 6,
        "heat": 4,
        "tons": 2,
        "critSlots": 1,
        "spaceSlots": 1,
        "range": {
            "min": 0,
            "short": 2,
            "medium": 4,
            "long": 6
        },
        "techRating": "E",
        "flags": [
            "directFire",
            "pulse"
        ],
        "source": {
            "weightSpacePage": 341,
            "battleValuePage": 317
        },
        "typeCodes": [
            "P"
        ],
        "aerospace": {
            "attackValue": "6",
            "range": "Short",
            "toHitModifier": -2
        },
        "bv": 48
    },
    "is_large_pulse_laser": {
        "id": "is_large_pulse_laser",
        "name": "Large Pulse Laser",
        "altNames": [
            "IS Large Pulse Laser",
            "ISLargePulseLaser",
            "LargePulseLaser"
        ],
        "category": "Energy",
        "techBase": "Inner Sphere",
        "rulesLevel": "Standard",
        "variant": "IS",
        "family": "pulseLaser",
        "damage": 9,
        "heat": 10,
        "tons": 7,
        "critSlots": 2,
        "spaceSlots": 2,
        "range": {
            "min": 0,
            "short": 3,
            "medium": 7,
            "long": 10
        },
        "techRating": "E",
        "flags": [
            "directFire",
            "pulse"
        ],
        "source": {
            "weightSpacePage": 341,
            "battleValuePage": 317
        },
        "typeCodes": [
            "P"
        ],
        "aerospace": {
            "attackValue": "9",
            "range": "Medium",
            "toHitModifier": -2
        },
        "bv": 119
    },
    "is_plasma_rifle": {
        "id": "is_plasma_rifle",
        "name": "Plasma Rifle",
        "altNames": [
            "IS Plasma Rifle",
            "ISPlasmaRifle",
            "PlasmaRifle"
        ],
        "category": "Energy",
        "techBase": "Inner Sphere",
        "rulesLevel": "Standard",
        "variant": "IS",
        "family": "plasma",
        "damage": 10,
        "heat": 10,
        "tons": 6,
        "critSlots": 2,
        "spaceSlots": 2,
        "range": {
            "min": 0,
            "short": 5,
            "medium": 10,
            "long": 15
        },
        "techRating": "E",
        "flags": [
            "directFire",
            "requiresAmmo"
        ],
        "source": {
            "weightSpacePage": 341,
            "battleValuePage": 317
        },
        "typeCodes": [
            "DE",
            "H"
        ],
        "aerospace": {
            "attackValue": "10",
            "range": "Medium",
            "toHitModifier": 0
        },
        "ammo": {
            "ammoType": "is_plasma_rifle",
            "ammoPerTon": 10,
            "ammoCostPerTon": 10000,
            "ammoBV": 26
        },
        "bv": 210,
        "notes": [
            "Ammo BV marked \u00a7 in the BV table; ammunition is not counted as explosive."
        ]
    },
    "is_light_ppc": {
        "id": "is_light_ppc",
        "name": "Light PPC",
        "altNames": [
            "IS Light PPC",
            "ISLightPPC",
            "LightPPC"
        ],
        "category": "Energy",
        "techBase": "Inner Sphere",
        "rulesLevel": "Standard",
        "variant": "IS",
        "family": "ppc",
        "damage": 5,
        "heat": 5,
        "tons": 3,
        "critSlots": 2,
        "spaceSlots": 2,
        "range": {
            "min": 3,
            "short": 6,
            "medium": 12,
            "long": 18
        },
        "techRating": "E",
        "flags": [
            "directFire",
            "minimumRange"
        ],
        "source": {
            "weightSpacePage": 341,
            "battleValuePage": 317
        },
        "typeCodes": [
            "DE"
        ],
        "aerospace": {
            "attackValue": "5",
            "range": "Medium",
            "toHitModifier": 0
        },
        "bv": 88
    },
    "is_ppc": {
        "id": "is_ppc",
        "name": "PPC",
        "altNames": [
            "IS PPC",
            "ISPPC",
            "Particle Projector Cannon",
            "Particle Cannon"
        ],
        "category": "Energy",
        "techBase": "Inner Sphere",
        "rulesLevel": "Introductory",
        "variant": "IS",
        "family": "ppc",
        "damage": 10,
        "heat": 10,
        "tons": 7,
        "critSlots": 3,
        "spaceSlots": 3,
        "range": {
            "min": 3,
            "short": 6,
            "medium": 12,
            "long": 18
        },
        "techRating": "D",
        "flags": [
            "directFire",
            "minimumRange"
        ],
        "source": {
            "weightSpacePage": 341,
            "battleValuePage": 317
        },
        "typeCodes": [
            "DE"
        ],
        "aerospace": {
            "attackValue": "10",
            "range": "Medium",
            "toHitModifier": 0
        },
        "cost": 200000,
        "bv": 176
    },
    "is_heavy_ppc": {
        "id": "is_heavy_ppc",
        "name": "Heavy PPC",
        "altNames": [
            "IS Heavy PPC",
            "ISHeavyPPC",
            "HeavyPPC"
        ],
        "category": "Energy",
        "techBase": "Inner Sphere",
        "rulesLevel": "Standard",
        "variant": "IS",
        "family": "ppc",
        "damage": 15,
        "heat": 15,
        "tons": 10,
        "critSlots": 4,
        "spaceSlots": 4,
        "range": {
            "min": 3,
            "short": 6,
            "medium": 12,
            "long": 18
        },
        "techRating": "E",
        "flags": [
            "directFire"
        ],
        "source": {
            "weightSpacePage": 341,
            "battleValuePage": 317
        },
        "typeCodes": [
            "DE"
        ],
        "aerospace": {
            "attackValue": "15",
            "range": "Medium",
            "toHitModifier": 0
        },
        "bv": 317
    },
    "is_er_ppc": {
        "id": "is_er_ppc",
        "name": "ER PPC",
        "altNames": [
            "IS ER PPC",
            "ISERPPC",
            "ERPPC"
        ],
        "category": "Energy",
        "techBase": "Inner Sphere",
        "rulesLevel": "Standard",
        "variant": "IS",
        "family": "ppc",
        "damage": 10,
        "heat": 15,
        "tons": 7,
        "critSlots": 3,
        "spaceSlots": 3,
        "range": {
            "min": 0,
            "short": 7,
            "medium": 14,
            "long": 23
        },
        "techRating": "E",
        "flags": [
            "directFire"
        ],
        "source": {
            "weightSpacePage": 341,
            "battleValuePage": 317
        },
        "typeCodes": [
            "DE"
        ],
        "aerospace": {
            "attackValue": "10",
            "range": "Long",
            "toHitModifier": 0
        },
        "bv": 229
    },
    "is_snub_nose_ppc": {
        "id": "is_snub_nose_ppc",
        "name": "Snub-Nose PPC",
        "altNames": [
            "IS Snub-Nose PPC",
            "ISSnubNosePPC",
            "SnubNosePPC"
        ],
        "category": "Energy",
        "techBase": "Inner Sphere",
        "rulesLevel": "Standard",
        "variant": "IS",
        "family": "ppc",
        "damage": "10/8/5",
        "heat": 10,
        "tons": 6,
        "critSlots": 2,
        "spaceSlots": 2,
        "range": {
            "min": 0,
            "short": 9,
            "medium": 13,
            "long": 15
        },
        "techRating": "E",
        "flags": [
            "directFire"
        ],
        "source": {
            "weightSpacePage": 341,
            "battleValuePage": 317
        },
        "typeCodes": [
            "DE",
            "V"
        ],
        "aerospace": {
            "attackValue": "10/8",
            "range": "Medium",
            "toHitModifier": 0
        },
        "bv": 165
    },
    "is_lrm_5": {
        "id": "is_lrm_5",
        "name": "LRM 5",
        "altNames": [
            "IS LRM 5",
            "ISLRM5",
            "LRM-5",
            "LRM5"
        ],
        "category": "Missile",
        "techBase": "Inner Sphere",
        "rulesLevel": "Introductory",
        "variant": "IS",
        "family": "lrm",
        "damage": "1/Msl",
        "heat": 2,
        "tons": 2,
        "critSlots": 1,
        "spaceSlots": 1,
        "range": {
            "min": 6,
            "short": 7,
            "medium": 14,
            "long": 21
        },
        "techRating": "C",
        "flags": [
            "cluster",
            "requiresAmmo",
            "indirectFire",
            "minimumRange"
        ],
        "source": {
            "weightSpacePage": 341,
            "battleValuePage": 317
        },
        "typeCodes": [
            "M",
            "C",
            "S"
        ],
        "aerospace": {
            "attackValue": "3/4",
            "range": "Long",
            "toHitModifier": 0
        },
        "ammo": {
            "ammoType": "is_lrm",
            "ammoPerTon": 24,
            "ammoCostPerTon": 30000,
            "ammoBV": 6
        },
        "cost": 30000,
        "bv": 45,
        "oneShotBV": 9,
        "notes": [
            "BV after slash in the rules table is the single-shot/one-shot launcher BV."
        ]
    },
    "is_lrm_10": {
        "id": "is_lrm_10",
        "name": "LRM 10",
        "altNames": [
            "IS LRM 10",
            "ISLRM10",
            "LRM-10",
            "LRM10"
        ],
        "category": "Missile",
        "techBase": "Inner Sphere",
        "rulesLevel": "Introductory",
        "variant": "IS",
        "family": "lrm",
        "damage": "1/Msl",
        "heat": 4,
        "tons": 5,
        "critSlots": 2,
        "spaceSlots": 2,
        "range": {
            "min": 6,
            "short": 7,
            "medium": 14,
            "long": 21
        },
        "techRating": "C",
        "flags": [
            "cluster",
            "requiresAmmo",
            "indirectFire",
            "minimumRange"
        ],
        "source": {
            "weightSpacePage": 341,
            "battleValuePage": 317
        },
        "typeCodes": [
            "M",
            "C",
            "S"
        ],
        "aerospace": {
            "attackValue": "6/8",
            "range": "Long",
            "toHitModifier": 0
        },
        "ammo": {
            "ammoType": "is_lrm",
            "ammoPerTon": 12,
            "ammoCostPerTon": 30000,
            "ammoBV": 11
        },
        "cost": 100000,
        "bv": 90,
        "oneShotBV": 18,
        "notes": [
            "BV after slash in the rules table is the single-shot/one-shot launcher BV."
        ]
    },
    "is_lrm_15": {
        "id": "is_lrm_15",
        "name": "LRM 15",
        "altNames": [
            "IS LRM 15",
            "ISLRM15",
            "LRM-15",
            "LRM15"
        ],
        "category": "Missile",
        "techBase": "Inner Sphere",
        "rulesLevel": "Introductory",
        "variant": "IS",
        "family": "lrm",
        "damage": "1/Msl",
        "heat": 5,
        "tons": 7,
        "critSlots": 3,
        "spaceSlots": 3,
        "range": {
            "min": 6,
            "short": 7,
            "medium": 14,
            "long": 21
        },
        "techRating": "C",
        "flags": [
            "cluster",
            "requiresAmmo",
            "indirectFire",
            "minimumRange"
        ],
        "source": {
            "weightSpacePage": 341,
            "battleValuePage": 317
        },
        "typeCodes": [
            "M",
            "C",
            "S"
        ],
        "aerospace": {
            "attackValue": "9/12",
            "range": "Long",
            "toHitModifier": 0
        },
        "ammo": {
            "ammoType": "is_lrm",
            "ammoPerTon": 8,
            "ammoCostPerTon": 30000,
            "ammoBV": 17
        },
        "cost": 175000,
        "bv": 136,
        "oneShotBV": 27,
        "notes": [
            "BV after slash in the rules table is the single-shot/one-shot launcher BV."
        ]
    },
    "is_lrm_20": {
        "id": "is_lrm_20",
        "name": "LRM 20",
        "altNames": [
            "IS LRM 20",
            "ISLRM20",
            "LRM-20",
            "LRM20"
        ],
        "category": "Missile",
        "techBase": "Inner Sphere",
        "rulesLevel": "Introductory",
        "variant": "IS",
        "family": "lrm",
        "damage": "1/Msl",
        "heat": 6,
        "tons": 10,
        "critSlots": 5,
        "spaceSlots": 5,
        "range": {
            "min": 6,
            "short": 7,
            "medium": 14,
            "long": 21
        },
        "techRating": "C",
        "flags": [
            "cluster",
            "requiresAmmo",
            "indirectFire",
            "minimumRange"
        ],
        "source": {
            "weightSpacePage": 341,
            "battleValuePage": 317
        },
        "typeCodes": [
            "M",
            "C",
            "S"
        ],
        "aerospace": {
            "attackValue": "12/16",
            "range": "Long",
            "toHitModifier": 0
        },
        "ammo": {
            "ammoType": "is_lrm",
            "ammoPerTon": 6,
            "ammoCostPerTon": 30000,
            "ammoBV": 23
        },
        "cost": 250000,
        "bv": 181,
        "oneShotBV": 36,
        "notes": [
            "BV after slash in the rules table is the single-shot/one-shot launcher BV."
        ]
    },
    "is_mml_3_lrm": {
        "id": "is_mml_3_lrm",
        "name": "MML 3 (LRM)",
        "altNames": [
            "IS MML 3 (LRM)",
            "ISMML3(LRM)",
            "MML3(LRM)"
        ],
        "category": "Missile",
        "techBase": "Inner Sphere",
        "rulesLevel": "Standard",
        "variant": "IS",
        "family": "lrm",
        "damage": "1/Msl",
        "heat": 2,
        "tons": 1.5,
        "critSlots": 2,
        "spaceSlots": 2,
        "range": {
            "min": 6,
            "short": 7,
            "medium": 14,
            "long": 21
        },
        "techRating": "E",
        "flags": [
            "cluster",
            "requiresAmmo",
            "indirectFire",
            "minimumRange"
        ],
        "source": {
            "weightSpacePage": 341,
            "battleValuePage": 317
        },
        "typeCodes": [
            "M",
            "C",
            "S"
        ],
        "aerospace": {
            "attackValue": "2/2",
            "range": "Long",
            "toHitModifier": 0
        },
        "ammo": {
            "ammoType": "is_lrm",
            "ammoPerTon": 40,
            "ammoCostPerTon": 30000,
            "ammoBV": 4
        },
        "bv": 29
    },
    "is_mml_3_srm": {
        "id": "is_mml_3_srm",
        "name": "MML 3 (SRM)",
        "altNames": [
            "IS MML 3 (SRM)",
            "ISMML3(SRM)",
            "MML3(SRM)"
        ],
        "category": "Missile",
        "techBase": "Inner Sphere",
        "rulesLevel": "Standard",
        "variant": "IS",
        "family": "srm",
        "damage": "2/Msl",
        "heat": 2,
        "tons": 1.5,
        "critSlots": 2,
        "spaceSlots": 2,
        "range": {
            "min": 0,
            "short": 3,
            "medium": 6,
            "long": 9
        },
        "techRating": "E",
        "flags": [
            "cluster",
            "requiresAmmo"
        ],
        "source": {
            "weightSpacePage": 341,
            "battleValuePage": 317
        },
        "typeCodes": [
            "M",
            "C",
            "S"
        ],
        "aerospace": {
            "attackValue": "4/4",
            "range": "Short",
            "toHitModifier": 0
        },
        "ammo": {
            "ammoType": "is_mml_srm",
            "ammoPerTon": 33,
            "ammoCostPerTon": 27000,
            "ammoBV": 4
        },
        "bv": 29
    },
    "is_mml_5_lrm": {
        "id": "is_mml_5_lrm",
        "name": "MML 5 (LRM)",
        "altNames": [
            "IS MML 5 (LRM)",
            "ISMML5(LRM)",
            "MML5(LRM)"
        ],
        "category": "Missile",
        "techBase": "Inner Sphere",
        "rulesLevel": "Standard",
        "variant": "IS",
        "family": "lrm",
        "damage": "1/Msl",
        "heat": 3,
        "tons": 3,
        "critSlots": 3,
        "spaceSlots": 3,
        "range": {
            "min": 6,
            "short": 7,
            "medium": 14,
            "long": 21
        },
        "techRating": "E",
        "flags": [
            "cluster",
            "requiresAmmo",
            "indirectFire",
            "minimumRange"
        ],
        "source": {
            "weightSpacePage": 341,
            "battleValuePage": 317
        },
        "typeCodes": [
            "M",
            "C",
            "S"
        ],
        "aerospace": {
            "attackValue": "3/4",
            "range": "Long",
            "toHitModifier": 0
        },
        "ammo": {
            "ammoType": "is_lrm",
            "ammoPerTon": 24,
            "ammoCostPerTon": 30000,
            "ammoBV": 6
        },
        "bv": 45
    },
    "is_mml_5_srm": {
        "id": "is_mml_5_srm",
        "name": "MML 5 (SRM)",
        "altNames": [
            "IS MML 5 (SRM)",
            "ISMML5(SRM)",
            "MML5(SRM)"
        ],
        "category": "Missile",
        "techBase": "Inner Sphere",
        "rulesLevel": "Standard",
        "variant": "IS",
        "family": "srm",
        "damage": "2/Msl",
        "heat": 3,
        "tons": 3,
        "critSlots": 3,
        "spaceSlots": 3,
        "range": {
            "min": 0,
            "short": 3,
            "medium": 6,
            "long": 9
        },
        "techRating": "E",
        "flags": [
            "cluster",
            "requiresAmmo"
        ],
        "source": {
            "weightSpacePage": 341,
            "battleValuePage": 317
        },
        "typeCodes": [
            "M",
            "C",
            "S"
        ],
        "aerospace": {
            "attackValue": "6/8",
            "range": "Short",
            "toHitModifier": 0
        },
        "ammo": {
            "ammoType": "is_mml_srm",
            "ammoPerTon": 20,
            "ammoCostPerTon": 27000,
            "ammoBV": 6
        },
        "bv": 45
    },
    "is_mml_7_lrm": {
        "id": "is_mml_7_lrm",
        "name": "MML 7 (LRM)",
        "altNames": [
            "IS MML 7 (LRM)",
            "ISMML7(LRM)",
            "MML7(LRM)"
        ],
        "category": "Missile",
        "techBase": "Inner Sphere",
        "rulesLevel": "Standard",
        "variant": "IS",
        "family": "lrm",
        "damage": "1/Msl",
        "heat": 4,
        "tons": 4.5,
        "critSlots": 4,
        "spaceSlots": 4,
        "range": {
            "min": 6,
            "short": 7,
            "medium": 14,
            "long": 21
        },
        "techRating": "E",
        "flags": [
            "cluster",
            "requiresAmmo",
            "indirectFire",
            "minimumRange"
        ],
        "source": {
            "weightSpacePage": 341,
            "battleValuePage": 317
        },
        "typeCodes": [
            "M",
            "C",
            "S"
        ],
        "aerospace": {
            "attackValue": "4/6",
            "range": "Long",
            "toHitModifier": 0
        },
        "ammo": {
            "ammoType": "is_lrm",
            "ammoPerTon": 17,
            "ammoCostPerTon": 30000,
            "ammoBV": 8
        },
        "bv": 67
    },
    "is_mml_7_srm": {
        "id": "is_mml_7_srm",
        "name": "MML 7 (SRM)",
        "altNames": [
            "IS MML 7 (SRM)",
            "ISMML7(SRM)",
            "MML7(SRM)"
        ],
        "category": "Missile",
        "techBase": "Inner Sphere",
        "rulesLevel": "Standard",
        "variant": "IS",
        "family": "srm",
        "damage": "2/Msl",
        "heat": 4,
        "tons": 4.5,
        "critSlots": 4,
        "spaceSlots": 4,
        "range": {
            "min": 0,
            "short": 3,
            "medium": 6,
            "long": 9
        },
        "techRating": "E",
        "flags": [
            "cluster",
            "requiresAmmo"
        ],
        "source": {
            "weightSpacePage": 341,
            "battleValuePage": 317
        },
        "typeCodes": [
            "M",
            "C",
            "S"
        ],
        "aerospace": {
            "attackValue": "8/12",
            "range": "Short",
            "toHitModifier": 0
        },
        "ammo": {
            "ammoType": "is_mml_srm",
            "ammoPerTon": 14,
            "ammoCostPerTon": 27000,
            "ammoBV": 8
        },
        "bv": 67
    },
    "is_mml_9_lrm": {
        "id": "is_mml_9_lrm",
        "name": "MML 9 (LRM)",
        "altNames": [
            "IS MML 9 (LRM)",
            "ISMML9(LRM)",
            "MML9(LRM)"
        ],
        "category": "Missile",
        "techBase": "Inner Sphere",
        "rulesLevel": "Standard",
        "variant": "IS",
        "family": "lrm",
        "damage": "1/Msl",
        "heat": 5,
        "tons": 6,
        "critSlots": 5,
        "spaceSlots": 5,
        "range": {
            "min": 6,
            "short": 7,
            "medium": 14,
            "long": 21
        },
        "techRating": "E",
        "flags": [
            "cluster",
            "requiresAmmo",
            "indirectFire",
            "minimumRange"
        ],
        "source": {
            "weightSpacePage": 341,
            "battleValuePage": 317
        },
        "typeCodes": [
            "M",
            "C",
            "S"
        ],
        "aerospace": {
            "attackValue": "5/7",
            "range": "Long",
            "toHitModifier": 0
        },
        "ammo": {
            "ammoType": "is_lrm",
            "ammoPerTon": 13,
            "ammoCostPerTon": 30000,
            "ammoBV": 11
        },
        "bv": 86
    },
    "is_mml_9_srm": {
        "id": "is_mml_9_srm",
        "name": "MML 9 (SRM)",
        "altNames": [
            "IS MML 9 (SRM)",
            "ISMML9(SRM)",
            "MML9(SRM)"
        ],
        "category": "Missile",
        "techBase": "Inner Sphere",
        "rulesLevel": "Standard",
        "variant": "IS",
        "family": "srm",
        "damage": "2/Msl",
        "heat": 5,
        "tons": 6,
        "critSlots": 5,
        "spaceSlots": 5,
        "range": {
            "min": 0,
            "short": 3,
            "medium": 6,
            "long": 9
        },
        "techRating": "E",
        "flags": [
            "cluster",
            "requiresAmmo"
        ],
        "source": {
            "weightSpacePage": 341,
            "battleValuePage": 317
        },
        "typeCodes": [
            "M",
            "C",
            "S"
        ],
        "aerospace": {
            "attackValue": "10/14",
            "range": "Short",
            "toHitModifier": 0
        },
        "ammo": {
            "ammoType": "is_mml_srm",
            "ammoPerTon": 11,
            "ammoCostPerTon": 27000,
            "ammoBV": 11
        },
        "bv": 86
    },
    "is_srm_2": {
        "id": "is_srm_2",
        "name": "SRM 2",
        "altNames": [
            "IS SRM 2",
            "ISSRM2",
            "SRM-2",
            "SRM2"
        ],
        "category": "Missile",
        "techBase": "Inner Sphere",
        "rulesLevel": "Introductory",
        "variant": "IS",
        "family": "srm",
        "damage": "2/Msl",
        "heat": 2,
        "tons": 1,
        "critSlots": 1,
        "spaceSlots": 1,
        "range": {
            "min": 0,
            "short": 3,
            "medium": 6,
            "long": 9
        },
        "techRating": "C",
        "flags": [
            "cluster",
            "requiresAmmo"
        ],
        "source": {
            "weightSpacePage": 341,
            "battleValuePage": 317
        },
        "typeCodes": [
            "M",
            "C",
            "S"
        ],
        "aerospace": {
            "attackValue": "2/4",
            "range": "Short",
            "toHitModifier": 0
        },
        "ammo": {
            "ammoType": "is_srm",
            "ammoPerTon": 50,
            "ammoCostPerTon": 27000,
            "ammoBV": 3
        },
        "cost": 10000,
        "bv": 21,
        "oneShotBV": 4,
        "notes": [
            "BV after slash in the rules table is the single-shot/one-shot launcher BV."
        ]
    },
    "is_srm_4": {
        "id": "is_srm_4",
        "name": "SRM 4",
        "altNames": [
            "IS SRM 4",
            "ISSRM4",
            "SRM-4",
            "SRM4"
        ],
        "category": "Missile",
        "techBase": "Inner Sphere",
        "rulesLevel": "Introductory",
        "variant": "IS",
        "family": "srm",
        "damage": "2/Msl",
        "heat": 3,
        "tons": 2,
        "critSlots": 1,
        "spaceSlots": 1,
        "range": {
            "min": 0,
            "short": 3,
            "medium": 6,
            "long": 9
        },
        "techRating": "C",
        "flags": [
            "cluster",
            "requiresAmmo"
        ],
        "source": {
            "weightSpacePage": 341,
            "battleValuePage": 317
        },
        "typeCodes": [
            "M",
            "C",
            "S"
        ],
        "aerospace": {
            "attackValue": "4/6",
            "range": "Short",
            "toHitModifier": 0
        },
        "ammo": {
            "ammoType": "is_srm",
            "ammoPerTon": 25,
            "ammoCostPerTon": 27000,
            "ammoBV": 5
        },
        "cost": 60000,
        "bv": 39,
        "oneShotBV": 8,
        "notes": [
            "BV after slash in the rules table is the single-shot/one-shot launcher BV."
        ]
    },
    "is_srm_6": {
        "id": "is_srm_6",
        "name": "SRM 6",
        "altNames": [
            "IS SRM 6",
            "ISSRM6",
            "SRM-6",
            "SRM6"
        ],
        "category": "Missile",
        "techBase": "Inner Sphere",
        "rulesLevel": "Introductory",
        "variant": "IS",
        "family": "srm",
        "damage": "2/Msl",
        "heat": 4,
        "tons": 3,
        "critSlots": 2,
        "spaceSlots": 2,
        "range": {
            "min": 0,
            "short": 3,
            "medium": 6,
            "long": 9
        },
        "techRating": "C",
        "flags": [
            "cluster",
            "requiresAmmo"
        ],
        "source": {
            "weightSpacePage": 341,
            "battleValuePage": 317
        },
        "typeCodes": [
            "M",
            "C",
            "S"
        ],
        "aerospace": {
            "attackValue": "8/10",
            "range": "Short",
            "toHitModifier": 0
        },
        "ammo": {
            "ammoType": "is_srm",
            "ammoPerTon": 15,
            "ammoCostPerTon": 27000,
            "ammoBV": 7
        },
        "cost": 80000,
        "bv": 59,
        "oneShotBV": 12,
        "notes": [
            "BV after slash in the rules table is the single-shot/one-shot launcher BV."
        ]
    },
    "is_mrm_10": {
        "id": "is_mrm_10",
        "name": "MRM 10",
        "altNames": [
            "IS MRM 10",
            "ISMRM10",
            "MRM-10",
            "MRM10"
        ],
        "category": "Missile",
        "techBase": "Inner Sphere",
        "rulesLevel": "Standard",
        "variant": "IS",
        "family": "mrm",
        "damage": "1/Msl",
        "heat": 4,
        "tons": 3,
        "critSlots": 2,
        "spaceSlots": 2,
        "range": {
            "min": 0,
            "short": 3,
            "medium": 8,
            "long": 15
        },
        "techRating": "C",
        "flags": [
            "cluster",
            "requiresAmmo"
        ],
        "source": {
            "weightSpacePage": 341,
            "battleValuePage": 317
        },
        "typeCodes": [
            "M",
            "C"
        ],
        "aerospace": {
            "attackValue": "6",
            "range": "Medium",
            "toHitModifier": 1
        },
        "ammo": {
            "ammoType": "is_mrm",
            "ammoPerTon": 24,
            "ammoCostPerTon": 5000,
            "ammoBV": 7
        },
        "bv": 56,
        "oneShotBV": 11,
        "notes": [
            "BV after slash in the rules table is the single-shot/one-shot launcher BV."
        ]
    },
    "is_mrm_20": {
        "id": "is_mrm_20",
        "name": "MRM 20",
        "altNames": [
            "IS MRM 20",
            "ISMRM20",
            "MRM-20",
            "MRM20"
        ],
        "category": "Missile",
        "techBase": "Inner Sphere",
        "rulesLevel": "Standard",
        "variant": "IS",
        "family": "mrm",
        "damage": "1/Msl",
        "heat": 6,
        "tons": 7,
        "critSlots": 3,
        "spaceSlots": 3,
        "range": {
            "min": 0,
            "short": 3,
            "medium": 8,
            "long": 15
        },
        "techRating": "C",
        "flags": [
            "cluster",
            "requiresAmmo"
        ],
        "source": {
            "weightSpacePage": 341,
            "battleValuePage": 317
        },
        "typeCodes": [
            "M",
            "C"
        ],
        "aerospace": {
            "attackValue": "12",
            "range": "Medium",
            "toHitModifier": 1
        },
        "ammo": {
            "ammoType": "is_mrm",
            "ammoPerTon": 12,
            "ammoCostPerTon": 5000,
            "ammoBV": 14
        },
        "bv": 112,
        "oneShotBV": 22,
        "notes": [
            "BV after slash in the rules table is the single-shot/one-shot launcher BV."
        ]
    },
    "is_mrm_30": {
        "id": "is_mrm_30",
        "name": "MRM 30",
        "altNames": [
            "IS MRM 30",
            "ISMRM30",
            "MRM-30",
            "MRM30"
        ],
        "category": "Missile",
        "techBase": "Inner Sphere",
        "rulesLevel": "Standard",
        "variant": "IS",
        "family": "mrm",
        "damage": "1/Msl",
        "heat": 10,
        "tons": 10,
        "critSlots": 5,
        "spaceSlots": 5,
        "range": {
            "min": 0,
            "short": 3,
            "medium": 8,
            "long": 15
        },
        "techRating": "C",
        "flags": [
            "cluster",
            "requiresAmmo"
        ],
        "source": {
            "weightSpacePage": 341,
            "battleValuePage": 317
        },
        "typeCodes": [
            "M",
            "C"
        ],
        "aerospace": {
            "attackValue": "18",
            "range": "Medium",
            "toHitModifier": 1
        },
        "ammo": {
            "ammoType": "is_mrm",
            "ammoPerTon": 8,
            "ammoCostPerTon": 5000,
            "ammoBV": 21
        },
        "bv": 168,
        "oneShotBV": 34,
        "notes": [
            "BV after slash in the rules table is the single-shot/one-shot launcher BV."
        ]
    },
    "is_mrm_40": {
        "id": "is_mrm_40",
        "name": "MRM 40",
        "altNames": [
            "IS MRM 40",
            "ISMRM40",
            "MRM-40",
            "MRM40"
        ],
        "category": "Missile",
        "techBase": "Inner Sphere",
        "rulesLevel": "Standard",
        "variant": "IS",
        "family": "mrm",
        "damage": "1/Msl",
        "heat": 12,
        "tons": 12,
        "critSlots": 7,
        "spaceSlots": 7,
        "range": {
            "min": 0,
            "short": 3,
            "medium": 8,
            "long": 15
        },
        "techRating": "C",
        "flags": [
            "cluster",
            "requiresAmmo"
        ],
        "source": {
            "weightSpacePage": 341,
            "battleValuePage": 317
        },
        "typeCodes": [
            "M",
            "C"
        ],
        "aerospace": {
            "attackValue": "24",
            "range": "Medium",
            "toHitModifier": 1
        },
        "ammo": {
            "ammoType": "is_mrm",
            "ammoPerTon": 6,
            "ammoCostPerTon": 5000,
            "ammoBV": 28
        },
        "bv": 224,
        "oneShotBV": 45,
        "notes": [
            "BV after slash in the rules table is the single-shot/one-shot launcher BV."
        ]
    },
    "is_rocket_launcher_10": {
        "id": "is_rocket_launcher_10",
        "name": "Rocket Launcher 10",
        "altNames": [
            "IS Rocket Launcher 10",
            "ISRocketLauncher10",
            "RocketLauncher10"
        ],
        "category": "Missile",
        "techBase": "Inner Sphere",
        "rulesLevel": "Standard",
        "variant": "IS",
        "family": "rocketLauncher",
        "damage": "1/Msl",
        "heat": 3,
        "tons": 0.5,
        "critSlots": 1,
        "spaceSlots": 1,
        "range": {
            "min": 0,
            "short": 5,
            "medium": 11,
            "long": 18
        },
        "techRating": "B",
        "flags": [
            "cluster",
            "requiresAmmo",
            "oneShot"
        ],
        "source": {
            "weightSpacePage": 341,
            "battleValuePage": 317
        },
        "typeCodes": [
            "M",
            "C",
            "OS"
        ],
        "aerospace": {
            "attackValue": "6",
            "range": "Medium",
            "toHitModifier": 1
        },
        "ammo": {
            "ammoType": "is_rocket_launcher",
            "ammoPerTon": "OS",
            "ammoCostPerTon": 1000
        },
        "bv": 18
    },
    "is_rocket_launcher_15": {
        "id": "is_rocket_launcher_15",
        "name": "Rocket Launcher 15",
        "altNames": [
            "IS Rocket Launcher 15",
            "ISRocketLauncher15",
            "RocketLauncher15"
        ],
        "category": "Missile",
        "techBase": "Inner Sphere",
        "rulesLevel": "Standard",
        "variant": "IS",
        "family": "rocketLauncher",
        "damage": "1/Msl",
        "heat": 4,
        "tons": 1,
        "critSlots": 2,
        "spaceSlots": 2,
        "range": {
            "min": 0,
            "short": 4,
            "medium": 9,
            "long": 15
        },
        "techRating": "B",
        "flags": [
            "cluster",
            "requiresAmmo",
            "oneShot"
        ],
        "source": {
            "weightSpacePage": 341,
            "battleValuePage": 317
        },
        "typeCodes": [
            "M",
            "C",
            "OS"
        ],
        "aerospace": {
            "attackValue": "9",
            "range": "Medium",
            "toHitModifier": 1
        },
        "ammo": {
            "ammoType": "is_rocket_launcher",
            "ammoPerTon": "OS",
            "ammoCostPerTon": 1000
        },
        "bv": 23
    },
    "is_rocket_launcher_20": {
        "id": "is_rocket_launcher_20",
        "name": "Rocket Launcher 20",
        "altNames": [
            "IS Rocket Launcher 20",
            "ISRocketLauncher20",
            "RocketLauncher20"
        ],
        "category": "Missile",
        "techBase": "Inner Sphere",
        "rulesLevel": "Standard",
        "variant": "IS",
        "family": "rocketLauncher",
        "damage": "1/Msl",
        "heat": 5,
        "tons": 1.5,
        "critSlots": 3,
        "spaceSlots": 3,
        "range": {
            "min": 0,
            "short": 3,
            "medium": 7,
            "long": 12
        },
        "techRating": "B",
        "flags": [
            "cluster",
            "requiresAmmo",
            "oneShot"
        ],
        "source": {
            "weightSpacePage": 341,
            "battleValuePage": 317
        },
        "typeCodes": [
            "M",
            "C",
            "OS"
        ],
        "aerospace": {
            "attackValue": "12",
            "range": "Medium",
            "toHitModifier": 1
        },
        "ammo": {
            "ammoType": "is_rocket_launcher",
            "ammoPerTon": "OS",
            "ammoCostPerTon": 1000
        },
        "bv": 24
    },
    "is_streak_srm_2": {
        "id": "is_streak_srm_2",
        "name": "Streak SRM 2",
        "altNames": [
            "IS Streak SRM 2",
            "ISStreakSRM2",
            "Streak SRM-2",
            "StreakSRM2"
        ],
        "category": "Missile",
        "techBase": "Inner Sphere",
        "rulesLevel": "Standard",
        "variant": "IS",
        "family": "streakSrm",
        "damage": "2/Msl",
        "heat": 2,
        "tons": 1.5,
        "critSlots": 1,
        "spaceSlots": 1,
        "range": {
            "min": 0,
            "short": 3,
            "medium": 6,
            "long": 9
        },
        "techRating": "E",
        "flags": [
            "cluster",
            "requiresAmmo",
            "streak"
        ],
        "source": {
            "weightSpacePage": 341,
            "battleValuePage": 317
        },
        "typeCodes": [
            "M",
            "C"
        ],
        "aerospace": {
            "attackValue": "4",
            "range": "Short",
            "toHitModifier": 0
        },
        "ammo": {
            "ammoType": "is_streak_srm",
            "ammoPerTon": 50,
            "ammoCostPerTon": 54000,
            "ammoBV": 4
        },
        "bv": 30,
        "oneShotBV": 6,
        "notes": [
            "BV after slash in the rules table is the single-shot/one-shot launcher BV."
        ]
    },
    "is_streak_srm_4": {
        "id": "is_streak_srm_4",
        "name": "Streak SRM 4",
        "altNames": [
            "IS Streak SRM 4",
            "ISStreakSRM4",
            "Streak SRM-4",
            "StreakSRM4"
        ],
        "category": "Missile",
        "techBase": "Inner Sphere",
        "rulesLevel": "Standard",
        "variant": "IS",
        "family": "streakSrm",
        "damage": "2/Msl",
        "heat": 3,
        "tons": 3,
        "critSlots": 1,
        "spaceSlots": 1,
        "range": {
            "min": 0,
            "short": 3,
            "medium": 6,
            "long": 9
        },
        "techRating": "E",
        "flags": [
            "cluster",
            "requiresAmmo",
            "streak"
        ],
        "source": {
            "weightSpacePage": 341,
            "battleValuePage": 317
        },
        "typeCodes": [
            "M",
            "C"
        ],
        "aerospace": {
            "attackValue": "8",
            "range": "Short",
            "toHitModifier": 0
        },
        "ammo": {
            "ammoType": "is_streak_srm",
            "ammoPerTon": 25,
            "ammoCostPerTon": 54000,
            "ammoBV": 7
        },
        "bv": 59,
        "oneShotBV": 12,
        "notes": [
            "BV after slash in the rules table is the single-shot/one-shot launcher BV."
        ]
    },
    "is_streak_srm_6": {
        "id": "is_streak_srm_6",
        "name": "Streak SRM 6",
        "altNames": [
            "IS Streak SRM 6",
            "ISStreakSRM6",
            "Streak SRM-6",
            "StreakSRM6"
        ],
        "category": "Missile",
        "techBase": "Inner Sphere",
        "rulesLevel": "Standard",
        "variant": "IS",
        "family": "streakSrm",
        "damage": "2/Msl",
        "heat": 4,
        "tons": 4.5,
        "critSlots": 2,
        "spaceSlots": 2,
        "range": {
            "min": 0,
            "short": 3,
            "medium": 6,
            "long": 9
        },
        "techRating": "E",
        "flags": [
            "cluster",
            "requiresAmmo",
            "streak"
        ],
        "source": {
            "weightSpacePage": 341,
            "battleValuePage": 317
        },
        "typeCodes": [
            "M",
            "C"
        ],
        "aerospace": {
            "attackValue": "12",
            "range": "Short",
            "toHitModifier": 0
        },
        "ammo": {
            "ammoType": "is_streak_srm",
            "ammoPerTon": 15,
            "ammoCostPerTon": 54000,
            "ammoBV": 11
        },
        "bv": 89,
        "oneShotBV": 18,
        "notes": [
            "BV after slash in the rules table is the single-shot/one-shot launcher BV."
        ]
    },
    "is_narc_missile_beacon": {
        "id": "is_narc_missile_beacon",
        "name": "Narc Missile Beacon",
        "altNames": [
            "IS Narc Missile Beacon",
            "ISNarcMissileBeacon",
            "NarcMissileBeacon"
        ],
        "category": "Equipment",
        "techBase": "Inner Sphere",
        "rulesLevel": "Standard",
        "variant": "IS",
        "family": "narc_missile_beacon",
        "damage": "special",
        "heat": 0,
        "tons": 3,
        "critSlots": 2,
        "spaceSlots": 2,
        "range": {
            "min": 0,
            "short": 3,
            "medium": 6,
            "long": 9
        },
        "techRating": "E",
        "flags": [
            "narc",
            "requiresAmmo"
        ],
        "source": {
            "weightSpacePage": 342,
            "battleValuePage": 317
        },
        "ammo": {
            "ammoType": "is_narc_missile_beacon_ammo",
            "ammoPerTon": 6,
            "ammoBV": 0
        },
        "bv": 30,
        "oneShotBV": 6,
        "notes": [
            "BV after slash in the rules table is the single-shot/one-shot launcher BV."
        ]
    },
    "is_improved_narc_launcher": {
        "id": "is_improved_narc_launcher",
        "name": "Improved Narc Launcher",
        "altNames": [
            "IS Improved Narc Launcher",
            "ISImprovedNarcLauncher",
            "ImprovedNarcLauncher"
        ],
        "category": "Missile",
        "techBase": "Inner Sphere",
        "rulesLevel": "Standard",
        "variant": "IS",
        "family": "narc",
        "damage": "special",
        "heat": 0,
        "tons": 5,
        "critSlots": 3,
        "spaceSlots": 3,
        "range": {
            "min": 0,
            "short": 4,
            "medium": 9,
            "long": 15
        },
        "techRating": "E",
        "flags": [
            "cluster",
            "requiresAmmo"
        ],
        "source": {
            "weightSpacePage": 341,
            "battleValuePage": 317
        },
        "typeCodes": [
            "M",
            "E",
            "S"
        ],
        "aerospace": {
            "attackValue": "special",
            "range": "special",
            "toHitModifier": 0
        },
        "ammo": {
            "ammoType": "is_narc",
            "ammoPerTon": 4,
            "ammoCostPerTon": 6000,
            "ammoBV": 0
        },
        "bv": 75,
        "oneShotBV": 15,
        "notes": [
            "BV after slash in the rules table is the single-shot/one-shot launcher BV."
        ]
    },
    "clan_lb_2_x_ac": {
        "id": "clan_lb_2_x_ac",
        "name": "LB 2-X AC",
        "altNames": [
            "Clan LB 2-X AC",
            "CL LB 2-X AC",
            "CLLB2XAC",
            "LB2XAC"
        ],
        "category": "Ballistic",
        "techBase": "Clan",
        "rulesLevel": "Standard",
        "variant": "Clan",
        "family": "lbXAutocannon",
        "damage": 2,
        "heat": 1,
        "tons": 5,
        "critSlots": 3,
        "spaceSlots": 3,
        "range": {
            "min": 4,
            "short": 10,
            "medium": 20,
            "long": 30
        },
        "techRating": "F",
        "flags": [
            "directFire",
            "requiresAmmo",
            "clusterAmmo",
            "flak",
            "switchableAmmo"
        ],
        "source": {
            "weightSpacePage": 343,
            "battleValuePage": 318
        },
        "typeCodes": [
            "DB",
            "C",
            "S",
            "F"
        ],
        "aerospace": {
            "attackValue": "2",
            "range": "Extreme",
            "toHitModifier": "0/-1"
        },
        "ammo": {
            "ammoType": "clan_lb_x_ac",
            "ammoPerTon": 45,
            "ammoCostPerTon": 2000,
            "ammoBV": 6
        },
        "bv": 47
    },
    "clan_lb_5_x_ac": {
        "id": "clan_lb_5_x_ac",
        "name": "LB 5-X AC",
        "altNames": [
            "Clan LB 5-X AC",
            "CL LB 5-X AC",
            "CLLB5XAC",
            "LB5XAC"
        ],
        "category": "Ballistic",
        "techBase": "Clan",
        "rulesLevel": "Standard",
        "variant": "Clan",
        "family": "lbXAutocannon",
        "damage": 5,
        "heat": 1,
        "tons": 7,
        "critSlots": 4,
        "spaceSlots": 4,
        "range": {
            "min": 3,
            "short": 8,
            "medium": 15,
            "long": 24
        },
        "techRating": "F",
        "flags": [
            "directFire",
            "requiresAmmo",
            "clusterAmmo",
            "flak",
            "switchableAmmo"
        ],
        "source": {
            "weightSpacePage": 343,
            "battleValuePage": 318
        },
        "typeCodes": [
            "DB",
            "C",
            "S",
            "F"
        ],
        "aerospace": {
            "attackValue": "3",
            "range": "Long",
            "toHitModifier": "0/-1"
        },
        "ammo": {
            "ammoType": "clan_lb_x_ac",
            "ammoPerTon": 20,
            "ammoCostPerTon": 2000,
            "ammoBV": 12
        },
        "bv": 93
    },
    "clan_lb_10_x_ac": {
        "id": "clan_lb_10_x_ac",
        "name": "LB 10-X AC",
        "altNames": [
            "Clan LB 10-X AC",
            "CL LB 10-X AC",
            "CLLB10XAC",
            "LB10XAC"
        ],
        "category": "Ballistic",
        "techBase": "Clan",
        "rulesLevel": "Standard",
        "variant": "Clan",
        "family": "lbXAutocannon",
        "damage": 10,
        "heat": 2,
        "tons": 10,
        "critSlots": 5,
        "spaceSlots": 5,
        "range": {
            "min": 0,
            "short": 6,
            "medium": 12,
            "long": 18
        },
        "techRating": "F",
        "flags": [
            "directFire",
            "requiresAmmo",
            "clusterAmmo",
            "flak",
            "switchableAmmo"
        ],
        "source": {
            "weightSpacePage": 343,
            "battleValuePage": 318
        },
        "typeCodes": [
            "DB",
            "C",
            "S",
            "F"
        ],
        "aerospace": {
            "attackValue": "6",
            "range": "Medium",
            "toHitModifier": "0/-1"
        },
        "ammo": {
            "ammoType": "clan_lb_x_ac",
            "ammoPerTon": 10,
            "ammoCostPerTon": 2000,
            "ammoBV": 19
        },
        "bv": 148
    },
    "clan_lb_20_x_ac": {
        "id": "clan_lb_20_x_ac",
        "name": "LB 20-X AC",
        "altNames": [
            "Clan LB 20-X AC",
            "CL LB 20-X AC",
            "CLLB20XAC",
            "LB20XAC"
        ],
        "category": "Ballistic",
        "techBase": "Clan",
        "rulesLevel": "Standard",
        "variant": "Clan",
        "family": "lbXAutocannon",
        "damage": 20,
        "heat": 6,
        "tons": 12,
        "critSlots": 9,
        "spaceSlots": 9,
        "range": {
            "min": 0,
            "short": 4,
            "medium": 8,
            "long": 12
        },
        "techRating": "F",
        "flags": [
            "directFire",
            "requiresAmmo",
            "clusterAmmo",
            "flak",
            "switchableAmmo"
        ],
        "source": {
            "weightSpacePage": 343,
            "battleValuePage": 318
        },
        "typeCodes": [
            "DB",
            "C",
            "S",
            "F"
        ],
        "aerospace": {
            "attackValue": "12",
            "range": "Medium",
            "toHitModifier": "0/-1"
        },
        "ammo": {
            "ammoType": "clan_lb_x_ac",
            "ammoPerTon": 5,
            "ammoCostPerTon": 2000,
            "ammoBV": 30
        },
        "bv": 237
    },
    "clan_ultra_ac_2": {
        "id": "clan_ultra_ac_2",
        "name": "Ultra AC/2",
        "altNames": [
            "Clan Ultra AC/2",
            "CL Ultra AC/2",
            "CLUltraAC2",
            "UltraAC/2"
        ],
        "category": "Ballistic",
        "techBase": "Clan",
        "rulesLevel": "Standard",
        "variant": "Clan",
        "family": "ultraAutocannon",
        "damage": "2/Shot",
        "heat": 1,
        "tons": 5,
        "critSlots": 2,
        "spaceSlots": 2,
        "range": {
            "min": 2,
            "short": 9,
            "medium": 18,
            "long": 27
        },
        "techRating": "F",
        "flags": [
            "directFire",
            "requiresAmmo",
            "rapidFire"
        ],
        "source": {
            "weightSpacePage": 343,
            "battleValuePage": 318
        },
        "typeCodes": [
            "DB",
            "R",
            "C"
        ],
        "aerospace": {
            "attackValue": "3",
            "range": "Extreme",
            "toHitModifier": 0
        },
        "ammo": {
            "ammoType": "clan_ultra_ac",
            "ammoPerTon": 45,
            "ammoCostPerTon": 1000,
            "ammoBV": 8
        },
        "bv": 62
    },
    "clan_ultra_ac_5": {
        "id": "clan_ultra_ac_5",
        "name": "Ultra AC/5",
        "altNames": [
            "Clan Ultra AC/5",
            "CL Ultra AC/5",
            "CLUltraAC5",
            "UltraAC/5"
        ],
        "category": "Ballistic",
        "techBase": "Clan",
        "rulesLevel": "Standard",
        "variant": "Clan",
        "family": "ultraAutocannon",
        "damage": "5/Shot",
        "heat": 1,
        "tons": 7,
        "critSlots": 3,
        "spaceSlots": 3,
        "range": {
            "min": 0,
            "short": 7,
            "medium": 14,
            "long": 21
        },
        "techRating": "F",
        "flags": [
            "directFire",
            "requiresAmmo",
            "rapidFire"
        ],
        "source": {
            "weightSpacePage": 343,
            "battleValuePage": 318
        },
        "typeCodes": [
            "DB",
            "R",
            "C"
        ],
        "aerospace": {
            "attackValue": "7",
            "range": "Long",
            "toHitModifier": 0
        },
        "ammo": {
            "ammoType": "clan_ultra_ac",
            "ammoPerTon": 20,
            "ammoCostPerTon": 1000,
            "ammoBV": 15
        },
        "bv": 122
    },
    "clan_ultra_ac_10": {
        "id": "clan_ultra_ac_10",
        "name": "Ultra AC/10",
        "altNames": [
            "Clan Ultra AC/10",
            "CL Ultra AC/10",
            "CLUltraAC10",
            "UltraAC/10"
        ],
        "category": "Ballistic",
        "techBase": "Clan",
        "rulesLevel": "Standard",
        "variant": "Clan",
        "family": "ultraAutocannon",
        "damage": "10/Shot",
        "heat": 3,
        "tons": 10,
        "critSlots": 4,
        "spaceSlots": 4,
        "range": {
            "min": 0,
            "short": 6,
            "medium": 12,
            "long": 18
        },
        "techRating": "F",
        "flags": [
            "directFire",
            "requiresAmmo",
            "rapidFire"
        ],
        "source": {
            "weightSpacePage": 343,
            "battleValuePage": 318
        },
        "typeCodes": [
            "DB",
            "R",
            "C"
        ],
        "aerospace": {
            "attackValue": "15",
            "range": "Medium",
            "toHitModifier": 0
        },
        "ammo": {
            "ammoType": "clan_ultra_ac",
            "ammoPerTon": 10,
            "ammoCostPerTon": 1000,
            "ammoBV": 26
        },
        "bv": 210
    },
    "clan_ultra_ac_20": {
        "id": "clan_ultra_ac_20",
        "name": "Ultra AC/20",
        "altNames": [
            "Clan Ultra AC/20",
            "CL Ultra AC/20",
            "CLUltraAC20",
            "UltraAC/20"
        ],
        "category": "Ballistic",
        "techBase": "Clan",
        "rulesLevel": "Standard",
        "variant": "Clan",
        "family": "ultraAutocannon",
        "damage": "20/Shot",
        "heat": 7,
        "tons": 12,
        "critSlots": 8,
        "spaceSlots": 8,
        "range": {
            "min": 0,
            "short": 4,
            "medium": 8,
            "long": 12
        },
        "techRating": "F",
        "flags": [
            "directFire",
            "requiresAmmo",
            "rapidFire"
        ],
        "source": {
            "weightSpacePage": 343,
            "battleValuePage": 318
        },
        "typeCodes": [
            "DB",
            "R",
            "C"
        ],
        "aerospace": {
            "attackValue": "30",
            "range": "Medium",
            "toHitModifier": 0
        },
        "ammo": {
            "ammoType": "clan_ultra_ac",
            "ammoPerTon": 5,
            "ammoCostPerTon": 1000,
            "ammoBV": 42
        },
        "bv": 335
    },
    "clan_ap_gauss_rifle": {
        "id": "clan_ap_gauss_rifle",
        "name": "AP Gauss Rifle",
        "altNames": [
            "Clan AP Gauss Rifle",
            "CL AP Gauss Rifle",
            "CLAPGaussRifle",
            "APGaussRifle"
        ],
        "category": "Ballistic",
        "techBase": "Clan",
        "rulesLevel": "Standard",
        "variant": "Clan",
        "family": "gauss",
        "damage": 3,
        "heat": 1,
        "tons": 0.5,
        "critSlots": 1,
        "spaceSlots": 1,
        "range": {
            "min": 0,
            "short": 3,
            "medium": 6,
            "long": 9
        },
        "techRating": "F",
        "flags": [
            "directFire",
            "antiInfantry",
            "requiresAmmo"
        ],
        "source": {
            "weightSpacePage": 343,
            "battleValuePage": 318
        },
        "typeCodes": [
            "DB",
            "X",
            "AI"
        ],
        "aerospace": {
            "attackValue": "3",
            "range": "Short",
            "toHitModifier": 0
        },
        "ammo": {
            "ammoType": "clan_ap_gauss",
            "ammoPerTon": 40,
            "ammoCostPerTon": 3000,
            "ammoBV": 3
        },
        "bv": 21,
        "notes": [
            "Ammo BV marked \u00a7 in the BV table; ammunition is not counted as explosive."
        ]
    },
    "clan_gauss_rifle": {
        "id": "clan_gauss_rifle",
        "name": "Gauss Rifle",
        "altNames": [
            "Clan Gauss Rifle",
            "CL Gauss Rifle",
            "CLGaussRifle",
            "GaussRifle"
        ],
        "category": "Ballistic",
        "techBase": "Clan",
        "rulesLevel": "Standard",
        "variant": "Clan",
        "family": "gauss",
        "damage": 15,
        "heat": 1,
        "tons": 12,
        "critSlots": 6,
        "spaceSlots": 6,
        "range": {
            "min": 2,
            "short": 7,
            "medium": 15,
            "long": 22
        },
        "techRating": "F",
        "flags": [
            "directFire",
            "requiresAmmo"
        ],
        "source": {
            "weightSpacePage": 343,
            "battleValuePage": 318
        },
        "typeCodes": [
            "DB",
            "X"
        ],
        "aerospace": {
            "attackValue": "15",
            "range": "Long",
            "toHitModifier": 0
        },
        "ammo": {
            "ammoType": "clan_gauss",
            "ammoPerTon": 8,
            "ammoCostPerTon": 20000,
            "ammoBV": 40
        },
        "bv": 320,
        "notes": [
            "Ammo BV marked \u00a7 in the BV table; ammunition is not counted as explosive."
        ]
    },
    "clan_hyper_assault_gauss_20": {
        "id": "clan_hyper_assault_gauss_20",
        "name": "Hyper-Assault Gauss 20",
        "altNames": [
            "Clan Hyper-Assault Gauss 20",
            "CL Hyper-Assault Gauss 20",
            "CLHyperAssaultGauss20",
            "HyperAssaultGauss20"
        ],
        "category": "Ballistic",
        "techBase": "Clan",
        "rulesLevel": "Standard",
        "variant": "Clan",
        "family": "hag",
        "damage": "C5/20",
        "heat": 4,
        "tons": 10,
        "critSlots": 6,
        "spaceSlots": 6,
        "range": {
            "min": 2,
            "short": 8,
            "medium": 16,
            "long": 24
        },
        "techRating": "F",
        "flags": [
            "directFire",
            "requiresAmmo"
        ],
        "source": {
            "weightSpacePage": 343,
            "battleValuePage": 318
        },
        "typeCodes": [
            "DB",
            "X",
            "C",
            "F"
        ],
        "aerospace": {
            "attackValue": "16/12/12",
            "range": "Long",
            "toHitModifier": 0
        },
        "ammo": {
            "ammoType": "clan_hag",
            "ammoPerTon": 6,
            "ammoCostPerTon": 30000,
            "ammoBV": 33
        },
        "bv": 267,
        "notes": [
            "Ammo BV marked \u00a7 in the BV table; ammunition is not counted as explosive."
        ]
    },
    "clan_hyper_assault_gauss_30": {
        "id": "clan_hyper_assault_gauss_30",
        "name": "Hyper-Assault Gauss 30",
        "altNames": [
            "Clan Hyper-Assault Gauss 30",
            "CL Hyper-Assault Gauss 30",
            "CLHyperAssaultGauss30",
            "HyperAssaultGauss30"
        ],
        "category": "Ballistic",
        "techBase": "Clan",
        "rulesLevel": "Standard",
        "variant": "Clan",
        "family": "hag",
        "damage": "C5/30",
        "heat": 6,
        "tons": 13,
        "critSlots": 8,
        "spaceSlots": 8,
        "range": {
            "min": 2,
            "short": 8,
            "medium": 16,
            "long": 24
        },
        "techRating": "F",
        "flags": [
            "directFire",
            "requiresAmmo"
        ],
        "source": {
            "weightSpacePage": 343,
            "battleValuePage": 318
        },
        "typeCodes": [
            "DB",
            "X",
            "C",
            "F"
        ],
        "aerospace": {
            "attackValue": "24/18/18",
            "range": "Long",
            "toHitModifier": 0
        },
        "ammo": {
            "ammoType": "clan_hag",
            "ammoPerTon": 4,
            "ammoCostPerTon": 30000,
            "ammoBV": 50
        },
        "bv": 401,
        "notes": [
            "Ammo BV marked \u00a7 in the BV table; ammunition is not counted as explosive."
        ]
    },
    "clan_hyper_assault_gauss_40": {
        "id": "clan_hyper_assault_gauss_40",
        "name": "Hyper-Assault Gauss 40",
        "altNames": [
            "Clan Hyper-Assault Gauss 40",
            "CL Hyper-Assault Gauss 40",
            "CLHyperAssaultGauss40",
            "HyperAssaultGauss40"
        ],
        "category": "Ballistic",
        "techBase": "Clan",
        "rulesLevel": "Standard",
        "variant": "Clan",
        "family": "hag",
        "damage": "C5/40",
        "heat": 8,
        "tons": 16,
        "critSlots": 10,
        "spaceSlots": 10,
        "range": {
            "min": 2,
            "short": 8,
            "medium": 16,
            "long": 24
        },
        "techRating": "F",
        "flags": [
            "directFire",
            "requiresAmmo"
        ],
        "source": {
            "weightSpacePage": 343,
            "battleValuePage": 318
        },
        "typeCodes": [
            "DB",
            "X",
            "C",
            "F"
        ],
        "aerospace": {
            "attackValue": "32/24/24",
            "range": "Long",
            "toHitModifier": 0
        },
        "ammo": {
            "ammoType": "clan_hag",
            "ammoPerTon": 3,
            "ammoCostPerTon": 30000,
            "ammoBV": 67
        },
        "bv": 535,
        "notes": [
            "Ammo BV marked \u00a7 in the BV table; ammunition is not counted as explosive."
        ]
    },
    "clan_light_machine_gun": {
        "id": "clan_light_machine_gun",
        "name": "Light Machine Gun",
        "altNames": [
            "Clan Light Machine Gun",
            "CL Light Machine Gun",
            "CLLightMachineGun",
            "LightMachineGun"
        ],
        "category": "Ballistic",
        "techBase": "Clan",
        "rulesLevel": "Standard",
        "variant": "Clan",
        "family": "machineGun",
        "damage": 1,
        "heat": 0,
        "tons": 0.25,
        "critSlots": 1,
        "spaceSlots": 1,
        "range": {
            "min": 0,
            "short": 2,
            "medium": 4,
            "long": 6
        },
        "techRating": "F",
        "flags": [
            "directFire",
            "antiInfantry",
            "requiresAmmo"
        ],
        "source": {
            "weightSpacePage": 343,
            "battleValuePage": 318
        },
        "typeCodes": [
            "DB",
            "AI"
        ],
        "aerospace": {
            "attackValue": "1",
            "range": "Short",
            "toHitModifier": 0
        },
        "ammo": {
            "ammoType": "clan_machine_gun",
            "ammoPerTon": 200,
            "ammoCostPerTon": 1000,
            "ammoBV": 1
        },
        "bv": 5
    },
    "clan_machine_gun": {
        "id": "clan_machine_gun",
        "name": "Machine Gun",
        "altNames": [
            "Clan Machine Gun",
            "CL Machine Gun",
            "CLMachineGun",
            "MachineGun"
        ],
        "category": "Ballistic",
        "techBase": "Clan",
        "rulesLevel": "Standard",
        "variant": "Clan",
        "family": "machineGun",
        "damage": 2,
        "heat": 0,
        "tons": 0.25,
        "critSlots": 1,
        "spaceSlots": 1,
        "range": {
            "min": 0,
            "short": 1,
            "medium": 2,
            "long": 3
        },
        "techRating": "C",
        "flags": [
            "directFire",
            "antiInfantry",
            "requiresAmmo"
        ],
        "source": {
            "weightSpacePage": 343,
            "battleValuePage": 318
        },
        "typeCodes": [
            "DB",
            "AI"
        ],
        "aerospace": {
            "attackValue": "2",
            "range": "Short",
            "toHitModifier": 0
        },
        "ammo": {
            "ammoType": "clan_machine_gun",
            "ammoPerTon": 200,
            "ammoCostPerTon": 1000,
            "ammoBV": 1
        },
        "bv": 5
    },
    "clan_heavy_machine_gun": {
        "id": "clan_heavy_machine_gun",
        "name": "Heavy Machine Gun",
        "altNames": [
            "Clan Heavy Machine Gun",
            "CL Heavy Machine Gun",
            "CLHeavyMachineGun",
            "HeavyMachineGun"
        ],
        "category": "Ballistic",
        "techBase": "Clan",
        "rulesLevel": "Standard",
        "variant": "Clan",
        "family": "machineGun",
        "damage": 3,
        "heat": 0,
        "tons": 0.5,
        "critSlots": 1,
        "spaceSlots": 1,
        "range": {
            "min": 0,
            "short": 1,
            "medium": 2
        },
        "techRating": "C",
        "flags": [
            "directFire",
            "antiInfantry",
            "requiresAmmo"
        ],
        "source": {
            "weightSpacePage": 343,
            "battleValuePage": 318
        },
        "typeCodes": [
            "DB",
            "AI"
        ],
        "aerospace": {
            "attackValue": "3",
            "range": "Short",
            "toHitModifier": 0
        },
        "ammo": {
            "ammoType": "clan_machine_gun",
            "ammoPerTon": 100,
            "ammoCostPerTon": 1000,
            "ammoBV": 1
        },
        "bv": 6
    },
    "clan_flamer": {
        "id": "clan_flamer",
        "name": "Flamer",
        "altNames": [
            "Clan Flamer",
            "CL Flamer",
            "CLFlamer"
        ],
        "category": "Energy",
        "techBase": "Clan",
        "rulesLevel": "Standard",
        "variant": "Clan",
        "family": "flamer",
        "damage": 2,
        "heat": 3,
        "tons": 0.5,
        "critSlots": 1,
        "spaceSlots": 1,
        "range": {
            "min": 0,
            "short": 1,
            "medium": 2,
            "long": 3
        },
        "techRating": "C",
        "flags": [
            "directFire",
            "antiInfantry"
        ],
        "source": {
            "weightSpacePage": 343,
            "battleValuePage": 318
        },
        "typeCodes": [
            "DE",
            "H",
            "AI"
        ],
        "aerospace": {
            "attackValue": "2",
            "range": "Short",
            "toHitModifier": 0
        },
        "bv": 6
    },
    "clan_flamer_vehicle": {
        "id": "clan_flamer_vehicle",
        "name": "Flamer (Vehicle)",
        "altNames": [
            "Clan Flamer (Vehicle)",
            "CL Flamer (Vehicle)",
            "CLFlamer(Vehicle)",
            "Flamer(Vehicle)"
        ],
        "category": "Energy",
        "techBase": "Clan",
        "rulesLevel": "Standard",
        "variant": "Clan",
        "family": "flamer",
        "damage": 2,
        "heat": 3,
        "tons": 0.5,
        "critSlots": 1,
        "spaceSlots": 1,
        "range": {
            "min": 0,
            "short": 1,
            "medium": 2,
            "long": 3
        },
        "techRating": "B",
        "flags": [
            "directFire",
            "antiInfantry",
            "requiresAmmo"
        ],
        "source": {
            "weightSpacePage": 343,
            "battleValuePage": 318
        },
        "typeCodes": [
            "DE",
            "H",
            "AI"
        ],
        "aerospace": {
            "attackValue": "2",
            "range": "Short",
            "toHitModifier": 0
        },
        "ammo": {
            "ammoType": "clan_vehicle_flamer",
            "ammoPerTon": 20,
            "ammoCostPerTon": 1000,
            "ammoBV": 1
        },
        "bv": 5
    },
    "clan_er_micro_laser": {
        "id": "clan_er_micro_laser",
        "name": "ER Micro Laser",
        "altNames": [
            "Clan ER Micro Laser",
            "CL ER Micro Laser",
            "CLERMicroLaser",
            "ERMicroLaser"
        ],
        "category": "Energy",
        "techBase": "Clan",
        "rulesLevel": "Standard",
        "variant": "Clan",
        "family": "laser",
        "damage": 2,
        "heat": 1,
        "tons": 0.25,
        "critSlots": 1,
        "spaceSlots": 1,
        "range": {
            "min": 0,
            "short": 1,
            "medium": 2,
            "long": 4
        },
        "techRating": "F",
        "flags": [
            "directFire"
        ],
        "source": {
            "weightSpacePage": 343,
            "battleValuePage": 318
        },
        "typeCodes": [
            "DE"
        ],
        "aerospace": {
            "attackValue": "2",
            "range": "Short",
            "toHitModifier": 0
        },
        "bv": 7
    },
    "clan_er_small_laser": {
        "id": "clan_er_small_laser",
        "name": "ER Small Laser",
        "altNames": [
            "Clan ER Small Laser",
            "CL ER Small Laser",
            "CLERSmallLaser",
            "ERSmallLaser"
        ],
        "category": "Energy",
        "techBase": "Clan",
        "rulesLevel": "Standard",
        "variant": "Clan",
        "family": "laser",
        "damage": 5,
        "heat": 2,
        "tons": 0.5,
        "critSlots": 1,
        "spaceSlots": 1,
        "range": {
            "min": 0,
            "short": 2,
            "medium": 4,
            "long": 6
        },
        "techRating": "F",
        "flags": [
            "directFire"
        ],
        "source": {
            "weightSpacePage": 343,
            "battleValuePage": 318
        },
        "typeCodes": [
            "DE"
        ],
        "aerospace": {
            "attackValue": "5",
            "range": "Short",
            "toHitModifier": 0
        },
        "bv": 31
    },
    "clan_er_medium_laser": {
        "id": "clan_er_medium_laser",
        "name": "ER Medium Laser",
        "altNames": [
            "Clan ER Medium Laser",
            "CL ER Medium Laser",
            "CLERMediumLaser",
            "ERMediumLaser"
        ],
        "category": "Energy",
        "techBase": "Clan",
        "rulesLevel": "Standard",
        "variant": "Clan",
        "family": "laser",
        "damage": 7,
        "heat": 5,
        "tons": 1,
        "critSlots": 1,
        "spaceSlots": 1,
        "range": {
            "min": 0,
            "short": 5,
            "medium": 10,
            "long": 15
        },
        "techRating": "F",
        "flags": [
            "directFire"
        ],
        "source": {
            "weightSpacePage": 343,
            "battleValuePage": 318
        },
        "typeCodes": [
            "DE"
        ],
        "aerospace": {
            "attackValue": "7",
            "range": "Medium",
            "toHitModifier": 0
        },
        "bv": 108
    },
    "clan_er_large_laser": {
        "id": "clan_er_large_laser",
        "name": "ER Large Laser",
        "altNames": [
            "Clan ER Large Laser",
            "CL ER Large Laser",
            "CLERLargeLaser",
            "ERLargeLaser"
        ],
        "category": "Energy",
        "techBase": "Clan",
        "rulesLevel": "Standard",
        "variant": "Clan",
        "family": "laser",
        "damage": 10,
        "heat": 12,
        "tons": 4,
        "critSlots": 1,
        "spaceSlots": 1,
        "range": {
            "min": 0,
            "short": 8,
            "medium": 15,
            "long": 25
        },
        "techRating": "F",
        "flags": [
            "directFire"
        ],
        "source": {
            "weightSpacePage": 343,
            "battleValuePage": 318
        },
        "typeCodes": [
            "DE"
        ],
        "aerospace": {
            "attackValue": "10",
            "range": "Extreme",
            "toHitModifier": 0
        },
        "bv": 248
    },
    "clan_micro_pulse_laser": {
        "id": "clan_micro_pulse_laser",
        "name": "Micro Pulse Laser",
        "altNames": [
            "Clan Micro Pulse Laser",
            "CL Micro Pulse Laser",
            "CLMicroPulseLaser",
            "MicroPulseLaser"
        ],
        "category": "Energy",
        "techBase": "Clan",
        "rulesLevel": "Standard",
        "variant": "Clan",
        "family": "pulseLaser",
        "damage": 3,
        "heat": 1,
        "tons": 0.5,
        "critSlots": 1,
        "spaceSlots": 1,
        "range": {
            "min": 0,
            "short": 1,
            "medium": 2,
            "long": 3
        },
        "techRating": "F",
        "flags": [
            "directFire",
            "pulse"
        ],
        "source": {
            "weightSpacePage": 343,
            "battleValuePage": 318
        },
        "typeCodes": [
            "P",
            "AI"
        ],
        "aerospace": {
            "attackValue": "3",
            "range": "Short",
            "toHitModifier": -2
        },
        "bv": 12
    },
    "clan_small_pulse_laser": {
        "id": "clan_small_pulse_laser",
        "name": "Small Pulse Laser",
        "altNames": [
            "Clan Small Pulse Laser",
            "CL Small Pulse Laser",
            "CLSmallPulseLaser",
            "SmallPulseLaser"
        ],
        "category": "Energy",
        "techBase": "Clan",
        "rulesLevel": "Standard",
        "variant": "Clan",
        "family": "pulseLaser",
        "damage": 3,
        "heat": 2,
        "tons": 1,
        "critSlots": 1,
        "spaceSlots": 1,
        "range": {
            "min": 0,
            "short": 2,
            "medium": 4,
            "long": 6
        },
        "techRating": "F",
        "flags": [
            "directFire",
            "pulse"
        ],
        "source": {
            "weightSpacePage": 343,
            "battleValuePage": 318
        },
        "typeCodes": [
            "P",
            "AI"
        ],
        "aerospace": {
            "attackValue": "3",
            "range": "Short",
            "toHitModifier": -2
        },
        "bv": 24
    },
    "clan_medium_pulse_laser": {
        "id": "clan_medium_pulse_laser",
        "name": "Medium Pulse Laser",
        "altNames": [
            "Clan Medium Pulse Laser",
            "CL Medium Pulse Laser",
            "CLMediumPulseLaser",
            "MediumPulseLaser"
        ],
        "category": "Energy",
        "techBase": "Clan",
        "rulesLevel": "Standard",
        "variant": "Clan",
        "family": "pulseLaser",
        "damage": 7,
        "heat": 4,
        "tons": 2,
        "critSlots": 1,
        "spaceSlots": 1,
        "range": {
            "min": 0,
            "short": 4,
            "medium": 8,
            "long": 12
        },
        "techRating": "F",
        "flags": [
            "directFire",
            "pulse"
        ],
        "source": {
            "weightSpacePage": 343,
            "battleValuePage": 318
        },
        "typeCodes": [
            "P"
        ],
        "aerospace": {
            "attackValue": "7",
            "range": "Medium",
            "toHitModifier": -2
        },
        "bv": 111
    },
    "clan_large_pulse_laser": {
        "id": "clan_large_pulse_laser",
        "name": "Large Pulse Laser",
        "altNames": [
            "Clan Large Pulse Laser",
            "CL Large Pulse Laser",
            "CLLargePulseLaser",
            "LargePulseLaser"
        ],
        "category": "Energy",
        "techBase": "Clan",
        "rulesLevel": "Standard",
        "variant": "Clan",
        "family": "pulseLaser",
        "damage": 10,
        "heat": 10,
        "tons": 6,
        "critSlots": 2,
        "spaceSlots": 2,
        "range": {
            "min": 0,
            "short": 6,
            "medium": 14,
            "long": 20
        },
        "techRating": "F",
        "flags": [
            "directFire",
            "pulse"
        ],
        "source": {
            "weightSpacePage": 343,
            "battleValuePage": 318
        },
        "typeCodes": [
            "P"
        ],
        "aerospace": {
            "attackValue": "10",
            "range": "Long",
            "toHitModifier": -2
        },
        "bv": 265
    },
    "clan_heavy_small_laser": {
        "id": "clan_heavy_small_laser",
        "name": "Heavy Small Laser",
        "altNames": [
            "Clan Heavy Small Laser",
            "CL Heavy Small Laser",
            "CLHeavySmallLaser",
            "HeavySmallLaser"
        ],
        "category": "Energy",
        "techBase": "Clan",
        "rulesLevel": "Standard",
        "variant": "Clan",
        "family": "laser",
        "damage": 6,
        "heat": 3,
        "tons": 0.5,
        "critSlots": 1,
        "spaceSlots": 1,
        "range": {
            "min": 0,
            "short": 1,
            "medium": 2,
            "long": 3
        },
        "techRating": "F",
        "flags": [
            "directFire"
        ],
        "source": {
            "weightSpacePage": 343,
            "battleValuePage": 318
        },
        "typeCodes": [
            "DE"
        ],
        "aerospace": {
            "attackValue": "6",
            "range": "Short",
            "toHitModifier": 1
        },
        "bv": 15
    },
    "clan_heavy_medium_laser": {
        "id": "clan_heavy_medium_laser",
        "name": "Heavy Medium Laser",
        "altNames": [
            "Clan Heavy Medium Laser",
            "CL Heavy Medium Laser",
            "CLHeavyMediumLaser",
            "HeavyMediumLaser"
        ],
        "category": "Energy",
        "techBase": "Clan",
        "rulesLevel": "Standard",
        "variant": "Clan",
        "family": "laser",
        "damage": 10,
        "heat": 7,
        "tons": 1,
        "critSlots": 2,
        "spaceSlots": 2,
        "range": {
            "min": 0,
            "short": 3,
            "medium": 6,
            "long": 9
        },
        "techRating": "F",
        "flags": [
            "directFire"
        ],
        "source": {
            "weightSpacePage": 343,
            "battleValuePage": 318
        },
        "typeCodes": [
            "DE"
        ],
        "aerospace": {
            "attackValue": "10",
            "range": "Short",
            "toHitModifier": 1
        },
        "bv": 76
    },
    "clan_heavy_large_laser": {
        "id": "clan_heavy_large_laser",
        "name": "Heavy Large Laser",
        "altNames": [
            "Clan Heavy Large Laser",
            "CL Heavy Large Laser",
            "CLHeavyLargeLaser",
            "HeavyLargeLaser"
        ],
        "category": "Energy",
        "techBase": "Clan",
        "rulesLevel": "Standard",
        "variant": "Clan",
        "family": "laser",
        "damage": 16,
        "heat": 18,
        "tons": 4,
        "critSlots": 3,
        "spaceSlots": 3,
        "range": {
            "min": 0,
            "short": 5,
            "medium": 10,
            "long": 15
        },
        "techRating": "F",
        "flags": [
            "directFire"
        ],
        "source": {
            "weightSpacePage": 343,
            "battleValuePage": 318
        },
        "typeCodes": [
            "DE"
        ],
        "aerospace": {
            "attackValue": "16",
            "range": "Medium",
            "toHitModifier": 1
        },
        "bv": 244
    },
    "clan_plasma_cannon": {
        "id": "clan_plasma_cannon",
        "name": "Plasma Cannon",
        "altNames": [
            "Clan Plasma Cannon",
            "CL Plasma Cannon",
            "CLPlasmaCannon",
            "PlasmaCannon"
        ],
        "category": "Energy",
        "techBase": "Clan",
        "rulesLevel": "Standard",
        "variant": "Clan",
        "family": "plasma",
        "damage": "special",
        "heat": 7,
        "tons": 3,
        "critSlots": 1,
        "spaceSlots": 1,
        "range": {
            "min": 0,
            "short": 6,
            "medium": 12,
            "long": 18
        },
        "techRating": "F",
        "flags": [
            "directFire",
            "requiresAmmo"
        ],
        "source": {
            "weightSpacePage": 343,
            "battleValuePage": 318
        },
        "typeCodes": [
            "DE",
            "H"
        ],
        "aerospace": {
            "attackValue": "special",
            "range": "Medium",
            "toHitModifier": 0
        },
        "ammo": {
            "ammoType": "clan_plasma_cannon",
            "ammoPerTon": 10,
            "ammoCostPerTon": 12000,
            "ammoBV": 21
        },
        "bv": 170,
        "notes": [
            "Ammo BV marked \u00a7 in the BV table; ammunition is not counted as explosive."
        ]
    },
    "clan_er_ppc": {
        "id": "clan_er_ppc",
        "name": "ER PPC",
        "altNames": [
            "Clan ER PPC",
            "CL ER PPC",
            "CLERPPC",
            "ERPPC"
        ],
        "category": "Energy",
        "techBase": "Clan",
        "rulesLevel": "Standard",
        "variant": "Clan",
        "family": "ppc",
        "damage": 15,
        "heat": 15,
        "tons": 6,
        "critSlots": 2,
        "spaceSlots": 2,
        "range": {
            "min": 0,
            "short": 7,
            "medium": 14,
            "long": 23
        },
        "techRating": "F",
        "flags": [
            "directFire"
        ],
        "source": {
            "weightSpacePage": 343,
            "battleValuePage": 318
        },
        "typeCodes": [
            "DE"
        ],
        "aerospace": {
            "attackValue": "15",
            "range": "Long",
            "toHitModifier": 0
        },
        "bv": 412
    },
    "clan_atm_3": {
        "id": "clan_atm_3",
        "name": "ATM 3",
        "altNames": [
            "Clan ATM 3",
            "CL ATM 3",
            "CLATM3",
            "ATM-3",
            "ATM3"
        ],
        "category": "Missile",
        "techBase": "Clan",
        "rulesLevel": "Standard",
        "variant": "Clan",
        "family": "atm",
        "damage": "2/Msl",
        "heat": 2,
        "tons": 1.5,
        "critSlots": 2,
        "spaceSlots": 2,
        "range": {
            "min": 4,
            "short": 5,
            "medium": 10,
            "long": 15
        },
        "techRating": "F",
        "flags": [
            "cluster",
            "requiresAmmo"
        ],
        "source": {
            "weightSpacePage": 343,
            "battleValuePage": 318
        },
        "typeCodes": [
            "M",
            "C",
            "S"
        ],
        "aerospace": {
            "attackValue": "4",
            "range": "Medium",
            "toHitModifier": 0
        },
        "ammo": {
            "ammoType": "clan_atm",
            "ammoPerTon": 20,
            "ammoCostPerTon": 75000,
            "ammoBV": 14
        },
        "bv": 53
    },
    "clan_atm_6": {
        "id": "clan_atm_6",
        "name": "ATM 6",
        "altNames": [
            "Clan ATM 6",
            "CL ATM 6",
            "CLATM6",
            "ATM-6",
            "ATM6"
        ],
        "category": "Missile",
        "techBase": "Clan",
        "rulesLevel": "Standard",
        "variant": "Clan",
        "family": "atm",
        "damage": "2/Msl",
        "heat": 4,
        "tons": 3.5,
        "critSlots": 3,
        "spaceSlots": 3,
        "range": {
            "min": 4,
            "short": 5,
            "medium": 10,
            "long": 15
        },
        "techRating": "F",
        "flags": [
            "cluster",
            "requiresAmmo"
        ],
        "source": {
            "weightSpacePage": 343,
            "battleValuePage": 318
        },
        "typeCodes": [
            "M",
            "C",
            "S"
        ],
        "aerospace": {
            "attackValue": "10",
            "range": "Medium",
            "toHitModifier": 0
        },
        "ammo": {
            "ammoType": "clan_atm",
            "ammoPerTon": 10,
            "ammoCostPerTon": 75000,
            "ammoBV": 26
        },
        "bv": 105
    },
    "clan_atm_9": {
        "id": "clan_atm_9",
        "name": "ATM 9",
        "altNames": [
            "Clan ATM 9",
            "CL ATM 9",
            "CLATM9",
            "ATM-9",
            "ATM9"
        ],
        "category": "Missile",
        "techBase": "Clan",
        "rulesLevel": "Standard",
        "variant": "Clan",
        "family": "atm",
        "damage": "2/Msl",
        "heat": 6,
        "tons": 5,
        "critSlots": 4,
        "spaceSlots": 4,
        "range": {
            "min": 4,
            "short": 5,
            "medium": 10,
            "long": 15
        },
        "techRating": "F",
        "flags": [
            "cluster",
            "requiresAmmo"
        ],
        "source": {
            "weightSpacePage": 343,
            "battleValuePage": 318
        },
        "typeCodes": [
            "M",
            "C",
            "S"
        ],
        "aerospace": {
            "attackValue": "14",
            "range": "Medium",
            "toHitModifier": 0
        },
        "ammo": {
            "ammoType": "clan_atm",
            "ammoPerTon": 7,
            "ammoCostPerTon": 75000,
            "ammoBV": 36
        },
        "bv": 147
    },
    "clan_atm_12": {
        "id": "clan_atm_12",
        "name": "ATM 12",
        "altNames": [
            "Clan ATM 12",
            "CL ATM 12",
            "CLATM12",
            "ATM-12",
            "ATM12"
        ],
        "category": "Missile",
        "techBase": "Clan",
        "rulesLevel": "Standard",
        "variant": "Clan",
        "family": "atm",
        "damage": "2/Msl",
        "heat": 8,
        "tons": 7,
        "critSlots": 5,
        "spaceSlots": 5,
        "range": {
            "min": 4,
            "short": 5,
            "medium": 10,
            "long": 15
        },
        "techRating": "F",
        "flags": [
            "cluster",
            "requiresAmmo"
        ],
        "source": {
            "weightSpacePage": 343,
            "battleValuePage": 318
        },
        "typeCodes": [
            "M",
            "C",
            "S"
        ],
        "aerospace": {
            "attackValue": "20",
            "range": "Medium",
            "toHitModifier": 0
        },
        "ammo": {
            "ammoType": "clan_atm",
            "ammoPerTon": 5,
            "ammoCostPerTon": 75000,
            "ammoBV": 52
        },
        "bv": 212
    },
    "clan_lrm_5": {
        "id": "clan_lrm_5",
        "name": "LRM 5",
        "altNames": [
            "Clan LRM 5",
            "CL LRM 5",
            "CLLRM5",
            "LRM-5",
            "LRM5"
        ],
        "category": "Missile",
        "techBase": "Clan",
        "rulesLevel": "Standard",
        "variant": "Clan",
        "family": "lrm",
        "damage": "1/Msl",
        "heat": 2,
        "tons": 1,
        "critSlots": 1,
        "spaceSlots": 1,
        "range": {
            "min": 0,
            "short": 7,
            "medium": 14,
            "long": 21
        },
        "techRating": "F",
        "flags": [
            "cluster",
            "requiresAmmo",
            "indirectFire",
            "minimumRange"
        ],
        "source": {
            "weightSpacePage": 343,
            "battleValuePage": 318
        },
        "typeCodes": [
            "M",
            "C",
            "S"
        ],
        "aerospace": {
            "attackValue": "3/4",
            "range": "Long",
            "toHitModifier": 0
        },
        "ammo": {
            "ammoType": "clan_lrm",
            "ammoPerTon": 24,
            "ammoCostPerTon": 30000,
            "ammoBV": 7
        },
        "bv": 55,
        "oneShotBV": 11,
        "notes": [
            "BV after slash in the rules table is the single-shot/one-shot launcher BV."
        ]
    },
    "clan_lrm_10": {
        "id": "clan_lrm_10",
        "name": "LRM 10",
        "altNames": [
            "Clan LRM 10",
            "CL LRM 10",
            "CLLRM10",
            "LRM-10",
            "LRM10"
        ],
        "category": "Missile",
        "techBase": "Clan",
        "rulesLevel": "Standard",
        "variant": "Clan",
        "family": "lrm",
        "damage": "1/Msl",
        "heat": 4,
        "tons": 2.5,
        "critSlots": 1,
        "spaceSlots": 1,
        "range": {
            "min": 0,
            "short": 7,
            "medium": 14,
            "long": 21
        },
        "techRating": "F",
        "flags": [
            "cluster",
            "requiresAmmo",
            "indirectFire",
            "minimumRange"
        ],
        "source": {
            "weightSpacePage": 343,
            "battleValuePage": 318
        },
        "typeCodes": [
            "M",
            "C",
            "S"
        ],
        "aerospace": {
            "attackValue": "6/8",
            "range": "Long",
            "toHitModifier": 0
        },
        "ammo": {
            "ammoType": "clan_lrm",
            "ammoPerTon": 12,
            "ammoCostPerTon": 30000,
            "ammoBV": 14
        },
        "bv": 109,
        "oneShotBV": 22,
        "notes": [
            "BV after slash in the rules table is the single-shot/one-shot launcher BV."
        ]
    },
    "clan_lrm_15": {
        "id": "clan_lrm_15",
        "name": "LRM 15",
        "altNames": [
            "Clan LRM 15",
            "CL LRM 15",
            "CLLRM15",
            "LRM-15",
            "LRM15"
        ],
        "category": "Missile",
        "techBase": "Clan",
        "rulesLevel": "Standard",
        "variant": "Clan",
        "family": "lrm",
        "damage": "1/Msl",
        "heat": 5,
        "tons": 3.5,
        "critSlots": 2,
        "spaceSlots": 2,
        "range": {
            "min": 0,
            "short": 7,
            "medium": 14,
            "long": 21
        },
        "techRating": "F",
        "flags": [
            "cluster",
            "requiresAmmo",
            "indirectFire",
            "minimumRange"
        ],
        "source": {
            "weightSpacePage": 343,
            "battleValuePage": 318
        },
        "typeCodes": [
            "M",
            "C",
            "S"
        ],
        "aerospace": {
            "attackValue": "9/12",
            "range": "Long",
            "toHitModifier": 0
        },
        "ammo": {
            "ammoType": "clan_lrm",
            "ammoPerTon": 8,
            "ammoCostPerTon": 30000,
            "ammoBV": 21
        },
        "bv": 164,
        "oneShotBV": 33,
        "notes": [
            "BV after slash in the rules table is the single-shot/one-shot launcher BV."
        ]
    },
    "clan_lrm_20": {
        "id": "clan_lrm_20",
        "name": "LRM 20",
        "altNames": [
            "Clan LRM 20",
            "CL LRM 20",
            "CLLRM20",
            "LRM-20",
            "LRM20"
        ],
        "category": "Missile",
        "techBase": "Clan",
        "rulesLevel": "Standard",
        "variant": "Clan",
        "family": "lrm",
        "damage": "1/Msl",
        "heat": 6,
        "tons": 5,
        "critSlots": 4,
        "spaceSlots": 4,
        "range": {
            "min": 0,
            "short": 7,
            "medium": 14,
            "long": 21
        },
        "techRating": "F",
        "flags": [
            "cluster",
            "requiresAmmo",
            "indirectFire",
            "minimumRange"
        ],
        "source": {
            "weightSpacePage": 343,
            "battleValuePage": 318
        },
        "typeCodes": [
            "M",
            "C",
            "S"
        ],
        "aerospace": {
            "attackValue": "12/16",
            "range": "Long",
            "toHitModifier": 0
        },
        "ammo": {
            "ammoType": "clan_lrm",
            "ammoPerTon": 6,
            "ammoCostPerTon": 30000,
            "ammoBV": 27
        },
        "bv": 220,
        "oneShotBV": 44,
        "notes": [
            "BV after slash in the rules table is the single-shot/one-shot launcher BV."
        ]
    },
    "clan_srm_2": {
        "id": "clan_srm_2",
        "name": "SRM 2",
        "altNames": [
            "Clan SRM 2",
            "CL SRM 2",
            "CLSRM2",
            "SRM-2",
            "SRM2"
        ],
        "category": "Missile",
        "techBase": "Clan",
        "rulesLevel": "Standard",
        "variant": "Clan",
        "family": "srm",
        "damage": "2/Msl",
        "heat": 2,
        "tons": 0.5,
        "critSlots": 1,
        "spaceSlots": 1,
        "range": {
            "min": 0,
            "short": 3,
            "medium": 6,
            "long": 9
        },
        "techRating": "F",
        "flags": [
            "cluster",
            "requiresAmmo"
        ],
        "source": {
            "weightSpacePage": 343,
            "battleValuePage": 318
        },
        "typeCodes": [
            "M",
            "C",
            "S"
        ],
        "aerospace": {
            "attackValue": "2/4",
            "range": "Short",
            "toHitModifier": 0
        },
        "ammo": {
            "ammoType": "clan_srm",
            "ammoPerTon": 50,
            "ammoCostPerTon": 27000,
            "ammoBV": 3
        },
        "bv": 21,
        "oneShotBV": 4,
        "notes": [
            "BV after slash in the rules table is the single-shot/one-shot launcher BV."
        ]
    },
    "clan_srm_4": {
        "id": "clan_srm_4",
        "name": "SRM 4",
        "altNames": [
            "Clan SRM 4",
            "CL SRM 4",
            "CLSRM4",
            "SRM-4",
            "SRM4"
        ],
        "category": "Missile",
        "techBase": "Clan",
        "rulesLevel": "Standard",
        "variant": "Clan",
        "family": "srm",
        "damage": "2/Msl",
        "heat": 3,
        "tons": 1,
        "critSlots": 1,
        "spaceSlots": 1,
        "range": {
            "min": 0,
            "short": 3,
            "medium": 6,
            "long": 9
        },
        "techRating": "F",
        "flags": [
            "cluster",
            "requiresAmmo"
        ],
        "source": {
            "weightSpacePage": 343,
            "battleValuePage": 318
        },
        "typeCodes": [
            "M",
            "C",
            "S"
        ],
        "aerospace": {
            "attackValue": "4/6",
            "range": "Short",
            "toHitModifier": 0
        },
        "ammo": {
            "ammoType": "clan_srm",
            "ammoPerTon": 25,
            "ammoCostPerTon": 27000,
            "ammoBV": 5
        },
        "bv": 39,
        "oneShotBV": 8,
        "notes": [
            "BV after slash in the rules table is the single-shot/one-shot launcher BV."
        ]
    },
    "clan_srm_6": {
        "id": "clan_srm_6",
        "name": "SRM 6",
        "altNames": [
            "Clan SRM 6",
            "CL SRM 6",
            "CLSRM6",
            "SRM-6",
            "SRM6"
        ],
        "category": "Missile",
        "techBase": "Clan",
        "rulesLevel": "Standard",
        "variant": "Clan",
        "family": "srm",
        "damage": "2/Msl",
        "heat": 4,
        "tons": 1.5,
        "critSlots": 1,
        "spaceSlots": 1,
        "range": {
            "min": 0,
            "short": 3,
            "medium": 6,
            "long": 9
        },
        "techRating": "F",
        "flags": [
            "cluster",
            "requiresAmmo"
        ],
        "source": {
            "weightSpacePage": 343,
            "battleValuePage": 318
        },
        "typeCodes": [
            "M",
            "C",
            "S"
        ],
        "aerospace": {
            "attackValue": "8/10",
            "range": "Short",
            "toHitModifier": 0
        },
        "ammo": {
            "ammoType": "clan_srm",
            "ammoPerTon": 15,
            "ammoCostPerTon": 27000,
            "ammoBV": 7
        },
        "bv": 59,
        "oneShotBV": 12,
        "notes": [
            "BV after slash in the rules table is the single-shot/one-shot launcher BV."
        ]
    },
    "clan_streak_srm_2": {
        "id": "clan_streak_srm_2",
        "name": "Streak SRM 2",
        "altNames": [
            "Clan Streak SRM 2",
            "CL Streak SRM 2",
            "CLStreakSRM2",
            "Streak SRM-2",
            "StreakSRM2"
        ],
        "category": "Missile",
        "techBase": "Clan",
        "rulesLevel": "Standard",
        "variant": "Clan",
        "family": "streakSrm",
        "damage": "2/Msl",
        "heat": 2,
        "tons": 1,
        "critSlots": 1,
        "spaceSlots": 1,
        "range": {
            "min": 0,
            "short": 4,
            "medium": 8,
            "long": 12
        },
        "techRating": "F",
        "flags": [
            "cluster",
            "requiresAmmo",
            "streak"
        ],
        "source": {
            "weightSpacePage": 343,
            "battleValuePage": 318
        },
        "typeCodes": [
            "M",
            "C"
        ],
        "aerospace": {
            "attackValue": "4",
            "range": "Medium",
            "toHitModifier": 0
        },
        "ammo": {
            "ammoType": "clan_streak_srm",
            "ammoPerTon": 50,
            "ammoCostPerTon": 54000,
            "ammoBV": 5
        },
        "bv": 40,
        "oneShotBV": 8,
        "notes": [
            "BV after slash in the rules table is the single-shot/one-shot launcher BV."
        ]
    },
    "clan_streak_srm_4": {
        "id": "clan_streak_srm_4",
        "name": "Streak SRM 4",
        "altNames": [
            "Clan Streak SRM 4",
            "CL Streak SRM 4",
            "CLStreakSRM4",
            "Streak SRM-4",
            "StreakSRM4"
        ],
        "category": "Missile",
        "techBase": "Clan",
        "rulesLevel": "Standard",
        "variant": "Clan",
        "family": "streakSrm",
        "damage": "2/Msl",
        "heat": 3,
        "tons": 2,
        "critSlots": 1,
        "spaceSlots": 1,
        "range": {
            "min": 0,
            "short": 4,
            "medium": 8,
            "long": 12
        },
        "techRating": "F",
        "flags": [
            "cluster",
            "requiresAmmo",
            "streak"
        ],
        "source": {
            "weightSpacePage": 343,
            "battleValuePage": 318
        },
        "typeCodes": [
            "M",
            "C"
        ],
        "aerospace": {
            "attackValue": "8",
            "range": "Medium",
            "toHitModifier": 0
        },
        "ammo": {
            "ammoType": "clan_streak_srm",
            "ammoPerTon": 25,
            "ammoCostPerTon": 54000,
            "ammoBV": 10
        },
        "bv": 79,
        "oneShotBV": 16,
        "notes": [
            "BV after slash in the rules table is the single-shot/one-shot launcher BV."
        ]
    },
    "clan_streak_srm_6": {
        "id": "clan_streak_srm_6",
        "name": "Streak SRM 6",
        "altNames": [
            "Clan Streak SRM 6",
            "CL Streak SRM 6",
            "CLStreakSRM6",
            "Streak SRM-6",
            "StreakSRM6"
        ],
        "category": "Missile",
        "techBase": "Clan",
        "rulesLevel": "Standard",
        "variant": "Clan",
        "family": "streakSrm",
        "damage": "2/Msl",
        "heat": 4,
        "tons": 3,
        "critSlots": 2,
        "spaceSlots": 2,
        "range": {
            "min": 0,
            "short": 4,
            "medium": 8,
            "long": 12
        },
        "techRating": "F",
        "flags": [
            "cluster",
            "requiresAmmo",
            "streak"
        ],
        "source": {
            "weightSpacePage": 343,
            "battleValuePage": 318
        },
        "typeCodes": [
            "M",
            "C"
        ],
        "aerospace": {
            "attackValue": "12",
            "range": "Medium",
            "toHitModifier": 0
        },
        "ammo": {
            "ammoType": "clan_streak_srm",
            "ammoPerTon": 15,
            "ammoCostPerTon": 54000,
            "ammoBV": 15
        },
        "bv": 118,
        "oneShotBV": 24,
        "notes": [
            "BV after slash in the rules table is the single-shot/one-shot launcher BV."
        ]
    },
    "clan_narc_missile_beacon": {
        "id": "clan_narc_missile_beacon",
        "name": "Narc Missile Beacon",
        "altNames": [
            "Clan Narc Missile Beacon",
            "CL Narc Missile Beacon",
            "CLNarcMissileBeacon",
            "NarcMissileBeacon"
        ],
        "category": "Equipment",
        "techBase": "Clan",
        "rulesLevel": "Standard",
        "variant": "Clan",
        "family": "narc_missile_beacon",
        "damage": "special",
        "heat": 0,
        "tons": 2,
        "critSlots": 1,
        "spaceSlots": 1,
        "range": {
            "min": 0,
            "short": 4,
            "medium": 8,
            "long": 12
        },
        "techRating": "F",
        "flags": [
            "narc",
            "requiresAmmo"
        ],
        "source": {
            "weightSpacePage": 343,
            "battleValuePage": 318
        },
        "ammo": {
            "ammoType": "clan_narc_missile_beacon_ammo",
            "ammoPerTon": 6,
            "ammoBV": 0
        },
        "bv": 30,
        "oneShotBV": 6,
        "notes": [
            "BV after slash in the rules table is the single-shot/one-shot launcher BV."
        ]
    },
    "is_a_pod": {
        "id": "is_a_pod",
        "name": "A-Pod",
        "altNames": [
            "IS A-Pod",
            "ISAPod",
            "APod"
        ],
        "category": "Equipment",
        "techBase": "Inner Sphere",
        "rulesLevel": "Standard",
        "variant": "IS",
        "family": "a_pod",
        "damage": "special",
        "heat": 0,
        "tons": 0.5,
        "critSlots": 1,
        "spaceSlots": 1,
        "techRating": "B",
        "flags": [
            "oneShot",
            "antiInfantry",
            "pointBlank"
        ],
        "source": {
            "weightSpacePage": 342,
            "battleValuePage": 317
        },
        "ammo": {
            "ammoType": "is_a_pod_ammo",
            "ammoPerTon": "OS"
        },
        "bv": 1
    },
    "is_b_pod": {
        "id": "is_b_pod",
        "name": "B-Pod",
        "altNames": [
            "IS B-Pod",
            "ISBPod",
            "BPod"
        ],
        "category": "Equipment",
        "techBase": "Inner Sphere",
        "rulesLevel": "Standard",
        "variant": "IS",
        "family": "b_pod",
        "damage": "special",
        "heat": 0,
        "tons": 1,
        "critSlots": 1,
        "spaceSlots": 1,
        "techRating": "E",
        "flags": [
            "oneShot",
            "antiInfantry",
            "pointBlank",
            "explosive"
        ],
        "source": {
            "weightSpacePage": 342,
            "battleValuePage": 317
        },
        "ammo": {
            "ammoType": "is_b_pod_ammo",
            "ammoPerTon": "OS"
        },
        "bv": 2
    },
    "is_anti_missile_system": {
        "id": "is_anti_missile_system",
        "name": "Anti-Missile System",
        "altNames": [
            "IS Anti-Missile System",
            "ISAntiMissileSystem",
            "AntiMissileSystem"
        ],
        "category": "Equipment",
        "techBase": "Inner Sphere",
        "rulesLevel": "Standard",
        "variant": "IS",
        "family": "anti_missile_system",
        "damage": "special",
        "heat": 1,
        "tons": 0.5,
        "critSlots": 1,
        "spaceSlots": 1,
        "techRating": "E",
        "flags": [
            "pointDefense",
            "requiresAmmo"
        ],
        "source": {
            "weightSpacePage": 342,
            "battleValuePage": 317
        },
        "ammo": {
            "ammoType": "is_anti_missile_system_ammo",
            "ammoPerTon": 12,
            "ammoBV": 11
        },
        "bv": 32
    },
    "is_machine_gun_array": {
        "id": "is_machine_gun_array",
        "name": "Machine Gun Array",
        "altNames": [
            "IS Machine Gun Array",
            "ISMachineGunArray",
            "MachineGunArray"
        ],
        "category": "Equipment",
        "techBase": "Inner Sphere",
        "rulesLevel": "Standard",
        "variant": "IS",
        "family": "machine_gun_array",
        "damage": "special",
        "heat": 0,
        "tons": 0.5,
        "critSlots": 1,
        "spaceSlots": 1,
        "techRating": "E",
        "flags": [
            "targetingSystem"
        ],
        "source": {
            "weightSpacePage": 342,
            "battleValuePage": 317
        },
        "bv": "F"
    },
    "is_masc": {
        "id": "is_masc",
        "name": "MASC",
        "altNames": [
            "IS MASC",
            "ISMASC"
        ],
        "category": "Equipment",
        "techBase": "Inner Sphere",
        "rulesLevel": "Standard",
        "variant": "IS",
        "family": "masc",
        "damage": "special",
        "heat": 0,
        "tons": "variable",
        "critSlots": "variable",
        "spaceSlots": "variable",
        "techRating": "E",
        "flags": [
            "movementEnhancement"
        ],
        "source": {
            "weightSpacePage": 342,
            "battleValuePage": 317
        },
        "notes": [
            "Variable weight/space; see construction rules."
        ],
        "bv": "C"
    },
    "is_one_shot": {
        "id": "is_one_shot",
        "name": "One-Shot",
        "altNames": [
            "IS One-Shot",
            "ISOneShot",
            "OneShot"
        ],
        "category": "Equipment",
        "techBase": "Inner Sphere",
        "rulesLevel": "Standard",
        "variant": "IS",
        "family": "one_shot",
        "damage": "special",
        "heat": 0,
        "tons": "add 0.5",
        "critSlots": 0,
        "spaceSlots": 0,
        "techRating": "Special",
        "flags": [
            "oneShot"
        ],
        "source": {
            "weightSpacePage": 342,
            "battleValuePage": 317
        },
        "notes": [
            "May apply to eligible missile weapons; adds 0.5 tons to the weapon."
        ],
        "bv": "launcherSpecific"
    },
    "is_tag": {
        "id": "is_tag",
        "name": "TAG",
        "altNames": [
            "IS TAG",
            "ISTAG"
        ],
        "category": "Equipment",
        "techBase": "Inner Sphere",
        "rulesLevel": "Standard",
        "variant": "IS",
        "family": "tag",
        "damage": "special",
        "heat": 0,
        "tons": 1,
        "critSlots": 1,
        "spaceSlots": 1,
        "range": {
            "min": 0,
            "short": 5,
            "medium": 9,
            "long": 15
        },
        "techRating": "E",
        "flags": [
            "tag"
        ],
        "source": {
            "weightSpacePage": 342,
            "battleValuePage": 317
        },
        "bv": "A"
    },
    "clan_a_pod": {
        "id": "clan_a_pod",
        "name": "A-Pod",
        "altNames": [
            "Clan A-Pod",
            "CL A-Pod",
            "CLAPod",
            "APod"
        ],
        "category": "Equipment",
        "techBase": "Clan",
        "rulesLevel": "Standard",
        "variant": "Clan",
        "family": "a_pod",
        "damage": "special",
        "heat": 0,
        "tons": 0.5,
        "critSlots": 1,
        "spaceSlots": 1,
        "techRating": "B",
        "flags": [
            "oneShot",
            "antiInfantry",
            "pointBlank"
        ],
        "source": {
            "weightSpacePage": 343,
            "battleValuePage": 318
        },
        "ammo": {
            "ammoType": "clan_a_pod_ammo",
            "ammoPerTon": "OS"
        },
        "bv": 1
    },
    "clan_b_pod": {
        "id": "clan_b_pod",
        "name": "B-Pod",
        "altNames": [
            "Clan B-Pod",
            "CL B-Pod",
            "CLBPod",
            "BPod"
        ],
        "category": "Equipment",
        "techBase": "Clan",
        "rulesLevel": "Standard",
        "variant": "Clan",
        "family": "b_pod",
        "damage": "special",
        "heat": 0,
        "tons": 1,
        "critSlots": 1,
        "spaceSlots": 1,
        "techRating": "E",
        "flags": [
            "oneShot",
            "antiInfantry",
            "pointBlank",
            "explosive"
        ],
        "source": {
            "weightSpacePage": 343,
            "battleValuePage": 318
        },
        "ammo": {
            "ammoType": "clan_b_pod_ammo",
            "ammoPerTon": "OS"
        },
        "bv": 2
    },
    "clan_anti_missile_system": {
        "id": "clan_anti_missile_system",
        "name": "Anti-Missile System",
        "altNames": [
            "Clan Anti-Missile System",
            "CL Anti-Missile System",
            "CLAntiMissileSystem",
            "AntiMissileSystem"
        ],
        "category": "Equipment",
        "techBase": "Clan",
        "rulesLevel": "Standard",
        "variant": "Clan",
        "family": "anti_missile_system",
        "damage": "special",
        "heat": 1,
        "tons": 0.5,
        "critSlots": 1,
        "spaceSlots": 1,
        "techRating": "F",
        "flags": [
            "pointDefense",
            "requiresAmmo"
        ],
        "source": {
            "weightSpacePage": 343,
            "battleValuePage": 318
        },
        "ammo": {
            "ammoType": "clan_anti_missile_system_ammo",
            "ammoPerTon": 24,
            "ammoBV": 22
        },
        "bv": 32
    },
    "clan_machine_gun_array": {
        "id": "clan_machine_gun_array",
        "name": "Machine Gun Array",
        "altNames": [
            "Clan Machine Gun Array",
            "CL Machine Gun Array",
            "CLMachineGunArray",
            "MachineGunArray"
        ],
        "category": "Equipment",
        "techBase": "Clan",
        "rulesLevel": "Standard",
        "variant": "Clan",
        "family": "machine_gun_array",
        "damage": "special",
        "heat": 0,
        "tons": 0.25,
        "critSlots": 1,
        "spaceSlots": 1,
        "techRating": "E",
        "flags": [
            "targetingSystem"
        ],
        "source": {
            "weightSpacePage": 343,
            "battleValuePage": 318
        },
        "bv": "F"
    },
    "clan_masc": {
        "id": "clan_masc",
        "name": "MASC",
        "altNames": [
            "Clan MASC",
            "CL MASC",
            "CLMASC"
        ],
        "category": "Equipment",
        "techBase": "Clan",
        "rulesLevel": "Standard",
        "variant": "Clan",
        "family": "masc",
        "damage": "special",
        "heat": 0,
        "tons": "variable",
        "critSlots": "variable",
        "spaceSlots": "variable",
        "techRating": "F",
        "flags": [
            "movementEnhancement"
        ],
        "source": {
            "weightSpacePage": 343,
            "battleValuePage": 318
        },
        "notes": [
            "Variable weight/space; see construction rules."
        ],
        "bv": "C"
    },
    "clan_one_shot": {
        "id": "clan_one_shot",
        "name": "One-Shot",
        "altNames": [
            "Clan One-Shot",
            "CL One-Shot",
            "CLOneShot",
            "OneShot"
        ],
        "category": "Equipment",
        "techBase": "Clan",
        "rulesLevel": "Standard",
        "variant": "Clan",
        "family": "one_shot",
        "damage": "special",
        "heat": 0,
        "tons": "add 0.5",
        "critSlots": 0,
        "spaceSlots": 0,
        "techRating": "Special",
        "flags": [
            "oneShot"
        ],
        "source": {
            "weightSpacePage": 343,
            "battleValuePage": 318
        },
        "notes": [
            "May apply to eligible missile weapons; adds 0.5 tons to the weapon."
        ],
        "bv": "launcherSpecific"
    },
    "clan_tag": {
        "id": "clan_tag",
        "name": "TAG",
        "altNames": [
            "Clan TAG",
            "CL TAG",
            "CLTAG"
        ],
        "category": "Equipment",
        "techBase": "Clan",
        "rulesLevel": "Standard",
        "variant": "Clan",
        "family": "tag",
        "damage": "special",
        "heat": 0,
        "tons": 1,
        "critSlots": 1,
        "spaceSlots": 1,
        "range": {
            "min": 0,
            "short": 5,
            "medium": 9,
            "long": 15
        },
        "techRating": "E",
        "flags": [
            "tag"
        ],
        "source": {
            "weightSpacePage": 343,
            "battleValuePage": 318
        },
        "bv": "A"
    },
    "is_beagle_active_probe": {
        "id": "is_beagle_active_probe",
        "name": "Beagle Active Probe",
        "altNames": [
            "IS Beagle Active Probe",
            "ISBeagleActiveProbe",
            "BeagleActiveProbe"
        ],
        "category": "Equipment",
        "techBase": "Inner Sphere",
        "rulesLevel": "Standard",
        "variant": "IS",
        "family": "beagle_active_probe",
        "damage": "special",
        "heat": 0,
        "tons": 1.5,
        "critSlots": 2,
        "spaceSlots": 2,
        "range": {
            "min": 0,
            "short": 0,
            "medium": 0,
            "long": 4
        },
        "techRating": "E",
        "flags": [
            "activeProbe"
        ],
        "source": {
            "weightSpacePage": 342,
            "battleValuePage": 317
        },
        "bv": 10
    },
    "is_case": {
        "id": "is_case",
        "name": "CASE",
        "altNames": [
            "IS CASE",
            "ISCASE"
        ],
        "category": "Equipment",
        "techBase": "Inner Sphere",
        "rulesLevel": "Standard",
        "variant": "IS",
        "family": "case",
        "damage": "special",
        "heat": 0,
        "tons": 0.5,
        "critSlots": 1,
        "spaceSlots": 1,
        "techRating": "D",
        "flags": [
            "ammoProtection"
        ],
        "source": {
            "weightSpacePage": 342,
            "battleValuePage": 317
        },
        "bv": "C"
    },
    "is_c3_computer_master": {
        "id": "is_c3_computer_master",
        "name": "C3 Computer (Master)",
        "altNames": [
            "IS C3 Computer (Master)",
            "ISC3Computer(Master)",
            "C3Computer(Master)"
        ],
        "category": "Equipment",
        "techBase": "Inner Sphere",
        "rulesLevel": "Standard",
        "variant": "IS",
        "family": "c3_computer_master",
        "damage": "special",
        "heat": 0,
        "tons": 5,
        "critSlots": 5,
        "spaceSlots": 5,
        "techRating": "E",
        "flags": [
            "c3"
        ],
        "source": {
            "weightSpacePage": 342,
            "battleValuePage": 317
        },
        "bv": "D"
    },
    "is_c3_computer_slave": {
        "id": "is_c3_computer_slave",
        "name": "C3 Computer (Slave)",
        "altNames": [
            "IS C3 Computer (Slave)",
            "ISC3Computer(Slave)",
            "C3Computer(Slave)"
        ],
        "category": "Equipment",
        "techBase": "Inner Sphere",
        "rulesLevel": "Standard",
        "variant": "IS",
        "family": "c3_computer_slave",
        "damage": "special",
        "heat": 0,
        "tons": 1,
        "critSlots": 1,
        "spaceSlots": 1,
        "techRating": "E",
        "flags": [
            "c3"
        ],
        "source": {
            "weightSpacePage": 342,
            "battleValuePage": 317
        },
        "bv": "D"
    },
    "is_improved_c3_computer": {
        "id": "is_improved_c3_computer",
        "name": "Improved C3 Computer",
        "altNames": [
            "IS Improved C3 Computer",
            "ISImprovedC3Computer",
            "ImprovedC3Computer"
        ],
        "category": "Equipment",
        "techBase": "Inner Sphere",
        "rulesLevel": "Standard",
        "variant": "IS",
        "family": "improved_c3_computer",
        "damage": "special",
        "heat": 0,
        "tons": 2.5,
        "critSlots": 2,
        "spaceSlots": 2,
        "techRating": "E",
        "flags": [
            "c3"
        ],
        "source": {
            "weightSpacePage": 342,
            "battleValuePage": 317
        },
        "bv": "D"
    },
    "is_guardian_ecm_suite": {
        "id": "is_guardian_ecm_suite",
        "name": "Guardian ECM Suite",
        "altNames": [
            "IS Guardian ECM Suite",
            "ISGuardianECMSuite",
            "GuardianECMSuite"
        ],
        "category": "Equipment",
        "techBase": "Inner Sphere",
        "rulesLevel": "Standard",
        "variant": "IS",
        "family": "guardian_ecm_suite",
        "damage": "special",
        "heat": 0,
        "tons": 1.5,
        "critSlots": 2,
        "spaceSlots": 2,
        "range": {
            "min": 0,
            "short": 0,
            "medium": 0,
            "long": 6
        },
        "techRating": "E",
        "flags": [
            "ecm"
        ],
        "source": {
            "weightSpacePage": 342,
            "battleValuePage": 317
        },
        "bv": 61
    },
    "is_targeting_computer": {
        "id": "is_targeting_computer",
        "name": "Targeting Computer",
        "altNames": [
            "IS Targeting Computer",
            "ISTargetingComputer",
            "TargetingComputer"
        ],
        "category": "Equipment",
        "techBase": "Inner Sphere",
        "rulesLevel": "Standard",
        "variant": "IS",
        "family": "targeting_computer",
        "damage": "special",
        "heat": 0,
        "tons": "variable",
        "critSlots": "variable",
        "spaceSlots": "variable",
        "techRating": "E",
        "flags": [
            "targetingComputer"
        ],
        "source": {
            "weightSpacePage": 342,
            "battleValuePage": 317
        },
        "bv": "E"
    },
    "clan_active_probe": {
        "id": "clan_active_probe",
        "name": "Active Probe",
        "altNames": [
            "Clan Active Probe",
            "CL Active Probe",
            "CLActiveProbe",
            "ActiveProbe"
        ],
        "category": "Equipment",
        "techBase": "Clan",
        "rulesLevel": "Standard",
        "variant": "Clan",
        "family": "active_probe",
        "damage": "special",
        "heat": 0,
        "tons": 1,
        "critSlots": 1,
        "spaceSlots": 1,
        "range": {
            "min": 0,
            "short": 0,
            "medium": 0,
            "long": 5
        },
        "techRating": "E",
        "flags": [
            "activeProbe"
        ],
        "source": {
            "weightSpacePage": 343,
            "battleValuePage": 318
        },
        "bv": 12
    },
    "clan_light_active_probe": {
        "id": "clan_light_active_probe",
        "name": "Light Active Probe",
        "altNames": [
            "Clan Light Active Probe",
            "CL Light Active Probe",
            "CLLightActiveProbe",
            "LightActiveProbe"
        ],
        "category": "Equipment",
        "techBase": "Clan",
        "rulesLevel": "Standard",
        "variant": "Clan",
        "family": "light_active_probe",
        "damage": "special",
        "heat": 0,
        "tons": 0.5,
        "critSlots": 1,
        "spaceSlots": 1,
        "range": {
            "min": 0,
            "short": 0,
            "medium": 0,
            "long": 3
        },
        "techRating": "F",
        "flags": [
            "activeProbe"
        ],
        "source": {
            "weightSpacePage": 343,
            "battleValuePage": 318
        },
        "bv": 7
    },
    "clan_ecm_suite": {
        "id": "clan_ecm_suite",
        "name": "ECM Suite",
        "altNames": [
            "Clan ECM Suite",
            "CL ECM Suite",
            "CLECMSuite",
            "ECMSuite"
        ],
        "category": "Equipment",
        "techBase": "Clan",
        "rulesLevel": "Standard",
        "variant": "Clan",
        "family": "ecm_suite",
        "damage": "special",
        "heat": 0,
        "tons": 1,
        "critSlots": 1,
        "spaceSlots": 1,
        "range": {
            "min": 0,
            "short": 0,
            "medium": 0,
            "long": 6
        },
        "techRating": "F",
        "flags": [
            "ecm"
        ],
        "source": {
            "weightSpacePage": 343,
            "battleValuePage": 318
        },
        "bv": 61
    },
    "clan_light_tag": {
        "id": "clan_light_tag",
        "name": "Light TAG",
        "altNames": [
            "Clan Light TAG",
            "CL Light TAG",
            "CLLightTAG",
            "LightTAG"
        ],
        "category": "Equipment",
        "techBase": "Clan",
        "rulesLevel": "Standard",
        "variant": "Clan",
        "family": "light_tag",
        "damage": "special",
        "heat": 0,
        "tons": 0.5,
        "critSlots": 1,
        "spaceSlots": 1,
        "range": {
            "min": 0,
            "short": 3,
            "medium": 6,
            "long": 9
        },
        "techRating": "F",
        "flags": [
            "tag"
        ],
        "source": {
            "weightSpacePage": 343,
            "battleValuePage": 318
        },
        "bv": "A"
    },
    "clan_targeting_computer": {
        "id": "clan_targeting_computer",
        "name": "Targeting Computer",
        "altNames": [
            "Clan Targeting Computer",
            "CL Targeting Computer",
            "CLTargetingComputer",
            "TargetingComputer"
        ],
        "category": "Equipment",
        "techBase": "Clan",
        "rulesLevel": "Standard",
        "variant": "Clan",
        "family": "targeting_computer",
        "damage": "special",
        "heat": 0,
        "tons": "variable",
        "critSlots": "variable",
        "spaceSlots": "variable",
        "techRating": "F",
        "flags": [
            "targetingComputer"
        ],
        "source": {
            "weightSpacePage": 343,
            "battleValuePage": 318
        },
        "bv": "D"
    },
    "is_killer_whale": {
        "id": "is_killer_whale",
        "name": "Killer Whale",
        "altNames": [
            "IS Killer Whale",
            "ISKillerWhale",
            "KillerWhale"
        ],
        "category": "Missile",
        "techBase": "Inner Sphere",
        "rulesLevel": "Standard",
        "variant": "IS",
        "family": "killer_whale",
        "damage": "capital",
        "heat": "NA",
        "tons": 150,
        "critSlots": "NA",
        "spaceSlots": "NA",
        "techRating": "D",
        "flags": [
            "cluster"
        ],
        "source": {
            "weightSpacePage": 341,
            "battleValuePage": 318
        },
        "typeCodes": [
            "M"
        ],
        "aerospace": {
            "range": "Extreme",
            "toHitModifier": 0
        },
        "ammo": {
            "ammoType": "is_capital_missile",
            "ammoPerTon": "50 t/Msl",
            "ammoBV": 96
        },
        "notes": [
            "Capital missile/aerospace weapon; generally not BattleMech-mounted."
        ],
        "bv": 769
    },
    "is_white_shark": {
        "id": "is_white_shark",
        "name": "White Shark",
        "altNames": [
            "IS White Shark",
            "ISWhiteShark",
            "WhiteShark"
        ],
        "category": "Missile",
        "techBase": "Inner Sphere",
        "rulesLevel": "Standard",
        "variant": "IS",
        "family": "white_shark",
        "damage": "capital",
        "heat": "NA",
        "tons": 120,
        "critSlots": "NA",
        "spaceSlots": "NA",
        "techRating": "D",
        "flags": [
            "cluster"
        ],
        "source": {
            "weightSpacePage": 341,
            "battleValuePage": 318
        },
        "typeCodes": [
            "M"
        ],
        "aerospace": {
            "range": "Extreme",
            "toHitModifier": 0
        },
        "ammo": {
            "ammoType": "is_capital_missile",
            "ammoPerTon": "40 t/Msl",
            "ammoBV": 72
        },
        "notes": [
            "Capital missile/aerospace weapon; generally not BattleMech-mounted."
        ],
        "bv": 577
    },
    "is_barracuda": {
        "id": "is_barracuda",
        "name": "Barracuda",
        "altNames": [
            "IS Barracuda",
            "ISBarracuda"
        ],
        "category": "Missile",
        "techBase": "Inner Sphere",
        "rulesLevel": "Standard",
        "variant": "IS",
        "family": "barracuda",
        "damage": "capital",
        "heat": "NA",
        "tons": 90,
        "critSlots": "NA",
        "spaceSlots": "NA",
        "techRating": "D",
        "flags": [
            "cluster",
            "requiresAmmo"
        ],
        "source": {
            "weightSpacePage": 341,
            "battleValuePage": 318
        },
        "typeCodes": [
            "M"
        ],
        "aerospace": {
            "range": "Extreme",
            "toHitModifier": 0
        },
        "ammo": {
            "ammoType": "is_capital_missile",
            "ammoPerTon": "30 t/Msl",
            "ammoBV": 65
        },
        "notes": [
            "Capital missile/aerospace weapon; generally not BattleMech-mounted."
        ],
        "bv": 522
    },
    "is_ar_10_launcher": {
        "id": "is_ar_10_launcher",
        "name": "AR-10 Launcher",
        "altNames": [
            "IS AR-10 Launcher",
            "ISAR10Launcher",
            "AR10Launcher"
        ],
        "category": "Missile",
        "techBase": "Inner Sphere",
        "rulesLevel": "Standard",
        "variant": "IS",
        "family": "ar_10_launcher",
        "damage": "special",
        "heat": "special",
        "tons": 250,
        "critSlots": "NA",
        "spaceSlots": "NA",
        "techRating": "D",
        "flags": [
            "cluster"
        ],
        "source": {
            "weightSpacePage": 341,
            "battleValuePage": 318
        },
        "typeCodes": [
            "M"
        ],
        "aerospace": {
            "range": "Extreme",
            "toHitModifier": 0
        },
        "notes": [
            "Capital missile/aerospace weapon; generally not BattleMech-mounted."
        ],
        "bv": 961
    },
    "clan_killer_whale": {
        "id": "clan_killer_whale",
        "name": "Killer Whale",
        "altNames": [
            "Clan Killer Whale",
            "CL Killer Whale",
            "CLKillerWhale",
            "KillerWhale"
        ],
        "category": "Missile",
        "techBase": "Clan",
        "rulesLevel": "Standard",
        "variant": "Clan",
        "family": "killer_whale",
        "damage": "capital",
        "heat": "NA",
        "tons": 150,
        "critSlots": "NA",
        "spaceSlots": "NA",
        "techRating": "D",
        "flags": [
            "cluster"
        ],
        "source": {
            "weightSpacePage": 343,
            "battleValuePage": 318
        },
        "typeCodes": [
            "M"
        ],
        "aerospace": {
            "range": "Extreme",
            "toHitModifier": 0
        },
        "ammo": {
            "ammoType": "clan_capital_missile",
            "ammoPerTon": "50 t/Msl",
            "ammoBV": 96
        },
        "notes": [
            "Capital missile/aerospace weapon; generally not BattleMech-mounted."
        ],
        "bv": 769
    },
    "clan_white_shark": {
        "id": "clan_white_shark",
        "name": "White Shark",
        "altNames": [
            "Clan White Shark",
            "CL White Shark",
            "CLWhiteShark",
            "WhiteShark"
        ],
        "category": "Missile",
        "techBase": "Clan",
        "rulesLevel": "Standard",
        "variant": "Clan",
        "family": "white_shark",
        "damage": "capital",
        "heat": "NA",
        "tons": 120,
        "critSlots": "NA",
        "spaceSlots": "NA",
        "techRating": "D",
        "flags": [
            "cluster"
        ],
        "source": {
            "weightSpacePage": 343,
            "battleValuePage": 318
        },
        "typeCodes": [
            "M"
        ],
        "aerospace": {
            "range": "Extreme",
            "toHitModifier": 0
        },
        "ammo": {
            "ammoType": "clan_capital_missile",
            "ammoPerTon": "40 t/Msl",
            "ammoBV": 72
        },
        "notes": [
            "Capital missile/aerospace weapon; generally not BattleMech-mounted."
        ],
        "bv": 577
    },
    "clan_barracuda": {
        "id": "clan_barracuda",
        "name": "Barracuda",
        "altNames": [
            "Clan Barracuda",
            "CL Barracuda",
            "CLBarracuda"
        ],
        "category": "Missile",
        "techBase": "Clan",
        "rulesLevel": "Standard",
        "variant": "Clan",
        "family": "barracuda",
        "damage": "capital",
        "heat": "NA",
        "tons": 90,
        "critSlots": "NA",
        "spaceSlots": "NA",
        "techRating": "D",
        "flags": [
            "cluster",
            "requiresAmmo"
        ],
        "source": {
            "weightSpacePage": 343,
            "battleValuePage": 318
        },
        "typeCodes": [
            "M"
        ],
        "aerospace": {
            "range": "Extreme",
            "toHitModifier": 0
        },
        "ammo": {
            "ammoType": "clan_capital_missile",
            "ammoPerTon": "30 t/Msl",
            "ammoBV": 65
        },
        "notes": [
            "Capital missile/aerospace weapon; generally not BattleMech-mounted."
        ],
        "bv": 522
    },
    "clan_ar_10_launcher": {
        "id": "clan_ar_10_launcher",
        "name": "AR-10 Launcher",
        "altNames": [
            "Clan AR-10 Launcher",
            "CL AR-10 Launcher",
            "CLAR10Launcher",
            "AR10Launcher"
        ],
        "category": "Missile",
        "techBase": "Clan",
        "rulesLevel": "Standard",
        "variant": "Clan",
        "family": "ar_10_launcher",
        "damage": "special",
        "heat": "special",
        "tons": 250,
        "critSlots": "NA",
        "spaceSlots": "NA",
        "techRating": "D",
        "flags": [
            "cluster"
        ],
        "source": {
            "weightSpacePage": 343,
            "battleValuePage": 318
        },
        "typeCodes": [
            "M"
        ],
        "aerospace": {
            "range": "Extreme",
            "toHitModifier": 0
        },
        "notes": [
            "Capital missile/aerospace weapon; generally not BattleMech-mounted."
        ],
        "bv": 961
    }
} as const satisfies Record<string, WeaponDefinition>;

export function findWeaponDefinition(rawName: string, techBase?: TechBase): WeaponDefinition | undefined {
    const normalized = rawName.toLowerCase().replace(/[^a-z0-9]/g, "");

    return (Object.values(WEAPONS) as WeaponDefinition[]).find((weapon: WeaponDefinition) => {
        if (techBase && weapon.techBase !== techBase && weapon.techBase !== "Mixed") return false;

        const names = [weapon.name, ...weapon.altNames];
        return names.some((name) => name.toLowerCase().replace(/[^a-z0-9]/g, "") === normalized);
    });
}
