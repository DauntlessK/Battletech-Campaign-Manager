import type { TechBase, WeaponDefinition } from "./weaponTypes";
export type {
  WeaponCategory,
  TechBase,
  RulesLevel,
  AvailabilityByEra,
  WeaponAvailability,
  WeaponCost,
  WeaponRange,
  AmmoDefinition,
  AmmoReference,
  AmmoOptionReference,
  WeaponDefinition,
} from "./weaponTypes";
export { AMMO, getAmmoDefinition } from "./ammo";

export const WEAPONS: Record<string, WeaponDefinition> = {
    // Inner Sphere weapons
"is_ac_2": {
        "id": "is_ac_2",
        "name": "AC/2",
        "altNames": [
            "IS Autocannon/2",
            "AC/2",
            "ISAC2",
            "Auto Cannon/2"
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
            "battleValuePage": 317,
            "costAvailabilityPage": 294
        },
        "typeCodes": [
            "DB",
            "S"
        ],
        "ammo": {
            "ammoId": "is_ac_2_ammo"
        },
        "cost": 75000,
        "bv": 37,
        "availability": {

            "starLeague": "C",

            "successionWars": "D",

            "clanInvasion": "D",

        }
    },
    "is_ac_5": {
        "id": "is_ac_5",
        "name": "AC/5",
        "altNames": [
            "IS Autocannon/5",
            "AC/5",
            "ISAC5",
            "Auto Cannon/5"
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
            "battleValuePage": 317,
            "costAvailabilityPage": 294
        },
        "typeCodes": [
            "DB",
            "S"
        ],
        "ammo": {
            "ammoId": "is_ac_5_ammo"
        },
        "cost": 125000,
        "bv": 70,
        "availability": {

            "starLeague": "C",

            "successionWars": "C",

            "clanInvasion": "D",

        }
    },
    "is_ac_10": {
        "id": "is_ac_10",
        "name": "AC/10",
        "altNames": [
            "IS Autocannon/10",
            "AC/10",
            "ISAC10",
            "Auto Cannon/10"
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
            "battleValuePage": 317,
            "costAvailabilityPage": 294
        },
        "typeCodes": [
            "DB",
            "S"
        ],
        "ammo": {
            "ammoId": "is_ac_10_ammo"
        },
        "cost": 200000,
        "bv": 123,
        "availability": {

            "starLeague": "C",

            "successionWars": "D",

            "clanInvasion": "D",

        }
    },
    "is_ac_20": {
        "id": "is_ac_20",
        "name": "AC/20",
        "altNames": [
            "IS Autocannon/20",
            "AC/20",
            "ISAC20",
            "Auto Cannon/20"
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
            "battleValuePage": 317,
            "costAvailabilityPage": 294
        },
        "typeCodes": [
            "DB",
            "S"
        ],
        "ammo": {
            "ammoId": "is_ac_20_ammo"
        },
        "cost": 300000,
        "bv": 178,
        "availability": {

            "starLeague": "D",

            "successionWars": "E",

            "clanInvasion": "D",

        }
    },
    "is_lb_2_x_ac": {
        "id": "is_lb_2_x_ac",
        "name": "LB 2-X AC",
        "altNames": [
            "IS LB 2-X AC",
            "ISLB2XAC",
            "LB2XAC",
            "ISLBXAC2",
            "LBXAC2",
            "LB 2-X Autocannon",
            "LB 2-X Auto Cannon"
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
            "battleValuePage": 317,
            "costAvailabilityPage": 294
        },
        "typeCodes": [
            "DB",
            "C",
            "S",
            "F"
        ],
        "ammo": {
            "ammoId": "is_lb_2_x_ac_ammo"
        },
        "bv": 42,
        "cost": 150000,
        "availability": {

            "starLeague": "X",

            "successionWars": "X",

            "clanInvasion": "E",

        }
    },
    "is_lb_5_x_ac": {
        "id": "is_lb_5_x_ac",
        "name": "LB 5-X AC",
        "altNames": [
            "IS LB 5-X AC",
            "ISLB5XAC",
            "LB5XAC",
            "ISLBXAC5",
            "LBXAC5",
            "LB 5-X Autocannon",
            "LB 5-X Auto Cannon"
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
            "battleValuePage": 317,
            "costAvailabilityPage": 294
        },
        "typeCodes": [
            "DB",
            "C",
            "S",
            "F"
        ],
        "ammo": {
            "ammoId": "is_lb_5_x_ac_ammo"
        },
        "bv": 83,
        "cost": 150000,
        "availability": {

            "starLeague": "X",

            "successionWars": "X",

            "clanInvasion": "D",

        }
    },
    "is_lb_10_x_ac": {
        "id": "is_lb_10_x_ac",
        "name": "LB 10-X AC",
        "altNames": [
            "IS LB 10-X AC",
            "ISLB10XAC",
            "LB10XAC",
            "ISLBXAC10",
            "LBXAC10",
            "LB 10-X Autocannon",
            "LB 10-X Auto Cannon"
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
            "battleValuePage": 317,
            "costAvailabilityPage": 294
        },
        "typeCodes": [
            "DB",
            "C",
            "S",
            "F"
        ],
        "ammo": {
            "ammoId": "is_lb_10_x_ac_ammo"
        },
        "bv": 148,
        "cost": 400000,
        "availability": {

            "starLeague": "C",

            "successionWars": "E",

            "clanInvasion": "D",

        }
    },
    "is_lb_20_x_ac": {
        "id": "is_lb_20_x_ac",
        "name": "LB 20-X AC",
        "altNames": [
            "IS LB 20-X AC",
            "ISLB20XAC",
            "LB20XAC",
            "ISLBXAC20",
            "LBXAC20",
            "LB 20-X Autocannon",
            "LB 20-X Auto Cannon"
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
            "battleValuePage": 317,
            "costAvailabilityPage": 294
        },
        "typeCodes": [
            "DB",
            "C",
            "S",
            "F"
        ],
        "ammo": {
            "ammoId": "is_lb_20_x_ac_ammo"
        },
        "bv": 237,
        "cost": 600000,
        "availability": {

            "starLeague": "X",

            "successionWars": "X",

            "clanInvasion": "E",

        }
    },
    "is_light_ac_2": {
        "id": "is_light_ac_2",
        "name": "Light AC/2",
        "altNames": [
            "IS Light AC/2",
            "ISLightAC2",
            "LightAC/2",
            "ISLAC2",
            "LAC/2",
            "Light Auto Cannon/2",
            "Light Autocannon/2"
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
            "battleValuePage": 317,
            "costAvailabilityPage": 294
        },
        "typeCodes": [
            "DB",
            "S"
        ],
        "ammo": {
            "ammoId": "is_light_ac_2_ammo"
        },
        "bv": 30,
        "cost": 100000,
        "availability": {

            "starLeague": "X",

            "successionWars": "X",

            "clanInvasion": "F",

        }
    },
    "is_light_ac_5": {
        "id": "is_light_ac_5",
        "name": "Light AC/5",
        "altNames": [
            "IS Light AC/5",
            "ISLightAC5",
            "LightAC/5",
            "ISLAC5",
            "LAC/5",
            "Light Auto Cannon/5",
            "Light Autocannon/5"
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
            "battleValuePage": 317,
            "costAvailabilityPage": 294
        },
        "typeCodes": [
            "DB",
            "S"
        ],
        "ammo": {
            "ammoId": "is_light_ac_5_ammo"
        },
        "bv": 62,
        "cost": 150000,
        "availability": {

            "starLeague": "X",

            "successionWars": "X",

            "clanInvasion": "F",

        }
    },
    "is_rotary_ac_2": {
        "id": "is_rotary_ac_2",
        "name": "Rotary AC/2",
        "altNames": [
            "IS Rotary AC/2",
            "ISRotaryAC2",
            "RotaryAC/2",
            "ISRA2",
            "RAC/2",
            "ISRAC2",
            "Rotary Autocannon/2",
            "Rotary Auto Cannon/2"
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
            "battleValuePage": 317,
            "costAvailabilityPage": 294
        },
        "typeCodes": [
            "DB",
            "R",
            "C"
        ],
        "ammo": {
            "ammoId": "is_rotary_ac_2_ammo"
        },
        "bv": 118,
        "cost": 175000,
        "availability": {

            "starLeague": "X",

            "successionWars": "X",

            "clanInvasion": "E",

        }
    },
    "is_rotary_ac_5": {
        "id": "is_rotary_ac_5",
        "name": "Rotary AC/5",
        "altNames": [
            "IS Rotary AC/5",
            "ISRotaryAC5",
            "RotaryAC/5",
            "ISRA5",
            "RAC/5",
            "ISRAC5",
            "Rotary Autocannon/5",
            "Rotary Auto Cannon/5"
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
            "battleValuePage": 317,
            "costAvailabilityPage": 294
        },
        "typeCodes": [
            "DB",
            "R",
            "C"
        ],
        "ammo": {
            "ammoId": "is_rotary_ac_5_ammo"
        },
        "bv": 247,
        "cost": 275000,
        "availability": {

            "starLeague": "X",

            "successionWars": "X",

            "clanInvasion": "E",

        }
    },
    "is_ultra_ac_2": {
        "id": "is_ultra_ac_2",
        "name": "Ultra AC/2",
        "altNames": [
            "IS Ultra AC/2",
            "ISUltraAC2",
            "UltraAC/2",
            "ISUAC2",
            "UAC/2",
            "Ultra Autocannon/2",
            "Ultra Auto Cannon/2"
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
            "battleValuePage": 317,
            "costAvailabilityPage": 294
        },
        "typeCodes": [
            "DB",
            "R",
            "C"
        ],
        "ammo": {
            "ammoId": "is_ultra_ac_2_ammo"
        },
        "bv": 56,
        "cost": 120000,
        "availability": {

            "starLeague": "X",

            "successionWars": "X",

            "clanInvasion": "E",

        }
    },
    "is_ultra_ac_5": {
        "id": "is_ultra_ac_5",
        "name": "Ultra AC/5",
        "altNames": [
            "IS Ultra AC/5",
            "ISUltraAC5",
            "UltraAC/5",
            "ISUAC5",
            "UAC/5",
            "Ultra Autocannon/5",
            "Ultra Auto Cannon/5"
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
            "battleValuePage": 317,
            "costAvailabilityPage": 294
        },
        "typeCodes": [
            "DB",
            "R",
            "C"
        ],
        "ammo": {
            "ammoId": "is_ultra_ac_5_ammo"
        },
        "bv": 112,
        "cost": 200000,
        "availability": {

            "starLeague": "D",

            "successionWars": "F",

            "clanInvasion": "D",

        }
    },
    "is_ultra_ac_10": {
        "id": "is_ultra_ac_10",
        "name": "Ultra AC/10",
        "altNames": [
            "IS Ultra AC/10",
            "ISUltraAC10",
            "UltraAC/10",
            "ISUAC10",
            "UAC/10",
            "Ultra Autocannon/10",
            "Ultra Auto Cannon/10"
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
            "battleValuePage": 317,
            "costAvailabilityPage": 294
        },
        "typeCodes": [
            "DB",
            "R",
            "C"
        ],
        "ammo": {
            "ammoId": "is_ultra_ac_10_ammo"
        },
        "bv": 210,
        "cost": 320000,
        "availability": {

            "starLeague": "X",

            "successionWars": "X",

            "clanInvasion": "E",

        }
    },
    "is_ultra_ac_20": {
        "id": "is_ultra_ac_20",
        "name": "Ultra AC/20",
        "altNames": [
            "IS Ultra AC/20",
            "ISUltraAC20",
            "UltraAC/20",
            "ISUAC20",
            "UAC/20",
            "Ultra Autocannon/20",
            "Ultra Auto Cannon/20"
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
            "battleValuePage": 317,
            "costAvailabilityPage": 294
        },
        "typeCodes": [
            "DB",
            "R",
            "C"
        ],
        "ammo": {
            "ammoId": "is_ultra_ac_20_ammo"
        },
        "bv": 281,
        "cost": 480000,
        "availability": {

            "starLeague": "X",

            "successionWars": "X",

            "clanInvasion": "E",

        }
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
            "battleValuePage": 317,
            "costAvailabilityPage": 294
        },
        "typeCodes": [
            "DB",
            "X"
        ],
        "ammo": {
            "ammoId": "is_light_gauss_rifle_ammo"
        },
        "bv": 159,
        "cost": 275000,
        "notes": [
            "Ammo BV marked § in the BV table; ammunition is not counted as explosive."
        ],
        "availability": {

            "starLeague": "X",

            "successionWars": "X",

            "clanInvasion": "E",

        }
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
            "battleValuePage": 317,
            "costAvailabilityPage": 294
        },
        "typeCodes": [
            "DB",
            "X"
        ],
        "ammo": {
            "ammoId": "is_gauss_rifle_ammo"
        },
        "bv": 320,
        "notes": [
            "Ammo BV marked § in the BV table; ammunition is not counted as explosive."
        ],
        "cost": 300000,
        "availability": {

            "starLeague": "D",

            "successionWars": "F",

            "clanInvasion": "D",

        }
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
            "battleValuePage": 317,
            "costAvailabilityPage": 294
        },
        "typeCodes": [
            "DB",
            "X",
            "V"
        ],
        "ammo": {
            "ammoId": "is_heavy_gauss_rifle_ammo"
        },
        "bv": 346,
        "cost": 500000,
        "notes": [
            "Ammo BV marked § in the BV table; ammunition is not counted as explosive."
        ],
        "availability": {

            "starLeague": "X",

            "successionWars": "X",

            "clanInvasion": "E",

        }
    },
    "is_improved_heavy_gauss_rifle": {
        "id": "is_improved_heavy_gauss_rifle",
        "name": "Improved Heavy Gauss Rifle",
        "altNames": [
            "IS Improved Heavy Gauss Rifle",
            "ISImprovedHeavyGaussRifle",
            "ImprovedHeavyGaussRifle"
        ],
        "category": "Ballistic",
        "techBase": "Inner Sphere",
        "rulesLevel": "Standard",
        "variant": "IS",
        "family": "gauss",
        "damage": 22,
        "heat": 2,
        "tons": 20,
        "critSlots": 11,
        "spaceSlots": 11,
        "range": {
            "min": 3,
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
            "battleValuePage": 317,
            "costAvailabilityPage": 294
        },
        "typeCodes": [
            "DB",
            "X",
            "V"
        ],
        "ammo": {
            "ammoId": "is_improved_heavy_gauss_rifle_ammo"
        },
        "bv": 385,
        "cost": 700000,
        "notes": [
            "Ammo BV marked § in the BV table; ammunition is not counted as explosive."
        ],
        "availability": {

            "starLeague": "X",

            "successionWars": "X",

            "clanInvasion": "F",

        }
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
            "battleValuePage": 317,
            "costAvailabilityPage": 294
        },
        "typeCodes": [
            "DB",
            "AI"
        ],
        "ammo": {
            "ammoId": "is_light_machine_gun_ammo"
        },
        "bv": 5,
        "cost": 5000,
        "availability": {

            "starLeague": "X",

            "successionWars": "X",

            "clanInvasion": "C",

        }
    },
    "is_machine_gun": {
        "id": "is_machine_gun",
        "name": "Machine Gun",
        "altNames": [
            "IS Machine Gun",
            "ISMachineGun",
            "MachineGun",
            "ISMG",
            "MG"
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
            "battleValuePage": 317,
            "costAvailabilityPage": 294
        },
        "typeCodes": [
            "DB",
            "AI"
        ],
        "ammo": {
            "ammoId": "is_machine_gun_ammo"
        },
        "cost": 5000,
        "bv": 5,
        "availability": {

            "starLeague": "A",

            "successionWars": "A",

            "clanInvasion": "B",

        }
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
            "battleValuePage": 317,
            "costAvailabilityPage": 294
        },
        "typeCodes": [
            "DB",
            "AI"
        ],
        "ammo": {
            "ammoId": "is_heavy_machine_gun_ammo"
        },
        "bv": 6,
        "cost": 7500,
        "availability": {

            "starLeague": "X",

            "successionWars": "X",

            "clanInvasion": "C",

        }
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
            "battleValuePage": 317,
            "costAvailabilityPage": 0
        },
        "typeCodes": [
            "DE",
            "H",
            "AI"
        ],
        "cost": 7500,
        "bv": 6
    },
    "is_er_flamer": {
        "id": "is_er_flamer",
        "name": "ER Flamer",
        "altNames": [
            "IS ER Flamer",
            "ISERFlamer",
            "ERFlamer"
        ],
        "category": "Energy",
        "techBase": "Inner Sphere",
        "rulesLevel": "Advanced",
        "variant": "IS",
        "family": "flamer",
        "damage": 2,
        "heat": 4,
        "tons": 1,
        "critSlots": 1,
        "spaceSlots": 1,
        "range": {
            "min": 0,
            "short": 3,
            "medium": 5,
            "long": 7
        },
        "techRating": "D",
        "availability": {

            "starLeague": "X",

            "successionWars": "X",

            "clanInvasion": "E",

        },
        "flags": [
            "directFire",
            "antiInfantry"
        ],
        "source": {
            "weightSpacePage": 341,
            "battleValuePage": 317,
            "costAvailabilityPage": 0
        },
        "typeCodes": [
            "DE",
            "H",
            "AI"
        ],
        "cost": 15000,
        "bv": 16
    },
    "is_heavy_flamer": {
        "id": "is_heavy_flamer",
        "name": "Heavy Flamer",
        "altNames": [
            "IS Heavy Flamer",
            "ISHeavyFlamer",
            "HeavyFlamer"
        ],
        "category": "Energy",
        "techBase": "Inner Sphere",
        "rulesLevel": "Advanced",
        "variant": "IS",
        "family": "flamer",
        "damage": 4,
        "heat": 5,
        "tons": 1.5,
        "critSlots": 1,
        "spaceSlots": 1,
        "range": {
            "min": 0,
            "short": 2,
            "medium": 3,
            "long": 4
        },
        "techRating": "C",
        "availability": {

            "starLeague": "X",

            "successionWars": "X",

            "clanInvasion": "E",

        },
        "flags": [
            "directFire",
            "antiInfantry"
        ],
        "source": {
            "weightSpacePage": 341,
            "battleValuePage": 317,
            "costAvailabilityPage": 0
        },
        "typeCodes": [
            "DE",
            "H",
            "AI"
        ],
        "cost": 11250,
        "bv": 15,
        "ammo": {
            "ammoId": "is_heavy_flamer_ammo"
        }
    },
    "is_flamer_vehicle": {
        "id": "is_flamer_vehicle",
        "name": "Flamer (Vehicle)",
        "altNames": [
            "IS Flamer (Vehicle)",
            "ISFlamer(Vehicle)",
            "Flamer(Vehicle)",
            "Vehicle Flamer",
            "IS Vehicle Flamer"
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
            "battleValuePage": 317,
            "costAvailabilityPage": 294
        },
        "typeCodes": [
            "DE",
            "H",
            "AI"
        ],
        "ammo": {
            "ammoId": "is_flamer_vehicle_ammo"
        },
        "bv": 5,
        "cost": 7500,
        "availability": {

            "starLeague": "A",

            "successionWars": "A",

            "clanInvasion": "B",

        }
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
            "battleValuePage": 317,
            "costAvailabilityPage": 0
        },
        "typeCodes": [
            "DE"
        ],
        "bv": 17,
        "cost": 11250
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
            "battleValuePage": 317,
            "costAvailabilityPage": 0
        },
        "typeCodes": [
            "DE"
        ],
        "bv": 62,
        "cost": 80000
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
            "battleValuePage": 317,
            "costAvailabilityPage": 0
        },
        "typeCodes": [
            "DE"
        ],
        "bv": 163,
        "cost": 200000
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
            "battleValuePage": 317,
            "costAvailabilityPage": 0
        },
        "typeCodes": [
            "DE"
        ],
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
            "battleValuePage": 317,
            "costAvailabilityPage": 0
        },
        "typeCodes": [
            "DE"
        ],
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
            "battleValuePage": 317,
            "costAvailabilityPage": 0
        },
        "typeCodes": [
            "DE"
        ],
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
            "battleValuePage": 317,
            "costAvailabilityPage": 0
        },
        "typeCodes": [
            "P",
            "AI"
        ],
        "bv": 12,
        "cost": 16000
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
            "battleValuePage": 317,
            "costAvailabilityPage": 0
        },
        "typeCodes": [
            "P"
        ],
        "bv": 48,
        "cost": 60000
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
            "battleValuePage": 317,
            "costAvailabilityPage": 0
        },
        "typeCodes": [
            "P"
        ],
        "bv": 119,
        "cost": 175000
    },
    "is_small_xpulse_laser": {
        "id": "is_small_xpulse_laser",
        "name": "Small X-Pulse Laser",
        "altNames": [
            "IS Small X-Pulse Laser",
            "ISSmallXPulseLaser",
            "SmallXPulseLaser"
        ],
        "category": "Energy",
        "techBase": "Inner Sphere",
        "rulesLevel": "Standard",
        "variant": "IS",
        "family": "pulseLaser",
        "damage": 3,
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
        "techRating": "E",
        "flags": [
            "directFire",
            "pulse"
        ],
        "source": {
            "weightSpacePage": 341,
            "battleValuePage": 317,
            "costAvailabilityPage": 0
        },
        "availability": {

            "starLeague": "X",

            "successionWars": "X",

            "clanInvasion": "E",

        },
        "typeCodes": [
            "P",
            "AI"
        ],
        "bv": 21,
        "cost": 31000
    },
    "is_medium_xpulse_laser": {
        "id": "is_medium_xpulse_laser",
        "name": "Medium X-Pulse Laser",
        "altNames": [
            "IS Medium X-Pulse Laser",
            "ISMediumXPulseLaser",
            "MediumXPulseLaser"
        ],
        "category": "Energy",
        "techBase": "Inner Sphere",
        "rulesLevel": "Standard",
        "variant": "IS",
        "family": "pulseLaser",
        "damage": 6,
        "heat": 6,
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
        "availability": {

            "starLeague": "X",

            "successionWars": "X",

            "clanInvasion": "E",

        },
        "flags": [
            "directFire",
            "pulse"
        ],
        "source": {
            "weightSpacePage": 341,
            "battleValuePage": 317,
            "costAvailabilityPage": 0
        },
        "typeCodes": [
            "P"
        ],
        "bv": 71,
        "cost": 110000
    },
    "is_large_xpulse_laser": {
        "id": "is_large_xpulse_laser",
        "name": "Large X-Pulse Laser",
        "altNames": [
            "IS Large X-Pulse Laser",
            "ISLargeXPulseLaser",
            "LargePulseLaser"
        ],
        "category": "Energy",
        "techBase": "Inner Sphere",
        "rulesLevel": "Standard",
        "variant": "IS",
        "family": "pulseLaser",
        "damage": 9,
        "heat": 14,
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
        "availability": {

            "starLeague": "X",

            "successionWars": "X",

            "clanInvasion": "E",

        },
        "flags": [
            "directFire",
            "pulse"
        ],
        "source": {
            "weightSpacePage": 341,
            "battleValuePage": 317,
            "costAvailabilityPage": 0
        },
        "typeCodes": [
            "P"
        ],
        "bv": 178,
        "cost": 275000
    },
    "is_small_vsp_laser": {     //VSP = Variable Speed Pulse - subvariant of pulse laser with different damage/heat values at range brackets
        "id": "is_small_vsp_laser",
        "name": "Small VSP Laser",
        "altNames": [
            "IS Small VSP Laser",
            "ISSmallVSPLaser",
            "SmallVSPLaser",
            "Small VSP",
            "SmallVSP"
        ],
        "category": "Energy",
        "techBase": "Inner Sphere",
        "rulesLevel": "Standard",
        "variant": "IS",
        "family": "pulseLaser",
        "damage": "5/4/3",
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
        "availability": {

            "starLeague": "X",

            "successionWars": "X",

            "clanInvasion": "E",

        },
        "flags": [
            "directFire",
            "pulse"
        ],
        "source": {
            "weightSpacePage": 341,
            "battleValuePage": 317,
            "costAvailabilityPage": 0
        },
        "typeCodes": [
            "P",
            "AI"
        ],
        "bv": 22,
        "cost": 60000
    },
    "is_medium_vsp_laser": {
        "id": "is_medium_vsp_laser",
        "name": "Medium VSP Laser",
        "altNames": [
            "IS Medium VSP Laser",
            "ISMediumVSPLaser",
            "MediumVSPLaser",
            "Medium VSP",
            "MediumVSP"
        ],
        "category": "Energy",
        "techBase": "Inner Sphere",
        "rulesLevel": "Standard",
        "variant": "IS",
        "family": "pulseLaser",
        "damage": "9/7/5",
        "heat": 4,
        "tons": 2,
        "critSlots": 1,
        "spaceSlots": 1,
        "range": {
            "min": 0,
            "short": 2,
            "medium": 5,
            "long": 9
        },
        "techRating": "E",
        "availability": {

            "starLeague": "X",

            "successionWars": "X",

            "clanInvasion": "E",

        },
        "flags": [
            "directFire",
            "pulse"
        ],
        "source": {
            "weightSpacePage": 341,
            "battleValuePage": 317,
            "costAvailabilityPage": 0
        },
        "typeCodes": [
            "P"
        ],
        "bv": 56,
        "cost": 200000
    },
    "is_large_vsp_pulse_laser": {
        "id": "is_large_vsp_pulse_laser",
        "name": "Large VSP Pulse Laser",
        "altNames": [
            "IS Large VSP Pulse Laser",
            "ISLargeVSPPulseLaser",
            "LargeVSPLaser",
            "Large VSP",
            "LargeVSP"
        ],
        "category": "Energy",
        "techBase": "Inner Sphere",
        "rulesLevel": "Standard",
        "variant": "IS",
        "family": "pulseLaser",
        "damage": "11/9/7",
        "heat": 10,
        "tons": 7,
        "critSlots": 2,
        "spaceSlots": 2,
        "range": {
            "min": 0,
            "short": 4,
            "medium": 8,
            "long": 15
        },
        "techRating": "E",
        "availability": {

            "starLeague": "X",

            "successionWars": "X",

            "clanInvasion": "E",

        },
        "flags": [
            "directFire",
            "pulse"
        ],
        "source": {
            "weightSpacePage": 341,
            "battleValuePage": 317,
            "costAvailabilityPage": 0
        },
        "typeCodes": [
            "P"
        ],
        "bv": 123,
        "cost": 465000
    },
    "is_small_re-engineered_laser": {
        "id": "is_small_re-engineered_laser",
        "name": "Small Re-Engineered Laser",
        "altNames": [
            "IS Small Re-Engineered Laser",
            "ISSmallReEngineeredLaser",
            "SmallReEngineeredLaser"
        ],
        "category": "Energy",
        "techBase": "Inner Sphere",
        "rulesLevel": "Standard",
        "variant": "IS",
        "family": "pulseLaser",
        "damage": 4,
        "heat": 4,
        "tons": 1.5,
        "critSlots": 1,
        "spaceSlots": 1,
        "range": {
            "min": 0,
            "short": 1,
            "medium": 2,
            "long": 3
        },
        "techRating": "E",
        "availability": {

            "starLeague": "X",

            "successionWars": "X",

            "clanInvasion": "E",

        },
        "flags": [
            "directFire",
            "pulse"
        ],
        "source": {
            "weightSpacePage": 341,
            "battleValuePage": 317,
            "costAvailabilityPage": 0
        },
        "typeCodes": [
            "P",
            "AI"
        ],
        "bv": 14,
        "cost": 25000
    },
    "is_medium_re-engineered_laser": {
        "id": "is_medium_re-engineered_laser",
        "name": "Medium Re-Engineered Laser",
        "altNames": [
            "IS Medium Re-Engineered Laser",
            "ISMediumReEngineeredLaser",
            "MediumReEngineeredLaser"
        ],
        "category": "Energy",
        "techBase": "Inner Sphere",
        "rulesLevel": "Standard",
        "variant": "IS",
        "family": "pulseLaser",
        "damage": 6,
        "heat": 6,
        "tons": 2.5,
        "critSlots": 2,
        "spaceSlots": 1,
        "range": {
            "min": 0,
            "short": 3,
            "medium": 6,
            "long": 9
        },
        "techRating": "E",
        "availability": {

            "starLeague": "X",

            "successionWars": "X",

            "clanInvasion": "E",

        },
        "flags": [
            "directFire",
            "pulse"
        ],
        "source": {
            "weightSpacePage": 341,
            "battleValuePage": 317,
            "costAvailabilityPage": 0
        },
        "typeCodes": [
            "P"
        ],
        "bv": 65,
        "cost": 100000
    },
    "is_large_re-engineered_laser": {
        "id": "is_large_re-engineered_laser",
        "name": "Large Re-Engineered Laser",
        "altNames": [
            "IS Large Re-Engineered Laser",
            "ISLargeReEngineeredLaser",
            "LargeReEngineeredLaser"
        ],
        "category": "Energy",
        "techBase": "Inner Sphere",
        "rulesLevel": "Standard",
        "variant": "IS",
        "family": "pulseLaser",
        "damage": 9,
        "heat": 9,
        "tons": 8,
        "critSlots": 5,
        "spaceSlots": 2,
        "range": {
            "min": 0,
            "short": 5,
            "medium": 10,
            "long": 15
        },
        "techRating": "E",
        "availability": {

            "starLeague": "X",

            "successionWars": "X",

            "clanInvasion": "E",

        },
        "flags": [
            "directFire",
            "pulse"
        ],
        "source": {
            "weightSpacePage": 341,
            "battleValuePage": 317,
            "costAvailabilityPage": 0
        },
        "typeCodes": [
            "P"
        ],
        "bv": 161,
        "cost": 250000
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
            "battleValuePage": 317,
            "costAvailabilityPage": 295
        },
        "typeCodes": [
            "DE",
            "H"
        ],
        "ammo": {
            "ammoId": "is_plasma_rifle_ammo"
        },
        "bv": 210,
        "cost": 260000,
        "notes": [
            "Ammo BV marked § in the BV table; ammunition is not counted as explosive."
        ],
        "availability": {

            "starLeague": "X",

            "successionWars": "X",

            "clanInvasion": "E",

        }
    },
    "is_light_ppc": {
        "id": "is_light_ppc",
        "name": "Light PPC",
        "altNames": [
            "IS Light PPC",
            "ISLightPPC",
            "LightPPC",
            "ISLPPC",
            "LPPC"
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
        "bv": 88,
        "cost": 150000
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
            "battleValuePage": 317,
            "costAvailabilityPage": 0
        },
        "typeCodes": [
            "DE"
        ],
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
        "bv": 317,
        "cost": 250000,
    },
    "is_er_ppc": {
        "id": "is_er_ppc",
        "name": "ER PPC",
        "altNames": [
            "IS ER PPC",
            "ISERPPC",
            "ERPPC",
            "ISEHERPPC",
            "ER Particle Projector Cannon"
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
            "battleValuePage": 317,
            "costAvailabilityPage": 0
        },
        "typeCodes": [
            "DE"
        ],
        "bv": 229,
        "cost": 300000
    },
    "is_snub_nose_ppc": {
        "id": "is_snub_nose_ppc",
        "name": "Snub-Nose PPC",
        "altNames": [
            "IS Snub-Nose PPC",
            "ISSnubNosePPC",
            "SnubNosePPC",
            "ISSNPPC",
            "SNPPC",
            "Snub Nose PPC",
            "Snub PPC"
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
            "battleValuePage": 317,
            "costAvailabilityPage": 0
        },
        "typeCodes": [
            "DE",
            "V"
        ],
        "bv": 165,
        "cost": 300000
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
            "battleValuePage": 317,
            "costAvailabilityPage": 295
        },
        "typeCodes": [
            "M",
            "C",
            "S"
        ],
        "ammo": {
            "ammoId": "is_lrm_5_ammo"
        },
        "cost": 30000,
        "bv": 45,
        "oneShotBV": 9,
        "notes": [
            "BV after slash in the rules table is the single-shot/one-shot launcher BV."
        ],
        "availability": {

            "starLeague": "C",

            "successionWars": "C",

            "clanInvasion": "C",

        }
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
            "battleValuePage": 317,
            "costAvailabilityPage": 295
        },
        "typeCodes": [
            "M",
            "C",
            "S"
        ],
        "ammo": {
            "ammoId": "is_lrm_10_ammo"
        },
        "cost": 100000,
        "bv": 90,
        "oneShotBV": 18,
        "notes": [
            "BV after slash in the rules table is the single-shot/one-shot launcher BV."
        ],
        "availability": {

            "starLeague": "C",

            "successionWars": "C",

            "clanInvasion": "C",

        }
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
            "battleValuePage": 317,
            "costAvailabilityPage": 295
        },
        "typeCodes": [
            "M",
            "C",
            "S"
        ],
        "ammo": {
            "ammoId": "is_lrm_15_ammo"
        },
        "cost": 175000,
        "bv": 136,
        "oneShotBV": 27,
        "notes": [
            "BV after slash in the rules table is the single-shot/one-shot launcher BV."
        ],
        "availability": {

            "starLeague": "C",

            "successionWars": "C",

            "clanInvasion": "C",

        }
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
            "battleValuePage": 317,
            "costAvailabilityPage": 295
        },
        "typeCodes": [
            "M",
            "C",
            "S"
        ],
        "ammo": {
            "ammoId": "is_lrm_20_ammo"
        },
        "cost": 250000,
        "bv": 181,
        "oneShotBV": 36,
        "notes": [
            "BV after slash in the rules table is the single-shot/one-shot launcher BV."
        ],
        "availability": {

            "starLeague": "C",

            "successionWars": "C",

            "clanInvasion": "C",

        }
    },
    "is_elrm_5": {
        "id": "is_elrm_5",
        "name": "Extended LRM 5",
        "altNames": [
            "IS ELRM 5",
            "ISELRM5",
            "ELRM-5",
            "ELRM5"
        ],
        "category": "Missile",
        "techBase": "Inner Sphere",
        "rulesLevel": "Advanced",
        "variant": "IS",
        "family": "lrm",
        "damage": "1/Msl",
        "heat": 3,
        "tons": 6,
        "critSlots": 1,
        "spaceSlots": 1,
        "range": {
            "min": 10,
            "short": 12,
            "medium": 22,
            "long": 38
        },
        "techRating": "E",
        "availability": {

            "starLeague": "X",

            "successionWars": "X",

            "clanInvasion": "F",

        },
        "flags": [
            "cluster",
            "requiresAmmo",
            "indirectFire",
            "minimumRange"
        ],
        "source": {
            "weightSpacePage": 341,
            "battleValuePage": 317,
            "costAvailabilityPage": 295
        },
        "typeCodes": [
            "M",
            "C",
            "S"
        ],
        "ammo": {
            "ammoId": "is_elrm_5_ammo"
        },
        "cost": 60000,
        "bv": 67,
        "oneShotBV": 9,
        "notes": [
            "BV after slash in the rules table is the single-shot/one-shot launcher BV."
        ],
    },
    "is_elrm_10": {
        "id": "is_elrm_10",
        "name": "Extended LRM 10",
        "altNames": [
            "IS ELRM 10",
            "ISELRM10",
            "ELRM-10",
            "ELRM10"
        ],
        "category": "Missile",
        "techBase": "Inner Sphere",
        "rulesLevel": "Advanced",
        "variant": "IS",
        "family": "lrm",
        "damage": "1/Msl",
        "heat": 6,
        "tons": 8,
        "critSlots": 4,
        "spaceSlots": 2,
        "range": {
            "min": 10,
            "short": 12,
            "medium": 22,
            "long": 38
        },
        "techRating": "E",
        "availability": {

            "starLeague": "X",

            "successionWars": "X",

            "clanInvasion": "F",

        },
        "flags": [
            "cluster",
            "requiresAmmo",
            "indirectFire",
            "minimumRange"
        ],
        "source": {
            "weightSpacePage": 341,
            "battleValuePage": 317,
            "costAvailabilityPage": 295
        },
        "typeCodes": [
            "M",
            "C",
            "S"
        ],
        "ammo": {
            "ammoId": "is_elrm_10_ammo"
        },
        "cost": 200000,
        "bv": 133,
        "oneShotBV": 18,
        "notes": [
            "BV after slash in the rules table is the single-shot/one-shot launcher BV."
        ]
    },
    "is_elrm_15": {
        "id": "is_elrm_15",
        "name": "Extended LRM 15",
        "altNames": [
            "IS ELRM 15",
            "ISELRM15",
            "ELRM-15",
            "ELRM15"
        ],
        "category": "Missile",
        "techBase": "Inner Sphere",
        "rulesLevel": "Advanced",
        "variant": "IS",
        "family": "lrm",
        "damage": "1/Msl",
        "heat": 8,
        "tons": 12,
        "critSlots": 6,
        "spaceSlots": 3,
        "range": {
            "min": 10,
            "short": 12,
            "medium": 22,
            "long": 38
        },
        "techRating": "E",
        "availability": {

            "starLeague": "X",

            "successionWars": "X",

            "clanInvasion": "F",

        },
        "flags": [
            "cluster",
            "requiresAmmo",
            "indirectFire",
            "minimumRange"
        ],
        "source": {
            "weightSpacePage": 341,
            "battleValuePage": 317,
            "costAvailabilityPage": 295
        },
        "typeCodes": [
            "M",
            "C",
            "S"
        ],
        "ammo": {
            "ammoId": "is_elrm_15_ammo"
        },
        "cost": 350000,
        "bv": 200,
        "oneShotBV": 27,
        "notes": [
            "BV after slash in the rules table is the single-shot/one-shot launcher BV."
        ]
    },
    "is_elrm_20": {
        "id": "is_elrm_20",
        "name": "Extended LRM 20",
        "altNames": [
            "IS ELRM 20",
            "ISELRM20",
            "ELRM-20",
            "ELRM20"
        ],
        "category": "Missile",
        "techBase": "Inner Sphere",
        "rulesLevel": "Advanced",
        "variant": "IS",
        "family": "lrm",
        "damage": "1/Msl",
        "heat": 12,
        "tons": 18,
        "critSlots": 8,
        "spaceSlots": 5,
        "range": {
            "min": 10,
            "short": 12,
            "medium": 22,
            "long": 38
        },
        "techRating": "E",
        "availability": {

            "starLeague": "X",

            "successionWars": "X",

            "clanInvasion": "F",

        },
        "flags": [
            "cluster",
            "requiresAmmo",
            "indirectFire",
            "minimumRange"
        ],
        "source": {
            "weightSpacePage": 341,
            "battleValuePage": 317,
            "costAvailabilityPage": 295
        },
        "typeCodes": [
            "M",
            "C",
            "S"
        ],
        "ammo": {
            "ammoId": "is_elrm_20_ammo"
        },
        "cost": 500000,
        "bv": 268,
        "oneShotBV": 36,
        "notes": [
            "BV after slash in the rules table is the single-shot/one-shot launcher BV."
        ]
    },
    "is_thunderbolt_5": {
        "id": "is_thunderbolt_5",
        "name": "Thunderbolt 5",
        "altNames": [
            "IS Thunderbolt 5",
            "ISThunderbolt5",
            "Thunderbolt-5",
            "Thunderbolt5",
            "TB-5",
            "TB5"
        ],
        "category": "Missile",
        "techBase": "Inner Sphere",
        "rulesLevel": "Advanced",
        "variant": "IS",
        "family": "lrm",
        "damage": 5,
        "heat": 3,
        "tons": 3,
        "critSlots": 1,
        "spaceSlots": 1,
        "range": {
            "min": 5,
            "short": 6,
            "medium": 12,
            "long": 18
        },
        "techRating": "E",
        "flags": [
            "requiresAmmo",
            "indirectFire",
            "minimumRange"
        ],
        "source": {
            "weightSpacePage": 341,
            "battleValuePage": 317,
            "costAvailabilityPage": 295
        },
        "typeCodes": [
            "M",
            "S"
        ],
        "ammo": {
            "ammoId": "is_thunderbolt_5_ammo"
        },
        "cost": 50000,
        "bv": 64,
        "availability": {

            "starLeague": "X",

            "successionWars": "X",

            "clanInvasion": "F",

        }
    },
    "is_thunderbolt_10": {
        "id": "is_thunderbolt_10",
        "name": "Thunderbolt 10",
        "altNames": [
            "IS Thunderbolt 10",
            "ISThunderbolt10",
            "Thunderbolt-10",
            "Thunderbolt10",
            "TB-10",
            "TB10"
        ],
        "category": "Missile",
        "techBase": "Inner Sphere",
        "rulesLevel": "Advanced",
        "variant": "IS",
        "family": "lrm",
        "damage": 10,
        "heat": 5,
        "tons": 7,
        "critSlots": 2,
        "spaceSlots": 2,
        "range": {
            "min": 5,
            "short": 6,
            "medium": 12,
            "long": 18
        },
        "techRating": "E",
        "flags": [
            "requiresAmmo",
            "indirectFire",
            "minimumRange"
        ],
        "source": {
            "weightSpacePage": 341,
            "battleValuePage": 317,
            "costAvailabilityPage": 295
        },
        "typeCodes": [
            "M",
            "S"
        ],
        "ammo": {
            "ammoId": "is_thunderbolt_10_ammo"
        },
        "cost": 175000,
        "bv": 127,
        "availability": {

            "starLeague": "X",

            "successionWars": "X",

            "clanInvasion": "F",

        }
    },
    "is_thunderbolt_15": {
        "id": "is_thunderbolt_15",
        "name": "Thunderbolt 15",
        "altNames": [
            "IS Thunderbolt 15",
            "ISThunderbolt15",
            "Thunderbolt-15",
            "Thunderbolt15",
            "TB-15",
            "TB15"
        ],
        "category": "Missile",
        "techBase": "Inner Sphere",
        "rulesLevel": "Advanced",
        "variant": "IS",
        "family": "lrm",
        "damage": 15,
        "heat": 7,
        "tons": 11,
        "critSlots": 3,
        "spaceSlots": 3,
        "range": {
            "min": 5,
            "short": 6,
            "medium": 12,
            "long": 18
        },
        "techRating": "E",
        "flags": [
            "requiresAmmo",
            "indirectFire",
            "minimumRange"
        ],
        "source": {
            "weightSpacePage": 341,
            "battleValuePage": 317,
            "costAvailabilityPage": 295
        },
        "typeCodes": [
            "M",
            "S"
        ],
        "ammo": {
            "ammoId": "is_thunderbolt_15_ammo"
        },
        "cost": 325000,
        "bv": 229,
        "availability": {

            "starLeague": "X",

            "successionWars": "X",

            "clanInvasion": "F",

        }
    },
    "is_thunderbolt_20": {
        "id": "is_thunderbolt_20",
        "name": "Thunderbolt 20",
        "altNames": [
            "IS Thunderbolt 20",
            "ISThunderbolt20",
            "Thunderbolt-20",
            "Thunderbolt20",
            "TB-20",
            "TB20"
        ],
        "category": "Missile",
        "techBase": "Inner Sphere",
        "rulesLevel": "Advanced",
        "variant": "IS",
        "family": "lrm",
        "damage": 20,
        "heat": 8,
        "tons": 15,
        "critSlots": 5,
        "spaceSlots": 5,
        "range": {
            "min": 5,
            "short": 6,
            "medium": 12,
            "long": 18
        },
        "techRating": "E",
        "flags": [
            "requiresAmmo",
            "indirectFire",
            "minimumRange"
        ],
        "source": {
            "weightSpacePage": 341,
            "battleValuePage": 317,
            "costAvailabilityPage": 295
        },
        "typeCodes": [
            "M",
            "S"
        ],
        "ammo": {
            "ammoId": "is_thunderbolt_20_ammo"
        },
        "cost": 450000,
        "bv": 306,
        "availability": {

            "starLeague": "X",

            "successionWars": "X",

            "clanInvasion": "F",

        }
    },
    "is_mml_3": {
        "id": "is_mml_3",
        "name": "MML 3",
        "altNames": [
            "IS MML 3 (LRM)",
            "ISMML3(LRM)",
            "MML3(LRM)",
            "IS MML 3",
            "ISMML3",
            "MML3",
            "MML 3",
            "MML 3 (LRM)",
            "IS MML 3 (SRM)",
            "ISMML3(SRM)",
            "MML3(SRM)",
            "MML 3 (SRM)"
        ],
        "category": "Missile",
        "techBase": "Inner Sphere",
        "rulesLevel": "Standard",
        "variant": "IS",
        "family": "mml",
        "damage": "1/Msl or 2/Msl",
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
"bv": 29,
        "cost": 45000,
        "ammoOptions": [
            {
                "mode": "LRM",
                "ammoId": "is_mml_3_lrm_ammo"
            },
            {
                "mode": "SRM",
                "ammoId": "is_mml_3_srm_ammo"
            }
        ],
        "notes": [
            "MML launchers are stored as one launcher entry; ammunition mode (LRM or SRM) is selected by ammo type, not by separate launcher definitions."
        ]
    },
    "is_mml_5": {
        "id": "is_mml_5",
        "name": "MML 5",
        "altNames": [
            "IS MML 5 (LRM)",
            "ISMML5(LRM)",
            "MML5(LRM)",
            "IS MML 5",
            "ISMML5",
            "MML5",
            "MML 5",
            "MML 5 (LRM)",
            "IS MML 5 (SRM)",
            "ISMML5(SRM)",
            "MML5(SRM)",
            "MML 5 (SRM)"
        ],
        "category": "Missile",
        "techBase": "Inner Sphere",
        "rulesLevel": "Standard",
        "variant": "IS",
        "family": "mml",
        "damage": "1/Msl or 2/Msl",
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
"bv": 45,
        "cost": 75000,
        "ammoOptions": [
            {
                "mode": "LRM",
                "ammoId": "is_mml_5_lrm_ammo"
            },
            {
                "mode": "SRM",
                "ammoId": "is_mml_5_srm_ammo"
            }
        ],
        "notes": [
            "MML launchers are stored as one launcher entry; ammunition mode (LRM or SRM) is selected by ammo type, not by separate launcher definitions."
        ]
    },
    "is_mml_7": {
        "id": "is_mml_7",
        "name": "MML 7",
        "altNames": [
            "IS MML 7 (LRM)",
            "ISMML7(LRM)",
            "MML7(LRM)",
            "IS MML 7",
            "ISMML7",
            "MML7",
            "MML 7",
            "MML 7 (LRM)",
            "IS MML 7 (SRM)",
            "ISMML7(SRM)",
            "MML7(SRM)",
            "MML 7 (SRM)"
        ],
        "category": "Missile",
        "techBase": "Inner Sphere",
        "rulesLevel": "Standard",
        "variant": "IS",
        "family": "mml",
        "damage": "1/Msl or 2/Msl",
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
"bv": 67,
        "cost": 105000,
        "ammoOptions": [
            {
                "mode": "LRM",
                "ammoId": "is_mml_7_lrm_ammo"
            },
            {
                "mode": "SRM",
                "ammoId": "is_mml_7_srm_ammo"
            }
        ],
        "notes": [
            "MML launchers are stored as one launcher entry; ammunition mode (LRM or SRM) is selected by ammo type, not by separate launcher definitions."
        ]
    },
    "is_mml_9": {
        "id": "is_mml_9",
        "name": "MML 9",
        "altNames": [
            "IS MML 9 (LRM)",
            "ISMML9(LRM)",
            "MML9(LRM)",
            "IS MML 9",
            "ISMML9",
            "MML9",
            "MML 9",
            "MML 9 (LRM)",
            "IS MML 9 (SRM)",
            "ISMML9(SRM)",
            "MML9(SRM)",
            "MML 9 (SRM)"
        ],
        "category": "Missile",
        "techBase": "Inner Sphere",
        "rulesLevel": "Standard",
        "variant": "IS",
        "family": "mml",
        "damage": "1/Msl or 2/Msl",
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
"bv": 86,
        "cost": 125000,
        "ammoOptions": [
            {
                "mode": "LRM",
                "ammoId": "is_mml_9_lrm_ammo"
            },
            {
                "mode": "SRM",
                "ammoId": "is_mml_9_srm_ammo"
            }
        ],
        "notes": [
            "MML launchers are stored as one launcher entry; ammunition mode (LRM or SRM) is selected by ammo type, not by separate launcher definitions."
        ]
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
            "battleValuePage": 317,
            "costAvailabilityPage": 295
        },
        "typeCodes": [
            "M",
            "C",
            "S"
        ],
        "ammo": {
            "ammoId": "is_srm_2_ammo"
        },
        "cost": 10000,
        "bv": 21,
        "oneShotBV": 4,
        "notes": [
            "BV after slash in the rules table is the single-shot/one-shot launcher BV."
        ],
        "availability": {

            "starLeague": "B",

            "successionWars": "B",

            "clanInvasion": "B",

        }
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
            "battleValuePage": 317,
            "costAvailabilityPage": 295
        },
        "typeCodes": [
            "M",
            "C",
            "S"
        ],
        "ammo": {
            "ammoId": "is_srm_4_ammo"
        },
        "cost": 60000,
        "bv": 39,
        "oneShotBV": 8,
        "notes": [
            "BV after slash in the rules table is the single-shot/one-shot launcher BV."
        ],
        "availability": {

            "starLeague": "B",

            "successionWars": "B",

            "clanInvasion": "B",

        }
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
            "battleValuePage": 317,
            "costAvailabilityPage": 295
        },
        "typeCodes": [
            "M",
            "C",
            "S"
        ],
        "ammo": {
            "ammoId": "is_srm_6_ammo"
        },
        "cost": 80000,
        "bv": 59,
        "oneShotBV": 12,
        "notes": [
            "BV after slash in the rules table is the single-shot/one-shot launcher BV."
        ],
        "availability": {

            "starLeague": "B",

            "successionWars": "B",

            "clanInvasion": "B",

        }
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
            "battleValuePage": 317,
            "costAvailabilityPage": 295
        },
        "typeCodes": [
            "M",
            "C"
        ],
        "ammo": {
            "ammoId": "is_mrm_10_ammo"
        },
        "bv": 56,
        "cost": 50000,
        "oneShotBV": 11,
        "notes": [
            "BV after slash in the rules table is the single-shot/one-shot launcher BV."
        ],
        "availability": {

            "starLeague": "X",

            "successionWars": "X",

            "clanInvasion": "E",

        }
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
            "battleValuePage": 317,
            "costAvailabilityPage": 295
        },
        "typeCodes": [
            "M",
            "C"
        ],
        "ammo": {
            "ammoId": "is_mrm_20_ammo"
        },
        "bv": 112,
        "cost": 125000,
        "oneShotBV": 22,
        "notes": [
            "BV after slash in the rules table is the single-shot/one-shot launcher BV."
        ],
        "availability": {

            "starLeague": "X",

            "successionWars": "X",

            "clanInvasion": "E",

        }
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
            "battleValuePage": 317,
            "costAvailabilityPage": 295
        },
        "typeCodes": [
            "M",
            "C"
        ],
        "ammo": {
            "ammoId": "is_mrm_30_ammo"
        },
        "bv": 168,
        "cost": 225000,
        "oneShotBV": 34,
        "notes": [
            "BV after slash in the rules table is the single-shot/one-shot launcher BV."
        ],
        "availability": {

            "starLeague": "X",

            "successionWars": "X",

            "clanInvasion": "E",

        }
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
            "battleValuePage": 317,
            "costAvailabilityPage": 295
        },
        "typeCodes": [
            "M",
            "C"
        ],
        "ammo": {
            "ammoId": "is_mrm_40_ammo"
        },
        "bv": 224,
        "cost": 350000,
        "oneShotBV": 45,
        "notes": [
            "BV after slash in the rules table is the single-shot/one-shot launcher BV."
        ],
        "availability": {

            "starLeague": "X",

            "successionWars": "X",

            "clanInvasion": "E",

        }
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
            "battleValuePage": 317,
            "costAvailabilityPage": 295
        },
        "typeCodes": [
            "M",
            "C",
            "OS"
        ],
        "ammo": {
            "ammoId": "is_rocket_launcher_10_ammo"
        },
        "bv": 18,
        "cost": 15000,
        "availability": {

            "starLeague": "X",

            "successionWars": "X",

            "clanInvasion": "B",

        }
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
            "battleValuePage": 317,
            "costAvailabilityPage": 295
        },
        "typeCodes": [
            "M",
            "C",
            "OS"
        ],
        "ammo": {
            "ammoId": "is_rocket_launcher_15_ammo"
        },
        "bv": 23,
        "cost": 30000,
        "availability": {

            "starLeague": "X",

            "successionWars": "X",

            "clanInvasion": "B",

        }
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
            "battleValuePage": 317,
            "costAvailabilityPage": 295
        },
        "typeCodes": [
            "M",
            "C",
            "OS"
        ],
        "ammo": {
            "ammoId": "is_rocket_launcher_20_ammo"
        },
        "bv": 24,
        "cost": 45000,
        "availability": {

            "starLeague": "X",

            "successionWars": "X",

            "clanInvasion": "B",

        }
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
            "battleValuePage": 317,
            "costAvailabilityPage": 295
        },
        "typeCodes": [
            "M",
            "C"
        ],
        "ammo": {
            "ammoId": "is_streak_srm_2_ammo"
        },
        "bv": 30,
        "cost": 15000,
        "oneShotBV": 6,
        "notes": [
            "BV after slash in the rules table is the single-shot/one-shot launcher BV."
        ],
        "availability": {

            "starLeague": "E",

            "successionWars": "F",

            "clanInvasion": "D",

        }
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
            "battleValuePage": 317,
            "costAvailabilityPage": 295
        },
        "typeCodes": [
            "M",
            "C"
        ],
        "ammo": {
            "ammoId": "is_streak_srm_4_ammo"
        },
        "bv": 59,
        "cost": 90000,
        "oneShotBV": 12,
        "notes": [
            "BV after slash in the rules table is the single-shot/one-shot launcher BV."
        ],
        "availability": {

            "starLeague": "X",

            "successionWars": "X",

            "clanInvasion": "E",

        }
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
            "battleValuePage": 317,
            "costAvailabilityPage": 295
        },
        "typeCodes": [
            "M",
            "C"
        ],
        "ammo": {
            "ammoId": "is_streak_srm_6_ammo"
        },
        "bv": 89,
        "cost": 120000,
        "oneShotBV": 18,
        "notes": [
            "BV after slash in the rules table is the single-shot/one-shot launcher BV."
        ],
        "availability": {

            "starLeague": "X",

            "successionWars": "X",

            "clanInvasion": "E",

        }
    },
    "is_narc_missile_beacon": {
        "id": "is_narc_missile_beacon",
        "name": "Narc Missile Beacon",
        "altNames": [
            "IS Narc Missile Beacon",
            "ISNarcMissileBeacon",
            "NarcMissileBeacon",
            "Narc",
            "Narc Beacon",
            "Narc Missile Beacon"
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
            "ammoId": "is_narc_missile_beacon_ammo"
        },
        "bv": 30,
        "cost": 100000,
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
            "ImprovedNarcLauncher",
            "iNarc",
            "Improved Narc",
            "Improved Narc Launcher",
            "ISiNarc"
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
        "ammo": {
            "ammoId": "is_improved_narc_launcher_ammo"
        },
        "bv": 75,
        "cost": 250000,
        "oneShotBV": 15,
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
            "APod",
            "Anti-Personnel Pods (A-Pods)",
            "Anti-Personnel Pod",
            "A-Pod",
            "A-Pods"
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
            "ammoId": "is_a_pod_ammo"
        },
        "bv": 1,
        "cost": 1500,
    },
    "is_b_pod": {
        "id": "is_b_pod",
        "name": "B-Pod",
        "altNames": [
            "IS B-Pod",
            "ISBPod",
            "BPod",
            "Anti-BattleArmor Pods (B-Pods)",
            "Anti-Battle Armor Pods (B-Pods)",
            "Anti-BattleArmor Pod",
            "B-Pod",
            "B-Pods"
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
            "ammoId": "is_b_pod_ammo"
        },
        "bv": 2,
        "cost": 2500,
    },
    "is_anti_missile_system": {
        "id": "is_anti_missile_system",
        "name": "Anti-Missile System",
        "altNames": [
            "IS Anti-Missile System",
            "ISAntiMissileSystem",
            "AntiMissileSystem",
            "AMS"
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
            "battleValuePage": 317,
            "costAvailabilityPage": 295
        },
        "ammo": {
            "ammoId": "is_anti_missile_system_ammo"
        },
        "bv": 32,
        "cost": 100000,
        "availability": {

            "starLeague": "E",

            "successionWars": "F",

            "clanInvasion": "D",

        }
    },
    "is_laser_ams": {
        "id": "is_laser_ams",
        "name": "Laser AMS",
        "altNames": [
            "IS Laser AMS",
            "ISLaserAMS",
            "Laser Anti-Missile System",
            "IS Laser Anti-Missile System",
            "ISLaserAntiMissileSystem",
            "Laser Anti Missile System",
            "IS Laser Anti Missile System"
        ],
        "category": "Equipment",
        "techBase": "Inner Sphere",
        "rulesLevel": "Advanced",
        "variant": "IS",
        "family": "antiMissileSystem",
        "damage": "special",
        "heat": 7,
        "tons": 1.5,
        "critSlots": 2,
        "spaceSlots": 2,
        "range": {
            "min": 0,
            "short": 0,
            "medium": 0,
            "long": 0
        },
        "techRating": "E",
        "flags": [
            "defensive",
            "antiMissile",
            "laserAMS",
            "noAmmo"
        ],
        "source": {
            "weightSpacePage": 0,
            "battleValuePage": 0,
            "costAvailabilityPage": 0
        },
        "cost": 225000,
        "bv": 45,
        "notes": [
            "Laser AMS has defensive BV and does not require ammunition.",
            "Rules level progressed over time; treated as Advanced for catalog support."
        ]
    },
    "is_machine_gun_array": {
        "id": "is_machine_gun_array",
        "name": "Machine Gun Array",
        "altNames": [
            "IS Machine Gun Array",
            "ISMachineGunArray",
            "MachineGunArray",
            "Machine Gun Array",
            "Light Machine Gun Array",
            "Heavy Machine Gun Array",
            "MG Array"
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
        "bv": "F",
        "cost": 1250
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
        "bv": "A",
        "cost": 50000,
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
        "bv": 10,
        "cost": 200000,
        "availability": {

            "starLeague": "E",

            "successionWars": "F",

            "clanInvasion": "D",

        }
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
        "bv": "C",
        "cost": 50000,
    },
    "is_case_ii": {
        "id": "is_case_ii",
        "name": "CASE II",
        "altNames": [
            "IS CASE II",
            "ISCASEII",
            "CASEII"
        ],
        "category": "Equipment",
        "techBase": "Inner Sphere",
        "rulesLevel": "Experimental",
        "variant": "IS",
        "family": "case",
        "damage": "special",
        "heat": 0,
        "tons": 1,
        "critSlots": 1,
        "spaceSlots": 1,
        "techRating": "E",
        "flags": [
            "ammoProtection"
        ],
        "source": {
            "weightSpacePage": 342,
            "battleValuePage": 317
        },
        "bv": "C",
        "cost": 175000,
        "availability": {

            "starLeague": "X",

            "successionWars": "X",

            "clanInvasion": "F",

        }
    },
    "is_c3_computer_master": {
        "id": "is_c3_computer_master",
        "name": "C3 Computer (Master)",
        "altNames": [
            "IS C3 Computer (Master)",
            "ISC3Computer(Master)",
            "C3Computer(Master)",
            "C3 Master",
            "C3 Computer (Master)",
            "C3 Master Computer",
            "C3 Master with TAG",
            "C3ComputerMaster",
            "C3 Computer Master",
            "C3MasterBoostedWithTAG",
            "c3 master boosted with tag",
            "c3boostedsystemmaster",
            "c3 boosted system master",
            "c3computermaster"
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
        "bv": "D",
        "cost": 1500000,
    },
    "is_c3_computer_slave": {
        "id": "is_c3_computer_slave",
        "name": "C3 Computer (Slave)",
        "altNames": [
            "IS C3 Computer (Slave)",
            "ISC3Computer(Slave)",
            "C3Computer(Slave)",
            "ISC3SlaveUnit",
            "C3 Slave",
            "C3 Computer (Slave)",
            "C3 Slave Unit"
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
        "bv": "D",
        "cost": 250000,
    },
    "is_improved_c3_computer": {
        "id": "is_improved_c3_computer",
        "name": "Improved C3 Computer",
        "altNames": [
            "IS Improved C3 Computer",
            "ISImprovedC3Computer",
            "ImprovedC3Computer",
            "ISImprovedC3CPU",
            "Improved C3 CPU",
            "Improved C3 Computer",
            "Improved C3 Computer (C3I)",
            "improvedc3computerc3i",
            "improved c3 computer c3i",
            "ISC3iUnit"
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
        "bv": "D",
        "cost": 750000,
    },
    "is_guardian_ecm_suite": {
        "id": "is_guardian_ecm_suite",
        "name": "Guardian ECM Suite",
        "altNames": [
            "IS Guardian ECM Suite",
            "ISGuardianECMSuite",
            "GuardianECMSuite",
            "ISGuardianECM"
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
        "bv": 61,
        "cost": 200000
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
    "is_enhanced_lrm_5": {
        "id": "is_enhanced_lrm_5",
        "name": "Enhanced LRM 5",
        "altNames": [
                "IS Enhanced LRM 5",
                "ISEnhancedLRM5",
                "EnhancedLRM5",
                "Enhanced-LRM-5",
                "NLRM 5",
                "NLRM-5",
                "NLRM5",
                "ISNLRM5"
        ],
        "category": "Missile",
        "techBase": "Inner Sphere",
        "rulesLevel": "Advanced",
        "variant": "IS",
        "family": "enhancedLrm",
        "damage": "1/Msl",
        "rackSize": 5,
        "heat": 2,
        "tons": 3,
        "critSlots": 2,
        "spaceSlots": 1,
        "range": {
                "min": 3,
                "short": 7,
                "medium": 14,
                "long": 21,
                "extreme": 28
        },
        "techRating": "E",
        "flags": [
                "cluster",
                "requiresAmmo",
                "minimumRange",
                "indirectFire"
        ],
        "source": {
                "battleValuePage": 0,
                "weightSpacePage": 0
        },
        "typeCodes": [
                "M",
                "C",
                "S"
        ],
        "ammo": {
            "ammoId": "is_enhanced_lrm_5_ammo"
        },
        "bv": 52,
        "cost": 60000,
        "availability": {

            "starLeague": "X",

            "successionWars": "X",

            "clanInvasion": "E",

        },
        "notes": [
                "Enhanced LRM/NLRM launcher family. Added for MTF matching; verify cost before making cost required.",
                "Enhanced LRM costs were unavailable in the source consulted; ammo cost is temporarily aligned to standard LRM ammo until verified."
        ]
},
    "is_enhanced_lrm_10": {
        "id": "is_enhanced_lrm_10",
        "name": "Enhanced LRM 10",
        "altNames": [
                "IS Enhanced LRM 10",
                "ISEnhancedLRM10",
                "EnhancedLRM10",
                "Enhanced-LRM-10",
                "NLRM 10",
                "NLRM-10",
                "NLRM10",
                "ISNLRM10"
        ],
        "category": "Missile",
        "techBase": "Inner Sphere",
        "rulesLevel": "Advanced",
        "variant": "IS",
        "family": "enhancedLrm",
        "damage": "1/Msl",
        "rackSize": 10,
        "heat": 4,
        "tons": 6,
        "critSlots": 4,
        "spaceSlots": 1,
        "range": {
                "min": 3,
                "short": 7,
                "medium": 14,
                "long": 21,
                "extreme": 28
        },
        "techRating": "E",
        "flags": [
                "cluster",
                "requiresAmmo",
                "minimumRange",
                "indirectFire"
        ],
        "source": {
                "battleValuePage": 0,
                "weightSpacePage": 0
        },
        "typeCodes": [
                "M",
                "C",
                "S"
        ],
        "ammo": {
            "ammoId": "is_enhanced_lrm_10_ammo"
        },
        "bv": 104,
        "cost": 200000,
        "availability": {

            "starLeague": "X",

            "successionWars": "X",

            "clanInvasion": "E",

        },
        "notes": [
                "Enhanced LRM/NLRM launcher family. Added for MTF matching; verify cost before making cost required.",
                "Enhanced LRM costs were unavailable in the source consulted; ammo cost is temporarily aligned to standard LRM ammo until verified."
        ]
},
    "is_enhanced_lrm_15": {
        "id": "is_enhanced_lrm_15",
        "name": "Enhanced LRM 15",
        "altNames": [
                "IS Enhanced LRM 15",
                "ISEnhancedLRM15",
                "EnhancedLRM15",
                "Enhanced-LRM-15",
                "NLRM 15",
                "NLRM-15",
                "NLRM15",
                "ISNLRM15"
        ],
        "category": "Missile",
        "techBase": "Inner Sphere",
        "rulesLevel": "Advanced",
        "variant": "IS",
        "family": "enhancedLrm",
        "damage": "1/Msl",
        "rackSize": 15,
        "heat": 5,
        "tons": 9,
        "critSlots": 6,
        "spaceSlots": 1,
        "range": {
                "min": 3,
                "short": 7,
                "medium": 14,
                "long": 21,
                "extreme": 28
        },
        "techRating": "E",
        "flags": [
                "cluster",
                "requiresAmmo",
                "minimumRange",
                "indirectFire"
        ],
        "source": {
                "battleValuePage": 0,
                "weightSpacePage": 0
        },
        "typeCodes": [
                "M",
                "C",
                "S"
        ],
        "ammo": {
            "ammoId": "is_enhanced_lrm_15_ammo"
        },
        "bv": 157,
        "cost": 350000,
        "availability": {

            "starLeague": "X",

            "successionWars": "X",

            "clanInvasion": "E",

        },
        "notes": [
                "Enhanced LRM/NLRM launcher family. Added for MTF matching; verify cost before making cost required.",
                "Enhanced LRM costs were unavailable in the source consulted; ammo cost is temporarily aligned to standard LRM ammo until verified."
        ]
},
    "is_enhanced_lrm_20": {
        "id": "is_enhanced_lrm_20",
        "name": "Enhanced LRM 20",
        "altNames": [
                "IS Enhanced LRM 20",
                "ISEnhancedLRM20",
                "EnhancedLRM20",
                "Enhanced-LRM-20",
                "NLRM 20",
                "NLRM-20",
                "NLRM20",
                "ISNLRM20"
        ],
        "category": "Missile",
        "techBase": "Inner Sphere",
        "rulesLevel": "Advanced",
        "variant": "IS",
        "family": "enhancedLrm",
        "damage": "1/Msl",
        "rackSize": 20,
        "heat": 6,
        "tons": 12,
        "critSlots": 9,
        "spaceSlots": 1,
        "range": {
                "min": 3,
                "short": 7,
                "medium": 14,
                "long": 21,
                "extreme": 28
        },
        "techRating": "E",
        "flags": [
                "cluster",
                "requiresAmmo",
                "minimumRange",
                "indirectFire"
        ],
        "source": {
                "battleValuePage": 0,
                "weightSpacePage": 0
        },
        "typeCodes": [
                "M",
                "C",
                "S"
        ],
        "ammo": {
            "ammoId": "is_enhanced_lrm_20_ammo"
        },
        "bv": 210,
        "availability": {

            "starLeague": "X",

            "successionWars": "X",

            "clanInvasion": "E",

        },
        "notes": [
                "Enhanced LRM/NLRM launcher family. Added for MTF matching; verify cost before making cost required.",
                "Enhanced LRM costs were unavailable in the source consulted; ammo cost is temporarily aligned to standard LRM ammo until verified."
        ]
},
    "is_arrow_iv": {
        "id": "is_arrow_iv",
        "name": "Arrow IV",
        "altNames": [
                "IS Arrow IV",
                "ISArrowIV",
                "ArrowIV",
                "Arrow-IV",
                "isarrowivsystem",
                "is arrow iv system"
        ],
        "category": "Missile",
        "techBase": "Inner Sphere",
        "rulesLevel": "Advanced",
        "variant": "IS",
        "family": "Artillery",
        "damage": "20/10",
        "heat": 10,
        "tons": 15,
        "critSlots": 15,
        "spaceSlots": 1,
        "techRating": "E",
        "flags": [
                "artillery",
                "requiresAmmo",
                "indirectFire"
        ],
        "source": {
                "battleValuePage": 0,
                "weightSpacePage": 0
        },
        "typeCodes": [
                "M",
                "C",
                "S"
        ],
        "ammo": {
            "ammoId": "is_arrow_iv_ammo"
        },
        "bv": 240,
        "cost": 450000,
        "availability": {

            "starLeague": "E",

            "successionWars": "F",

            "clanInvasion": "E",

        }
},
    "tsemp_cannon": {
        "id": "tsemp_cannon",
        "name": "TSEMP Cannon",
        "altNames": [
                "TSEMP Cannon",
                "TSEMPCannon",
                "TSEMP"
        ],
        "category": "Energy",
        "techBase": "Inner Sphere",
        "rulesLevel": "Advanced",
        "variant": "IS",
        "damage": 0,
        "heat": 10,
        "tons": 6,
        "critSlots": 5,
        "spaceSlots": 1,
        "range": {
                "min": 0,
                "short": 5,
                "medium": 9,
                "long": 15
        },
        "techRating": "X",
        "flags": [
                "directFire"
        ],
        "source": {
                "battleValuePage": 0,
                "weightSpacePage": 0
        },
        "typeCodes": [
                "L"
        ],
        "bv": 488,
        "cost": 800000,
        "availability": {

            "starLeague": "X",

            "successionWars": "X",

            "clanInvasion": "X",

        }
},
    "is_full_head_ejection_system": {
        "id": "is_full_head_ejection_system",
        "name": "Full Head Ejection System",
        "altNames": [
            "Inner Sphere Full Head Ejection System",
            "ISFullHeadEjectionSystem",
            "FullHeadEjectionSystem"
        ],
        "category": "Equipment",
        "techBase": "Inner Sphere",
        "rulesLevel": "Standard",
        "variant": "IS",
        "family": "Ejection",
        "damage": 0,
        "heat": 0,
        "tons": 0,
        "critSlots": 0,
        "spaceSlots": 0,
        "range": {
            "min": 0,
            "short": 0,
            "medium": 0,
            "long": 0
        },
        "techRating": "D",
        "flags": [
            "ejection"
        ],
        "source": {
            "weightSpacePage": 342,
            "battleValuePage": 317
        },
        "bv": "G",
        "cost": 1725000,
        "availability": {

            "starLeague": "X",

            "successionWars": "X",

            "clanInvasion": "E",

        }
    },
    "is_sniper_artillery": {
        "id": "is_sniper_artillery",
        "name": "Sniper",
        "altNames": [
            "ISSniper",
            "Sniper",
            "Sniper Artillery"
        ],
        "category": "Artillery",
        "techBase": "Inner Sphere",
        "rulesLevel": "Advanced",
        "damage": "20A",
        "heat": 10,
        "tons": 20,
        "critSlots": 20,
"range": { "min": 0, "short": 0, "medium": 0, "long": 0 },
        "techRating": "B",
        "flags": [],
        "source": {
            "weightSpacePage": 0,
            "battleValuePage": 0,
            "costAvailabilityPage": 0
        },
        "typeCodes": ["AE", "S", "F"],
        "ammo": {
            "ammoId": "is_sniper_artillery_ammo"
        },
        "bv": 0,
        "cost": 300000,
        "availability": {
            "starLeague": "C",
            "successionWars": "C",
            "clanInvasion": "C"

        }
    },
    "is_sniper_cannon": {
        "id": "is_sniper_cannon",
        "name": "Sniper Cannon",
        "altNames": [
            "ISSniperCannon",
            "Sniper Cannon",
            "Sniper Artillery Cannon"
        ],
        "category": "Ballistic",
        "techBase": "Inner Sphere",
        "rulesLevel": "Experimental",
        "damage": "10A",
        "heat": 10,
        "tons": 15,
        "critSlots": 10,
"range": { "min": 0, "short": 0, "medium": 0, "long": 0 },
        "techRating": "B",
        "flags": ["directFire"],
        "source": {
            "weightSpacePage": 0,
            "battleValuePage": 0,
            "costAvailabilityPage": 0
        },
        "typeCodes": ["DB", "AE", "F"],
        "ammo": {
            "ammoId": "is_sniper_cannon_ammo"
        },
        "bv": 0,
        "cost": 475000,
        "availability": {
            "starLeague": "X",
            "successionWars": "F",
            "clanInvasion": "E"

        }
    },
    "is_long_tom_cannon": {
        "id": "is_long_tom_cannon",
        "name": "Long Tom Cannon",
        "altNames": [
            "ISLongTomCannon",
            "ISLongTomCannon (OMNIPOD)",
            "Long Tom Cannon",
            "Long Tom Artillery Cannon"
        ],
        "category": "Ballistic",
        "techBase": "Inner Sphere",
        "rulesLevel": "Experimental",
        "damage": "20A",
        "heat": 20,
        "tons": 20,
        "critSlots": 15,
"range": { "min": 0, "short": 0, "medium": 0, "long": 0 },
        "techRating": "B",
        "flags": ["directFire"],
        "source": {
            "weightSpacePage": 0,
            "battleValuePage": 0,
            "costAvailabilityPage": 0
        },
        "typeCodes": ["DB", "AE", "F"],
        "ammo": {
            "ammoId": "is_long_tom_cannon_ammo"
        },
        "bv": 0,
        "cost": 650000,
        "availability": {
            "starLeague": "X",
            "successionWars": "F",
            "clanInvasion": "E"

        }
    },
    "is_thumper_cannon": {
        "id": "is_thumper_cannon",
        "name": "Thumper Cannon",
        "altNames": [
            "ISThumperCannon",
            "Thumper Cannon",
            "Thumper Artillery Cannon"
        ],
        "category": "Ballistic",
        "techBase": "Inner Sphere",
        "rulesLevel": "Experimental",
        "damage": "5A",
        "heat": 5,
        "tons": 10,
        "critSlots": 7,
"range": { "min": 0, "short": 0, "medium": 0, "long": 0 },
        "techRating": "B",
        "flags": ["directFire"],
        "source": {
            "weightSpacePage": 0,
            "battleValuePage": 0,
            "costAvailabilityPage": 0
        },
        "typeCodes": ["DB", "AE", "F"],
        "ammo": {
            "ammoId": "is_thumper_cannon_ammo"
        },
        "bv": 0,
        "cost": 200000,
        "availability": {
            "starLeague": "X",
            "successionWars": "F",
            "clanInvasion": "E"

        }
    },
    "hatchet": {
        "id": "hatchet",
        "name": "Hatchet",
        "altNames": [
            "Hatchet",
            "ISHatchet",
            "CLHatchet"
        ],
        "category": "Equipment",
        "techBase": "Inner Sphere",
        "rulesLevel": "Advanced",
        "variant": "IS",
        "family": "physicalWeapon",
        "damage": "physical",
        "heat": 0,
        "tons": "\"unitTonnage/15\"",
        "critSlots": "\"unitTonnage/15\"",
        "spaceSlots": "\"unitTonnage/15\"",
        "techRating": "C",
        "flags": [
            "physicalWeapon"
        ],
        "source": {
            "weightSpacePage": 0,
            "battleValuePage": 0,
            "costAvailabilityPage": 0
        },
        "typeCodes": [
            "ME"
        ],
        "bv": "Damage x 1.5",
        "cost": {"type": "equipmentTonnage", "multiplier": 5000},
        "availability": {
            "starLeague": "X",
            "successionWars": "F",
            "clanInvasion": "D"
        },
        "notes": [
            "BattleMech melee weapon; BV is damage-based rather than a flat item BV."
        ]
    },
    "sword": {
        "id": "sword",
        "name": "Sword",
        "altNames": [
            "Sword",
            "ISSword",
            "CLSword"
        ],
        "category": "Equipment",
        "techBase": "Inner Sphere",
        "rulesLevel": "Advanced",
        "variant": "IS",
        "family": "physicalWeapon",
        "damage": "physical",
        "heat": 0,
        "tons": "\"unitTonnage/20\"",
        "critSlots": "\"unitTonnage/20\"",
        "spaceSlots": "\"unitTonnage/20\"",
        "techRating": "D",
        "flags": [
            "physicalWeapon"
        ],
        "source": {
            "weightSpacePage": 0,
            "battleValuePage": 0,
            "costAvailabilityPage": 0
        },
        "typeCodes": [
            "ME"
        ],
        "bv": "Damage x 1.725",
        "cost": {"type": "equipmentTonnage", "multiplier": 10000},
        "availability": {
            "starLeague": "X",
            "successionWars": "X",
            "clanInvasion": "D"
        },
        "notes": [
            "BattleMech melee weapon; BV is damage-based rather than a flat item BV."
        ]
    },
    "mace": {
        "id": "mace",
        "name": "Mace",
        "altNames": [
            "Mace",
            "ISMace",
            "CLMace"
        ],
        "category": "Equipment",
        "techBase": "Inner Sphere",
        "rulesLevel": "Advanced",
        "variant": "IS",
        "family": "physicalWeapon",
        "damage": "1/4T",
        "heat": 0,
        "tons": "\"unitTonnage/10\"",
        "critSlots": "\"unitTonnage/10\"",
        "spaceSlots": "\"unitTonnage/10\"",
        "techRating": "B",
        "flags": [
            "physicalWeapon"
        ],
        "source": {
            "weightSpacePage": 0,
            "battleValuePage": 0,
            "costAvailabilityPage": 0
        },
        "typeCodes": [
            "ME"
        ],
        "bv": "damage-based",
        "cost": {"type": "fixed", "amount": 130000},
        "availability": {
            "starLeague": "X",
            "successionWars": "F",
            "clanInvasion": "D"
        },
        "notes": [
            "BattleMech melee weapon; construction data lists fixed item cost and tonnage/slots based on unit tonnage."
        ]
    },
    "claws": {
        "id": "claws",
        "name": "Claws",
        "altNames": [
            "Claw",
            "Claws",
            "ISClaw",
            "ISClaws",
            "CLClaw",
            "CLClaws"
        ],
        "category": "Equipment",
        "techBase": "Inner Sphere",
        "rulesLevel": "Advanced",
        "variant": "IS",
        "family": "physicalWeapon",
        "damage": "1/7T",
        "heat": 0,
        "tons": "\"unitTonnage/15\"",
        "critSlots": "\"unitTonnage/15\"",
        "spaceSlots": "\"unitTonnage/15\"",
        "techRating": "B",
        "flags": [
            "physicalWeapon"
        ],
        "source": {
            "weightSpacePage": 0,
            "battleValuePage": 0,
            "costAvailabilityPage": 0
        },
        "typeCodes": [
            "ME"
        ],
        "bv": "damage-based",
        "cost": {"type": "unitTonnage", "multiplier": 200},
        "availability": {
            "starLeague": "X",
            "successionWars": "F",
            "clanInvasion": "E"
        },
        "notes": [
            "BattleMech melee weapon; usually appears in MTF critical slots as ISClaw/CLClaw."
        ]
    },
    "retractable_blade": {
        "id": "retractable_blade",
        "name": "Retractable Blade",
        "altNames": [
            "Retractable Blade",
            "Retractable Blade (OMNIPOD)",
            "ISRetractableBlade",
            "CLRetractableBlade"
        ],
        "category": "Equipment",
        "techBase": "Inner Sphere",
        "rulesLevel": "Advanced",
        "variant": "IS",
        "family": "physicalWeapon",
        "damage": "physical",
        "heat": 0,
        "tons": "\"varies\"",
        "critSlots": "\"varies\"",
        "spaceSlots": "\"varies\"",
        "techRating": "D",
        "flags": [
            "physicalWeapon"
        ],
        "source": {
            "weightSpacePage": 0,
            "battleValuePage": 0,
            "costAvailabilityPage": 0
        },
        "typeCodes": [
            "ME"
        ],
        "bv": "Damage x 1.725",
        "cost": {"type": "equipmentTonnage", "multiplier": 10000},
        "availability": {
            "starLeague": "X",
            "successionWars": "X",
            "clanInvasion": "E"
        },
        "notes": [
            "BattleMech melee weapon; BV is damage-based rather than a flat item BV."
        ]
    },

    // Clan weapons
"clan_lb_2_x_ac": {
        "id": "clan_lb_2_x_ac",
        "name": "LB 2-X AC",
        "altNames": [
            "Clan LB 2-X AC",
            "CL LB 2-X AC",
            "CLLB2XAC",
            "LB2XAC",
            "CLLBXAC2",
            "Clan LBXAC2",
            "Clan LB 2-X Autocannon",
            "Clan LB 2-X Auto Cannon"
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
            "battleValuePage": 318,
            "costAvailabilityPage": 294
        },
        "typeCodes": [
            "DB",
            "C",
            "S",
            "F"
        ],
        "ammo": {
            "ammoId": "clan_lb_2_x_ac_ammo"
        },
        "bv": 47,
        "cost": 150000,
        "availability": {

            "starLeague": "X",

            "successionWars": "X",

            "clanInvasion": "E",

        }
    },
    "clan_lb_5_x_ac": {
        "id": "clan_lb_5_x_ac",
        "name": "LB 5-X AC",
        "altNames": [
            "Clan LB 5-X AC",
            "CL LB 5-X AC",
            "CLLB5XAC",
            "LB5XAC",
            "CLLBXAC5",
            "Clan LBXAC5",
            "Clan LB 5-X Autocannon",
            "Clan LB 5-X Auto Cannon"
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
            "battleValuePage": 318,
            "costAvailabilityPage": 294
        },
        "typeCodes": [
            "DB",
            "C",
            "S",
            "F"
        ],
        "ammo": {
            "ammoId": "clan_lb_5_x_ac_ammo"
        },
        "bv": 93,
        "cost": 250000,
        "availability": {

            "starLeague": "X",

            "successionWars": "X",

            "clanInvasion": "D",

        }
    },
    "clan_lb_10_x_ac": {
        "id": "clan_lb_10_x_ac",
        "name": "LB 10-X AC",
        "altNames": [
            "Clan LB 10-X AC",
            "CL LB 10-X AC",
            "CLLB10XAC",
            "LB10XAC",
            "CLLBXAC10",
            "Clan LBXAC10",
            "Clan LB 10-X Autocannon",
            "Clan LB 10-X Auto Cannon"
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
            "battleValuePage": 318,
            "costAvailabilityPage": 294
        },
        "typeCodes": [
            "DB",
            "C",
            "S",
            "F"
        ],
        "ammo": {
            "ammoId": "clan_lb_10_x_ac_ammo"
        },
        "bv": 148,
        "cost": 400000,
        "availability": {

            "starLeague": "C",

            "successionWars": "E",

            "clanInvasion": "D",

        }
    },
    "clan_lb_20_x_ac": {
        "id": "clan_lb_20_x_ac",
        "name": "LB 20-X AC",
        "altNames": [
            "Clan LB 20-X AC",
            "CL LB 20-X AC",
            "CLLB20XAC",
            "LB20XAC",
            "CLLBXAC20",
            "Clan LBXAC20",
            "Clan LB 20-X Autocannon",
            "Clan LB 20-X Auto Cannon"
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
            "battleValuePage": 318,
            "costAvailabilityPage": 294
        },
        "typeCodes": [
            "DB",
            "C",
            "S",
            "F"
        ],
        "ammo": {
            "ammoId": "clan_lb_20_x_ac_ammo"
        },
        "bv": 237,
        "cost": 600000,
        "availability": {

            "starLeague": "X",

            "successionWars": "X",

            "clanInvasion": "E",

        }
    },
    "clan_ultra_ac_2": {
        "id": "clan_ultra_ac_2",
        "name": "Ultra AC/2",
        "altNames": [
            "Clan Ultra AC/2",
            "CL Ultra AC/2",
            "CLUltraAC2",
            "UltraAC/2",
            "CLUAC2",
            "Clan UAC/2",
            "Clan Ultra Autocannon/2",
            "Clan Ultra Auto Cannon/2"
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
            "battleValuePage": 318,
            "costAvailabilityPage": 294
        },
        "typeCodes": [
            "DB",
            "R",
            "C"
        ],
        "ammo": {
            "ammoId": "clan_ultra_ac_2_ammo"
        },
        "bv": 62,
        "cost": 120000,
        "availability": {

            "starLeague": "X",

            "successionWars": "X",

            "clanInvasion": "E",

        }
    },
    "clan_ultra_ac_5": {
        "id": "clan_ultra_ac_5",
        "name": "Ultra AC/5",
        "altNames": [
            "Clan Ultra AC/5",
            "CL Ultra AC/5",
            "CLUltraAC5",
            "UltraAC/5",
            "CLUAC5",
            "Clan UAC/5",
            "Clan Ultra Autocannon/5",
            "Clan Ultra Auto Cannon/5"
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
            "battleValuePage": 318,
            "costAvailabilityPage": 294
        },
        "typeCodes": [
            "DB",
            "R",
            "C"
        ],
        "ammo": {
            "ammoId": "clan_ultra_ac_5_ammo"
        },
        "bv": 122,
        "cost": 200000,
        "availability": {

            "starLeague": "D",

            "successionWars": "F",

            "clanInvasion": "D",

        }
    },
    "clan_ultra_ac_10": {
        "id": "clan_ultra_ac_10",
        "name": "Ultra AC/10",
        "altNames": [
            "Clan Ultra AC/10",
            "CL Ultra AC/10",
            "CLUltraAC10",
            "UltraAC/10",
            "CLUAC10",
            "Clan UAC/10",
            "Clan Ultra Autocannon/10",
            "Clan Ultra Auto Cannon/10"
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
            "battleValuePage": 318,
            "costAvailabilityPage": 294
        },
        "typeCodes": [
            "DB",
            "R",
            "C"
        ],
        "ammo": {
            "ammoId": "clan_ultra_ac_10_ammo"
        },
        "bv": 210,
        "cost": 320000,
        "availability": {

            "starLeague": "X",

            "successionWars": "X",

            "clanInvasion": "E",

        }
    },
    "clan_ultra_ac_20": {
        "id": "clan_ultra_ac_20",
        "name": "Ultra AC/20",
        "altNames": [
            "Clan Ultra AC/20",
            "CL Ultra AC/20",
            "CLUltraAC20",
            "UltraAC/20",
            "CLUAC20",
            "Clan UAC/20",
            "Clan Ultra Autocannon/20",
            "Clan Ultra Auto Cannon/20"
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
            "battleValuePage": 318,
            "costAvailabilityPage": 294
        },
        "typeCodes": [
            "DB",
            "R",
            "C"
        ],
        "ammo": {
            "ammoId": "clan_ultra_ac_20_ammo"
        },
        "bv": 335,
        "cost": 480000,
        "availability": {

            "starLeague": "X",

            "successionWars": "X",

            "clanInvasion": "E",

        }
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
            "battleValuePage": 318,
            "costAvailabilityPage": 294
        },
        "typeCodes": [
            "DB",
            "X",
            "AI"
        ],
        "ammo": {
            "ammoId": "clan_ap_gauss_rifle_ammo"
        },
        "bv": 21,
        "cost": 10000,
        "notes": [
            "Ammo BV marked § in the BV table; ammunition is not counted as explosive."
        ],
        "availability": {

            "starLeague": "X",

            "successionWars": "X",

            "clanInvasion": "E",

        }
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
            "battleValuePage": 318,
            "costAvailabilityPage": 294
        },
        "typeCodes": [
            "DB",
            "X"
        ],
        "ammo": {
            "ammoId": "clan_gauss_rifle_ammo"
        },
        "bv": 320,
        "notes": [
            "Ammo BV marked § in the BV table; ammunition is not counted as explosive."
        ],
        "cost": 300000,
        "availability": {

            "starLeague": "D",

            "successionWars": "F",

            "clanInvasion": "D",

        }
    },
    "clan_hyper_assault_gauss_20": {
        "id": "clan_hyper_assault_gauss_20",
        "name": "Hyper-Assault Gauss 20",
        "altNames": [
            "Clan Hyper-Assault Gauss 20",
            "CL Hyper-Assault Gauss 20",
            "CLHyperAssaultGauss20",
            "HyperAssaultGauss20",
            "HAG/20",
            "HAG20",
            "CLHAG20"
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
            "battleValuePage": 318,
            "costAvailabilityPage": 294
        },
        "typeCodes": [
            "DB",
            "X",
            "C",
            "F"
        ],
        "ammo": {
            "ammoId": "clan_hyper_assault_gauss_20_ammo"
        },
        "bv": 267,
        "cost": 400000,
        "notes": [
            "Ammo BV marked § in the BV table; ammunition is not counted as explosive."
        ],
        "availability": {

            "starLeague": "X",

            "successionWars": "X",

            "clanInvasion": "E",

        }
    },
    "clan_hyper_assault_gauss_30": {
        "id": "clan_hyper_assault_gauss_30",
        "name": "Hyper-Assault Gauss 30",
        "altNames": [
            "Clan Hyper-Assault Gauss 30",
            "CL Hyper-Assault Gauss 30",
            "CLHyperAssaultGauss30",
            "HyperAssaultGauss30",
            "HAG/30",
            "HAG30",
            "CLHAG30"
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
            "battleValuePage": 318,
            "costAvailabilityPage": 294
        },
        "typeCodes": [
            "DB",
            "X",
            "C",
            "F"
        ],
        "ammo": {
            "ammoId": "clan_hyper_assault_gauss_30_ammo"
        },
        "bv": 401,
        "cost": 500000,
        "notes": [
            "Ammo BV marked § in the BV table; ammunition is not counted as explosive."
        ],
        "availability": {

            "starLeague": "X",

            "successionWars": "X",

            "clanInvasion": "E",

        }
    },
    "clan_hyper_assault_gauss_40": {
        "id": "clan_hyper_assault_gauss_40",
        "name": "Hyper-Assault Gauss 40",
        "altNames": [
            "Clan Hyper-Assault Gauss 40",
            "CL Hyper-Assault Gauss 40",
            "CLHyperAssaultGauss40",
            "HyperAssaultGauss40",
            "HAG/40",
            "HAG40",
            "CLHAG40"
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
            "battleValuePage": 318,
            "costAvailabilityPage": 294
        },
        "typeCodes": [
            "DB",
            "X",
            "C",
            "F"
        ],
        "ammo": {
            "ammoId": "clan_hyper_assault_gauss_40_ammo"
        },
        "bv": 535,
        "cost": 600000,
        "notes": [
            "Ammo BV marked § in the BV table; ammunition is not counted as explosive."
        ],
        "availability": {

            "starLeague": "X",

            "successionWars": "X",

            "clanInvasion": "E",

        }
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
            "battleValuePage": 318,
            "costAvailabilityPage": 294
        },
        "typeCodes": [
            "DB",
            "AI"
        ],
        "ammo": {
            "ammoId": "clan_light_machine_gun_ammo"
        },
        "bv": 5,
        "cost": 5000,
        "availability": {

            "starLeague": "X",

            "successionWars": "X",

            "clanInvasion": "C",

        }
    },
    "clan_machine_gun": {
        "id": "clan_machine_gun",
        "name": "Machine Gun",
        "altNames": [
            "Clan Machine Gun",
            "CL Machine Gun",
            "CLMachineGun",
            "MachineGun",
            "CLMG",
            "Clan MG"
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
            "battleValuePage": 318,
            "costAvailabilityPage": 294
        },
        "typeCodes": [
            "DB",
            "AI"
        ],
        "ammo": {
            "ammoId": "clan_machine_gun_ammo"
        },
        "bv": 5,
        "cost": 5000,
        "availability": {

            "starLeague": "A",

            "successionWars": "A",

            "clanInvasion": "B",

        }
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
            "battleValuePage": 318,
            "costAvailabilityPage": 294
        },
        "typeCodes": [
            "DB",
            "AI"
        ],
        "ammo": {
            "ammoId": "clan_heavy_machine_gun_ammo"
        },
        "bv": 6,
        "cost": 7500,
        "availability": {

            "starLeague": "X",

            "successionWars": "X",

            "clanInvasion": "C",

        }
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
            "battleValuePage": 318,
            "costAvailabilityPage": 0
        },
        "typeCodes": [
            "DE",
            "H",
            "AI"
        ],
        "bv": 6,
        "cost": 7500
    },
    "clan_er_flamer": {
        "id": "clan_er_flamer",
        "name": "ER Flamer",
        "altNames": [
            "Clan ER Flamer",
            "CLERFlamer",
            "ERFlamer",

        ],
        "category": "Energy",
        "techBase": "Clan",
        "rulesLevel": "Advanced",
        "variant": "Clan",
        "family": "flamer",
        "damage": 2,
        "heat": 4,
        "tons": 1,
        "critSlots": 1,
        "spaceSlots": 1,
        "range": {
            "min": 0,
            "short": 3,
            "medium": 5,
            "long": 7
        },
        "techRating": "D",
        "availability": {

            "starLeague": "X",

            "successionWars": "X",

            "clanInvasion": "E",

        },
        "flags": [
            "directFire",
            "antiInfantry"
        ],
        "source": {
            "weightSpacePage": 341,
            "battleValuePage": 317,
            "costAvailabilityPage": 0
        },
        "typeCodes": [
            "DE",
            "H",
            "AI"
        ],
        "cost": 15000,
        "bv": 16
    },
    "clan_heavy_flamer": {
        "id": "clan_heavy_flamer",
        "name": "Heavy Flamer",
        "altNames": [
            "Clan Heavy Flamer",
            "CL Heavy Flamer",
            "CLHeavyFlamer",
            "HeavyFlamer"
        ],
        "category": "Energy",
        "techBase": "Clan",
        "rulesLevel": "Advanced",
        "variant": "Clan",
        "family": "flamer",
        "damage": 4,
        "heat": 5,
        "tons": 1.5,
        "critSlots": 1,
        "spaceSlots": 1,
        "range": {
            "min": 0,
            "short": 2,
            "medium": 3,
            "long": 4
        },
        "techRating": "C",
        "availability": {

            "starLeague": "X",

            "successionWars": "X",

            "clanInvasion": "E",

        },
        "flags": [
            "directFire",
            "antiInfantry"
        ],
        "source": {
            "weightSpacePage": 341,
            "battleValuePage": 317,
            "costAvailabilityPage": 0
        },
        "typeCodes": [
            "DE",
            "H",
            "AI"
        ],
        "cost": 11250,
        "bv": 15,
        "ammo": {
            "ammoId": "clan_heavy_flamer_ammo"
        }
    },
    "clan_flamer_vehicle": {
        "id": "clan_flamer_vehicle",
        "name": "Flamer (Vehicle)",
        "altNames": [
            "Clan Flamer (Vehicle)",
            "CL Flamer (Vehicle)",
            "CLFlamer(Vehicle)",
            "Flamer(Vehicle)",
            "Clan Vehicle Flamer",
            "CL Vehicle Flamer"
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
            "battleValuePage": 318,
            "costAvailabilityPage": 294
        },
        "typeCodes": [
            "DE",
            "H",
            "AI"
        ],
        "ammo": {
            "ammoId": "clan_flamer_vehicle_ammo"
        },
        "bv": 5,
        "cost": 7500,
        "availability": {

            "starLeague": "A",

            "successionWars": "A",

            "clanInvasion": "B",

        }
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
            "battleValuePage": 318,
            "costAvailabilityPage": 0
        },
        "typeCodes": [
            "DE"
        ],
        "bv": 7,
        "cost": 10000
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
            "battleValuePage": 318,
            "costAvailabilityPage": 0
        },
        "typeCodes": [
            "DE"
        ],
        "bv": 31,
        "cost": 11250
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
            "battleValuePage": 318,
            "costAvailabilityPage": 0
        },
        "typeCodes": [
            "DE"
        ],
        "bv": 108,
        "cost": 80000
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
            "battleValuePage": 318,
            "costAvailabilityPage": 0
        },
        "typeCodes": [
            "DE"
        ],
        "bv": 248,
        "cost": 200000
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
        "bv": 12,
        "cost": 12500,
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
            "battleValuePage": 318,
            "costAvailabilityPage": 0
        },
        "typeCodes": [
            "P",
            "AI"
        ],
        "bv": 24,
        "cost": 16000
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
            "battleValuePage": 318,
            "costAvailabilityPage": 0
        },
        "typeCodes": [
            "P"
        ],
        "bv": 111,
        "cost": 60000
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
            "battleValuePage": 318,
            "costAvailabilityPage": 0
        },
        "typeCodes": [
            "P"
        ],
        "bv": 265,
        "cost": 175000
    },
    "clan_small_er_pulse_laser": {
        "id": "clan_small_er_pulse_laser",
        "name": "Small ER Pulse Laser",
        "altNames": [
            "Clan Small ER Pulse Laser",
            "CL Small ER Pulse Laser",
            "CLSmallERPulseLaser",
            "SmallERPulseLaser",
            "ER Small Pulse Laser",
            "ERSmallPulseLaser"
        ],
        "category": "Energy",
        "techBase": "Clan",
        "rulesLevel": "Standard",
        "variant": "Clan",
        "family": "pulseLaser",
        "damage": 5,
        "heat": 3,
        "tons": 1.5,
        "critSlots": 1,
        "spaceSlots": 1,
        "range": {
            "min": 0,
            "short": 2,
            "medium": 4,
            "long": 6
        },
        "techRating": "F",
        "availability": {

            "starLeague": "X",

            "successionWars": "X",

            "clanInvasion": "E",

        },
        "flags": [
            "directFire",
            "pulse"
        ],
        "source": {
            "weightSpacePage": 343,
            "battleValuePage": 318,
            "costAvailabilityPage": 0
        },
        "typeCodes": [
            "P",
            "AI"
        ],
        "bv": 36,
        "cost": 30000
    },
    "clan_medium_er_pulse_laser": {
        "id": "clan_medium_er_pulse_laser",
        "name": "Medium ER Pulse Laser",
        "altNames": [
            "Clan Medium ER Pulse Laser",
            "CL Medium ER Pulse Laser",
            "CLMediumERPulseLaser",
            "MediumERPulseLaser",
            "ER Medium Pulse Laser",
            "ERMediumPulseLaser"
        ],
        "category": "Energy",
        "techBase": "Clan",
        "rulesLevel": "Standard",
        "variant": "Clan",
        "family": "pulseLaser",
        "damage": 7,
        "heat": 6,
        "tons": 2,
        "critSlots": 2,
        "spaceSlots": 1,
        "range": {
            "min": 0,
            "short": 5,
            "medium": 9,
            "long": 14
        },
        "techRating": "F",
        "availability": {

            "starLeague": "X",

            "successionWars": "X",

            "clanInvasion": "E",

        },
        "flags": [
            "directFire",
            "pulse"
        ],
        "source": {
            "weightSpacePage": 343,
            "battleValuePage": 318,
            "costAvailabilityPage": 0
        },
        "typeCodes": [
            "P"
        ],
        "bv": 117,
        "cost": 150000
    },
    "clan_large_er_pulse_laser": {
        "id": "clan_large_er_pulse_laser",
        "name": "Large ER Pulse Laser",
        "altNames": [
            "Clan Large ER Pulse Laser",
            "CL Large ER Pulse Laser",
            "CLLargeERPulseLaser",
            "LargeERPulseLaser",
            "ER Large Pulse Laser",
            "ERLargePulseLaser"
        ],
        "category": "Energy",
        "techBase": "Clan",
        "rulesLevel": "Standard",
        "variant": "Clan",
        "family": "pulseLaser",
        "damage": 10,
        "heat": 13,
        "tons": 6,
        "critSlots": 3,
        "spaceSlots": 2,
        "range": {
            "min": 0,
            "short": 7,
            "medium": 15,
            "long": 23
        },
        "techRating": "F",
        "availability": {

            "starLeague": "X",

            "successionWars": "X",

            "clanInvasion": "E",

        },
        "flags": [
            "directFire",
            "pulse"
        ],
        "source": {
            "weightSpacePage": 343,
            "battleValuePage": 318,
            "costAvailabilityPage": 0
        },
        "typeCodes": [
            "P"
        ],
        "bv": 272,
        "cost": 400000
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
        "bv": 15,
        "cost": 20000
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
        "bv": 76,
        "cost": 100000
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
            "battleValuePage": 318,
            "costAvailabilityPage": 0
        },
        "typeCodes": [
            "DE"
        ],
        "bv": 244,
        "cost": 250000
    },
    "clan_improved_heavy_small_laser": {
        "id": "clan_improved_heavy_small_laser",
        "name": "Improved Heavy Small Laser",
        "altNames": [
            "Clan Improved Heavy Small Laser",
            "CL Improved Heavy Small Laser",
            "CLImprovedHeavySmallLaser",
            "ImprovedHeavySmallLaser"
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
        "bv": 19,
        "cost": 30000
    },
    "clan_improved_heavy_medium_laser": {
        "id": "clan_improved_heavy_medium_laser",
        "name": "Improved Heavy Medium Laser",
        "altNames": [
            "Clan Improved Heavy Medium Laser",
            "CL Improved Heavy Medium Laser",
            "CLImprovedHeavyMediumLaser",
            "ImprovedHeavyMediumLaser"
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
        "bv": 93,
        "cost": 150000
    },
    "clan_improved_heavy_large_laser": {
        "id": "clan_improved_heavy_large_laser",
        "name": "Improved Heavy Large Laser",
        "altNames": [
            "Clan Improved Heavy Large Laser",
            "CL Improved Heavy Large Laser",
            "CLImprovedHeavyLargeLaser",
            "ImprovedHeavyLargeLaser"
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
            "battleValuePage": 318,
            "costAvailabilityPage": 0
        },
        "typeCodes": [
            "DE"
        ],
        "bv": 296,
        "cost": 350000
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
            "battleValuePage": 318,
            "costAvailabilityPage": 295
        },
        "typeCodes": [
            "DE",
            "H"
        ],
        "ammo": {
            "ammoId": "clan_plasma_cannon_ammo"
        },
        "bv": 170,
        "cost": 320000,
        "notes": [
            "Ammo BV marked § in the BV table; ammunition is not counted as explosive."
        ],
        "availability": {

            "starLeague": "X",

            "successionWars": "X",

            "clanInvasion": "E",

        }
    },
    "clan_er_ppc": {
        "id": "clan_er_ppc",
        "name": "ER PPC",
        "altNames": [
            "Clan ER PPC",
            "CL ER PPC",
            "CLERPPC",
            "ERPPC",
            "Clan ER Particle Projector Cannon"
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
            "battleValuePage": 318,
            "costAvailabilityPage": 0
        },
        "typeCodes": [
            "DE"
        ],
        "bv": 412,
        "cost": 300000
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
            "battleValuePage": 318,
            "costAvailabilityPage": 295
        },
        "typeCodes": [
            "M",
            "C",
            "S"
        ],
        "ammo": {
            "ammoId": "clan_atm_3_ammo"
        },
        "bv": 53,
        "cost": 50000,
        "availability": {

            "starLeague": "X",

            "successionWars": "X",

            "clanInvasion": "D",

        }
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
            "battleValuePage": 318,
            "costAvailabilityPage": 295
        },
        "typeCodes": [
            "M",
            "C",
            "S"
        ],
        "ammo": {
            "ammoId": "clan_atm_6_ammo"
        },
        "bv": 105,
        "cost": 125000,
        "availability": {

            "starLeague": "X",

            "successionWars": "X",

            "clanInvasion": "D",

        }
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
            "battleValuePage": 318,
            "costAvailabilityPage": 295
        },
        "typeCodes": [
            "M",
            "C",
            "S"
        ],
        "ammo": {
            "ammoId": "clan_atm_9_ammo"
        },
        "bv": 147,
        "cost": 225000,
        "availability": {

            "starLeague": "X",

            "successionWars": "X",

            "clanInvasion": "D",

        }
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
            "battleValuePage": 318,
            "costAvailabilityPage": 295
        },
        "typeCodes": [
            "M",
            "C",
            "S"
        ],
        "ammo": {
            "ammoId": "clan_atm_12_ammo"
        },
        "bv": 212,
        "cost": 350000,
        "availability": {

            "starLeague": "X",

            "successionWars": "X",

            "clanInvasion": "D",

        }
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
            "battleValuePage": 318,
            "costAvailabilityPage": 295
        },
        "typeCodes": [
            "M",
            "C",
            "S"
        ],
        "ammo": {
            "ammoId": "clan_lrm_5_ammo"
        },
        "bv": 55,
        "oneShotBV": 11,
        "notes": [
            "BV after slash in the rules table is the single-shot/one-shot launcher BV."
        ],
        "cost": 30000,
        "availability": {

            "starLeague": "C",

            "successionWars": "C",

            "clanInvasion": "C",

        }
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
            "battleValuePage": 318,
            "costAvailabilityPage": 295
        },
        "typeCodes": [
            "M",
            "C",
            "S"
        ],
        "ammo": {
            "ammoId": "clan_lrm_10_ammo"
        },
        "bv": 109,
        "oneShotBV": 22,
        "notes": [
            "BV after slash in the rules table is the single-shot/one-shot launcher BV."
        ],
        "cost": 100000,
        "availability": {

            "starLeague": "C",

            "successionWars": "C",

            "clanInvasion": "C",

        }
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
            "battleValuePage": 318,
            "costAvailabilityPage": 295
        },
        "typeCodes": [
            "M",
            "C",
            "S"
        ],
        "ammo": {
            "ammoId": "clan_lrm_15_ammo"
        },
        "bv": 164,
        "oneShotBV": 33,
        "notes": [
            "BV after slash in the rules table is the single-shot/one-shot launcher BV."
        ],
        "cost": 175000,
        "availability": {

            "starLeague": "C",

            "successionWars": "C",

            "clanInvasion": "C",

        }
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
            "battleValuePage": 318,
            "costAvailabilityPage": 295
        },
        "typeCodes": [
            "M",
            "C",
            "S"
        ],
        "ammo": {
            "ammoId": "clan_lrm_20_ammo"
        },
        "bv": 220,
        "oneShotBV": 44,
        "notes": [
            "BV after slash in the rules table is the single-shot/one-shot launcher BV."
        ],
        "cost": 250000,
        "availability": {

            "starLeague": "C",

            "successionWars": "C",

            "clanInvasion": "C",

        }
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
            "battleValuePage": 318,
            "costAvailabilityPage": 295
        },
        "typeCodes": [
            "M",
            "C",
            "S"
        ],
        "ammo": {
            "ammoId": "clan_srm_2_ammo"
        },
        "bv": 21,
        "oneShotBV": 4,
        "notes": [
            "BV after slash in the rules table is the single-shot/one-shot launcher BV."
        ],
        "cost": 10000,
        "availability": {

            "starLeague": "B",

            "successionWars": "B",

            "clanInvasion": "B",

        }
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
            "battleValuePage": 318,
            "costAvailabilityPage": 295
        },
        "typeCodes": [
            "M",
            "C",
            "S"
        ],
        "ammo": {
            "ammoId": "clan_srm_4_ammo"
        },
        "bv": 39,
        "oneShotBV": 8,
        "notes": [
            "BV after slash in the rules table is the single-shot/one-shot launcher BV."
        ],
        "cost": 60000,
        "availability": {

            "starLeague": "B",

            "successionWars": "B",

            "clanInvasion": "B",

        }
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
            "battleValuePage": 318,
            "costAvailabilityPage": 295
        },
        "typeCodes": [
            "M",
            "C",
            "S"
        ],
        "ammo": {
            "ammoId": "clan_srm_6_ammo"
        },
        "bv": 59,
        "oneShotBV": 12,
        "notes": [
            "BV after slash in the rules table is the single-shot/one-shot launcher BV."
        ],
        "cost": 80000,
        "availability": {

            "starLeague": "B",

            "successionWars": "B",

            "clanInvasion": "B",

        }
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
            "battleValuePage": 318,
            "costAvailabilityPage": 295
        },
        "typeCodes": [
            "M",
            "C"
        ],
        "ammo": {
            "ammoId": "clan_streak_srm_2_ammo"
        },
        "bv": 40,
        "cost": 15000,
        "oneShotBV": 8,
        "notes": [
            "BV after slash in the rules table is the single-shot/one-shot launcher BV."
        ],
        "availability": {

            "starLeague": "E",

            "successionWars": "F",

            "clanInvasion": "D",

        }
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
            "battleValuePage": 318,
            "costAvailabilityPage": 295
        },
        "typeCodes": [
            "M",
            "C"
        ],
        "ammo": {
            "ammoId": "clan_streak_srm_4_ammo"
        },
        "bv": 79,
        "cost": 90000,
        "oneShotBV": 16,
        "notes": [
            "BV after slash in the rules table is the single-shot/one-shot launcher BV."
        ],
        "availability": {

            "starLeague": "X",

            "successionWars": "X",

            "clanInvasion": "E",

        }
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
            "battleValuePage": 318,
            "costAvailabilityPage": 295
        },
        "typeCodes": [
            "M",
            "C"
        ],
        "ammo": {
            "ammoId": "clan_streak_srm_6_ammo"
        },
        "bv": 118,
        "cost": 120000,
        "oneShotBV": 24,
        "notes": [
            "BV after slash in the rules table is the single-shot/one-shot launcher BV."
        ],
        "availability": {

            "starLeague": "X",

            "successionWars": "X",

            "clanInvasion": "E",

        }
    },
    "clan_narc_missile_beacon": {
        "id": "clan_narc_missile_beacon",
        "name": "Narc Missile Beacon",
        "altNames": [
            "Clan Narc Missile Beacon",
            "CL Narc Missile Beacon",
            "CLNarcMissileBeacon",
            "NarcMissileBeacon",
            "CLNarc",
            "Clan Narc",
            "Clan Narc Beacon"
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
            "ammoId": "clan_narc_missile_beacon_ammo"
        },
        "bv": 30,
        "cost": 100000,
        "oneShotBV": 6,
        "notes": [
            "BV after slash in the rules table is the single-shot/one-shot launcher BV."
        ]
    },
    "clan_a_pod": {
        "id": "clan_a_pod",
        "name": "A-Pod",
        "altNames": [
            "Clan A-Pod",
            "CL A-Pod",
            "CLAPod",
            "APod",
            "CLAntiPersonnelPod",
            "Clan Anti-Personnel Pod",
            "Clan A-Pods"
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
            "ammoId": "clan_a_pod_ammo"
        },
        "bv": 1,
        "cost": 1500,
    },
    "clan_b_pod": {
        "id": "clan_b_pod",
        "name": "B-Pod",
        "altNames": [
            "Clan B-Pod",
            "CL B-Pod",
            "CLBPod",
            "BPod",
            "Clan Anti-BattleArmor Pod",
            "Clan Anti-Battle Armor Pod",
            "Clan B-Pods"
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
            "ammoId": "clan_b_pod_ammo"
        },
        "bv": 2,
        "cost": 2500
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
            "battleValuePage": 318,
            "costAvailabilityPage": 295
        },
        "ammo": {
            "ammoId": "clan_anti_missile_system_ammo"
        },
        "bv": 32,
        "cost": 100000,
        "availability": {

            "starLeague": "X",

            "successionWars": "D",

            "clanInvasion": "C",

        }
    },
    "clan_laser_ams": {
        "id": "clan_laser_ams",
        "name": "Laser AMS",
        "altNames": [
            "Clan Laser AMS",
            "CL Laser AMS",
            "CLLaserAMS",
            "Clan Laser Anti-Missile System",
            "CL Laser Anti-Missile System",
            "CLLaserAntiMissileSystem",
            "Clan Laser Anti Missile System",
            "CL Laser Anti Missile System"
        ],
        "category": "Equipment",
        "techBase": "Clan",
        "rulesLevel": "Advanced",
        "variant": "Clan",
        "family": "antiMissileSystem",
        "damage": "special",
        "heat": 5,
        "tons": 1,
        "critSlots": 1,
        "spaceSlots": 1,
        "range": {
            "min": 0,
            "short": 0,
            "medium": 0,
            "long": 0
        },
        "techRating": "F",
        "flags": [
            "defensive",
            "antiMissile",
            "laserAMS",
            "noAmmo"
        ],
        "source": {
            "weightSpacePage": 0,
            "battleValuePage": 0,
            "costAvailabilityPage": 0
        },
        "cost": 225000,
        "bv": 45,
        "notes": [
            "Laser AMS has defensive BV and does not require ammunition.",
            "Rules level progressed over time; treated as Advanced for catalog support."
        ]
    },
    "clan_machine_gun_array": {
        "id": "clan_machine_gun_array",
        "name": "Machine Gun Array",
        "altNames": [
            "Clan Machine Gun Array",
            "CL Machine Gun Array",
            "CLMachineGunArray",
            "MachineGunArray",
            "Clan Light Machine Gun Array",
            "Clan Heavy Machine Gun Array",
            "Clan MG Array"
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
        "bv": "F",
        "cost": 1250
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
    "clan_supercharger": {
        "id": "clan_supercharger",
        "name": "Supercharger",
        "altNames": [
            "Clan Supercharger",
            "CL Supercharger",
            "CLSupercharger",
            "Supercharger"
        ],
        "category": "Equipment",
        "techBase": "Clan",
        "rulesLevel": "Advanced",
        "variant": "Clan",
        "family": "supercharger",
        "damage": "special",
        "heat": 0,
        "tons": "variable",
        "critSlots": "variable",
        "spaceSlots": "variable",
        "techRating": "C",
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
        "bv": "C",
         "availability": {

             "starLeague": "F",

             "successionWars": "F",

             "clanInvasion": "F",

         }
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
        "bv": "A",
        "cost": 50000,
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
        "bv": 12,
        "cost": 200000
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
        "bv": 7,
        "cost": 50000,
        "availability": {

            "starLeague": "X",

            "successionWars": "X",

            "clanInvasion": "E",

        }
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
        "bv": 61,
        "cost": 200000,
        "availability": {

            "starLeague": "E",

            "successionWars": "F",

            "clanInvasion": "D",

        }
    },
    "clan_watchdog_ECM_suite": {
        "id": "clan_watchdog_ECM_suite",
        "name": "Watchdog ECM Suite",
        "altNames": [
            "Clan Watchdog System",
            "CL Watchdog System",
            "CLWatchdogSystem",
            "WatchdogSystem",
            "Clan Watchdog",
            "CL Watchdog",
            "CEWS",
            "WatchdogECMSuite",
            "Clan Watchdog ECM Suite",
            "CL Watchdog ECM Suite",
            "Watchdog ECM Suite"
        ],
        "category": "Equipment",
        "techBase": "Clan",
        "rulesLevel": "Standard",
        "variant": "Clan",
        "family": "watchdog_system",
        "damage": "special",
        "heat": 0,
        "tons": 1.5,
        "critSlots": 2,
        "spaceSlots": 1,
        "range": {
            "min": 0,
            "short": 0,
            "medium": 0,
            "long": 6
        },
        "techRating": "F",
        "flags": [
            "ecm",
            "activeProbe"
        ],
        "source": {
            "weightSpacePage": 343,
            "battleValuePage": 318
        },
        "bv": 68,
        "cost": 500000,
        "availability": {

            "starLeague": "X",

            "successionWars": "X",

            "clanInvasion": "F",

        }
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
        "bv": "A",
        "cost": 40000,
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
        "bv": "D",
    },
    "clan_case_ii": {
        "id": "clan_case_ii",
        "name": "CASE II",
        "altNames": [
            "Clan CASE II",
            "CLCASEII",
            "CASEII"
        ],
        "category": "Equipment",
        "techBase": "Clan",
        "rulesLevel": "Experimental",
        "variant": "Clan",
        "family": "case",
        "damage": "special",
        "heat": 0,
        "tons": 0.5,
        "critSlots": 1,
        "spaceSlots": 1,
        "techRating": "F",
        "flags": [
            "ammoProtection"
        ],
        "source": {
            "weightSpacePage": 342,
            "battleValuePage": 317
        },
        "bv": "C",
        "cost": 175000,
        "availability": {

            "starLeague": "X",

            "successionWars": "X",

            "clanInvasion": "F",

        }
    },
    "clan_streak_lrm_5": {
        "id": "clan_streak_lrm_5",
        "name": "Streak LRM 5",
        "altNames": [
                "Clan Streak LRM 5",
                "CLANStreakLRM5",
                "StreakLRM5",
                "Streak-LRM-5",
                "CL Streak LRM 5",
                "CLStreakLRM5",
                "Streak LRM-5",
                "CLSRTLRM5"
        ],
        "category": "Missile",
        "techBase": "Clan",
        "rulesLevel": "Experimental",
        "variant": "Clan",
        "family": "streakLrm",
        "damage": "1/Msl",
        "rackSize": 5,
        "heat": 2,
        "tons": 2,
        "critSlots": 1,
        "spaceSlots": 1,
        "range": {
                "min": 0,
                "short": 7,
                "medium": 14,
                "long": 21,
                "extreme": 28
        },
        "techRating": "F",
        "flags": [
                "cluster",
                "requiresAmmo",
                "minimumRange",
                "streak"
        ],
        "source": {
                "battleValuePage": 0,
                "weightSpacePage": 0
        },
        "typeCodes": [
                "M",
                "C",
                "S"
        ],
        "ammo": {
            "ammoId": "clan_streak_lrm_5_ammo"
        },
        "cost": 75000,
        "bv": 86,
        "availability": {

            "starLeague": "X",

            "successionWars": "X",

            "clanInvasion": "E",

        },
        "notes": [
                "Clan experimental Streak LRM launcher. Included to resolve existing MTF weapon names, even though experimental Meks can be excluded from audits."
        ]
},
    "clan_streak_lrm_10": {
        "id": "clan_streak_lrm_10",
        "name": "Streak LRM 10",
        "altNames": [
                "Clan Streak LRM 10",
                "CLANStreakLRM10",
                "StreakLRM10",
                "Streak-LRM-10",
                "CL Streak LRM 10",
                "CLStreakLRM10",
                "Streak LRM-10",
                "CLSRTLRM10"
        ],
        "category": "Missile",
        "techBase": "Clan",
        "rulesLevel": "Experimental",
        "variant": "Clan",
        "family": "streakLrm",
        "damage": "1/Msl",
        "rackSize": 10,
        "heat": 4,
        "tons": 5,
        "critSlots": 2,
        "spaceSlots": 1,
        "range": {
                "min": 0,
                "short": 7,
                "medium": 14,
                "long": 21,
                "extreme": 28
        },
        "techRating": "F",
        "flags": [
                "cluster",
                "requiresAmmo",
                "minimumRange",
                "streak"
        ],
        "source": {
                "battleValuePage": 0,
                "weightSpacePage": 0
        },
        "typeCodes": [
                "M",
                "C",
                "S"
        ],
        "ammo": {
            "ammoId": "clan_streak_lrm_10_ammo"
        },
        "cost": 225000,
        "bv": 173,
        "availability": {

            "starLeague": "X",

            "successionWars": "X",

            "clanInvasion": "E",

        },
        "notes": [
                "Clan experimental Streak LRM launcher. Included to resolve existing MTF weapon names, even though experimental Meks can be excluded from audits."
        ]
},
    "clan_streak_lrm_15": {
        "id": "clan_streak_lrm_15",
        "name": "Streak LRM 15",
        "altNames": [
                "Clan Streak LRM 15",
                "CLANStreakLRM15",
                "StreakLRM15",
                "Streak-LRM-15",
                "CL Streak LRM 15",
                "CLStreakLRM15",
                "Streak LRM-15",
                "CLSRTLRM15"
        ],
        "category": "Missile",
        "techBase": "Clan",
        "rulesLevel": "Experimental",
        "variant": "Clan",
        "family": "streakLrm",
        "damage": "1/Msl",
        "rackSize": 15,
        "heat": 5,
        "tons": 7,
        "critSlots": 3,
        "spaceSlots": 1,
        "range": {
                "min": 0,
                "short": 7,
                "medium": 14,
                "long": 21,
                "extreme": 28
        },
        "techRating": "F",
        "flags": [
                "cluster",
                "requiresAmmo",
                "minimumRange",
                "streak"
        ],
        "source": {
                "battleValuePage": 0,
                "weightSpacePage": 0
        },
        "typeCodes": [
                "M",
                "C",
                "S"
        ],
        "ammo": {
            "ammoId": "clan_streak_lrm_15_ammo"
        },
        "cost": 400000,
        "bv": 259,
        "availability": {

            "starLeague": "X",

            "successionWars": "X",

            "clanInvasion": "E",

        },
        "notes": [
                "Clan experimental Streak LRM launcher. Included to resolve existing MTF weapon names, even though experimental Meks can be excluded from audits."
        ]
},
    "clan_streak_lrm_20": {
        "id": "clan_streak_lrm_20",
        "name": "Streak LRM 20",
        "altNames": [
                "Clan Streak LRM 20",
                "CLANStreakLRM20",
                "StreakLRM20",
                "Streak-LRM-20",
                "CL Streak LRM 20",
                "CLStreakLRM20",
                "Streak LRM-20",
                "CLSRTLRM20"
        ],
        "category": "Missile",
        "techBase": "Clan",
        "rulesLevel": "Experimental",
        "variant": "Clan",
        "family": "streakLrm",
        "damage": "1/Msl",
        "rackSize": 20,
        "heat": 6,
        "tons": 10,
        "critSlots": 5,
        "spaceSlots": 1,
        "range": {
                "min": 0,
                "short": 7,
                "medium": 14,
                "long": 21,
                "extreme": 28
        },
        "techRating": "F",
        "flags": [
                "cluster",
                "requiresAmmo",
                "minimumRange",
                "streak"
        ],
        "source": {
                "battleValuePage": 0,
                "weightSpacePage": 0
        },
        "typeCodes": [
                "M",
                "C",
                "S"
        ],
        "ammo": {
            "ammoId": "clan_streak_lrm_20_ammo"
        },
        "cost": 600000,
        "bv": 345,
        "availability": {

            "starLeague": "X",

            "successionWars": "X",

            "clanInvasion": "E",

        },
        "notes": [
                "Clan experimental Streak LRM launcher. Included to resolve existing MTF weapon names, even though experimental Meks can be excluded from audits."
        ]
},
    "clan_arrow_iv": {
        "id": "clan_arrow_iv",
        "name": "Arrow IV",
        "altNames": [
                "Clan Arrow IV",
                "ClanArrowIV",
                "CArrowIV",
                "CArrow-IV"
        ],
        "category": "Missile",
        "techBase": "Clan",
        "rulesLevel": "Advanced",
        "variant": "Clan",
        "family": "Artillery",
        "damage": "20/10",
        "heat": 10,
        "tons": 12,
        "critSlots": 12,
        "spaceSlots": 1,
        "techRating": "E",
        "flags": [
                "artillery",
                "requiresAmmo",
                "indirectFire"
        ],
        "source": {
                "battleValuePage": 0,
                "weightSpacePage": 0
        },
        "typeCodes": [
                "M",
                "C",
                "S"
        ],
        "ammo": {
            "ammoId": "clan_arrow_iv_ammo"
        },
        "bv": 240,
        "cost": 450000,
        "availability": {

            "starLeague": "E",

            "successionWars": "F",

            "clanInvasion": "E",

        }
},
    "clan_beagle_active_probe": {
        "id": "clan_beagle_active_probe",
        "name": "Beagle Active Probe",
        "altNames": [
            "Clan Beagle Active Probe",
            "ClanBeagleActiveProbe",
            "BeagleActiveProbe"
        ],
        "category": "Equipment",
        "techBase": "Clan",
        "rulesLevel": "Standard",
        "variant": "Clan",
        "family": "beagle_active_probe",
        "damage": "special",
        "heat": 0,
        "tons": 1,
        "critSlots": 1,
        "spaceSlots": 2,
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
            "weightSpacePage": 342,
            "battleValuePage": 317
        },
        "bv": 12,
        "cost": 200000,
        "availability": {

            "starLeague": "E",

            "successionWars": "F",

            "clanInvasion": "D",

        }
    },
    "clan_full_head_ejection_system": {
        "id": "clan_full_head_ejection_system",
        "name": "Full Head Ejection System",
        "altNames": [
            "Clan Full Head Ejection System",
            "ClanFullHeadEjectionSystem",
            "FullHeadEjectionSystem"
        ],
        "category": "Equipment",
        "techBase": "Clan",
        "rulesLevel": "Standard",
        "variant": "Clan",
        "family": "Ejection",
        "damage": 0,
        "heat": 0,
        "tons": 0,
        "critSlots": 0,
        "spaceSlots": 0,
        "range": {
            "min": 0,
            "short": 0,
            "medium": 0,
            "long": 0
        },
        "techRating": "D",
        "flags": [
            "ejection"
        ],
        "source": {
            "weightSpacePage": 342,
            "battleValuePage": 317
        },
        "bv": "G",
        "cost": 1725000,
        "availability": {

            "starLeague": "X",

            "successionWars": "X",

            "clanInvasion": "E",

        }
    },
    "clan_protomech_ac_8": {
        "id": "clan_protomech_ac_8",
        "name": "ProtoMech AC/8",
        "altNames": [
            "CLProtoMechAC8",
            "CLProtoMechAC8 (OMNIPOD)",
            "ProtoMech AC/8",
            "Clan ProtoMech AC/8"
        ],
        "category": "Ballistic",
        "techBase": "Clan",
        "rulesLevel": "Advanced",
        "damage": 8,
        "heat": 2,
        "tons": 5.5,
        "critSlots": 4,
"range": { "min": 0, "short": 0, "medium": 0, "long": 0 },
        "techRating": "F",
        "flags": ["directFire"],
        "source": {
            "weightSpacePage": 0,
            "battleValuePage": 0,
            "costAvailabilityPage": 0
        },
        "typeCodes": ["DB", "S"],
        "ammo": {
            "ammoId": "clan_protomech_ac_8_ammo"
        },
        "bv": 0,
        "cost": 175000,
        "availability": {
            "starLeague": "X",
            "successionWars": "X",
            "clanInvasion": "F"

        }
    },
    "clan_protomech_ac_4": {
        "id": "clan_protomech_ac_4",
        "name": "ProtoMech AC/4",
        "altNames": [
            "CLProtoMechAC4",
            "CLProtoMechAC4 (OMNIPOD)",
            "ProtoMech AC/4",
            "Clan ProtoMech AC/4"
        ],
        "category": "Ballistic",
        "techBase": "Clan",
        "rulesLevel": "Advanced",
        "damage": 4,
        "heat": 1,
        "tons": 4.5,
        "critSlots": 3,
"range": { "min": 0, "short": 0, "medium": 0, "long": 0 },
        "techRating": "F",
        "flags": ["directFire"],
        "source": {
            "weightSpacePage": 0,
            "battleValuePage": 0,
            "costAvailabilityPage": 0
        },
        "typeCodes": ["DB", "S"],
        "ammo": {
            "ammoId": "clan_protomech_ac_4_ammo"
        },
        "bv": 0,
        "cost": 133000,
        "availability": {
            "starLeague": "X",
            "successionWars": "X",
            "clanInvasion": "F"

        }
    },

    // Mixed/common equipment
"artemis_iv_fcs": {
        "id": "artemis_iv_fcs",
        "name": "Artemis IV FCS",
        "altNames": [
            "Artemis IV",
            "Artemis IV FCS",
            "ISArtemisIV",
            "CLArtemisIV",
            "CLArtemisIV (OMNIPOD)",
            "IS Artemis IV",
            "Clan Artemis IV"
        ],
        "category": "Equipment",
        "techBase": "Mixed",
        "rulesLevel": "Standard",
        "variant": "Mixed",
        "family": "fireControl",
        "damage": 0,
        "heat": 0,
        "tons": 1,
        "critSlots": 1,
        "spaceSlots": 1,
        "techRating": "E",
        "flags": [
            "fireControl"
        ],
        "source": {
            "weightSpacePage": 0,
            "battleValuePage": 0,
            "costAvailabilityPage": 0
        },
        "typeCodes": [
            "T"
        ],
        "bv": "B",
        "cost": {"type": "fixed", "amount": 100000},
        "availability": {
            "starLeague": "E",
            "successionWars": "F",
            "clanInvasion": "D"
        },
        "notes": [
            "BV is applied as a 20 percent modifier to compatible missile launchers; ammo is not modified."
        ]
    },
    "chainsaw": {
        "id": "chainsaw",
        "name": "Chainsaw",
        "altNames": [
            "Chainsaw",
            "ISChainsaw",
            "CLChainsaw"
        ],
        "category": "Equipment",
        "techBase": "Mixed",
        "rulesLevel": "Advanced",
        "variant": "Mixed",
        "family": "industrialEquipment",
        "damage": "industrial",
        "heat": 0,
        "tons": "\"varies\"",
        "critSlots": "\"varies\"",
        "spaceSlots": "\"varies\"",
        "techRating": "D",
        "flags": [
            "industrialEquipment"
        ],
        "source": {
            "weightSpacePage": 0,
            "battleValuePage": 0,
            "costAvailabilityPage": 0
        },
        "typeCodes": [
            "ME"
        ],
        "bv": 7,
        "cost": {"type": "fixed", "amount": 100000},
        "availability": {
            "starLeague": "D",
            "successionWars": "D",
            "clanInvasion": "D"
        }
    },
    "dual_saw": {
        "id": "dual_saw",
        "name": "Dual Saw",
        "altNames": [
            "Dual Saw",
            "DualSaw",
            "ISDualSaw",
            "CLDualSaw"
        ],
        "category": "Equipment",
        "techBase": "Mixed",
        "rulesLevel": "Advanced",
        "variant": "Mixed",
        "family": "industrialEquipment",
        "damage": "industrial",
        "heat": 0,
        "tons": "\"varies\"",
        "critSlots": "\"varies\"",
        "spaceSlots": "\"varies\"",
        "techRating": "D",
        "flags": [
            "industrialEquipment"
        ],
        "source": {
            "weightSpacePage": 0,
            "battleValuePage": 0,
            "costAvailabilityPage": 0
        },
        "typeCodes": [
            "ME"
        ],
        "bv": 9,
        "cost": {"type": "fixed", "amount": 100000},
        "availability": {
            "starLeague": "D",
            "successionWars": "D",
            "clanInvasion": "D"
        }
    },
    "mining_drill": {
        "id": "mining_drill",
        "name": "Mining Drill",
        "altNames": [
            "Mining Drill",
            "MiningDrill",
            "ISMiningDrill",
            "CLMiningDrill"
        ],
        "category": "Equipment",
        "techBase": "Mixed",
        "rulesLevel": "Advanced",
        "variant": "Mixed",
        "family": "industrialEquipment",
        "damage": "industrial",
        "heat": 0,
        "tons": "\"varies\"",
        "critSlots": "\"varies\"",
        "spaceSlots": "\"varies\"",
        "techRating": "D",
        "flags": [
            "industrialEquipment"
        ],
        "source": {
            "weightSpacePage": 0,
            "battleValuePage": 0,
            "costAvailabilityPage": 0
        },
        "typeCodes": [
            "ME"
        ],
        "bv": 6,
        "cost": {"type": "fixed", "amount": 150000},
        "availability": {
            "starLeague": "D",
            "successionWars": "D",
            "clanInvasion": "D"
        }
    },
    "rock_cutter": {
        "id": "rock_cutter",
        "name": "Rock Cutter",
        "altNames": [
            "Rock Cutter",
            "RockCutter",
            "ISRockCutter",
            "CLRockCutter"
        ],
        "category": "Equipment",
        "techBase": "Mixed",
        "rulesLevel": "Advanced",
        "variant": "Mixed",
        "family": "industrialEquipment",
        "damage": "industrial",
        "heat": 0,
        "tons": "\"varies\"",
        "critSlots": "\"varies\"",
        "spaceSlots": "\"varies\"",
        "techRating": "D",
        "flags": [
            "industrialEquipment"
        ],
        "source": {
            "weightSpacePage": 0,
            "battleValuePage": 0,
            "costAvailabilityPage": 0
        },
        "typeCodes": [
            "ME"
        ],
        "bv": 6,
        "cost": {"type": "fixed", "amount": 150000},
        "availability": {
            "starLeague": "D",
            "successionWars": "D",
            "clanInvasion": "D"
        }
    },
    "backhoe": {
        "id": "backhoe",
        "name": "Backhoe",
        "altNames": [
            "Backhoe",
            "ISBackhoe",
            "CLBackhoe"
        ],
        "category": "Equipment",
        "techBase": "Mixed",
        "rulesLevel": "Advanced",
        "variant": "Mixed",
        "family": "industrialEquipment",
        "damage": "industrial",
        "heat": 0,
        "tons": "\"varies\"",
        "critSlots": "\"varies\"",
        "spaceSlots": "\"varies\"",
        "techRating": "B",
        "flags": [
            "industrialEquipment"
        ],
        "source": {
            "weightSpacePage": 0,
            "battleValuePage": 0,
            "costAvailabilityPage": 0
        },
        "typeCodes": [
            "ME"
        ],
        "bv": 8,
        "cost": {"type": "fixed", "amount": 50000},
        "availability": {
            "starLeague": "B",
            "successionWars": "B",
            "clanInvasion": "B"
        }
    },
    "lift_hoist": {
        "id": "lift_hoist",
        "name": "Lift Hoist",
        "altNames": [
            "Lift Hoist",
            "LiftHoist",
            "Lift Hoist/Arresting Hoist",
            "ISLiftHoist",
            "CLLiftHoist"
        ],
        "category": "Equipment",
        "techBase": "Mixed",
        "rulesLevel": "Advanced",
        "variant": "Mixed",
        "family": "industrialEquipment",
        "damage": 0,
        "heat": 0,
        "tons": "\"varies\"",
        "critSlots": "\"varies\"",
        "spaceSlots": "\"varies\"",
        "techRating": "A",
        "flags": [
            "industrialEquipment",
            "utility"
        ],
        "source": {
            "weightSpacePage": 0,
            "battleValuePage": 0,
            "costAvailabilityPage": 0
        },
        "typeCodes": [
            "PE"
        ],
        "bv": 0,
        "cost": {"type": "fixed", "amount": 50000},
        "availability": {
            "starLeague": "A",
            "successionWars": "A",
            "clanInvasion": "A"
        }
    },
    "arresting_hoist": {
        "id": "arresting_hoist",
        "name": "Arresting Hoist",
        "altNames": [
            "Arresting Hoist",
            "ArrestingHoist"
        ],
        "category": "Equipment",
        "techBase": "Mixed",
        "rulesLevel": "Advanced",
        "variant": "Mixed",
        "family": "industrialEquipment",
        "damage": 0,
        "heat": 0,
        "tons": "\"varies\"",
        "critSlots": "\"varies\"",
        "spaceSlots": "\"varies\"",
        "techRating": "C",
        "flags": [
            "industrialEquipment",
            "utility"
        ],
        "source": {
            "weightSpacePage": 0,
            "battleValuePage": 0,
            "costAvailabilityPage": 0
        },
        "typeCodes": [
            "PE"
        ],
        "bv": 0,
        "cost": {"type": "fixed", "amount": 90000},
        "availability": {
            "starLeague": "C",
            "successionWars": "F",
            "clanInvasion": "E"
        }
    },
    "mek_taser": {
        "id": "mek_taser",
        "name": "Mek Taser",
        "altNames": [
            "Mek Taser",
            "BattleMech Taser",
            "Taser (BattleMech)",
            "ISMekTaser",
            "CLMekTaser"
        ],
        "category": "Equipment",
        "techBase": "Mixed",
        "rulesLevel": "Experimental",
        "variant": "Mixed",
        "family": "taser",
        "damage": "1*",
        "heat": 6,
        "tons": 4,
        "critSlots": 1,
        "spaceSlots": 1,
        "techRating": "E",
        "flags": [
            "directFire",
            "requiresAmmo"
        ],
        "source": {
            "weightSpacePage": 0,
            "battleValuePage": 0,
            "costAvailabilityPage": 0
        },
        "typeCodes": [
            "DB",
            "X"
        ],
        "bv": 0,
        "cost": {"type": "fixed", "amount": 200000},
        "availability": {
            "starLeague": "X",
            "successionWars": "X",
            "clanInvasion": "E"
        },
        "notes": [
            "Added for MTF slot resolution; verify BV/ammo details against final BattleMech Taser table before using for BV calculations."
        ]
    },
    "mech_mortar_4": {
        "id": "mech_mortar_4",
        "name": "Mech Mortar/4",
        "altNames": [
            "Mech Mortar-4",
            "Mech Mortar/4",
            "Clan Mech Mortar-4",
            "Clan Mech Mortar-4 (OMNIPOD)",
            "ISMechMortar4",
            "CLMechMortar4"
        ],
        "category": "Equipment",
        "techBase": "Mixed",
        "rulesLevel": "Advanced",
        "variant": "Mixed",
        "family": "mortar",
        "damage": "special",
        "heat": 0,
        "tons": "\"varies\"",
        "critSlots": "\"varies\"",
        "spaceSlots": "\"varies\"",
        "techRating": "B",
        "flags": [
            "requiresAmmo"
        ],
        "source": {
            "weightSpacePage": 0,
            "battleValuePage": 0,
            "costAvailabilityPage": 0
        },
        "typeCodes": [
            "DB",
            "AE"
        ],
        "bv": 0,
        "cost": {"type": "fixed", "amount": 75000},
        "availability": {
            "starLeague": "C",
            "successionWars": "C",
            "clanInvasion": "C"
        }
    },
    "mech_mortar_8": {
        "id": "mech_mortar_8",
        "name": "Mech Mortar/8",
        "altNames": [
            "Mech Mortar-8",
            "Mech Mortar/8",
            "Clan Mech Mortar-8",
            "Clan Mech Mortar-8 (OMNIPOD)",
            "ISMechMortar8",
            "CLMechMortar8"
        ],
        "category": "Equipment",
        "techBase": "Mixed",
        "rulesLevel": "Advanced",
        "variant": "Mixed",
        "family": "mortar",
        "damage": "special",
        "heat": 0,
        "tons": "\"varies\"",
        "critSlots": "\"varies\"",
        "spaceSlots": "\"varies\"",
        "techRating": "B",
        "flags": [
            "requiresAmmo"
        ],
        "source": {
            "weightSpacePage": 0,
            "battleValuePage": 0,
            "costAvailabilityPage": 0
        },
        "typeCodes": [
            "DB",
            "AE"
        ],
        "bv": 0,
        "cost": {"type": "fixed", "amount": 150000},
        "availability": {
            "starLeague": "C",
            "successionWars": "C",
            "clanInvasion": "C"
        }
    }
};

export function findWeaponDefinition(rawName: string, techBase?: TechBase): WeaponDefinition | undefined {
  const normalized = rawName.toLowerCase().replace(/[^a-z0-9]/g, "");

  return (Object.values(WEAPONS) as WeaponDefinition[]).find((weapon: WeaponDefinition) => {
    if (techBase && weapon.techBase !== techBase && weapon.techBase !== "Mixed") return false;

    const names = [weapon.name, ...weapon.altNames];
    return names.some((name) => name.toLowerCase().replace(/[^a-z0-9]/g, "") === normalized);
  });
}
