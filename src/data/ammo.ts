import type { AmmoDefinition, AmmoReference, AmmoOptionReference } from "./weaponTypes";
export type { AmmoDefinition, AmmoReference, AmmoOptionReference } from "./weaponTypes";

export const AMMO: Record<string, AmmoDefinition> = {
    // Inner Sphere ammo
"is_a_pod_ammo": {
        "id": "is_a_pod_ammo",
        "name": "A-Pod Ammo",
        "altNames": [
            "IS A-Pod",
            "IS A-Pod Ammo",
            "A Pod",
            "A Pod Ammo"
        ],
        "ammoType": "is_a_pod_ammo",
        "weaponIds": ["is_a_pod"],
        "compatibleWeaponNames": ["A-Pod"],
        "techBase": "Inner Sphere",
        "rulesLevel": "Standard",
        "shotsPerTon": "OS",
        "source": {
                    "weightSpacePage": 342,
                    "battleValuePage": 317
                }
    },
    "is_anti_missile_system_ammo": {
        "id": "is_anti_missile_system_ammo",
        "name": "Anti-Missile System Ammo",
        "altNames": [
            "IS Anti-Missile System",
            "IS Anti-Missile System Ammo",
            "Anti Missile System",
            "Anti Missile System Ammo"
        ],
        "ammoType": "is_anti_missile_system_ammo",
        "weaponIds": ["is_anti_missile_system"],
        "compatibleWeaponNames": ["Anti-Missile System"],
        "techBase": "Inner Sphere",
        "rulesLevel": "Standard",
        "shotsPerTon": 12,
        "costPerTon": 2000,
        "bv": 11,
        "availability": {
        
                    "starLeague": "E",
        
                    "successionWars": "F",
        
                    "clanInvasion": "D",
        
                },
        "source": {
                    "weightSpacePage": 342,
                    "battleValuePage": 317,
                    "costAvailabilityPage": 295
                }
    },
    "is_arrow_iv_ammo": {
        "id": "is_arrow_iv_ammo",
        "name": "Arrow IV Ammo",
        "altNames": [
            "IS Arrow IV",
            "IS Arrow IV Ammo",
            "Arrow IV"
        ],
        "ammoType": "is_arrow_iv",
        "weaponIds": ["is_arrow_iv"],
        "compatibleWeaponNames": ["Arrow IV"],
        "techBase": "Inner Sphere",
        "rulesLevel": "Advanced",
        "shotsPerTon": 5,
        "costPerTon": 10000,
        "bv": 12,
        "availability": {
        
                    "starLeague": "E",
        
                    "successionWars": "F",
        
                    "clanInvasion": "E",
        
                },
        "source": {
                        "battleValuePage": 0,
                        "weightSpacePage": 0
                }
    },
    "is_ac_10_ammo": {
        "id": "is_ac_10_ammo",
        "name": "AC/10 Ammo",
        "altNames": [
            "IS AC/10",
            "IS AC/10 Ammo",
            "IS Autocannon/10",
            "IS Autocannon/10 Ammo",
            "AC 10",
            "AC 10 Ammo",
            "Autocannon 10",
            "Autocannon 10 Ammo",
            "is standard ac"
        ],
        "ammoType": "is_standard_ac",
        "weaponIds": ["is_ac_10"],
        "compatibleWeaponNames": ["AC/10"],
        "techBase": "Inner Sphere",
        "rulesLevel": "Introductory",
        "shotsPerTon": 10,
        "costPerTon": 6000,
        "bv": 15,
        "availability": {
        
                    "starLeague": "C",
        
                    "successionWars": "D",
        
                    "clanInvasion": "D",
        
                },
        "source": {
                    "weightSpacePage": 341,
                    "battleValuePage": 317,
                    "costAvailabilityPage": 294
                }
    },
    "is_ac_20_ammo": {
        "id": "is_ac_20_ammo",
        "name": "AC/20 Ammo",
        "altNames": [
            "IS AC/20",
            "IS AC/20 Ammo",
            "IS Autocannon/20",
            "IS Autocannon/20 Ammo",
            "AC 20",
            "AC 20 Ammo",
            "Autocannon 20",
            "Autocannon 20 Ammo",
            "is standard ac"
        ],
        "ammoType": "is_standard_ac",
        "weaponIds": ["is_ac_20"],
        "compatibleWeaponNames": ["AC/20"],
        "techBase": "Inner Sphere",
        "rulesLevel": "Introductory",
        "shotsPerTon": 5,
        "costPerTon": 10000,
        "bv": 22,
        "availability": {
        
                    "starLeague": "D",
        
                    "successionWars": "E",
        
                    "clanInvasion": "D",
        
                },
        "source": {
                    "weightSpacePage": 341,
                    "battleValuePage": 317,
                    "costAvailabilityPage": 294
                }
    },
    "is_ac_2_ammo": {
        "id": "is_ac_2_ammo",
        "name": "AC/2 Ammo",
        "altNames": [
            "IS AC/2",
            "IS AC/2 Ammo",
            "IS Autocannon/2",
            "IS Autocannon/2 Ammo",
            "AC 2",
            "AC 2 Ammo",
            "Autocannon 2",
            "Autocannon 2 Ammo",
            "is standard ac"
        ],
        "ammoType": "is_standard_ac",
        "weaponIds": ["is_ac_2"],
        "compatibleWeaponNames": ["AC/2"],
        "techBase": "Inner Sphere",
        "rulesLevel": "Introductory",
        "shotsPerTon": 45,
        "costPerTon": 1000,
        "bv": 5,
        "availability": {
        
                    "starLeague": "C",
        
                    "successionWars": "D",
        
                    "clanInvasion": "D",
        
                },
        "source": {
                    "weightSpacePage": 341,
                    "battleValuePage": 317,
                    "costAvailabilityPage": 294
                }
    },
    "is_ac_5_ammo": {
        "id": "is_ac_5_ammo",
        "name": "AC/5 Ammo",
        "altNames": [
            "IS AC/5",
            "IS AC/5 Ammo",
            "IS Autocannon/5",
            "IS Autocannon/5 Ammo",
            "AC 5",
            "AC 5 Ammo",
            "Autocannon 5",
            "Autocannon 5 Ammo",
            "is standard ac"
        ],
        "ammoType": "is_standard_ac",
        "weaponIds": ["is_ac_5"],
        "compatibleWeaponNames": ["AC/5"],
        "techBase": "Inner Sphere",
        "rulesLevel": "Introductory",
        "shotsPerTon": 20,
        "costPerTon": 4500,
        "bv": 9,
        "availability": {
        
                    "starLeague": "C",
        
                    "successionWars": "C",
        
                    "clanInvasion": "D",
        
                },
        "source": {
                    "weightSpacePage": 341,
                    "battleValuePage": 317,
                    "costAvailabilityPage": 294
                }
    },
    "is_b_pod_ammo": {
        "id": "is_b_pod_ammo",
        "name": "B-Pod Ammo",
        "altNames": [
            "IS B-Pod",
            "IS B-Pod Ammo",
            "B Pod",
            "B Pod Ammo"
        ],
        "ammoType": "is_b_pod_ammo",
        "weaponIds": ["is_b_pod"],
        "compatibleWeaponNames": ["B-Pod"],
        "techBase": "Inner Sphere",
        "rulesLevel": "Standard",
        "shotsPerTon": "OS",
        "source": {
                    "weightSpacePage": 342,
                    "battleValuePage": 317
                }
    },
    "is_elrm_10_ammo": {
        "id": "is_elrm_10_ammo",
        "name": "Extended LRM 10 Ammo",
        "altNames": [
            "IS Extended LRM 10",
            "IS Extended LRM 10 Ammo",
            "IS LRM 10 Ammo",
            "IS LRM 10 LRM Ammo",
            "IS LRM 10 SRM Ammo",
            "Extended LRM 10",
            "is elrm 10",
            "is elrm 10 ammo",
            "is lrm",
            "LRM 10 Ammo",
            "LRM 10 LRM Ammo",
            "LRM 10 SRM Ammo"
        ],
        "ammoType": "is_lrm",
        "weaponIds": ["is_elrm_10"],
        "compatibleWeaponNames": ["Extended LRM 10"],
        "techBase": "Inner Sphere",
        "rulesLevel": "Advanced",
        "shotsPerTon": 9,
        "costPerTon": 35000,
        "bv": 16,
        "availability": {
        
                    "starLeague": "X",
        
                    "successionWars": "X",
        
                    "clanInvasion": "F",
        
                },
        "source": {
                    "weightSpacePage": 341,
                    "battleValuePage": 317,
                    "costAvailabilityPage": 295
                }
    },
    "is_elrm_15_ammo": {
        "id": "is_elrm_15_ammo",
        "name": "Extended LRM 15 Ammo",
        "altNames": [
            "IS Extended LRM 15",
            "IS Extended LRM 15 Ammo",
            "IS LRM 15 Ammo",
            "IS LRM 15 LRM Ammo",
            "IS LRM 15 SRM Ammo",
            "Extended LRM 15",
            "is elrm 15",
            "is elrm 15 ammo",
            "is lrm",
            "LRM 15 Ammo",
            "LRM 15 LRM Ammo",
            "LRM 15 SRM Ammo"
        ],
        "ammoType": "is_lrm",
        "weaponIds": ["is_elrm_15"],
        "compatibleWeaponNames": ["Extended LRM 15"],
        "techBase": "Inner Sphere",
        "rulesLevel": "Advanced",
        "shotsPerTon": 6,
        "costPerTon": 35000,
        "bv": 25,
        "availability": {
        
                    "starLeague": "X",
        
                    "successionWars": "X",
        
                    "clanInvasion": "F",
        
                },
        "source": {
                    "weightSpacePage": 341,
                    "battleValuePage": 317,
                    "costAvailabilityPage": 295
                }
    },
    "is_elrm_20_ammo": {
        "id": "is_elrm_20_ammo",
        "name": "Extended LRM 20 Ammo",
        "altNames": [
            "IS Extended LRM 20",
            "IS Extended LRM 20 Ammo",
            "IS LRM 20 Ammo",
            "IS LRM 20 LRM Ammo",
            "IS LRM 20 SRM Ammo",
            "Extended LRM 20",
            "is elrm 20",
            "is elrm 20 ammo",
            "is lrm",
            "LRM 20 Ammo",
            "LRM 20 LRM Ammo",
            "LRM 20 SRM Ammo"
        ],
        "ammoType": "is_lrm",
        "weaponIds": ["is_elrm_20"],
        "compatibleWeaponNames": ["Extended LRM 20"],
        "techBase": "Inner Sphere",
        "rulesLevel": "Advanced",
        "shotsPerTon": 4,
        "costPerTon": 35000,
        "bv": 34,
        "availability": {
        
                    "starLeague": "X",
        
                    "successionWars": "X",
        
                    "clanInvasion": "F",
        
                },
        "source": {
                    "weightSpacePage": 341,
                    "battleValuePage": 317,
                    "costAvailabilityPage": 295
                }
    },
    "is_elrm_5_ammo": {
        "id": "is_elrm_5_ammo",
        "name": "Extended LRM 5 Ammo",
        "altNames": [
            "IS Extended LRM 5",
            "IS Extended LRM 5 Ammo",
            "IS LRM 5 Ammo",
            "IS LRM 5 LRM Ammo",
            "IS LRM 5 SRM Ammo",
            "Extended LRM 5",
            "is elrm 5",
            "is elrm 5 ammo",
            "is lrm",
            "LRM 5 Ammo",
            "LRM 5 LRM Ammo",
            "LRM 5 SRM Ammo"
        ],
        "ammoType": "is_lrm",
        "weaponIds": ["is_elrm_5"],
        "compatibleWeaponNames": ["Extended LRM 5"],
        "techBase": "Inner Sphere",
        "rulesLevel": "Advanced",
        "shotsPerTon": 18,
        "costPerTon": 30000,
        "bv": 8,
        "availability": {
        
                    "starLeague": "X",
        
                    "successionWars": "X",
        
                    "clanInvasion": "F",
        
                },
        "source": {
                    "weightSpacePage": 341,
                    "battleValuePage": 317,
                    "costAvailabilityPage": 295
                }
    },
    "is_enhanced_lrm_10_ammo": {
        "id": "is_enhanced_lrm_10_ammo",
        "name": "Enhanced LRM 10 Ammo",
        "altNames": [
            "IS Enhanced LRM 10",
            "IS Enhanced LRM 10 Ammo",
            "IS LRM 10 Ammo",
            "IS LRM 10 LRM Ammo",
            "IS LRM 10 SRM Ammo",
            "Enhanced LRM 10",
            "is enhanced lrm",
            "LRM 10 Ammo",
            "LRM 10 LRM Ammo",
            "LRM 10 SRM Ammo"
        ],
        "ammoType": "is_enhanced_lrm",
        "weaponIds": ["is_enhanced_lrm_10"],
        "compatibleWeaponNames": ["Enhanced LRM 10"],
        "techBase": "Inner Sphere",
        "rulesLevel": "Advanced",
        "shotsPerTon": 12,
        "costPerTon": 30000,
        "bv": 13,
        "availability": {
        
                    "starLeague": "X",
        
                    "successionWars": "X",
        
                    "clanInvasion": "E",
        
                },
        "source": {
                        "battleValuePage": 0,
                        "weightSpacePage": 0
                }
    },
    "is_enhanced_lrm_15_ammo": {
        "id": "is_enhanced_lrm_15_ammo",
        "name": "Enhanced LRM 15 Ammo",
        "altNames": [
            "IS Enhanced LRM 15",
            "IS Enhanced LRM 15 Ammo",
            "IS LRM 15 Ammo",
            "IS LRM 15 LRM Ammo",
            "IS LRM 15 SRM Ammo",
            "Enhanced LRM 15",
            "is enhanced lrm",
            "LRM 15 Ammo",
            "LRM 15 LRM Ammo",
            "LRM 15 SRM Ammo"
        ],
        "ammoType": "is_enhanced_lrm",
        "weaponIds": ["is_enhanced_lrm_15"],
        "compatibleWeaponNames": ["Enhanced LRM 15"],
        "techBase": "Inner Sphere",
        "rulesLevel": "Advanced",
        "shotsPerTon": 8,
        "costPerTon": 30000,
        "bv": 20,
        "availability": {
        
                    "starLeague": "X",
        
                    "successionWars": "X",
        
                    "clanInvasion": "E",
        
                },
        "source": {
                        "battleValuePage": 0,
                        "weightSpacePage": 0
                }
    },
    "is_enhanced_lrm_20_ammo": {
        "id": "is_enhanced_lrm_20_ammo",
        "name": "Enhanced LRM 20 Ammo",
        "altNames": [
            "IS Enhanced LRM 20",
            "IS Enhanced LRM 20 Ammo",
            "IS LRM 20 Ammo",
            "IS LRM 20 LRM Ammo",
            "IS LRM 20 SRM Ammo",
            "Enhanced LRM 20",
            "is enhanced lrm",
            "LRM 20 Ammo",
            "LRM 20 LRM Ammo",
            "LRM 20 SRM Ammo"
        ],
        "ammoType": "is_enhanced_lrm",
        "weaponIds": ["is_enhanced_lrm_20"],
        "compatibleWeaponNames": ["Enhanced LRM 20"],
        "techBase": "Inner Sphere",
        "rulesLevel": "Advanced",
        "shotsPerTon": 6,
        "costPerTon": 30000,
        "bv": 26,
        "availability": {
        
                    "starLeague": "X",
        
                    "successionWars": "X",
        
                    "clanInvasion": "E",
        
                },
        "source": {
                        "battleValuePage": 0,
                        "weightSpacePage": 0
                }
    },
    "is_enhanced_lrm_5_ammo": {
        "id": "is_enhanced_lrm_5_ammo",
        "name": "Enhanced LRM 5 Ammo",
        "altNames": [
            "IS Enhanced LRM 5",
            "IS Enhanced LRM 5 Ammo",
            "IS LRM 5 Ammo",
            "IS LRM 5 LRM Ammo",
            "IS LRM 5 SRM Ammo",
            "Enhanced LRM 5",
            "is enhanced lrm",
            "LRM 5 Ammo",
            "LRM 5 LRM Ammo",
            "LRM 5 SRM Ammo"
        ],
        "ammoType": "is_enhanced_lrm",
        "weaponIds": ["is_enhanced_lrm_5"],
        "compatibleWeaponNames": ["Enhanced LRM 5"],
        "techBase": "Inner Sphere",
        "rulesLevel": "Advanced",
        "shotsPerTon": 24,
        "costPerTon": 30000,
        "bv": 7,
        "availability": {
        
                    "starLeague": "X",
        
                    "successionWars": "X",
        
                    "clanInvasion": "E",
        
                },
        "source": {
                        "battleValuePage": 0,
                        "weightSpacePage": 0
                }
    },
    "is_flamer_vehicle_ammo": {
        "id": "is_flamer_vehicle_ammo",
        "name": "Flamer (Vehicle) Ammo",
        "altNames": [
            "IS Flamer (Vehicle)",
            "IS Flamer (Vehicle) Ammo",
            "Flamer (Vehicle)",
            "is vehicle flamer"
        ],
        "ammoType": "is_vehicle_flamer",
        "weaponIds": ["is_flamer_vehicle"],
        "compatibleWeaponNames": ["Flamer (Vehicle)"],
        "techBase": "Inner Sphere",
        "rulesLevel": "Standard",
        "shotsPerTon": 20,
        "costPerTon": 1000,
        "bv": 1,
        "availability": {
        
                    "starLeague": "A",
        
                    "successionWars": "A",
        
                    "clanInvasion": "B",
        
                },
        "source": {
                    "weightSpacePage": 341,
                    "battleValuePage": 317,
                    "costAvailabilityPage": 294
                }
    },
    "is_gauss_rifle_ammo": {
        "id": "is_gauss_rifle_ammo",
        "name": "Gauss Rifle Ammo",
        "altNames": [
            "IS Gauss Rifle",
            "IS Gauss Rifle Ammo",
            "Gauss Rifle",
            "is gauss"
        ],
        "ammoType": "is_gauss",
        "weaponIds": ["is_gauss_rifle"],
        "compatibleWeaponNames": ["Gauss Rifle"],
        "techBase": "Inner Sphere",
        "rulesLevel": "Standard",
        "shotsPerTon": 8,
        "costPerTon": 20000,
        "bv": 40,
        "availability": {
        
                    "starLeague": "D",
        
                    "successionWars": "F",
        
                    "clanInvasion": "D",
        
                },
        "source": {
                    "weightSpacePage": 341,
                    "battleValuePage": 317,
                    "costAvailabilityPage": 294
                }
    },
    "is_heavy_flamer_ammo": {
        "id": "is_heavy_flamer_ammo",
        "name": "Heavy Flamer Ammo",
        "altNames": [
            "IS Heavy Flamer",
            "IS Heavy Flamer Ammo",
            "Heavy Flamer"
        ],
        "ammoType": "is_heavy_flamer",
        "weaponIds": ["is_heavy_flamer"],
        "compatibleWeaponNames": ["Heavy Flamer"],
        "techBase": "Inner Sphere",
        "rulesLevel": "Advanced",
        "shotsPerTon": 10,
        "costPerTon": 2000,
        "bv": 2,
        "availability": {
        
                    "starLeague": "X",
        
                    "successionWars": "X",
        
                    "clanInvasion": "E",
        
                },
        "source": {
                    "weightSpacePage": 341,
                    "battleValuePage": 317,
                    "costAvailabilityPage": 0
                }
    },
    "is_heavy_gauss_rifle_ammo": {
        "id": "is_heavy_gauss_rifle_ammo",
        "name": "Heavy Gauss Rifle Ammo",
        "altNames": [
            "IS Heavy Gauss Rifle",
            "IS Heavy Gauss Rifle Ammo",
            "Heavy Gauss Rifle",
            "is heavy gauss"
        ],
        "ammoType": "is_heavy_gauss",
        "weaponIds": ["is_heavy_gauss_rifle"],
        "compatibleWeaponNames": ["Heavy Gauss Rifle"],
        "techBase": "Inner Sphere",
        "rulesLevel": "Standard",
        "shotsPerTon": 4,
        "costPerTon": 20000,
        "bv": 43,
        "availability": {
        
                    "starLeague": "X",
        
                    "successionWars": "X",
        
                    "clanInvasion": "E",
        
                },
        "source": {
                    "weightSpacePage": 341,
                    "battleValuePage": 317,
                    "costAvailabilityPage": 294
                }
    },
    "is_heavy_machine_gun_ammo": {
        "id": "is_heavy_machine_gun_ammo",
        "name": "Heavy Machine Gun Ammo",
        "altNames": [
            "IS Heavy Machine Gun",
            "IS Heavy Machine Gun Ammo",
            "IS Machine Gun Ammo",
            "Heavy Machine Gun",
            "is machine gun",
            "Machine Gun Ammo"
        ],
        "ammoType": "is_machine_gun",
        "weaponIds": ["is_heavy_machine_gun"],
        "compatibleWeaponNames": ["Heavy Machine Gun"],
        "techBase": "Inner Sphere",
        "rulesLevel": "Standard",
        "shotsPerTon": 100,
        "costPerTon": 1000,
        "bv": 1,
        "availability": {
        
                    "starLeague": "X",
        
                    "successionWars": "X",
        
                    "clanInvasion": "C",
        
                },
        "source": {
                    "weightSpacePage": 341,
                    "battleValuePage": 317,
                    "costAvailabilityPage": 294
                }
    },
    "is_improved_heavy_gauss_rifle_ammo": {
        "id": "is_improved_heavy_gauss_rifle_ammo",
        "name": "Improved Heavy Gauss Rifle Ammo",
        "altNames": [
            "IS Improved Heavy Gauss Rifle",
            "IS Improved Heavy Gauss Rifle Ammo",
            "Improved Heavy Gauss Rifle",
            "is heavy gauss"
        ],
        "ammoType": "is_heavy_gauss",
        "weaponIds": ["is_improved_heavy_gauss_rifle"],
        "compatibleWeaponNames": ["Improved Heavy Gauss Rifle"],
        "techBase": "Inner Sphere",
        "rulesLevel": "Standard",
        "shotsPerTon": 4,
        "costPerTon": 20000,
        "bv": 48,
        "availability": {
        
                    "starLeague": "X",
        
                    "successionWars": "X",
        
                    "clanInvasion": "F",
        
                },
        "source": {
                    "weightSpacePage": 341,
                    "battleValuePage": 317,
                    "costAvailabilityPage": 294
                }
    },
    "is_improved_narc_launcher_ammo": {
        "id": "is_improved_narc_launcher_ammo",
        "name": "Improved Narc Launcher Ammo",
        "altNames": [
            "IS Improved Narc Launcher",
            "IS Improved Narc Launcher Ammo",
            "Improved Narc Launcher",
            "is narc"
        ],
        "ammoType": "is_narc",
        "weaponIds": ["is_improved_narc_launcher"],
        "compatibleWeaponNames": ["Improved Narc Launcher"],
        "techBase": "Inner Sphere",
        "rulesLevel": "Standard",
        "shotsPerTon": 4,
        "costPerTon": 7500,
        "bv": 0,
        "source": {
                    "weightSpacePage": 341,
                    "battleValuePage": 317
                }
    },
    "is_lb_10_x_ac_ammo": {
        "id": "is_lb_10_x_ac_ammo",
        "name": "LB 10-X AC Ammo",
        "altNames": [
            "IS LB 10-X AC",
            "IS LB 10-X AC Ammo",
            "IS LB 10-X AC Cluster Ammo",
            "IS LB 10-X Ammo",
            "IS LB 10-X Cluster Ammo",
            "IS LBX AC 10 Ammo",
            "IS LBX AC 10 Cluster Ammo",
            "is lb x ac",
            "LB 10 X AC",
            "LB 10 X AC Ammo",
            "LB 10-X AC Cluster Ammo",
            "LB 10-X Ammo",
            "LB 10-X Cluster Ammo",
            "LBX AC 10 Ammo",
            "LBX AC 10 Cluster Ammo"
        ],
        "ammoType": "is_lb_x_ac",
        "weaponIds": ["is_lb_10_x_ac"],
        "compatibleWeaponNames": ["LB 10-X AC"],
        "techBase": "Inner Sphere",
        "rulesLevel": "Standard",
        "shotsPerTon": 10,
        "costPerTon": 12000,
        "bv": 19,
        "availability": {
        
                    "starLeague": "C",
        
                    "successionWars": "E",
        
                    "clanInvasion": "D",
        
                },
        "source": {
                    "weightSpacePage": 341,
                    "battleValuePage": 317,
                    "costAvailabilityPage": 294
                }
    },
    "is_lb_20_x_ac_ammo": {
        "id": "is_lb_20_x_ac_ammo",
        "name": "LB 20-X AC Ammo",
        "altNames": [
            "IS LB 20-X AC",
            "IS LB 20-X AC Ammo",
            "IS LB 20-X AC Cluster Ammo",
            "IS LB 20-X Ammo",
            "IS LB 20-X Cluster Ammo",
            "IS LBX AC 20 Ammo",
            "IS LBX AC 20 Cluster Ammo",
            "is lb x ac",
            "LB 20 X AC",
            "LB 20 X AC Ammo",
            "LB 20-X AC Cluster Ammo",
            "LB 20-X Ammo",
            "LB 20-X Cluster Ammo",
            "LBX AC 20 Ammo",
            "LBX AC 20 Cluster Ammo"
        ],
        "ammoType": "is_lb_x_ac",
        "weaponIds": ["is_lb_20_x_ac"],
        "compatibleWeaponNames": ["LB 20-X AC"],
        "techBase": "Inner Sphere",
        "rulesLevel": "Standard",
        "shotsPerTon": 5,
        "costPerTon": 20000,
        "bv": 30,
        "availability": {
        
                    "starLeague": "X",
        
                    "successionWars": "X",
        
                    "clanInvasion": "E",
        
                },
        "source": {
                    "weightSpacePage": 341,
                    "battleValuePage": 317,
                    "costAvailabilityPage": 294
                }
    },
    "is_lb_2_x_ac_ammo": {
        "id": "is_lb_2_x_ac_ammo",
        "name": "LB 2-X AC Ammo",
        "altNames": [
            "IS LB 2-X AC",
            "IS LB 2-X AC Ammo",
            "IS LB 2-X AC Cluster Ammo",
            "IS LB 2-X Ammo",
            "IS LB 2-X Cluster Ammo",
            "IS LBX AC 2 Ammo",
            "IS LBX AC 2 Cluster Ammo",
            "is lb x ac",
            "LB 2 X AC",
            "LB 2 X AC Ammo",
            "LB 2-X AC Cluster Ammo",
            "LB 2-X Ammo",
            "LB 2-X Cluster Ammo",
            "LBX AC 2 Ammo",
            "LBX AC 2 Cluster Ammo"
        ],
        "ammoType": "is_lb_x_ac",
        "weaponIds": ["is_lb_2_x_ac"],
        "compatibleWeaponNames": ["LB 2-X AC"],
        "techBase": "Inner Sphere",
        "rulesLevel": "Standard",
        "shotsPerTon": 45,
        "costPerTon": 2000,
        "bv": 5,
        "availability": {
        
                    "starLeague": "X",
        
                    "successionWars": "X",
        
                    "clanInvasion": "E",
        
                },
        "source": {
                    "weightSpacePage": 341,
                    "battleValuePage": 317,
                    "costAvailabilityPage": 294
                }
    },
    "is_lb_5_x_ac_ammo": {
        "id": "is_lb_5_x_ac_ammo",
        "name": "LB 5-X AC Ammo",
        "altNames": [
            "IS LB 5-X AC",
            "IS LB 5-X AC Ammo",
            "IS LB 5-X AC Cluster Ammo",
            "IS LB 5-X Ammo",
            "IS LB 5-X Cluster Ammo",
            "IS LBX AC 5 Ammo",
            "IS LBX AC 5 Cluster Ammo",
            "is lb x ac",
            "LB 5 X AC",
            "LB 5 X AC Ammo",
            "LB 5-X AC Cluster Ammo",
            "LB 5-X Ammo",
            "LB 5-X Cluster Ammo",
            "LBX AC 5 Ammo",
            "LBX AC 5 Cluster Ammo"
        ],
        "ammoType": "is_lb_x_ac",
        "weaponIds": ["is_lb_5_x_ac"],
        "compatibleWeaponNames": ["LB 5-X AC"],
        "techBase": "Inner Sphere",
        "rulesLevel": "Standard",
        "shotsPerTon": 20,
        "costPerTon": 9000,
        "bv": 10,
        "availability": {
        
                    "starLeague": "X",
        
                    "successionWars": "X",
        
                    "clanInvasion": "D",
        
                },
        "source": {
                    "weightSpacePage": 341,
                    "battleValuePage": 317,
                    "costAvailabilityPage": 294
                }
    },
    "is_lb_10_x_ac_cl_ammo": {
        "id": "is_lb_10_x_ac_cl_ammo",
        "name": "LB 10-X AC Cluster Ammo",
        "altNames": [
            "IS LB 10-X Cluster Ammo",
            "IS LB 10-X AC Cluster Ammo",
            "IS LB 10-X AC",
            "IS LB 10-X AC Ammo",
            "IS LB 10-X Ammo",
            "IS LBX AC 10 Ammo",
            "IS LBX AC 10 Cluster Ammo",
            "is lb 10 x ac cl ammo",
            "is lb x ac cluster",
            "LB 10 X AC",
            "LB 10 X AC Cluster Ammo",
            "LB 10-X AC Ammo",
            "LB 10-X Ammo",
            "LB 10-X Cluster Ammo",
            "LBX AC 10 Ammo",
            "LBX AC 10 Cluster Ammo"
        ],
        "ammoType": "is_lb_x_ac_cluster",
        "weaponIds": ["is_lb_10_x_ac"],
        "compatibleWeaponNames": ["LB 10-X AC"],
        "techBase": "Inner Sphere",
        "rulesLevel": "Standard",
        "shotsPerTon": 10,
        "costPerTon": 20000,
        "bv": 19,
        "availability": {
        
                    "starLeague": "E",
        
                    "successionWars": "F",
        
                    "clanInvasion": "D",
        
                },
        "source": {
                    "weightSpacePage": 341,
                    "battleValuePage": 317,
                    "costAvailabilityPage": 294
                }
    },
    "is_lb_20_x_ac_cl_ammo": {
        "id": "is_lb_20_x_ac_cl_ammo",
        "name": "LB 20-X AC Cluster Ammo",
        "altNames": [
            "IS LB 20-X Cluster Ammo",
            "IS LB 20-X AC Cluster Ammo",
            "IS LB 20-X AC",
            "IS LB 20-X AC Ammo",
            "IS LB 20-X Ammo",
            "IS LBX AC 20 Ammo",
            "IS LBX AC 20 Cluster Ammo",
            "is lb 20 x ac cl ammo",
            "is lb x ac cluster",
            "LB 20 X AC",
            "LB 20 X AC Cluster Ammo",
            "LB 20-X AC Ammo",
            "LB 20-X Ammo",
            "LB 20-X Cluster Ammo",
            "LBX AC 20 Ammo",
            "LBX AC 20 Cluster Ammo"
        ],
        "ammoType": "is_lb_x_ac_cluster",
        "weaponIds": ["is_lb_20_x_ac"],
        "compatibleWeaponNames": ["LB 20-X AC"],
        "techBase": "Inner Sphere",
        "rulesLevel": "Standard",
        "shotsPerTon": 5,
        "costPerTon": 34000,
        "bv": 30,
        "availability": {
        
                    "starLeague": "X",
        
                    "successionWars": "X",
        
                    "clanInvasion": "E",
        
                },
        "source": {
                    "weightSpacePage": 341,
                    "battleValuePage": 317,
                    "costAvailabilityPage": 294
                }
    },
    "is_lb_2_x_ac_cl_ammo": {
        "id": "is_lb_2_x_ac_cl_ammo",
        "name": "LB 2-X AC Cluster Ammo",
        "altNames": [
            "IS LB 2-X Cluster Ammo",
            "IS LB 2-X AC Cluster Ammo",
            "IS LB 2-X AC",
            "IS LB 2-X AC Ammo",
            "IS LB 2-X Ammo",
            "IS LBX AC 2 Ammo",
            "IS LBX AC 2 Cluster Ammo",
            "is lb 2 x ac cl ammo",
            "is lb x ac cluster",
            "LB 2 X AC",
            "LB 2 X AC Cluster Ammo",
            "LB 2-X AC Ammo",
            "LB 2-X Ammo",
            "LB 2-X Cluster Ammo",
            "LBX AC 2 Ammo",
            "LBX AC 2 Cluster Ammo"
        ],
        "ammoType": "is_lb_x_ac_cluster",
        "weaponIds": ["is_lb_2_x_ac"],
        "compatibleWeaponNames": ["LB 2-X AC"],
        "techBase": "Inner Sphere",
        "rulesLevel": "Standard",
        "shotsPerTon": 45,
        "costPerTon": 3300,
        "bv": 5,
        "availability": {
        
                    "starLeague": "X",
        
                    "successionWars": "X",
        
                    "clanInvasion": "E",
        
                },
        "source": {
                    "weightSpacePage": 341,
                    "battleValuePage": 317,
                    "costAvailabilityPage": 294
                }
    },
    "is_lb_5_x_ac_cl_ammo": {
        "id": "is_lb_5_x_ac_cl_ammo",
        "name": "LB 5-X AC Cluster Ammo",
        "altNames": [
            "IS LB 5-X Cluster Ammo",
            "IS LB 5-X AC Cluster Ammo",
            "IS LB 5-X AC",
            "IS LB 5-X AC Ammo",
            "IS LB 5-X Ammo",
            "IS LBX AC 5 Ammo",
            "IS LBX AC 5 Cluster Ammo",
            "is lb 5 x ac cl ammo",
            "is lb x ac cluster",
            "LB 5 X AC",
            "LB 5 X AC Cluster Ammo",
            "LB 5-X AC Ammo",
            "LB 5-X Ammo",
            "LB 5-X Cluster Ammo",
            "LBX AC 5 Ammo",
            "LBX AC 5 Cluster Ammo"
        ],
        "ammoType": "is_lb_x_ac_cluster",
        "weaponIds": ["is_lb_5_x_ac"],
        "compatibleWeaponNames": ["LB 5-X AC"],
        "techBase": "Inner Sphere",
        "rulesLevel": "Standard",
        "shotsPerTon": 20,
        "costPerTon": 15000,
        "bv": 10,
        "availability": {
        
                    "starLeague": "X",
        
                    "successionWars": "X",
        
                    "clanInvasion": "D",
        
                },
        "source": {
                    "weightSpacePage": 341,
                    "battleValuePage": 317,
                    "costAvailabilityPage": 294
                }
    },
    "is_light_ac_2_ammo": {
        "id": "is_light_ac_2_ammo",
        "name": "Light AC/2 Ammo",
        "altNames": [
            "IS Light AC/2",
            "IS Light AC/2 Ammo",
            "is light ac",
            "Light AC 2",
            "Light AC 2 Ammo"
        ],
        "ammoType": "is_light_ac",
        "weaponIds": ["is_light_ac_2"],
        "compatibleWeaponNames": ["Light AC/2"],
        "techBase": "Inner Sphere",
        "rulesLevel": "Standard",
        "shotsPerTon": 45,
        "costPerTon": 1000,
        "bv": 4,
        "availability": {
        
                    "starLeague": "X",
        
                    "successionWars": "X",
        
                    "clanInvasion": "F",
        
                },
        "source": {
                    "weightSpacePage": 341,
                    "battleValuePage": 317,
                    "costAvailabilityPage": 294
                }
    },
    "is_light_ac_5_ammo": {
        "id": "is_light_ac_5_ammo",
        "name": "Light AC/5 Ammo",
        "altNames": [
            "IS Light AC/5",
            "IS Light AC/5 Ammo",
            "is light ac",
            "Light AC 5",
            "Light AC 5 Ammo"
        ],
        "ammoType": "is_light_ac",
        "weaponIds": ["is_light_ac_5"],
        "compatibleWeaponNames": ["Light AC/5"],
        "techBase": "Inner Sphere",
        "rulesLevel": "Standard",
        "shotsPerTon": 20,
        "costPerTon": 4500,
        "bv": 8,
        "availability": {
        
                    "starLeague": "X",
        
                    "successionWars": "X",
        
                    "clanInvasion": "F",
        
                },
        "source": {
                    "weightSpacePage": 341,
                    "battleValuePage": 317,
                    "costAvailabilityPage": 294
                }
    },
    "is_light_gauss_rifle_ammo": {
        "id": "is_light_gauss_rifle_ammo",
        "name": "Light Gauss Rifle Ammo",
        "altNames": [
            "IS Light Gauss Rifle",
            "IS Light Gauss Rifle Ammo",
            "is light gauss",
            "Light Gauss Rifle"
        ],
        "ammoType": "is_light_gauss",
        "weaponIds": ["is_light_gauss_rifle"],
        "compatibleWeaponNames": ["Light Gauss Rifle"],
        "techBase": "Inner Sphere",
        "rulesLevel": "Standard",
        "shotsPerTon": 16,
        "costPerTon": 20000,
        "bv": 20,
        "availability": {
        
                    "starLeague": "X",
        
                    "successionWars": "X",
        
                    "clanInvasion": "E",
        
                },
        "source": {
                    "weightSpacePage": 341,
                    "battleValuePage": 317,
                    "costAvailabilityPage": 294
                }
    },
    "is_light_machine_gun_ammo": {
        "id": "is_light_machine_gun_ammo",
        "name": "Light Machine Gun Ammo",
        "altNames": [
            "IS Light Machine Gun",
            "IS Light Machine Gun Ammo",
            "IS Machine Gun Ammo",
            "is machine gun",
            "Light Machine Gun",
            "Machine Gun Ammo"
        ],
        "ammoType": "is_machine_gun",
        "weaponIds": ["is_light_machine_gun"],
        "compatibleWeaponNames": ["Light Machine Gun"],
        "techBase": "Inner Sphere",
        "rulesLevel": "Standard",
        "shotsPerTon": 200,
        "costPerTon": 500,
        "bv": 1,
        "availability": {
        
                    "starLeague": "X",
        
                    "successionWars": "X",
        
                    "clanInvasion": "C",
        
                },
        "source": {
                    "weightSpacePage": 341,
                    "battleValuePage": 317,
                    "costAvailabilityPage": 294
                }
    },
    "is_lrm_10_ammo": {
        "id": "is_lrm_10_ammo",
        "name": "LRM 10 Ammo",
        "altNames": [
            "IS LRM 10",
            "IS LRM 10 Ammo",
            "IS LRM 10 LRM Ammo",
            "IS LRM 10 SRM Ammo",
            "is lrm",
            "LRM 10",
            "LRM 10 LRM Ammo",
            "LRM 10 SRM Ammo"
        ],
        "ammoType": "is_lrm",
        "weaponIds": ["is_lrm_10"],
        "compatibleWeaponNames": ["LRM 10"],
        "techBase": "Inner Sphere",
        "rulesLevel": "Introductory",
        "shotsPerTon": 12,
        "costPerTon": 30000,
        "bv": 11,
        "availability": {
        
                    "starLeague": "C",
        
                    "successionWars": "C",
        
                    "clanInvasion": "C",
        
                },
        "source": {
                    "weightSpacePage": 341,
                    "battleValuePage": 317,
                    "costAvailabilityPage": 295
                }
    },
    "is_lrm_15_ammo": {
        "id": "is_lrm_15_ammo",
        "name": "LRM 15 Ammo",
        "altNames": [
            "IS LRM 15",
            "IS LRM 15 Ammo",
            "IS LRM 15 LRM Ammo",
            "IS LRM 15 SRM Ammo",
            "is lrm",
            "LRM 15",
            "LRM 15 LRM Ammo",
            "LRM 15 SRM Ammo"
        ],
        "ammoType": "is_lrm",
        "weaponIds": ["is_lrm_15"],
        "compatibleWeaponNames": ["LRM 15"],
        "techBase": "Inner Sphere",
        "rulesLevel": "Introductory",
        "shotsPerTon": 8,
        "costPerTon": 30000,
        "bv": 17,
        "availability": {
        
                    "starLeague": "C",
        
                    "successionWars": "C",
        
                    "clanInvasion": "C",
        
                },
        "source": {
                    "weightSpacePage": 341,
                    "battleValuePage": 317,
                    "costAvailabilityPage": 295
                }
    },
    "is_lrm_20_ammo": {
        "id": "is_lrm_20_ammo",
        "name": "LRM 20 Ammo",
        "altNames": [
            "IS LRM 20",
            "IS LRM 20 Ammo",
            "IS LRM 20 LRM Ammo",
            "IS LRM 20 SRM Ammo",
            "is lrm",
            "LRM 20",
            "LRM 20 LRM Ammo",
            "LRM 20 SRM Ammo"
        ],
        "ammoType": "is_lrm",
        "weaponIds": ["is_lrm_20"],
        "compatibleWeaponNames": ["LRM 20"],
        "techBase": "Inner Sphere",
        "rulesLevel": "Introductory",
        "shotsPerTon": 6,
        "costPerTon": 30000,
        "bv": 23,
        "availability": {
        
                    "starLeague": "C",
        
                    "successionWars": "C",
        
                    "clanInvasion": "C",
        
                },
        "source": {
                    "weightSpacePage": 341,
                    "battleValuePage": 317,
                    "costAvailabilityPage": 295
                }
    },
    "is_lrm_5_ammo": {
        "id": "is_lrm_5_ammo",
        "name": "LRM 5 Ammo",
        "altNames": [
            "IS LRM 5",
            "IS LRM 5 Ammo",
            "IS LRM 5 LRM Ammo",
            "IS LRM 5 SRM Ammo",
            "is lrm",
            "LRM 5",
            "LRM 5 LRM Ammo",
            "LRM 5 SRM Ammo"
        ],
        "ammoType": "is_lrm",
        "weaponIds": ["is_lrm_5"],
        "compatibleWeaponNames": ["LRM 5"],
        "techBase": "Inner Sphere",
        "rulesLevel": "Introductory",
        "shotsPerTon": 24,
        "costPerTon": 30000,
        "bv": 6,
        "availability": {
        
                    "starLeague": "C",
        
                    "successionWars": "C",
        
                    "clanInvasion": "C",
        
                },
        "source": {
                    "weightSpacePage": 341,
                    "battleValuePage": 317,
                    "costAvailabilityPage": 295
                }
    },
    "is_machine_gun_ammo": {
        "id": "is_machine_gun_ammo",
        "name": "Machine Gun Ammo",
        "altNames": [
            "IS Machine Gun",
            "IS Machine Gun Ammo",
            "Machine Gun",
            "IS Ammo MG - Full"
        ],
        "ammoType": "is_machine_gun",
        "weaponIds": ["is_machine_gun"],
        "compatibleWeaponNames": ["Machine Gun"],
        "techBase": "Inner Sphere",
        "rulesLevel": "Introductory",
        "shotsPerTon": 200,
        "costPerTon": 1000,
        "bv": 1,
        "availability": {
        
                    "starLeague": "A",
        
                    "successionWars": "A",
        
                    "clanInvasion": "B",
        
                },
        "source": {
                    "weightSpacePage": 341,
                    "battleValuePage": 317,
                    "costAvailabilityPage": 294
                }
    },
    "is_mml_3_lrm_ammo": {
        "id": "is_mml_3_lrm_ammo",
        "name": "MML 3 LRM Ammo",
        "altNames": [
            "IS MML 3",
            "IS MML 3 Ammo",
            "IS MML 3 LRM Ammo",
            "IS MML 3 SRM Ammo",
            "is mml lrm",
            "MML 3",
            "MML 3 Ammo",
            "MML 3 SRM Ammo"
        ],
        "ammoType": "is_mml_lrm",
        "weaponIds": ["is_mml_3"],
        "compatibleWeaponNames": ["MML 3"],
        "mode": "LRM",
        "techBase": "Inner Sphere",
        "rulesLevel": "Standard",
        "shotsPerTon": 40,
        "costPerTon": 30000,
        "bv": 4,
        "source": {
                    "weightSpacePage": 341,
                    "battleValuePage": 317
                }
    },
    "is_mml_3_srm_ammo": {
        "id": "is_mml_3_srm_ammo",
        "name": "MML 3 SRM Ammo",
        "altNames": [
            "IS MML 3",
            "IS MML 3 Ammo",
            "IS MML 3 LRM Ammo",
            "IS MML 3 SRM Ammo",
            "is mml srm",
            "MML 3",
            "MML 3 Ammo",
            "MML 3 LRM Ammo"
        ],
        "ammoType": "is_mml_srm",
        "weaponIds": ["is_mml_3"],
        "compatibleWeaponNames": ["MML 3"],
        "mode": "SRM",
        "techBase": "Inner Sphere",
        "rulesLevel": "Standard",
        "shotsPerTon": 33,
        "costPerTon": 27000,
        "bv": 4,
        "source": {
                    "weightSpacePage": 341,
                    "battleValuePage": 317
                }
    },
    "is_mml_5_lrm_ammo": {
        "id": "is_mml_5_lrm_ammo",
        "name": "MML 5 LRM Ammo",
        "altNames": [
            "IS MML 5",
            "IS MML 5 Ammo",
            "IS MML 5 LRM Ammo",
            "IS MML 5 SRM Ammo",
            "is mml lrm",
            "MML 5",
            "MML 5 Ammo",
            "MML 5 SRM Ammo"
        ],
        "ammoType": "is_mml_lrm",
        "weaponIds": ["is_mml_5"],
        "compatibleWeaponNames": ["MML 5"],
        "mode": "LRM",
        "techBase": "Inner Sphere",
        "rulesLevel": "Standard",
        "shotsPerTon": 24,
        "costPerTon": 30000,
        "bv": 6,
        "source": {
                    "weightSpacePage": 341,
                    "battleValuePage": 317
                }
    },
    "is_mml_5_srm_ammo": {
        "id": "is_mml_5_srm_ammo",
        "name": "MML 5 SRM Ammo",
        "altNames": [
            "IS MML 5",
            "IS MML 5 Ammo",
            "IS MML 5 LRM Ammo",
            "IS MML 5 SRM Ammo",
            "is mml srm",
            "MML 5",
            "MML 5 Ammo",
            "MML 5 LRM Ammo"
        ],
        "ammoType": "is_mml_srm",
        "weaponIds": ["is_mml_5"],
        "compatibleWeaponNames": ["MML 5"],
        "mode": "SRM",
        "techBase": "Inner Sphere",
        "rulesLevel": "Standard",
        "shotsPerTon": 20,
        "costPerTon": 27000,
        "bv": 6,
        "source": {
                    "weightSpacePage": 341,
                    "battleValuePage": 317
                }
    },
    "is_mml_7_lrm_ammo": {
        "id": "is_mml_7_lrm_ammo",
        "name": "MML 7 LRM Ammo",
        "altNames": [
            "IS MML 7",
            "IS MML 7 Ammo",
            "IS MML 7 LRM Ammo",
            "IS MML 7 SRM Ammo",
            "is mml lrm",
            "MML 7",
            "MML 7 Ammo",
            "MML 7 SRM Ammo"
        ],
        "ammoType": "is_mml_lrm",
        "weaponIds": ["is_mml_7"],
        "compatibleWeaponNames": ["MML 7"],
        "mode": "LRM",
        "techBase": "Inner Sphere",
        "rulesLevel": "Standard",
        "shotsPerTon": 17,
        "costPerTon": 30000,
        "bv": 8,
        "source": {
                    "weightSpacePage": 341,
                    "battleValuePage": 317
                }
    },
    "is_mml_7_srm_ammo": {
        "id": "is_mml_7_srm_ammo",
        "name": "MML 7 SRM Ammo",
        "altNames": [
            "IS MML 7",
            "IS MML 7 Ammo",
            "IS MML 7 LRM Ammo",
            "IS MML 7 SRM Ammo",
            "is mml srm",
            "MML 7",
            "MML 7 Ammo",
            "MML 7 LRM Ammo"
        ],
        "ammoType": "is_mml_srm",
        "weaponIds": ["is_mml_7"],
        "compatibleWeaponNames": ["MML 7"],
        "mode": "SRM",
        "techBase": "Inner Sphere",
        "rulesLevel": "Standard",
        "shotsPerTon": 14,
        "costPerTon": 27000,
        "bv": 8,
        "source": {
                    "weightSpacePage": 341,
                    "battleValuePage": 317
                }
    },
    "is_mml_9_lrm_ammo": {
        "id": "is_mml_9_lrm_ammo",
        "name": "MML 9 LRM Ammo",
        "altNames": [
            "IS MML 9",
            "IS MML 9 Ammo",
            "IS MML 9 LRM Ammo",
            "IS MML 9 SRM Ammo",
            "is mml lrm",
            "MML 9",
            "MML 9 Ammo",
            "MML 9 SRM Ammo"
        ],
        "ammoType": "is_mml_lrm",
        "weaponIds": ["is_mml_9"],
        "compatibleWeaponNames": ["MML 9"],
        "mode": "LRM",
        "techBase": "Inner Sphere",
        "rulesLevel": "Standard",
        "shotsPerTon": 13,
        "costPerTon": 30000,
        "bv": 11,
        "source": {
                    "weightSpacePage": 341,
                    "battleValuePage": 317
                }
    },
    "is_mml_9_srm_ammo": {
        "id": "is_mml_9_srm_ammo",
        "name": "MML 9 SRM Ammo",
        "altNames": [
            "IS MML 9",
            "IS MML 9 Ammo",
            "IS MML 9 LRM Ammo",
            "IS MML 9 SRM Ammo",
            "is mml srm",
            "MML 9",
            "MML 9 Ammo",
            "MML 9 LRM Ammo"
        ],
        "ammoType": "is_mml_srm",
        "weaponIds": ["is_mml_9"],
        "compatibleWeaponNames": ["MML 9"],
        "mode": "SRM",
        "techBase": "Inner Sphere",
        "rulesLevel": "Standard",
        "shotsPerTon": 11,
        "costPerTon": 27000,
        "bv": 11,
        "source": {
                    "weightSpacePage": 341,
                    "battleValuePage": 317
                }
    },
    "is_mrm_10_ammo": {
        "id": "is_mrm_10_ammo",
        "name": "MRM 10 Ammo",
        "altNames": [
            "IS MRM 10",
            "IS MRM 10 Ammo",
            "IS MRM 10 LRM Ammo",
            "IS MRM 10 SRM Ammo",
            "is mrm",
            "MRM 10",
            "MRM 10 LRM Ammo",
            "MRM 10 SRM Ammo"
        ],
        "ammoType": "is_mrm",
        "weaponIds": ["is_mrm_10"],
        "compatibleWeaponNames": ["MRM 10"],
        "techBase": "Inner Sphere",
        "rulesLevel": "Standard",
        "shotsPerTon": 24,
        "costPerTon": 5000,
        "bv": 7,
        "availability": {
        
                    "starLeague": "X",
        
                    "successionWars": "X",
        
                    "clanInvasion": "E",
        
                },
        "source": {
                    "weightSpacePage": 341,
                    "battleValuePage": 317,
                    "costAvailabilityPage": 295
                }
    },
    "is_mrm_20_ammo": {
        "id": "is_mrm_20_ammo",
        "name": "MRM 20 Ammo",
        "altNames": [
            "IS MRM 20",
            "IS MRM 20 Ammo",
            "IS MRM 20 LRM Ammo",
            "IS MRM 20 SRM Ammo",
            "is mrm",
            "MRM 20",
            "MRM 20 LRM Ammo",
            "MRM 20 SRM Ammo"
        ],
        "ammoType": "is_mrm",
        "weaponIds": ["is_mrm_20"],
        "compatibleWeaponNames": ["MRM 20"],
        "techBase": "Inner Sphere",
        "rulesLevel": "Standard",
        "shotsPerTon": 12,
        "costPerTon": 5000,
        "bv": 14,
        "availability": {
        
                    "starLeague": "X",
        
                    "successionWars": "X",
        
                    "clanInvasion": "E",
        
                },
        "source": {
                    "weightSpacePage": 341,
                    "battleValuePage": 317,
                    "costAvailabilityPage": 295
                }
    },
    "is_mrm_30_ammo": {
        "id": "is_mrm_30_ammo",
        "name": "MRM 30 Ammo",
        "altNames": [
            "IS MRM 30",
            "IS MRM 30 Ammo",
            "IS MRM 30 LRM Ammo",
            "IS MRM 30 SRM Ammo",
            "is mrm",
            "MRM 30",
            "MRM 30 LRM Ammo",
            "MRM 30 SRM Ammo"
        ],
        "ammoType": "is_mrm",
        "weaponIds": ["is_mrm_30"],
        "compatibleWeaponNames": ["MRM 30"],
        "techBase": "Inner Sphere",
        "rulesLevel": "Standard",
        "shotsPerTon": 8,
        "costPerTon": 5000,
        "bv": 21,
        "availability": {
        
                    "starLeague": "X",
        
                    "successionWars": "X",
        
                    "clanInvasion": "E",
        
                },
        "source": {
                    "weightSpacePage": 341,
                    "battleValuePage": 317,
                    "costAvailabilityPage": 295
                }
    },
    "is_mrm_40_ammo": {
        "id": "is_mrm_40_ammo",
        "name": "MRM 40 Ammo",
        "altNames": [
            "IS MRM 40",
            "IS MRM 40 Ammo",
            "IS MRM 40 LRM Ammo",
            "IS MRM 40 SRM Ammo",
            "is mrm",
            "MRM 40",
            "MRM 40 LRM Ammo",
            "MRM 40 SRM Ammo"
        ],
        "ammoType": "is_mrm",
        "weaponIds": ["is_mrm_40"],
        "compatibleWeaponNames": ["MRM 40"],
        "techBase": "Inner Sphere",
        "rulesLevel": "Standard",
        "shotsPerTon": 6,
        "costPerTon": 5000,
        "bv": 28,
        "availability": {
        
                    "starLeague": "X",
        
                    "successionWars": "X",
        
                    "clanInvasion": "E",
        
                },
        "source": {
                    "weightSpacePage": 341,
                    "battleValuePage": 317,
                    "costAvailabilityPage": 295
                }
    },
    "is_narc_missile_beacon_ammo": {
        "id": "is_narc_missile_beacon_ammo",
        "name": "Narc Missile Beacon Ammo",
        "altNames": [
            "IS Narc Missile Beacon",
            "IS Narc Missile Beacon Ammo",
            "Narc Missile Beacon"
        ],
        "ammoType": "is_narc_missile_beacon_ammo",
        "weaponIds": ["is_narc_missile_beacon"],
        "compatibleWeaponNames": ["Narc Missile Beacon"],
        "techBase": "Inner Sphere",
        "rulesLevel": "Standard",
        "shotsPerTon": 6,
        "costPerTon": 6000,
        "bv": 0,
        "source": {
                    "weightSpacePage": 342,
                    "battleValuePage": 317
                }
    },
    "is_plasma_rifle_ammo": {
        "id": "is_plasma_rifle_ammo",
        "name": "Plasma Rifle Ammo",
        "altNames": [
            "IS Plasma Rifle",
            "IS Plasma Rifle Ammo",
            "Plasma Rifle"
        ],
        "ammoType": "is_plasma_rifle",
        "weaponIds": ["is_plasma_rifle"],
        "compatibleWeaponNames": ["Plasma Rifle"],
        "techBase": "Inner Sphere",
        "rulesLevel": "Standard",
        "shotsPerTon": 10,
        "costPerTon": 10000,
        "bv": 26,
        "availability": {
        
                    "starLeague": "X",
        
                    "successionWars": "X",
        
                    "clanInvasion": "E",
        
                },
        "source": {
                    "weightSpacePage": 341,
                    "battleValuePage": 317,
                    "costAvailabilityPage": 295
                }
    },
    "is_rocket_launcher_10_ammo": {
        "id": "is_rocket_launcher_10_ammo",
        "name": "Rocket Launcher 10 Ammo",
        "altNames": [
            "IS Rocket Launcher 10",
            "IS Rocket Launcher 10 Ammo",
            "is rocket launcher",
            "Rocket Launcher 10"
        ],
        "ammoType": "is_rocket_launcher",
        "weaponIds": ["is_rocket_launcher_10"],
        "compatibleWeaponNames": ["Rocket Launcher 10"],
        "techBase": "Inner Sphere",
        "rulesLevel": "Standard",
        "shotsPerTon": "OS",
        "costPerTon": 1000,
        "availability": {
        
                    "starLeague": "X",
        
                    "successionWars": "X",
        
                    "clanInvasion": "B",
        
                },
        "source": {
                    "weightSpacePage": 341,
                    "battleValuePage": 317,
                    "costAvailabilityPage": 295
                }
    },
    "is_rocket_launcher_15_ammo": {
        "id": "is_rocket_launcher_15_ammo",
        "name": "Rocket Launcher 15 Ammo",
        "altNames": [
            "IS Rocket Launcher 15",
            "IS Rocket Launcher 15 Ammo",
            "is rocket launcher",
            "Rocket Launcher 15"
        ],
        "ammoType": "is_rocket_launcher",
        "weaponIds": ["is_rocket_launcher_15"],
        "compatibleWeaponNames": ["Rocket Launcher 15"],
        "techBase": "Inner Sphere",
        "rulesLevel": "Standard",
        "shotsPerTon": "OS",
        "costPerTon": 1000,
        "availability": {
        
                    "starLeague": "X",
        
                    "successionWars": "X",
        
                    "clanInvasion": "B",
        
                },
        "source": {
                    "weightSpacePage": 341,
                    "battleValuePage": 317,
                    "costAvailabilityPage": 295
                }
    },
    "is_rocket_launcher_20_ammo": {
        "id": "is_rocket_launcher_20_ammo",
        "name": "Rocket Launcher 20 Ammo",
        "altNames": [
            "IS Rocket Launcher 20",
            "IS Rocket Launcher 20 Ammo",
            "is rocket launcher",
            "Rocket Launcher 20"
        ],
        "ammoType": "is_rocket_launcher",
        "weaponIds": ["is_rocket_launcher_20"],
        "compatibleWeaponNames": ["Rocket Launcher 20"],
        "techBase": "Inner Sphere",
        "rulesLevel": "Standard",
        "shotsPerTon": "OS",
        "costPerTon": 1000,
        "availability": {
        
                    "starLeague": "X",
        
                    "successionWars": "X",
        
                    "clanInvasion": "B",
        
                },
        "source": {
                    "weightSpacePage": 341,
                    "battleValuePage": 317,
                    "costAvailabilityPage": 295
                }
    },
    "is_rotary_ac_2_ammo": {
        "id": "is_rotary_ac_2_ammo",
        "name": "Rotary AC/2 Ammo",
        "altNames": [
            "IS Rotary AC/2",
            "IS Rotary AC/2 Ammo",
            "is rotary ac",
            "Rotary AC 2",
            "Rotary AC 2 Ammo"
        ],
        "ammoType": "is_rotary_ac",
        "weaponIds": ["is_rotary_ac_2"],
        "compatibleWeaponNames": ["Rotary AC/2"],
        "techBase": "Inner Sphere",
        "rulesLevel": "Standard",
        "shotsPerTon": 45,
        "costPerTon": 3000,
        "bv": 15,
        "availability": {
        
                    "starLeague": "X",
        
                    "successionWars": "X",
        
                    "clanInvasion": "E",
        
                },
        "source": {
                    "weightSpacePage": 341,
                    "battleValuePage": 317,
                    "costAvailabilityPage": 294
                }
    },
    "is_rotary_ac_5_ammo": {
        "id": "is_rotary_ac_5_ammo",
        "name": "Rotary AC/5 Ammo",
        "altNames": [
            "IS Rotary AC/5",
            "IS Rotary AC/5 Ammo",
            "is rotary ac",
            "Rotary AC 5",
            "Rotary AC 5 Ammo"
        ],
        "ammoType": "is_rotary_ac",
        "weaponIds": ["is_rotary_ac_5"],
        "compatibleWeaponNames": ["Rotary AC/5"],
        "techBase": "Inner Sphere",
        "rulesLevel": "Standard",
        "shotsPerTon": 20,
        "costPerTon": 12000,
        "bv": 31,
        "availability": {
        
                    "starLeague": "X",
        
                    "successionWars": "X",
        
                    "clanInvasion": "E",
        
                },
        "source": {
                    "weightSpacePage": 341,
                    "battleValuePage": 317,
                    "costAvailabilityPage": 294
                }
    },
    "is_srm_2_ammo": {
        "id": "is_srm_2_ammo",
        "name": "SRM 2 Ammo",
        "altNames": [
            "IS SRM 2",
            "IS SRM 2 Ammo",
            "IS SRM 2 LRM Ammo",
            "IS SRM 2 SRM Ammo",
            "is srm",
            "SRM 2",
            "SRM 2 LRM Ammo",
            "SRM 2 SRM Ammo"
        ],
        "ammoType": "is_srm",
        "weaponIds": ["is_srm_2"],
        "compatibleWeaponNames": ["SRM 2"],
        "techBase": "Inner Sphere",
        "rulesLevel": "Introductory",
        "shotsPerTon": 50,
        "costPerTon": 27000,
        "bv": 3,
        "availability": {
        
                    "starLeague": "B",
        
                    "successionWars": "B",
        
                    "clanInvasion": "B",
        
                },
        "source": {
                    "weightSpacePage": 341,
                    "battleValuePage": 317,
                    "costAvailabilityPage": 295
                }
    },
    "is_srm_4_ammo": {
        "id": "is_srm_4_ammo",
        "name": "SRM 4 Ammo",
        "altNames": [
            "IS SRM 4",
            "IS SRM 4 Ammo",
            "IS SRM 4 LRM Ammo",
            "IS SRM 4 SRM Ammo",
            "is srm",
            "SRM 4",
            "SRM 4 LRM Ammo",
            "SRM 4 SRM Ammo"
        ],
        "ammoType": "is_srm",
        "weaponIds": ["is_srm_4"],
        "compatibleWeaponNames": ["SRM 4"],
        "techBase": "Inner Sphere",
        "rulesLevel": "Introductory",
        "shotsPerTon": 25,
        "costPerTon": 27000,
        "bv": 5,
        "availability": {
        
                    "starLeague": "B",
        
                    "successionWars": "B",
        
                    "clanInvasion": "B",
        
                },
        "source": {
                    "weightSpacePage": 341,
                    "battleValuePage": 317,
                    "costAvailabilityPage": 295
                }
    },
    "is_srm_6_ammo": {
        "id": "is_srm_6_ammo",
        "name": "SRM 6 Ammo",
        "altNames": [
            "IS SRM 6",
            "IS SRM 6 Ammo",
            "IS SRM 6 LRM Ammo",
            "IS SRM 6 SRM Ammo",
            "is srm",
            "SRM 6",
            "SRM 6 LRM Ammo",
            "SRM 6 SRM Ammo"
        ],
        "ammoType": "is_srm",
        "weaponIds": ["is_srm_6"],
        "compatibleWeaponNames": ["SRM 6"],
        "techBase": "Inner Sphere",
        "rulesLevel": "Introductory",
        "shotsPerTon": 15,
        "costPerTon": 27000,
        "bv": 7,
        "availability": {
        
                    "starLeague": "B",
        
                    "successionWars": "B",
        
                    "clanInvasion": "B",
        
                },
        "source": {
                    "weightSpacePage": 341,
                    "battleValuePage": 317,
                    "costAvailabilityPage": 295
                }
    },
    "is_streak_srm_2_ammo": {
        "id": "is_streak_srm_2_ammo",
        "name": "Streak SRM 2 Ammo",
        "altNames": [
            "IS Streak SRM 2",
            "IS Streak SRM 2 Ammo",
            "IS Streak SRM 2 LRM Ammo",
            "IS Streak SRM 2 SRM Ammo",
            "is streak srm",
            "Streak SRM 2",
            "Streak SRM 2 LRM Ammo",
            "Streak SRM 2 SRM Ammo"
        ],
        "ammoType": "is_streak_srm",
        "weaponIds": ["is_streak_srm_2"],
        "compatibleWeaponNames": ["Streak SRM 2"],
        "techBase": "Inner Sphere",
        "rulesLevel": "Standard",
        "shotsPerTon": 50,
        "costPerTon": 54000,
        "bv": 4,
        "availability": {
        
                    "starLeague": "E",
        
                    "successionWars": "F",
        
                    "clanInvasion": "D",
        
                },
        "source": {
                    "weightSpacePage": 341,
                    "battleValuePage": 317,
                    "costAvailabilityPage": 295
                }
    },
    "is_streak_srm_4_ammo": {
        "id": "is_streak_srm_4_ammo",
        "name": "Streak SRM 4 Ammo",
        "altNames": [
            "IS Streak SRM 4",
            "IS Streak SRM 4 Ammo",
            "IS Streak SRM 4 LRM Ammo",
            "IS Streak SRM 4 SRM Ammo",
            "is streak srm",
            "Streak SRM 4",
            "Streak SRM 4 LRM Ammo",
            "Streak SRM 4 SRM Ammo"
        ],
        "ammoType": "is_streak_srm",
        "weaponIds": ["is_streak_srm_4"],
        "compatibleWeaponNames": ["Streak SRM 4"],
        "techBase": "Inner Sphere",
        "rulesLevel": "Standard",
        "shotsPerTon": 25,
        "costPerTon": 54000,
        "bv": 7,
        "availability": {
        
                    "starLeague": "X",
        
                    "successionWars": "X",
        
                    "clanInvasion": "E",
        
                },
        "source": {
                    "weightSpacePage": 341,
                    "battleValuePage": 317,
                    "costAvailabilityPage": 295
                }
    },
    "is_streak_srm_6_ammo": {
        "id": "is_streak_srm_6_ammo",
        "name": "Streak SRM 6 Ammo",
        "altNames": [
            "IS Streak SRM 6",
            "IS Streak SRM 6 Ammo",
            "IS Streak SRM 6 LRM Ammo",
            "IS Streak SRM 6 SRM Ammo",
            "is streak srm",
            "Streak SRM 6",
            "Streak SRM 6 LRM Ammo",
            "Streak SRM 6 SRM Ammo"
        ],
        "ammoType": "is_streak_srm",
        "weaponIds": ["is_streak_srm_6"],
        "compatibleWeaponNames": ["Streak SRM 6"],
        "techBase": "Inner Sphere",
        "rulesLevel": "Standard",
        "shotsPerTon": 15,
        "costPerTon": 54000,
        "bv": 11,
        "availability": {
        
                    "starLeague": "X",
        
                    "successionWars": "X",
        
                    "clanInvasion": "E",
        
                },
        "source": {
                    "weightSpacePage": 341,
                    "battleValuePage": 317,
                    "costAvailabilityPage": 295
                }
    },
    "is_thunderbolt_10_ammo": {
        "id": "is_thunderbolt_10_ammo",
        "name": "Thunderbolt 10 Ammo",
        "altNames": [
            "IS Thunderbolt 10",
            "IS Thunderbolt 10 Ammo",
            "is lrm",
            "Thunderbolt 10"
        ],
        "ammoType": "is_lrm",
        "weaponIds": ["is_thunderbolt_10"],
        "compatibleWeaponNames": ["Thunderbolt 10"],
        "techBase": "Inner Sphere",
        "rulesLevel": "Advanced",
        "shotsPerTon": 6,
        "costPerTon": 50000,
        "bv": 16,
        "availability": {
        
                    "starLeague": "X",
        
                    "successionWars": "X",
        
                    "clanInvasion": "F",
        
                },
        "source": {
                    "weightSpacePage": 341,
                    "battleValuePage": 317,
                    "costAvailabilityPage": 295
                }
    },
    "is_thunderbolt_15_ammo": {
        "id": "is_thunderbolt_15_ammo",
        "name": "Thunderbolt 15 Ammo",
        "altNames": [
            "IS Thunderbolt 15",
            "IS Thunderbolt 15 Ammo",
            "is lrm",
            "Thunderbolt 15"
        ],
        "ammoType": "is_lrm",
        "weaponIds": ["is_thunderbolt_15"],
        "compatibleWeaponNames": ["Thunderbolt 15"],
        "techBase": "Inner Sphere",
        "rulesLevel": "Advanced",
        "shotsPerTon": 4,
        "costPerTon": 50000,
        "bv": 29,
        "availability": {
        
                    "starLeague": "X",
        
                    "successionWars": "X",
        
                    "clanInvasion": "F",
        
                },
        "source": {
                    "weightSpacePage": 341,
                    "battleValuePage": 317,
                    "costAvailabilityPage": 295
                }
    },
    "is_thunderbolt_20_ammo": {
        "id": "is_thunderbolt_20_ammo",
        "name": "Thunderbolt 20 Ammo",
        "altNames": [
            "IS Thunderbolt 20",
            "IS Thunderbolt 20 Ammo",
            "is lrm",
            "Thunderbolt 20"
        ],
        "ammoType": "is_lrm",
        "weaponIds": ["is_thunderbolt_20"],
        "compatibleWeaponNames": ["Thunderbolt 20"],
        "techBase": "Inner Sphere",
        "rulesLevel": "Advanced",
        "shotsPerTon": 3,
        "costPerTon": 50000,
        "bv": 38,
        "availability": {
        
                    "starLeague": "X",
        
                    "successionWars": "X",
        
                    "clanInvasion": "F",
        
                },
        "source": {
                    "weightSpacePage": 341,
                    "battleValuePage": 317,
                    "costAvailabilityPage": 295
                }
    },
    "is_thunderbolt_5_ammo": {
        "id": "is_thunderbolt_5_ammo",
        "name": "Thunderbolt 5 Ammo",
        "altNames": [
            "IS Thunderbolt 5",
            "IS Thunderbolt 5 Ammo",
            "is lrm",
            "Thunderbolt 5"
        ],
        "ammoType": "is_lrm",
        "weaponIds": ["is_thunderbolt_5"],
        "compatibleWeaponNames": ["Thunderbolt 5"],
        "techBase": "Inner Sphere",
        "rulesLevel": "Advanced",
        "shotsPerTon": 12,
        "costPerTon": 50000,
        "bv": 8,
        "availability": {
        
                    "starLeague": "X",
        
                    "successionWars": "X",
        
                    "clanInvasion": "F",
        
                },
        "source": {
                    "weightSpacePage": 341,
                    "battleValuePage": 317,
                    "costAvailabilityPage": 295
                }
    },
    "is_ultra_ac_10_ammo": {
        "id": "is_ultra_ac_10_ammo",
        "name": "Ultra AC/10 Ammo",
        "altNames": [
            "IS Ultra AC/10",
            "IS Ultra AC/10 Ammo",
            "is ultra ac",
            "Ultra AC 10",
            "Ultra AC 10 Ammo"
        ],
        "ammoType": "is_ultra_ac",
        "weaponIds": ["is_ultra_ac_10"],
        "compatibleWeaponNames": ["Ultra AC/10"],
        "techBase": "Inner Sphere",
        "rulesLevel": "Standard",
        "shotsPerTon": 10,
        "costPerTon": 12000,
        "bv": 26,
        "availability": {
        
                    "starLeague": "X",
        
                    "successionWars": "X",
        
                    "clanInvasion": "E",
        
                },
        "source": {
                    "weightSpacePage": 341,
                    "battleValuePage": 317,
                    "costAvailabilityPage": 294
                }
    },
    "is_ultra_ac_20_ammo": {
        "id": "is_ultra_ac_20_ammo",
        "name": "Ultra AC/20 Ammo",
        "altNames": [
            "IS Ultra AC/20",
            "IS Ultra AC/20 Ammo",
            "is ultra ac",
            "Ultra AC 20",
            "Ultra AC 20 Ammo"
        ],
        "ammoType": "is_ultra_ac",
        "weaponIds": ["is_ultra_ac_20"],
        "compatibleWeaponNames": ["Ultra AC/20"],
        "techBase": "Inner Sphere",
        "rulesLevel": "Standard",
        "shotsPerTon": 5,
        "costPerTon": 20000,
        "bv": 35,
        "availability": {
        
                    "starLeague": "X",
        
                    "successionWars": "X",
        
                    "clanInvasion": "E",
        
                },
        "source": {
                    "weightSpacePage": 341,
                    "battleValuePage": 317,
                    "costAvailabilityPage": 294
                }
    },
    "is_ultra_ac_2_ammo": {
        "id": "is_ultra_ac_2_ammo",
        "name": "Ultra AC/2 Ammo",
        "altNames": [
            "IS Ultra AC/2",
            "IS Ultra AC/2 Ammo",
            "is ultra ac",
            "Ultra AC 2",
            "Ultra AC 2 Ammo"
        ],
        "ammoType": "is_ultra_ac",
        "weaponIds": ["is_ultra_ac_2"],
        "compatibleWeaponNames": ["Ultra AC/2"],
        "techBase": "Inner Sphere",
        "rulesLevel": "Standard",
        "shotsPerTon": 45,
        "costPerTon": 1000,
        "bv": 7,
        "availability": {
        
                    "starLeague": "X",
        
                    "successionWars": "X",
        
                    "clanInvasion": "E",
        
                },
        "source": {
                    "weightSpacePage": 341,
                    "battleValuePage": 317,
                    "costAvailabilityPage": 294
                }
    },
    "is_ultra_ac_5_ammo": {
        "id": "is_ultra_ac_5_ammo",
        "name": "Ultra AC/5 Ammo",
        "altNames": [
            "IS Ultra AC/5",
            "IS Ultra AC/5 Ammo",
            "is ultra ac",
            "Ultra AC 5",
            "Ultra AC 5 Ammo"
        ],
        "ammoType": "is_ultra_ac",
        "weaponIds": ["is_ultra_ac_5"],
        "compatibleWeaponNames": ["Ultra AC/5"],
        "techBase": "Inner Sphere",
        "rulesLevel": "Standard",
        "shotsPerTon": 20,
        "costPerTon": 9000,
        "bv": 14,
        "availability": {
        
                    "starLeague": "D",
        
                    "successionWars": "F",
        
                    "clanInvasion": "D",
        
                },
        "source": {
                    "weightSpacePage": 341,
                    "battleValuePage": 317,
                    "costAvailabilityPage": 294
                }
    },
    "is_sniper_artillery_ammo": {
        "id": "is_sniper_artillery_ammo",
        "name": "Sniper Ammo",
        "altNames": [
            "IS Sniper",
            "IS Sniper Ammo",
            "is sniper artillery",
            "is sniper artillery ammo",
            "Sniper"
        ],
        "ammoType": "is_sniper_artillery_ammo",
        "weaponIds": ["is_sniper_artillery"],
        "compatibleWeaponNames": ["Sniper"],
        "techBase": "Inner Sphere",
        "rulesLevel": "Advanced",
        "shotsPerTon": 10,
        "costPerTon": 6000,
        "bv": 0,
        "availability": {
                    "starLeague": "C",
                    "successionWars": "C",
                    "clanInvasion": "C"
        
                },
        "source": {
                    "weightSpacePage": 0,
                    "battleValuePage": 0,
                    "costAvailabilityPage": 0
                }
    },
    "is_sniper_cannon_ammo": {
        "id": "is_sniper_cannon_ammo",
        "name": "Sniper Cannon Ammo",
        "altNames": [
            "IS Sniper Cannon",
            "IS Sniper Cannon Ammo",
            "Sniper Cannon"
        ],
        "ammoType": "is_sniper_cannon_ammo",
        "weaponIds": ["is_sniper_cannon"],
        "compatibleWeaponNames": ["Sniper Cannon"],
        "techBase": "Inner Sphere",
        "rulesLevel": "Experimental",
        "shotsPerTon": 10,
        "costPerTon": 15000,
        "bv": 0,
        "availability": {
                    "starLeague": "X",
                    "successionWars": "F",
                    "clanInvasion": "E"
        
                },
        "source": {
                    "weightSpacePage": 0,
                    "battleValuePage": 0,
                    "costAvailabilityPage": 0
                }
    },
    "is_long_tom_cannon_ammo": {
        "id": "is_long_tom_cannon_ammo",
        "name": "Long Tom Cannon Ammo",
        "altNames": [
            "IS Long Tom Cannon",
            "IS Long Tom Cannon Ammo",
            "Long Tom Cannon"
        ],
        "ammoType": "is_long_tom_cannon_ammo",
        "weaponIds": ["is_long_tom_cannon"],
        "compatibleWeaponNames": ["Long Tom Cannon"],
        "techBase": "Inner Sphere",
        "rulesLevel": "Experimental",
        "shotsPerTon": 5,
        "costPerTon": 20000,
        "bv": 0,
        "availability": {
                    "starLeague": "X",
                    "successionWars": "F",
                    "clanInvasion": "E"
        
                },
        "source": {
                    "weightSpacePage": 0,
                    "battleValuePage": 0,
                    "costAvailabilityPage": 0
                }
    },
    "is_thumper_cannon_ammo": {
        "id": "is_thumper_cannon_ammo",
        "name": "Thumper Cannon Ammo",
        "altNames": [
            "IS Thumper Cannon",
            "IS Thumper Cannon Ammo",
            "Thumper Cannon"
        ],
        "ammoType": "is_thumper_cannon_ammo",
        "weaponIds": ["is_thumper_cannon"],
        "compatibleWeaponNames": ["Thumper Cannon"],
        "techBase": "Inner Sphere",
        "rulesLevel": "Experimental",
        "shotsPerTon": 20,
        "costPerTon": 10000,
        "bv": 0,
        "availability": {
                    "starLeague": "X",
                    "successionWars": "F",
                    "clanInvasion": "E"
        
                },
        "source": {
                    "weightSpacePage": 0,
                    "battleValuePage": 0,
                    "costAvailabilityPage": 0
                }
    },
        "is_narc_pod_ammo": {
        "id": "is_narc_pod_ammo",
        "name": "Narc Pod Ammo",
        "altNames": [
            "Narc Pod Ammo",
            "Narc Pods",
            "Narc Pod",
            "Narc Ammo",
            "IS Narc Pod Ammo",
            "IS Narc Pods",
            "IS Narc Pod",
            "ISNarcPodAmmo",
            "ISNarcPods",
            "ISNarcPod",
            "ISNarc Ammo",
            "ISNarcAmmo",
            "ISNarc Pods"
        ],
        "ammoType": "is_narc_pod",
        "weaponIds": ["is_narc_missile_beacon"],
        "compatibleWeaponNames": ["Narc Missile Beacon", "Narc Beacon", "Narc"],
        "techBase": "Inner Sphere",
        "rulesLevel": "Standard",
        "shotsPerTon": 6,
        "costPerTon": 6000,
        "bv": 5,
        "availability": {
            "starLeague": "E",
            "successionWars": "F",
            "clanInvasion": "D"
        },
        "source": {
            "weightSpacePage": 0,
            "battleValuePage": 0,
            "costAvailabilityPage": 0
        }
    },
    "is_inarc_pod_ammo": {
        "id": "is_inarc_pod_ammo",
        "name": "iNarc Pod Ammo",
        "altNames": [
            "iNarc Pod Ammo",
            "iNarc Pods",
            "iNarc Pod",
            "Improved Narc Pod Ammo",
            "Improved Narc Pods",
            "Improved Narc Pod",
            "IS iNarc Pod Ammo",
            "IS iNarc Pods",
            "ISiNarcPodAmmo",
            "ISiNarcPods",
            "ISImprovedNarcPodAmmo",
            "IS Improved Narc Pod Ammo",
            "IS Improved Narc Pods"
        ],
        "ammoType": "is_inarc_pod",
        "weaponIds": ["is_improved_narc_launcher"],
        "compatibleWeaponNames": [
            "Improved Narc Missile Beacon",
            "iNarc Missile Beacon",
            "iNarc"
        ],
        "techBase": "Inner Sphere",
        "rulesLevel": "Standard",
        "shotsPerTon": 4,
        "costPerTon": 30000,
        "bv": 6,
        "availability": {
            "starLeague": "X",
            "successionWars": "X",
            "clanInvasion": "E"
        },
        "source": {
            "weightSpacePage": 0,
            "battleValuePage": 0,
            "costAvailabilityPage": 0
        }
    },

    // Clan ammo
"clan_a_pod_ammo": {
        "id": "clan_a_pod_ammo",
        "name": "A-Pod Ammo",
        "altNames": [
            "CL A-Pod",
            "CL A-Pod Ammo",
            "A Pod",
            "A Pod Ammo",
            "clan a pod",
            "clan a pod ammo"
        ],
        "ammoType": "clan_a_pod_ammo",
        "weaponIds": ["clan_a_pod"],
        "compatibleWeaponNames": ["A-Pod"],
        "techBase": "Clan",
        "rulesLevel": "Standard",
        "shotsPerTon": "OS",
        "source": {
                    "weightSpacePage": 343,
                    "battleValuePage": 318
                }
    },
    
    "clan_narc_pod_ammo": {
        "id": "clan_narc_pod_ammo",
        "name": "Narc Pod Ammo",
        "altNames": [
            "Narc Pod Ammo",
            "Narc Pods",
            "Narc Pod",
            "Narc Ammo",
            "Clan Narc Pod Ammo",
            "Clan Narc Pods",
            "Clan Narc Pod",
            "CLNarcPodAmmo",
            "CLNarcPods",
            "CLNarcPod",
            "CLNarc Ammo",
            "CLNarcAmmo"
        ],
        "ammoType": "clan_narc_pod",
        "weaponIds": ["clan_narc_missile_beacon"],
        "compatibleWeaponNames": ["Narc Missile Beacon", "Narc Beacon", "Narc", "Clan Narc Missile Beacon"],
        "techBase": "Clan",
        "rulesLevel": "Standard",
        "shotsPerTon": 6,
        "costPerTon": 6000,
        "bv": 5,
        "availability": {
            "starLeague": "E",
            "successionWars": "F",
            "clanInvasion": "D"
        },
        "source": {
            "weightSpacePage": 0,
            "battleValuePage": 0,
            "costAvailabilityPage": 0
        }
    },
    "clan_inarc_pod_ammo": {
        "id": "clan_inarc_pod_ammo",
        "name": "iNarc Pod Ammo",
        "altNames": [
            "iNarc Pod Ammo",
            "iNarc Pods",
            "iNarc Pod",
            "Improved Narc Pod Ammo",
            "Improved Narc Pods",
            "Improved Narc Pod",
            "Clan iNarc Pod Ammo",
            "Clan iNarc Pods",
            "CLiNarcPodAmmo",
            "CLiNarcPods",
            "CLImprovedNarcPodAmmo",
            "Clan Improved Narc Pod Ammo",
            "Clan Improved Narc Pods"
        ],
        "ammoType": "clan_inarc_pod",
        "weaponIds": ["clan_improved_narc_missile_beacon"],
        "compatibleWeaponNames": [
            "Improved Narc Missile Beacon",
            "iNarc Missile Beacon",
            "iNarc",
            "Clan Improved Narc Missile Beacon"
        ],
        "techBase": "Clan",
        "rulesLevel": "Standard",
        "shotsPerTon": 4,
        "costPerTon": 30000,
        "bv": 6,
        "availability": {
            "starLeague": "X",
            "successionWars": "X",
            "clanInvasion": "E"
        },
        "source": {
            "weightSpacePage": 0,
            "battleValuePage": 0,
            "costAvailabilityPage": 0
        }
    },
    "clan_anti_missile_system_ammo": {
        "id": "clan_anti_missile_system_ammo",
        "name": "Anti-Missile System Ammo",
        "altNames": [
            "CL Anti-Missile System",
            "CL Anti-Missile System Ammo",
            "Anti Missile System",
            "Anti Missile System Ammo",
            "clan anti missile system",
            "clan anti missile system ammo"
        ],
        "ammoType": "clan_anti_missile_system_ammo",
        "weaponIds": ["clan_anti_missile_system"],
        "compatibleWeaponNames": ["Anti-Missile System"],
        "techBase": "Clan",
        "rulesLevel": "Standard",
        "shotsPerTon": 24,
        "costPerTon": 2000,
        "bv": 22,
        "availability": {
        
                    "starLeague": "X",
        
                    "successionWars": "D",
        
                    "clanInvasion": "C",
        
                },
        "source": {
                    "weightSpacePage": 343,
                    "battleValuePage": 318,
                    "costAvailabilityPage": 295
                }
    },
    "clan_ap_gauss_rifle_ammo": {
        "id": "clan_ap_gauss_rifle_ammo",
        "name": "AP Gauss Rifle Ammo",
        "altNames": [
            "CL AP Gauss Rifle",
            "CL AP Gauss Rifle Ammo",
            "AP Gauss Rifle",
            "clan ap gauss",
            "Clan AP Gauss Rifle",
            "Clan AP Gauss Rifle Ammo"
        ],
        "ammoType": "clan_ap_gauss",
        "weaponIds": ["clan_ap_gauss_rifle"],
        "compatibleWeaponNames": ["AP Gauss Rifle"],
        "techBase": "Clan",
        "rulesLevel": "Standard",
        "shotsPerTon": 40,
        "costPerTon": 3000,
        "bv": 3,
        "availability": {
        
                    "starLeague": "X",
        
                    "successionWars": "X",
        
                    "clanInvasion": "E",
        
                },
        "source": {
                    "weightSpacePage": 343,
                    "battleValuePage": 318,
                    "costAvailabilityPage": 294
                }
    },
    "clan_arrow_iv_ammo": {
        "id": "clan_arrow_iv_ammo",
        "name": "Arrow IV Ammo",
        "altNames": [
            "CL Arrow IV",
            "CL Arrow IV Ammo",
            "Arrow IV",
            "clan arrow iv",
            "Clan Arrow IV Ammo",
            "is arrow iv",
            "CLisarrowiv"
        ],
        "ammoType": "is_arrow_iv",
        "weaponIds": ["clan_arrow_iv"],
        "compatibleWeaponNames": ["Arrow IV"],
        "techBase": "Clan",
        "rulesLevel": "Advanced",
        "shotsPerTon": 5,
        "costPerTon": 10000,
        "bv": 12,
        "availability": {
        
                    "starLeague": "E",
        
                    "successionWars": "F",
        
                    "clanInvasion": "E",
        
                },
        "source": {
                        "battleValuePage": 0,
                        "weightSpacePage": 0
                }
    },
    "clan_atm_12_ammo": {
        "id": "clan_atm_12_ammo",
        "name": "ATM 12 Ammo",
        "altNames": [
            "CL ATM 12",
            "CL ATM 12 Ammo",
            "CL ATM 12 LRM Ammo",
            "CL ATM 12 SRM Ammo",
            "ATM 12",
            "ATM 12 LRM Ammo",
            "ATM 12 SRM Ammo",
            "clan atm",
            "Clan ATM 12",
            "Clan ATM 12 Ammo"
        ],
        "ammoType": "clan_atm",
        "weaponIds": ["clan_atm_12"],
        "compatibleWeaponNames": ["ATM 12"],
        "techBase": "Clan",
        "rulesLevel": "Standard",
        "shotsPerTon": 5,
        "costPerTon": 75000,
        "bv": 52,
        "availability": {
        
                    "starLeague": "X",
        
                    "successionWars": "X",
        
                    "clanInvasion": "D",
        
                },
        "source": {
                    "weightSpacePage": 343,
                    "battleValuePage": 318,
                    "costAvailabilityPage": 295
                }
    },
    "clan_atm_3_ammo": {
        "id": "clan_atm_3_ammo",
        "name": "ATM 3 Ammo",
        "altNames": [
            "CL ATM 3",
            "CL ATM 3 Ammo",
            "CL ATM 3 LRM Ammo",
            "CL ATM 3 SRM Ammo",
            "ATM 3",
            "ATM 3 LRM Ammo",
            "ATM 3 SRM Ammo",
            "clan atm",
            "clan atm 3",
            "Clan ATM 3 Ammo"
        ],
        "ammoType": "clan_atm",
        "weaponIds": ["clan_atm_3"],
        "compatibleWeaponNames": ["ATM 3"],
        "techBase": "Clan",
        "rulesLevel": "Standard",
        "shotsPerTon": 20,
        "costPerTon": 75000,
        "bv": 14,
        "availability": {
        
                    "starLeague": "X",
        
                    "successionWars": "X",
        
                    "clanInvasion": "D",
        
                },
        "source": {
                    "weightSpacePage": 343,
                    "battleValuePage": 318,
                    "costAvailabilityPage": 295
                }
    },
    "clan_atm_6_ammo": {
        "id": "clan_atm_6_ammo",
        "name": "ATM 6 Ammo",
        "altNames": [
            "CL ATM 6",
            "CL ATM 6 Ammo",
            "CL ATM 6 LRM Ammo",
            "CL ATM 6 SRM Ammo",
            "ATM 6",
            "ATM 6 LRM Ammo",
            "ATM 6 SRM Ammo",
            "clan atm",
            "clan atm 6",
            "Clan ATM 6 Ammo"
        ],
        "ammoType": "clan_atm",
        "weaponIds": ["clan_atm_6"],
        "compatibleWeaponNames": ["ATM 6"],
        "techBase": "Clan",
        "rulesLevel": "Standard",
        "shotsPerTon": 10,
        "costPerTon": 75000,
        "bv": 26,
        "availability": {
        
                    "starLeague": "X",
        
                    "successionWars": "X",
        
                    "clanInvasion": "D",
        
                },
        "source": {
                    "weightSpacePage": 343,
                    "battleValuePage": 318,
                    "costAvailabilityPage": 295
                }
    },
    "clan_atm_9_ammo": {
        "id": "clan_atm_9_ammo",
        "name": "ATM 9 Ammo",
        "altNames": [
            "CL ATM 9",
            "CL ATM 9 Ammo",
            "CL ATM 9 LRM Ammo",
            "CL ATM 9 SRM Ammo",
            "ATM 9",
            "ATM 9 LRM Ammo",
            "ATM 9 SRM Ammo",
            "clan atm",
            "clan atm 9",
            "Clan ATM 9 Ammo"
        ],
        "ammoType": "clan_atm",
        "weaponIds": ["clan_atm_9"],
        "compatibleWeaponNames": ["ATM 9"],
        "techBase": "Clan",
        "rulesLevel": "Standard",
        "shotsPerTon": 7,
        "costPerTon": 75000,
        "bv": 36,
        "availability": {
        
                    "starLeague": "X",
        
                    "successionWars": "X",
        
                    "clanInvasion": "D",
        
                },
        "source": {
                    "weightSpacePage": 343,
                    "battleValuePage": 318,
                    "costAvailabilityPage": 295
                }
    },
    "clan_b_pod_ammo": {
        "id": "clan_b_pod_ammo",
        "name": "B-Pod Ammo",
        "altNames": [
            "CL B-Pod",
            "CL B-Pod Ammo",
            "B Pod",
            "B Pod Ammo",
            "clan b pod",
            "clan b pod ammo"
        ],
        "ammoType": "clan_b_pod_ammo",
        "weaponIds": ["clan_b_pod"],
        "compatibleWeaponNames": ["B-Pod"],
        "techBase": "Clan",
        "rulesLevel": "Standard",
        "shotsPerTon": "OS",
        "source": {
                    "weightSpacePage": 343,
                    "battleValuePage": 318
                }
    },
    "clan_flamer_vehicle_ammo": {
        "id": "clan_flamer_vehicle_ammo",
        "name": "Flamer (Vehicle) Ammo",
        "altNames": [
            "CL Flamer (Vehicle)",
            "CL Flamer (Vehicle) Ammo",
            "Clan Flamer (Vehicle)",
            "Clan Flamer (Vehicle) Ammo",
            "clan vehicle flamer",
            "Flamer (Vehicle)"
        ],
        "ammoType": "clan_vehicle_flamer",
        "weaponIds": ["clan_flamer_vehicle"],
        "compatibleWeaponNames": ["Flamer (Vehicle)"],
        "techBase": "Clan",
        "rulesLevel": "Standard",
        "shotsPerTon": 20,
        "costPerTon": 1000,
        "bv": 1,
        "availability": {
        
                    "starLeague": "A",
        
                    "successionWars": "A",
        
                    "clanInvasion": "B",
        
                },
        "source": {
                    "weightSpacePage": 343,
                    "battleValuePage": 318,
                    "costAvailabilityPage": 294
                }
    },
    "clan_gauss_rifle_ammo": {
        "id": "clan_gauss_rifle_ammo",
        "name": "Gauss Rifle Ammo",
        "altNames": [
            "CL Gauss Rifle",
            "CL Gauss Rifle Ammo",
            "clan gauss",
            "clan gauss rifle",
            "clan gauss rifle ammo",
            "Gauss Rifle"
        ],
        "ammoType": "clan_gauss",
        "weaponIds": ["clan_gauss_rifle"],
        "compatibleWeaponNames": ["Gauss Rifle"],
        "techBase": "Clan",
        "rulesLevel": "Standard",
        "shotsPerTon": 8,
        "costPerTon": 20000,
        "bv": 40,
        "availability": {
        
                    "starLeague": "D",
        
                    "successionWars": "F",
        
                    "clanInvasion": "D",
        
                },
        "source": {
                    "weightSpacePage": 343,
                    "battleValuePage": 318,
                    "costAvailabilityPage": 294
                }
    },
    "clan_heavy_flamer_ammo": {
        "id": "clan_heavy_flamer_ammo",
        "name": "Heavy Flamer Ammo",
        "altNames": [
            "CL Heavy Flamer",
            "CL Heavy Flamer Ammo",
            "Clan Heavy Flamer",
            "Clan Heavy Flamer Ammo",
            "Heavy Flamer"
        ],
        "ammoType": "clan_heavy_flamer",
        "weaponIds": ["clan_heavy_flamer"],
        "compatibleWeaponNames": ["Heavy Flamer"],
        "techBase": "Clan",
        "rulesLevel": "Advanced",
        "shotsPerTon": 10,
        "costPerTon": 2000,
        "bv": 2,
        "availability": {
        
                    "starLeague": "X",
        
                    "successionWars": "X",
        
                    "clanInvasion": "E",
        
                },
        "source": {
                    "weightSpacePage": 341,
                    "battleValuePage": 317,
                    "costAvailabilityPage": 0
                }
    },
    "clan_heavy_machine_gun_ammo": {
        "id": "clan_heavy_machine_gun_ammo",
        "name": "Heavy Machine Gun Ammo",
        "altNames": [
            "CL Heavy Machine Gun",
            "CL Heavy Machine Gun Ammo",
            "CL Machine Gun Ammo",
            "Clan Heavy Machine Gun",
            "Clan Heavy Machine Gun Ammo",
            "clan machine gun",
            "Heavy Machine Gun",
            "Machine Gun Ammo"
        ],
        "ammoType": "clan_machine_gun",
        "weaponIds": ["clan_heavy_machine_gun"],
        "compatibleWeaponNames": ["Heavy Machine Gun"],
        "techBase": "Clan",
        "rulesLevel": "Standard",
        "shotsPerTon": 100,
        "costPerTon": 1000,
        "bv": 1,
        "availability": {
        
                    "starLeague": "X",
        
                    "successionWars": "X",
        
                    "clanInvasion": "C",
        
                },
        "source": {
                    "weightSpacePage": 343,
                    "battleValuePage": 318,
                    "costAvailabilityPage": 294
                }
    },
    "clan_hyper_assault_gauss_20_ammo": {
        "id": "clan_hyper_assault_gauss_20_ammo",
        "name": "Hyper-Assault Gauss 20 Ammo",
        "altNames": [
            "CL Hyper-Assault Gauss 20",
            "CL Hyper-Assault Gauss 20 Ammo",
            "clan hag",
            "clan hyper assault gauss 20",
            "clan hyper assault gauss 20 ammo",
            "Hyper Assault Gauss 20",
            "Hyper Assault Gauss 20 Ammo"
        ],
        "ammoType": "clan_hag",
        "weaponIds": ["clan_hyper_assault_gauss_20"],
        "compatibleWeaponNames": ["Hyper-Assault Gauss 20"],
        "techBase": "Clan",
        "rulesLevel": "Standard",
        "shotsPerTon": 6,
        "costPerTon": 30000,
        "bv": 33,
        "availability": {
        
                    "starLeague": "X",
        
                    "successionWars": "X",
        
                    "clanInvasion": "E",
        
                },
        "source": {
                    "weightSpacePage": 343,
                    "battleValuePage": 318,
                    "costAvailabilityPage": 294
                }
    },
    "clan_hyper_assault_gauss_30_ammo": {
        "id": "clan_hyper_assault_gauss_30_ammo",
        "name": "Hyper-Assault Gauss 30 Ammo",
        "altNames": [
            "CL Hyper-Assault Gauss 30",
            "CL Hyper-Assault Gauss 30 Ammo",
            "clan hag",
            "clan hyper assault gauss 30",
            "clan hyper assault gauss 30 ammo",
            "Hyper Assault Gauss 30",
            "Hyper Assault Gauss 30 Ammo"
        ],
        "ammoType": "clan_hag",
        "weaponIds": ["clan_hyper_assault_gauss_30"],
        "compatibleWeaponNames": ["Hyper-Assault Gauss 30"],
        "techBase": "Clan",
        "rulesLevel": "Standard",
        "shotsPerTon": 4,
        "costPerTon": 30000,
        "bv": 50,
        "availability": {
        
                    "starLeague": "X",
        
                    "successionWars": "X",
        
                    "clanInvasion": "E",
        
                },
        "source": {
                    "weightSpacePage": 343,
                    "battleValuePage": 318,
                    "costAvailabilityPage": 294
                }
    },
    "clan_hyper_assault_gauss_40_ammo": {
        "id": "clan_hyper_assault_gauss_40_ammo",
        "name": "Hyper-Assault Gauss 40 Ammo",
        "altNames": [
            "CL Hyper-Assault Gauss 40",
            "CL Hyper-Assault Gauss 40 Ammo",
            "clan hag",
            "clan hyper assault gauss 40",
            "clan hyper assault gauss 40 ammo",
            "Hyper Assault Gauss 40",
            "Hyper Assault Gauss 40 Ammo"
        ],
        "ammoType": "clan_hag",
        "weaponIds": ["clan_hyper_assault_gauss_40"],
        "compatibleWeaponNames": ["Hyper-Assault Gauss 40"],
        "techBase": "Clan",
        "rulesLevel": "Standard",
        "shotsPerTon": 3,
        "costPerTon": 30000,
        "bv": 67,
        "availability": {
        
                    "starLeague": "X",
        
                    "successionWars": "X",
        
                    "clanInvasion": "E",
        
                },
        "source": {
                    "weightSpacePage": 343,
                    "battleValuePage": 318,
                    "costAvailabilityPage": 294
                }
    },
    "clan_lb_10_x_ac_ammo": {
        "id": "clan_lb_10_x_ac_ammo",
        "name": "LB 10-X AC Ammo",
        "altNames": [
            "CL LB 10-X AC",
            "CL LB 10-X AC Ammo",
            "CL LB 10-X AC Cluster Ammo",
            "CL LB 10-X Ammo",
            "CL LB 10-X Cluster Ammo",
            "CL LBX AC 10 Ammo",
            "CL LBX AC 10 Cluster Ammo",
            "clan lb 10 x ac",
            "clan lb 10 x ac ammo",
            "Clan LB 10-X AC Cluster Ammo",
            "Clan LB 10-X Ammo",
            "Clan LB 10-X Cluster Ammo",
            "clan lb x ac",
            "Clan LBX AC 10 Ammo",
            "Clan LBX AC 10 Cluster Ammo",
            "LB 10 X AC",
            "LB 10 X AC Ammo",
            "LB 10-X AC Cluster Ammo",
            "LB 10-X Ammo",
            "LB 10-X Cluster Ammo",
            "LBX AC 10 Ammo",
            "LBX AC 10 Cluster Ammo"
        ],
        "ammoType": "clan_lb_x_ac",
        "weaponIds": ["clan_lb_10_x_ac"],
        "compatibleWeaponNames": ["LB 10-X AC"],
        "techBase": "Clan",
        "rulesLevel": "Standard",
        "shotsPerTon": 10,
        "costPerTon": 12000,
        "bv": 19,
        "availability": {
        
                    "starLeague": "C",
        
                    "successionWars": "E",
        
                    "clanInvasion": "D",
        
                },
        "source": {
                    "weightSpacePage": 343,
                    "battleValuePage": 318,
                    "costAvailabilityPage": 294
                }
    },
    "clan_lb_20_x_ac_ammo": {
        "id": "clan_lb_20_x_ac_ammo",
        "name": "LB 20-X AC Ammo",
        "altNames": [
            "CL LB 20-X AC",
            "CL LB 20-X AC Ammo",
            "CL LB 20-X AC Cluster Ammo",
            "CL LB 20-X Ammo",
            "CL LB 20-X Cluster Ammo",
            "CL LBX AC 20 Ammo",
            "CL LBX AC 20 Cluster Ammo",
            "clan lb 20 x ac",
            "clan lb 20 x ac ammo",
            "Clan LB 20-X AC Cluster Ammo",
            "Clan LB 20-X Ammo",
            "Clan LB 20-X Cluster Ammo",
            "clan lb x ac",
            "Clan LBX AC 20 Ammo",
            "Clan LBX AC 20 Cluster Ammo",
            "LB 20 X AC",
            "LB 20 X AC Ammo",
            "LB 20-X AC Cluster Ammo",
            "LB 20-X Ammo",
            "LB 20-X Cluster Ammo",
            "LBX AC 20 Ammo",
            "LBX AC 20 Cluster Ammo"
        ],
        "ammoType": "clan_lb_x_ac",
        "weaponIds": ["clan_lb_20_x_ac"],
        "compatibleWeaponNames": ["LB 20-X AC"],
        "techBase": "Clan",
        "rulesLevel": "Standard",
        "shotsPerTon": 5,
        "costPerTon": 20000,
        "bv": 30,
        "availability": {
        
                    "starLeague": "X",
        
                    "successionWars": "X",
        
                    "clanInvasion": "E",
        
                },
        "source": {
                    "weightSpacePage": 343,
                    "battleValuePage": 318,
                    "costAvailabilityPage": 294
                }
    },
    "clan_lb_2_x_ac_ammo": {
        "id": "clan_lb_2_x_ac_ammo",
        "name": "LB 2-X AC Ammo",
        "altNames": [
            "CL LB 2-X AC",
            "CL LB 2-X AC Ammo",
            "CL LB 2-X AC Cluster Ammo",
            "CL LB 2-X Ammo",
            "CL LB 2-X Cluster Ammo",
            "CL LBX AC 2 Ammo",
            "CL LBX AC 2 Cluster Ammo",
            "clan lb 2 x ac",
            "clan lb 2 x ac ammo",
            "Clan LB 2-X AC Cluster Ammo",
            "Clan LB 2-X Ammo",
            "Clan LB 2-X Cluster Ammo",
            "clan lb x ac",
            "Clan LBX AC 2 Ammo",
            "Clan LBX AC 2 Cluster Ammo",
            "LB 2 X AC",
            "LB 2 X AC Ammo",
            "LB 2-X AC Cluster Ammo",
            "LB 2-X Ammo",
            "LB 2-X Cluster Ammo",
            "LBX AC 2 Ammo",
            "LBX AC 2 Cluster Ammo"
        ],
        "ammoType": "clan_lb_x_ac",
        "weaponIds": ["clan_lb_2_x_ac"],
        "compatibleWeaponNames": ["LB 2-X AC"],
        "techBase": "Clan",
        "rulesLevel": "Standard",
        "shotsPerTon": 45,
        "costPerTon": 2000,
        "bv": 6,
        "availability": {
        
                    "starLeague": "X",
        
                    "successionWars": "X",
        
                    "clanInvasion": "E",
        
                },
        "source": {
                    "weightSpacePage": 343,
                    "battleValuePage": 318,
                    "costAvailabilityPage": 294
                }
    },
    "clan_lb_5_x_ac_ammo": {
        "id": "clan_lb_5_x_ac_ammo",
        "name": "LB 5-X AC Ammo",
        "altNames": [
            "CL LB 5-X AC",
            "CL LB 5-X AC Ammo",
            "CL LB 5-X AC Cluster Ammo",
            "CL LB 5-X Ammo",
            "CL LB 5-X Cluster Ammo",
            "CL LBX AC 5 Ammo",
            "CL LBX AC 5 Cluster Ammo",
            "clan lb 5 x ac",
            "clan lb 5 x ac ammo",
            "Clan LB 5-X AC Cluster Ammo",
            "Clan LB 5-X Ammo",
            "Clan LB 5-X Cluster Ammo",
            "clan lb x ac",
            "Clan LBX AC 5 Ammo",
            "Clan LBX AC 5 Cluster Ammo",
            "LB 5 X AC",
            "LB 5 X AC Ammo",
            "LB 5-X AC Cluster Ammo",
            "LB 5-X Ammo",
            "LB 5-X Cluster Ammo",
            "LBX AC 5 Ammo",
            "LBX AC 5 Cluster Ammo"
        ],
        "ammoType": "clan_lb_x_ac",
        "weaponIds": ["clan_lb_5_x_ac"],
        "compatibleWeaponNames": ["LB 5-X AC"],
        "techBase": "Clan",
        "rulesLevel": "Standard",
        "shotsPerTon": 20,
        "costPerTon": 9000,
        "bv": 12,
        "availability": {
        
                    "starLeague": "X",
        
                    "successionWars": "X",
        
                    "clanInvasion": "D",
        
                },
        "source": {
                    "weightSpacePage": 343,
                    "battleValuePage": 318,
                    "costAvailabilityPage": 294
                }
    },
    "clan_lb_10_x_ac_cl_ammo": {
        "id": "clan_lb_10_x_ac_cl_ammo",
        "name": "LB 10-X AC Cluster Ammo",
        "altNames": [
            "Clan LB 10-X Cluster Ammo",
            "Clan LB 10-X AC Cluster Ammo",
            "CL LB 10-X Cluster Ammo",
            "CLLB10XACClusterAmmo",
            "CL LB 10-X AC",
            "CL LB 10-X AC Ammo",
            "CL LB 10-X Ammo",
            "CL LBX AC 10 Ammo",
            "CL LBX AC 10 Cluster Ammo",
            "clan lb 10 x ac",
            "clan lb 10 x ac cl ammo",
            "Clan LB 10-X AC Ammo",
            "Clan LB 10-X Ammo",
            "clan lb x ac cluster",
            "Clan LBX AC 10 Ammo",
            "Clan LBX AC 10 Cluster Ammo",
            "LB 10 X AC",
            "LB 10 X AC Cluster Ammo",
            "LB 10-X AC Ammo",
            "LB 10-X Ammo",
            "LB 10-X Cluster Ammo",
            "LBX AC 10 Ammo",
            "LBX AC 10 Cluster Ammo"
        ],
        "ammoType": "clan_lb_x_ac_cluster",
        "weaponIds": ["clan_lb_10_x_ac"],
        "compatibleWeaponNames": ["LB 10-X AC"],
        "techBase": "Clan",
        "rulesLevel": "Standard",
        "shotsPerTon": 10,
        "costPerTon": 20000,
        "bv": 19,
        "availability": {
        
                    "starLeague": "E",
        
                    "successionWars": "F",
        
                    "clanInvasion": "D",
        
                },
        "source": {
                    "weightSpacePage": 343,
                    "battleValuePage": 318,
                    "costAvailabilityPage": 294
                }
    },
    "clan_lb_20_x_ac_cl_ammo": {
        "id": "clan_lb_20_x_ac_cl_ammo",
        "name": "LB 20-X AC Cluster Ammo",
        "altNames": [
            "Clan LB 20-X Cluster Ammo",
            "Clan LB 20-X AC Cluster Ammo",
            "CL LB 20-X Cluster Ammo",
            "CLLB20XACClusterAmmo",
            "CL LB 20-X AC",
            "CL LB 20-X AC Ammo",
            "CL LB 20-X Ammo",
            "CL LBX AC 20 Ammo",
            "CL LBX AC 20 Cluster Ammo",
            "clan lb 20 x ac",
            "clan lb 20 x ac cl ammo",
            "Clan LB 20-X AC Ammo",
            "Clan LB 20-X Ammo",
            "clan lb x ac cluster",
            "Clan LBX AC 20 Ammo",
            "Clan LBX AC 20 Cluster Ammo",
            "LB 20 X AC",
            "LB 20 X AC Cluster Ammo",
            "LB 20-X AC Ammo",
            "LB 20-X Ammo",
            "LB 20-X Cluster Ammo",
            "LBX AC 20 Ammo",
            "LBX AC 20 Cluster Ammo"
        ],
        "ammoType": "clan_lb_x_ac_cluster",
        "weaponIds": ["clan_lb_20_x_ac"],
        "compatibleWeaponNames": ["LB 20-X AC"],
        "techBase": "Clan",
        "rulesLevel": "Standard",
        "shotsPerTon": 5,
        "costPerTon": 34000,
        "bv": 30,
        "availability": {
        
                    "starLeague": "X",
        
                    "successionWars": "X",
        
                    "clanInvasion": "E",
        
                },
        "source": {
                    "weightSpacePage": 343,
                    "battleValuePage": 318,
                    "costAvailabilityPage": 294
                }
    },
    "clan_lb_2_x_ac_cl_ammo": {
        "id": "clan_lb_2_x_ac_cl_ammo",
        "name": "LB 2-X AC Cluster Ammo",
        "altNames": [
            "Clan LB 2-X Cluster Ammo",
            "Clan LB 2-X AC Cluster Ammo",
            "CL LB 2-X Cluster Ammo",
            "CLLB2XACClusterAmmo",
            "CL LB 2-X AC",
            "CL LB 2-X AC Ammo",
            "CL LB 2-X Ammo",
            "CL LBX AC 2 Ammo",
            "CL LBX AC 2 Cluster Ammo",
            "clan lb 2 x ac",
            "clan lb 2 x ac cl ammo",
            "Clan LB 2-X AC Ammo",
            "Clan LB 2-X Ammo",
            "clan lb x ac cluster",
            "Clan LBX AC 2 Ammo",
            "Clan LBX AC 2 Cluster Ammo",
            "LB 2 X AC",
            "LB 2 X AC Cluster Ammo",
            "LB 2-X AC Ammo",
            "LB 2-X Ammo",
            "LB 2-X Cluster Ammo",
            "LBX AC 2 Ammo",
            "LBX AC 2 Cluster Ammo"
        ],
        "ammoType": "clan_lb_x_ac_cluster",
        "weaponIds": ["clan_lb_2_x_ac"],
        "compatibleWeaponNames": ["LB 2-X AC"],
        "techBase": "Clan",
        "rulesLevel": "Standard",
        "shotsPerTon": 45,
        "costPerTon": 3300,
        "bv": 6,
        "availability": {
        
                    "starLeague": "X",
        
                    "successionWars": "X",
        
                    "clanInvasion": "E",
        
                },
        "source": {
                    "weightSpacePage": 343,
                    "battleValuePage": 318,
                    "costAvailabilityPage": 294
                }
    },
    "clan_lb_5_x_ac_cl_ammo": {
        "id": "clan_lb_5_x_ac_cl_ammo",
        "name": "LB 5-X AC Cluster Ammo",
        "altNames": [
            "Clan LB 5-X Cluster Ammo",
            "Clan LB 5-X AC Cluster Ammo",
            "CL LB 5-X Cluster Ammo",
            "CLLB5XACClusterAmmo",
            "CL LB 5-X AC",
            "CL LB 5-X AC Ammo",
            "CL LB 5-X Ammo",
            "CL LBX AC 5 Ammo",
            "CL LBX AC 5 Cluster Ammo",
            "clan lb 5 x ac",
            "clan lb 5 x ac cl ammo",
            "Clan LB 5-X AC Ammo",
            "Clan LB 5-X Ammo",
            "clan lb x ac cluster",
            "Clan LBX AC 5 Ammo",
            "Clan LBX AC 5 Cluster Ammo",
            "LB 5 X AC",
            "LB 5 X AC Cluster Ammo",
            "LB 5-X AC Ammo",
            "LB 5-X Ammo",
            "LB 5-X Cluster Ammo",
            "LBX AC 5 Ammo",
            "LBX AC 5 Cluster Ammo"
        ],
        "ammoType": "clan_lb_x_ac_cluster",
        "weaponIds": ["clan_lb_5_x_ac"],
        "compatibleWeaponNames": ["LB 5-X AC"],
        "techBase": "Clan",
        "rulesLevel": "Standard",
        "shotsPerTon": 20,
        "costPerTon": 15000,
        "bv": 12,
        "availability": {
        
                    "starLeague": "X",
        
                    "successionWars": "X",
        
                    "clanInvasion": "D",
        
                },
        "source": {
                    "weightSpacePage": 343,
                    "battleValuePage": 318,
                    "costAvailabilityPage": 294
                }
    },
    "clan_light_machine_gun_ammo": {
        "id": "clan_light_machine_gun_ammo",
        "name": "Light Machine Gun Ammo",
        "altNames": [
            "CL Light Machine Gun",
            "CL Light Machine Gun Ammo",
            "CL Machine Gun Ammo",
            "Clan Light Machine Gun",
            "clan light machine gun ammo",
            "clan machine gun",
            "Light Machine Gun",
            "Machine Gun Ammo"
        ],
        "ammoType": "clan_machine_gun",
        "weaponIds": ["clan_light_machine_gun"],
        "compatibleWeaponNames": ["Light Machine Gun"],
        "techBase": "Clan",
        "rulesLevel": "Standard",
        "shotsPerTon": 200,
        "costPerTon": 500,
        "bv": 1,
        "availability": {
        
                    "starLeague": "X",
        
                    "successionWars": "X",
        
                    "clanInvasion": "C",
        
                },
        "source": {
                    "weightSpacePage": 343,
                    "battleValuePage": 318,
                    "costAvailabilityPage": 294
                }
    },
    "clan_lrm_10_ammo": {
        "id": "clan_lrm_10_ammo",
        "name": "LRM 10 Ammo",
        "altNames": [
            "CL LRM 10",
            "CL LRM 10 Ammo",
            "CL LRM 10 LRM Ammo",
            "CL LRM 10 SRM Ammo",
            "clan lrm",
            "clan lrm 10",
            "clan lrm 10 ammo",
            "LRM 10",
            "LRM 10 LRM Ammo",
            "LRM 10 SRM Ammo"
        ],
        "ammoType": "clan_lrm",
        "weaponIds": ["clan_lrm_10"],
        "compatibleWeaponNames": ["LRM 10"],
        "techBase": "Clan",
        "rulesLevel": "Standard",
        "shotsPerTon": 12,
        "costPerTon": 30000,
        "bv": 14,
        "availability": {
        
                    "starLeague": "C",
        
                    "successionWars": "C",
        
                    "clanInvasion": "C",
        
                },
        "source": {
                    "weightSpacePage": 343,
                    "battleValuePage": 318,
                    "costAvailabilityPage": 295
                }
    },
    "clan_lrm_15_ammo": {
        "id": "clan_lrm_15_ammo",
        "name": "LRM 15 Ammo",
        "altNames": [
            "CL LRM 15",
            "CL LRM 15 Ammo",
            "CL LRM 15 LRM Ammo",
            "CL LRM 15 SRM Ammo",
            "clan lrm",
            "Clan LRM 15",
            "clan lrm 15 ammo",
            "LRM 15",
            "LRM 15 LRM Ammo",
            "LRM 15 SRM Ammo"
        ],
        "ammoType": "clan_lrm",
        "weaponIds": ["clan_lrm_15"],
        "compatibleWeaponNames": ["LRM 15"],
        "techBase": "Clan",
        "rulesLevel": "Standard",
        "shotsPerTon": 8,
        "costPerTon": 30000,
        "bv": 21,
        "availability": {
        
                    "starLeague": "C",
        
                    "successionWars": "C",
        
                    "clanInvasion": "C",
        
                },
        "source": {
                    "weightSpacePage": 343,
                    "battleValuePage": 318,
                    "costAvailabilityPage": 295
                }
    },
    "clan_lrm_20_ammo": {
        "id": "clan_lrm_20_ammo",
        "name": "LRM 20 Ammo",
        "altNames": [
            "CL LRM 20",
            "CL LRM 20 Ammo",
            "CL LRM 20 LRM Ammo",
            "CL LRM 20 SRM Ammo",
            "clan lrm",
            "Clan LRM 20",
            "Clan LRM 20 Ammo",
            "LRM 20",
            "LRM 20 LRM Ammo",
            "LRM 20 SRM Ammo"
        ],
        "ammoType": "clan_lrm",
        "weaponIds": ["clan_lrm_20"],
        "compatibleWeaponNames": ["LRM 20"],
        "techBase": "Clan",
        "rulesLevel": "Standard",
        "shotsPerTon": 6,
        "costPerTon": 30000,
        "bv": 27,
        "availability": {
        
                    "starLeague": "C",
        
                    "successionWars": "C",
        
                    "clanInvasion": "C",
        
                },
        "source": {
                    "weightSpacePage": 343,
                    "battleValuePage": 318,
                    "costAvailabilityPage": 295
                }
    },
    "clan_lrm_5_ammo": {
        "id": "clan_lrm_5_ammo",
        "name": "LRM 5 Ammo",
        "altNames": [
            "CL LRM 5",
            "CL LRM 5 Ammo",
            "CL LRM 5 LRM Ammo",
            "CL LRM 5 SRM Ammo",
            "clan lrm",
            "Clan LRM 5",
            "Clan LRM 5 Ammo",
            "LRM 5",
            "LRM 5 LRM Ammo",
            "LRM 5 SRM Ammo"
        ],
        "ammoType": "clan_lrm",
        "weaponIds": ["clan_lrm_5"],
        "compatibleWeaponNames": ["LRM 5"],
        "techBase": "Clan",
        "rulesLevel": "Standard",
        "shotsPerTon": 24,
        "costPerTon": 30000,
        "bv": 7,
        "availability": {
        
                    "starLeague": "C",
        
                    "successionWars": "C",
        
                    "clanInvasion": "C",
        
                },
        "source": {
                    "weightSpacePage": 343,
                    "battleValuePage": 318,
                    "costAvailabilityPage": 295
                }
    },
    "clan_machine_gun_ammo": {
        "id": "clan_machine_gun_ammo",
        "name": "Machine Gun Ammo",
        "altNames": [
            "CL Machine Gun",
            "CL Machine Gun Ammo",
            "clan machine gun",
            "clan machine gun ammo",
            "Machine Gun"
        ],
        "ammoType": "clan_machine_gun",
        "weaponIds": ["clan_machine_gun"],
        "compatibleWeaponNames": ["Machine Gun"],
        "techBase": "Clan",
        "rulesLevel": "Standard",
        "shotsPerTon": 200,
        "costPerTon": 1000,
        "bv": 1,
        "availability": {
        
                    "starLeague": "A",
        
                    "successionWars": "A",
        
                    "clanInvasion": "B",
        
                },
        "source": {
                    "weightSpacePage": 343,
                    "battleValuePage": 318,
                    "costAvailabilityPage": 294
                }
    },
    "clan_narc_missile_beacon_ammo": {
        "id": "clan_narc_missile_beacon_ammo",
        "name": "Narc Missile Beacon Ammo",
        "altNames": [
            "CL Narc Missile Beacon",
            "CL Narc Missile Beacon Ammo",
            "clan narc missile beacon",
            "clan narc missile beacon ammo",
            "Narc Missile Beacon"
        ],
        "ammoType": "clan_narc_missile_beacon_ammo",
        "weaponIds": ["clan_narc_missile_beacon"],
        "compatibleWeaponNames": ["Narc Missile Beacon"],
        "techBase": "Clan",
        "rulesLevel": "Standard",
        "shotsPerTon": 6,
        "costPerTon": 6000,
        "bv": 0,
        "source": {
                    "weightSpacePage": 343,
                    "battleValuePage": 318
                }
    },
    "clan_plasma_cannon_ammo": {
        "id": "clan_plasma_cannon_ammo",
        "name": "Plasma Cannon Ammo",
        "altNames": [
            "CL Plasma Cannon",
            "CL Plasma Cannon Ammo",
            "clan plasma cannon",
            "Clan Plasma Cannon Ammo",
            "Plasma Cannon"
        ],
        "ammoType": "clan_plasma_cannon",
        "weaponIds": ["clan_plasma_cannon"],
        "compatibleWeaponNames": ["Plasma Cannon"],
        "techBase": "Clan",
        "rulesLevel": "Standard",
        "shotsPerTon": 10,
        "costPerTon": 12000,
        "bv": 21,
        "availability": {
        
                    "starLeague": "X",
        
                    "successionWars": "X",
        
                    "clanInvasion": "E",
        
                },
        "source": {
                    "weightSpacePage": 343,
                    "battleValuePage": 318,
                    "costAvailabilityPage": 295
                }
    },
    "clan_srm_2_ammo": {
        "id": "clan_srm_2_ammo",
        "name": "SRM 2 Ammo",
        "altNames": [
            "CL SRM 2",
            "CL SRM 2 Ammo",
            "CL SRM 2 LRM Ammo",
            "CL SRM 2 SRM Ammo",
            "clan srm",
            "Clan SRM 2",
            "Clan SRM 2 Ammo",
            "SRM 2",
            "SRM 2 LRM Ammo",
            "SRM 2 SRM Ammo"
        ],
        "ammoType": "clan_srm",
        "weaponIds": ["clan_srm_2"],
        "compatibleWeaponNames": ["SRM 2"],
        "techBase": "Clan",
        "rulesLevel": "Standard",
        "shotsPerTon": 50,
        "costPerTon": 27000,
        "bv": 3,
        "availability": {
        
                    "starLeague": "B",
        
                    "successionWars": "B",
        
                    "clanInvasion": "B",
        
                },
        "source": {
                    "weightSpacePage": 343,
                    "battleValuePage": 318,
                    "costAvailabilityPage": 295
                }
    },
    "clan_srm_4_ammo": {
        "id": "clan_srm_4_ammo",
        "name": "SRM 4 Ammo",
        "altNames": [
            "CL SRM 4",
            "CL SRM 4 Ammo",
            "CL SRM 4 LRM Ammo",
            "CL SRM 4 SRM Ammo",
            "clan srm",
            "clan srm 4",
            "clan srm 4 ammo",
            "SRM 4",
            "SRM 4 LRM Ammo",
            "SRM 4 SRM Ammo"
        ],
        "ammoType": "clan_srm",
        "weaponIds": ["clan_srm_4"],
        "compatibleWeaponNames": ["SRM 4"],
        "techBase": "Clan",
        "rulesLevel": "Standard",
        "shotsPerTon": 25,
        "costPerTon": 27000,
        "bv": 5,
        "availability": {
        
                    "starLeague": "B",
        
                    "successionWars": "B",
        
                    "clanInvasion": "B",
        
                },
        "source": {
                    "weightSpacePage": 343,
                    "battleValuePage": 318,
                    "costAvailabilityPage": 295
                }
    },
    "clan_srm_6_ammo": {
        "id": "clan_srm_6_ammo",
        "name": "SRM 6 Ammo",
        "altNames": [
            "CL SRM 6",
            "CL SRM 6 Ammo",
            "CL SRM 6 LRM Ammo",
            "CL SRM 6 SRM Ammo",
            "clan srm",
            "clan srm 6",
            "clan srm 6 ammo",
            "SRM 6",
            "SRM 6 LRM Ammo",
            "SRM 6 SRM Ammo"
        ],
        "ammoType": "clan_srm",
        "weaponIds": ["clan_srm_6"],
        "compatibleWeaponNames": ["SRM 6"],
        "techBase": "Clan",
        "rulesLevel": "Standard",
        "shotsPerTon": 15,
        "costPerTon": 27000,
        "bv": 7,
        "availability": {
        
                    "starLeague": "B",
        
                    "successionWars": "B",
        
                    "clanInvasion": "B",
        
                },
        "source": {
                    "weightSpacePage": 343,
                    "battleValuePage": 318,
                    "costAvailabilityPage": 295
                }
    },
    "clan_streak_lrm_10_ammo": {
        "id": "clan_streak_lrm_10_ammo",
        "name": "Streak LRM 10 Ammo",
        "altNames": [
            "CL LRM 10 Ammo",
            "CL LRM 10 LRM Ammo",
            "CL LRM 10 SRM Ammo",
            "CL Streak LRM 10",
            "CL Streak LRM 10 Ammo",
            "clan streak lrm",
            "clan streak lrm 10",
            "Clan Streak LRM 10 Ammo",
            "LRM 10 Ammo",
            "LRM 10 LRM Ammo",
            "LRM 10 SRM Ammo",
            "Streak LRM 10"
        ],
        "ammoType": "clan_streak_lrm",
        "weaponIds": ["clan_streak_lrm_10"],
        "compatibleWeaponNames": ["Streak LRM 10"],
        "techBase": "Clan",
        "rulesLevel": "Experimental",
        "shotsPerTon": 12,
        "costPerTon": 60000,
        "bv": 22,
        "availability": {
        
                    "starLeague": "X",
        
                    "successionWars": "X",
        
                    "clanInvasion": "E",
        
                },
        "source": {
                        "battleValuePage": 0,
                        "weightSpacePage": 0
                }
    },
    "clan_streak_lrm_15_ammo": {
        "id": "clan_streak_lrm_15_ammo",
        "name": "Streak LRM 15 Ammo",
        "altNames": [
            "CL LRM 15 Ammo",
            "CL LRM 15 LRM Ammo",
            "CL LRM 15 SRM Ammo",
            "CL Streak LRM 15",
            "CL Streak LRM 15 Ammo",
            "clan streak lrm",
            "Clan Streak LRM 15",
            "Clan Streak LRM 15 Ammo",
            "LRM 15 Ammo",
            "LRM 15 LRM Ammo",
            "LRM 15 SRM Ammo",
            "Streak LRM 15"
        ],
        "ammoType": "clan_streak_lrm",
        "weaponIds": ["clan_streak_lrm_15"],
        "compatibleWeaponNames": ["Streak LRM 15"],
        "techBase": "Clan",
        "rulesLevel": "Experimental",
        "shotsPerTon": 8,
        "costPerTon": 60000,
        "bv": 32,
        "availability": {
        
                    "starLeague": "X",
        
                    "successionWars": "X",
        
                    "clanInvasion": "E",
        
                },
        "source": {
                        "battleValuePage": 0,
                        "weightSpacePage": 0
                }
    },
    "clan_streak_lrm_20_ammo": {
        "id": "clan_streak_lrm_20_ammo",
        "name": "Streak LRM 20 Ammo",
        "altNames": [
            "CL LRM 20 Ammo",
            "CL LRM 20 LRM Ammo",
            "CL LRM 20 SRM Ammo",
            "CL Streak LRM 20",
            "CL Streak LRM 20 Ammo",
            "clan streak lrm",
            "clan streak lrm 20",
            "Clan Streak LRM 20 Ammo",
            "LRM 20 Ammo",
            "LRM 20 LRM Ammo",
            "LRM 20 SRM Ammo",
            "Streak LRM 20"
        ],
        "ammoType": "clan_streak_lrm",
        "weaponIds": ["clan_streak_lrm_20"],
        "compatibleWeaponNames": ["Streak LRM 20"],
        "techBase": "Clan",
        "rulesLevel": "Experimental",
        "shotsPerTon": 6,
        "costPerTon": 60000,
        "bv": 43,
        "availability": {
        
                    "starLeague": "X",
        
                    "successionWars": "X",
        
                    "clanInvasion": "E",
        
                },
        "source": {
                        "battleValuePage": 0,
                        "weightSpacePage": 0
                }
    },
    "clan_streak_lrm_5_ammo": {
        "id": "clan_streak_lrm_5_ammo",
        "name": "Streak LRM 5 Ammo",
        "altNames": [
            "CL LRM 5 Ammo",
            "CL LRM 5 LRM Ammo",
            "CL LRM 5 SRM Ammo",
            "CL Streak LRM 5",
            "CL Streak LRM 5 Ammo",
            "clan streak lrm",
            "Clan Streak LRM 5",
            "clan streak lrm 5 ammo",
            "LRM 5 Ammo",
            "LRM 5 LRM Ammo",
            "LRM 5 SRM Ammo",
            "Streak LRM 5"
        ],
        "ammoType": "clan_streak_lrm",
        "weaponIds": ["clan_streak_lrm_5"],
        "compatibleWeaponNames": ["Streak LRM 5"],
        "techBase": "Clan",
        "rulesLevel": "Experimental",
        "shotsPerTon": 24,
        "costPerTon": 60000,
        "bv": 11,
        "availability": {
        
                    "starLeague": "X",
        
                    "successionWars": "X",
        
                    "clanInvasion": "E",
        
                },
        "source": {
                        "battleValuePage": 0,
                        "weightSpacePage": 0
                }
    },
    "clan_streak_srm_2_ammo": {
        "id": "clan_streak_srm_2_ammo",
        "name": "Streak SRM 2 Ammo",
        "altNames": [
            "CL Streak SRM 2",
            "CL Streak SRM 2 Ammo",
            "CL Streak SRM 2 LRM Ammo",
            "CL Streak SRM 2 SRM Ammo",
            "clan streak srm",
            "clan streak srm 2",
            "clan streak srm 2 ammo",
            "Streak SRM 2",
            "Streak SRM 2 LRM Ammo",
            "Streak SRM 2 SRM Ammo"
        ],
        "ammoType": "clan_streak_srm",
        "weaponIds": ["clan_streak_srm_2"],
        "compatibleWeaponNames": ["Streak SRM 2"],
        "techBase": "Clan",
        "rulesLevel": "Standard",
        "shotsPerTon": 50,
        "costPerTon": 54000,
        "bv": 5,
        "availability": {
        
                    "starLeague": "E",
        
                    "successionWars": "F",
        
                    "clanInvasion": "D",
        
                },
        "source": {
                    "weightSpacePage": 343,
                    "battleValuePage": 318,
                    "costAvailabilityPage": 295
                }
    },
    "clan_streak_srm_4_ammo": {
        "id": "clan_streak_srm_4_ammo",
        "name": "Streak SRM 4 Ammo",
        "altNames": [
            "CL Streak SRM 4",
            "CL Streak SRM 4 Ammo",
            "CL Streak SRM 4 LRM Ammo",
            "CL Streak SRM 4 SRM Ammo",
            "clan streak srm",
            "clan streak srm 4",
            "Clan Streak SRM 4 Ammo",
            "Streak SRM 4",
            "Streak SRM 4 LRM Ammo",
            "Streak SRM 4 SRM Ammo"
        ],
        "ammoType": "clan_streak_srm",
        "weaponIds": ["clan_streak_srm_4"],
        "compatibleWeaponNames": ["Streak SRM 4"],
        "techBase": "Clan",
        "rulesLevel": "Standard",
        "shotsPerTon": 25,
        "costPerTon": 54000,
        "bv": 10,
        "availability": {
        
                    "starLeague": "X",
        
                    "successionWars": "X",
        
                    "clanInvasion": "E",
        
                },
        "source": {
                    "weightSpacePage": 343,
                    "battleValuePage": 318,
                    "costAvailabilityPage": 295
                }
    },
    "clan_streak_srm_6_ammo": {
        "id": "clan_streak_srm_6_ammo",
        "name": "Streak SRM 6 Ammo",
        "altNames": [
            "CL Streak SRM 6",
            "CL Streak SRM 6 Ammo",
            "CL Streak SRM 6 LRM Ammo",
            "CL Streak SRM 6 SRM Ammo",
            "clan streak srm",
            "Clan Streak SRM 6",
            "Clan Streak SRM 6 Ammo",
            "Streak SRM 6",
            "Streak SRM 6 LRM Ammo",
            "Streak SRM 6 SRM Ammo"
        ],
        "ammoType": "clan_streak_srm",
        "weaponIds": ["clan_streak_srm_6"],
        "compatibleWeaponNames": ["Streak SRM 6"],
        "techBase": "Clan",
        "rulesLevel": "Standard",
        "shotsPerTon": 15,
        "costPerTon": 54000,
        "bv": 15,
        "availability": {
        
                    "starLeague": "X",
        
                    "successionWars": "X",
        
                    "clanInvasion": "E",
        
                },
        "source": {
                    "weightSpacePage": 343,
                    "battleValuePage": 318,
                    "costAvailabilityPage": 295
                }
    },
    "clan_ultra_ac_10_ammo": {
        "id": "clan_ultra_ac_10_ammo",
        "name": "Ultra AC/10 Ammo",
        "altNames": [
            "CL Ultra AC/10",
            "CL Ultra AC/10 Ammo",
            "clan ultra ac",
            "clan ultra ac 10",
            "clan ultra ac 10 ammo",
            "Ultra AC 10",
            "Ultra AC 10 Ammo"
        ],
        "ammoType": "clan_ultra_ac",
        "weaponIds": ["clan_ultra_ac_10"],
        "compatibleWeaponNames": ["Ultra AC/10"],
        "techBase": "Clan",
        "rulesLevel": "Standard",
        "shotsPerTon": 10,
        "costPerTon": 12000,
        "bv": 26,
        "availability": {
        
                    "starLeague": "X",
        
                    "successionWars": "X",
        
                    "clanInvasion": "E",
        
                },
        "source": {
                    "weightSpacePage": 343,
                    "battleValuePage": 318,
                    "costAvailabilityPage": 294
                }
    },
    "clan_ultra_ac_20_ammo": {
        "id": "clan_ultra_ac_20_ammo",
        "name": "Ultra AC/20 Ammo",
        "altNames": [
            "CL Ultra AC/20",
            "CL Ultra AC/20 Ammo",
            "clan ultra ac",
            "clan ultra ac 20",
            "clan ultra ac 20 ammo",
            "Ultra AC 20",
            "Ultra AC 20 Ammo"
        ],
        "ammoType": "clan_ultra_ac",
        "weaponIds": ["clan_ultra_ac_20"],
        "compatibleWeaponNames": ["Ultra AC/20"],
        "techBase": "Clan",
        "rulesLevel": "Standard",
        "shotsPerTon": 5,
        "costPerTon": 20000,
        "bv": 42,
        "availability": {
        
                    "starLeague": "X",
        
                    "successionWars": "X",
        
                    "clanInvasion": "E",
        
                },
        "source": {
                    "weightSpacePage": 343,
                    "battleValuePage": 318,
                    "costAvailabilityPage": 294
                }
    },
    "clan_ultra_ac_2_ammo": {
        "id": "clan_ultra_ac_2_ammo",
        "name": "Ultra AC/2 Ammo",
        "altNames": [
            "CL Ultra AC/2",
            "CL Ultra AC/2 Ammo",
            "clan ultra ac",
            "clan ultra ac 2",
            "clan ultra ac 2 ammo",
            "Ultra AC 2",
            "Ultra AC 2 Ammo"
        ],
        "ammoType": "clan_ultra_ac",
        "weaponIds": ["clan_ultra_ac_2"],
        "compatibleWeaponNames": ["Ultra AC/2"],
        "techBase": "Clan",
        "rulesLevel": "Standard",
        "shotsPerTon": 45,
        "costPerTon": 1000,
        "bv": 8,
        "availability": {
        
                    "starLeague": "X",
        
                    "successionWars": "X",
        
                    "clanInvasion": "E",
        
                },
        "source": {
                    "weightSpacePage": 343,
                    "battleValuePage": 318,
                    "costAvailabilityPage": 294
                }
    },
    "clan_ultra_ac_5_ammo": {
        "id": "clan_ultra_ac_5_ammo",
        "name": "Ultra AC/5 Ammo",
        "altNames": [
            "CL Ultra AC/5",
            "CL Ultra AC/5 Ammo",
            "clan ultra ac",
            "clan ultra ac 5",
            "clan ultra ac 5 ammo",
            "Ultra AC 5",
            "Ultra AC 5 Ammo"
        ],
        "ammoType": "clan_ultra_ac",
        "weaponIds": ["clan_ultra_ac_5"],
        "compatibleWeaponNames": ["Ultra AC/5"],
        "techBase": "Clan",
        "rulesLevel": "Standard",
        "shotsPerTon": 20,
        "costPerTon": 9000,
        "bv": 15,
        "availability": {
        
                    "starLeague": "D",
        
                    "successionWars": "F",
        
                    "clanInvasion": "D",
        
                },
        "source": {
                    "weightSpacePage": 343,
                    "battleValuePage": 318,
                    "costAvailabilityPage": 294
                }
    },
    "clan_protomech_ac_8_ammo": {
        "id": "clan_protomech_ac_8_ammo",
        "name": "ProtoMech AC/8 Ammo",
        "altNames": [
            "CL ProtoMech AC/8",
            "CL ProtoMech AC/8 Ammo",
            "clan protomech ac 8",
            "clan protomech ac 8 ammo",
            "ProtoMech AC 8",
            "ProtoMech AC 8 Ammo"
        ],
        "ammoType": "clan_protomech_ac_8_ammo",
        "weaponIds": ["clan_protomech_ac_8"],
        "compatibleWeaponNames": ["ProtoMech AC/8"],
        "techBase": "Clan",
        "rulesLevel": "Advanced",
        "shotsPerTon": 10,
        "costPerTon": 6300,
        "bv": 0,
        "availability": {
                    "starLeague": "X",
                    "successionWars": "X",
                    "clanInvasion": "F"
        
                },
        "source": {
                    "weightSpacePage": 0,
                    "battleValuePage": 0,
                    "costAvailabilityPage": 0
                }
    },
    "clan_protomech_ac_4_ammo": {
        "id": "clan_protomech_ac_4_ammo",
        "name": "ProtoMech AC/4 Ammo",
        "altNames": [
            "CL ProtoMech AC/4",
            "CL ProtoMech AC/4 Ammo",
            "clan protomech ac 4",
            "clan protomech ac 4 ammo",
            "ProtoMech AC 4",
            "ProtoMech AC 4 Ammo"
        ],
        "ammoType": "clan_protomech_ac_4_ammo",
        "weaponIds": ["clan_protomech_ac_4"],
        "compatibleWeaponNames": ["ProtoMech AC/4"],
        "techBase": "Clan",
        "rulesLevel": "Advanced",
        "shotsPerTon": 20,
        "costPerTon": 4800,
        "bv": 0,
        "availability": {
                    "starLeague": "X",
                    "successionWars": "X",
                    "clanInvasion": "F"
        
                },
        "source": {
                    "weightSpacePage": 0,
                    "battleValuePage": 0,
                    "costAvailabilityPage": 0
                }
    },
        "is_ams_ammo": {
        "id": "is_ams_ammo",
        "name": "Anti-Missile System Ammo",
        "altNames": [
            "IS AMS",
            "IS Anti-Missile System",
            "IS Anti-Missile System Ammo",
            "Anti Missile System",
            "Anti Missile System Ammo",
            "is ams ammo",
            "AMS"
        ],
        "ammoType": "is_ams",
        "weaponIds": ["is_anti_missile_system"],
        "compatibleWeaponNames": ["Anti-Missile System", "AMS"],
        "techBase": "Inner Sphere",
        "rulesLevel": "Standard",
        "shotsPerTon": 12,
        "costPerTon": 20000,
        "bv": 11,
        "availability": {
            "starLeague": "D",
            "successionWars": "F",
            "clanInvasion": "D"
        },
        "source": {
            "totalWarfarePage": 0,
            "weightSpacePage": 0,
            "costAvailabilityPage": 0,
            "battleValuePage": 0
        }
    },

    "clan_ams_ammo": {
        "id": "clan_ams_ammo",
        "name": "Anti-Missile System Ammo",
        "altNames": [
            "CL AMS",
            "CL Anti-Missile System",
            "CL Anti-Missile System Ammo",
            "CL Clan AMS",
            "CL Clan Anti-Missile System",
            "Anti Missile System",
            "Anti Missile System Ammo",
            "clan ams",
            "clan ams ammo",
            "clan anti missile system",
            "Clan Anti-Missile System Ammo",
            "Clan Clan AMS",
            "Clan Clan Anti-Missile System",
            "AMS"
        ],
        "ammoType": "clan_ams",
        "weaponIds": ["clan_anti_missile_system"],
        "compatibleWeaponNames": ["Anti-Missile System", "AMS", "Clan Anti-Missile System", "Clan AMS"],
        "techBase": "Clan",
        "rulesLevel": "Standard",
        "shotsPerTon": 24,
        "costPerTon": 20000,
        "bv": 11,
        "availability": {
            "starLeague": "D",
            "successionWars": "F",
            "clanInvasion": "D"
        },
        "source": {
            "totalWarfarePage": 0,
            "weightSpacePage": 0,
            "costAvailabilityPage": 0,
            "battleValuePage": 0
        }
    },
        "is_mech_mortar_1_sc_ammo": {
        "id": "is_mech_mortar_1_sc_ammo",
        "name": "Mech Mortar/1 SC Ammo",
        "altNames": [
            "IS Ammo SC Mortar-1",
            "IS SC Mortar-1 Ammo",
            "ISSCMortar1Ammo",
            "IS Mech Mortar/1 SC Ammo",
            "IS Mech Mortar-1 SC Ammo",
            "Ammo SC Mortar-1",
            "SC Mortar-1 Ammo",
            "Mech Mortar/1 SC Ammo",
            "Mech Mortar-1 SC Ammo"
        ],
        "ammoType": "is_mech_mortar_sc",
        "weaponIds": ["mech_mortar_1"],
        "compatibleWeaponNames": ["Mech Mortar/1", "Mech Mortar-1"],
        "techBase": "Inner Sphere",
        "rulesLevel": "Advanced",
        "shotsPerTon": 24,
        "costPerTon": 0,
        "bv": 0,
        "availability": {
            "starLeague": "C",
            "successionWars": "C",
            "clanInvasion": "C"
        },
        "source": {
            "weightSpacePage": 136,
            "battleValuePage": 0,
            "costAvailabilityPage": 0
        }
    },

    "is_mech_mortar_2_sc_ammo": {
        "id": "is_mech_mortar_2_sc_ammo",
        "name": "Mech Mortar/2 SC Ammo",
        "altNames": [
            "IS Ammo SC Mortar-2",
            "IS SC Mortar-2 Ammo",
            "ISSCMortar2Ammo",
            "IS Mech Mortar/2 SC Ammo",
            "IS Mech Mortar-2 SC Ammo",
            "Ammo SC Mortar-2",
            "SC Mortar-2 Ammo",
            "Mech Mortar/2 SC Ammo",
            "Mech Mortar-2 SC Ammo"
        ],
        "ammoType": "is_mech_mortar_sc",
        "weaponIds": ["mech_mortar_2"],
        "compatibleWeaponNames": ["Mech Mortar/2", "Mech Mortar-2"],
        "techBase": "Inner Sphere",
        "rulesLevel": "Advanced",
        "shotsPerTon": 12,
        "costPerTon": 0,
        "bv": 0,
        "availability": {
            "starLeague": "C",
            "successionWars": "C",
            "clanInvasion": "C"
        },
        "source": {
            "weightSpacePage": 136,
            "battleValuePage": 0,
            "costAvailabilityPage": 0
        }
    },

    "is_mech_mortar_4_sc_ammo": {
        "id": "is_mech_mortar_4_sc_ammo",
        "name": "Mech Mortar/4 SC Ammo",
        "altNames": [
            "IS Ammo SC Mortar-4",
            "IS SC Mortar-4 Ammo",
            "ISSCMortar4Ammo",
            "IS Mech Mortar/4 SC Ammo",
            "IS Mech Mortar-4 SC Ammo",
            "Ammo SC Mortar-4",
            "SC Mortar-4 Ammo",
            "Mech Mortar/4 SC Ammo",
            "Mech Mortar-4 SC Ammo"
        ],
        "ammoType": "is_mech_mortar_sc",
        "weaponIds": ["mech_mortar_4"],
        "compatibleWeaponNames": ["Mech Mortar/4", "Mech Mortar-4"],
        "techBase": "Inner Sphere",
        "rulesLevel": "Advanced",
        "shotsPerTon": 6,
        "costPerTon": 0,
        "bv": 0,
        "availability": {
            "starLeague": "C",
            "successionWars": "C",
            "clanInvasion": "C"
        },
        "source": {
            "weightSpacePage": 136,
            "battleValuePage": 0,
            "costAvailabilityPage": 0
        }
    },

    "is_mech_mortar_8_sc_ammo": {
        "id": "is_mech_mortar_8_sc_ammo",
        "name": "Mech Mortar/8 SC Ammo",
        "altNames": [
            "IS Ammo SC Mortar-8",
            "IS SC Mortar-8 Ammo",
            "ISSCMortar8Ammo",
            "IS Mech Mortar/8 SC Ammo",
            "IS Mech Mortar-8 SC Ammo",
            "Ammo SC Mortar-8",
            "SC Mortar-8 Ammo",
            "Mech Mortar/8 SC Ammo",
            "Mech Mortar-8 SC Ammo"
        ],
        "ammoType": "is_mech_mortar_sc",
        "weaponIds": ["mech_mortar_8"],
        "compatibleWeaponNames": ["Mech Mortar/8", "Mech Mortar-8"],
        "techBase": "Inner Sphere",
        "rulesLevel": "Advanced",
        "shotsPerTon": 4,
        "costPerTon": 0,
        "bv": 0,
        "availability": {
            "starLeague": "C",
            "successionWars": "C",
            "clanInvasion": "C"
        },
        "source": {
            "weightSpacePage": 136,
            "battleValuePage": 0,
            "costAvailabilityPage": 0
        }
    },

    "clan_mech_mortar_1_sc_ammo": {
        "id": "clan_mech_mortar_1_sc_ammo",
        "name": "Mech Mortar/1 SC Ammo",
        "altNames": [
            "Clan Ammo SC Mortar-1",
            "Clan SC Mortar-1 Ammo",
            "CL Ammo SC Mortar-1",
            "CLSCMortar1Ammo",
            "Clan Mech Mortar/1 SC Ammo",
            "Clan Mech Mortar-1 SC Ammo",
            "Ammo SC Mortar-1",
            "SC Mortar-1 Ammo",
            "Mech Mortar/1 SC Ammo",
            "Mech Mortar-1 SC Ammo"
        ],
        "ammoType": "clan_mech_mortar_sc",
        "weaponIds": ["mech_mortar_1"],
        "compatibleWeaponNames": ["Mech Mortar/1", "Mech Mortar-1"],
        "techBase": "Clan",
        "rulesLevel": "Advanced",
        "shotsPerTon": 24,
        "costPerTon": 0,
        "bv": 0,
        "availability": {
            "starLeague": "C",
            "successionWars": "C",
            "clanInvasion": "C"
        },
        "source": {
            "weightSpacePage": 136,
            "battleValuePage": 0,
            "costAvailabilityPage": 0
        }
    },

    "clan_mech_mortar_2_sc_ammo": {
        "id": "clan_mech_mortar_2_sc_ammo",
        "name": "Mech Mortar/2 SC Ammo",
        "altNames": [
            "Clan Ammo SC Mortar-2",
            "Clan SC Mortar-2 Ammo",
            "CL Ammo SC Mortar-2",
            "CLSCMortar2Ammo",
            "Clan Mech Mortar/2 SC Ammo",
            "Clan Mech Mortar-2 SC Ammo",
            "Ammo SC Mortar-2",
            "SC Mortar-2 Ammo",
            "Mech Mortar/2 SC Ammo",
            "Mech Mortar-2 SC Ammo"
        ],
        "ammoType": "clan_mech_mortar_sc",
        "weaponIds": ["mech_mortar_2"],
        "compatibleWeaponNames": ["Mech Mortar/2", "Mech Mortar-2"],
        "techBase": "Clan",
        "rulesLevel": "Advanced",
        "shotsPerTon": 12,
        "costPerTon": 0,
        "bv": 0,
        "availability": {
            "starLeague": "C",
            "successionWars": "C",
            "clanInvasion": "C"
        },
        "source": {
            "weightSpacePage": 136,
            "battleValuePage": 0,
            "costAvailabilityPage": 0
        }
    },

    "clan_mech_mortar_4_sc_ammo": {
        "id": "clan_mech_mortar_4_sc_ammo",
        "name": "Mech Mortar/4 SC Ammo",
        "altNames": [
            "Clan Ammo SC Mortar-4",
            "Clan SC Mortar-4 Ammo",
            "CL Ammo SC Mortar-4",
            "CLSCMortar4Ammo",
            "Clan Mech Mortar/4 SC Ammo",
            "Clan Mech Mortar-4 SC Ammo",
            "Ammo SC Mortar-4",
            "SC Mortar-4 Ammo",
            "Mech Mortar/4 SC Ammo",
            "Mech Mortar-4 SC Ammo"
        ],
        "ammoType": "clan_mech_mortar_sc",
        "weaponIds": ["mech_mortar_4"],
        "compatibleWeaponNames": ["Mech Mortar/4", "Mech Mortar-4"],
        "techBase": "Clan",
        "rulesLevel": "Advanced",
        "shotsPerTon": 6,
        "costPerTon": 0,
        "bv": 0,
        "availability": {
            "starLeague": "C",
            "successionWars": "C",
            "clanInvasion": "C"
        },
        "source": {
            "weightSpacePage": 136,
            "battleValuePage": 0,
            "costAvailabilityPage": 0
        }
    },

    "clan_mech_mortar_8_sc_ammo": {
        "id": "clan_mech_mortar_8_sc_ammo",
        "name": "Mech Mortar/8 SC Ammo",
        "altNames": [
            "Clan Ammo SC Mortar-8",
            "Clan SC Mortar-8 Ammo",
            "CL Ammo SC Mortar-8",
            "CLSCMortar8Ammo",
            "Clan Mech Mortar/8 SC Ammo",
            "Clan Mech Mortar-8 SC Ammo",
            "Ammo SC Mortar-8",
            "SC Mortar-8 Ammo",
            "Mech Mortar/8 SC Ammo",
            "Mech Mortar-8 SC Ammo"
        ],
        "ammoType": "clan_mech_mortar_sc",
        "weaponIds": ["mech_mortar_8"],
        "compatibleWeaponNames": ["Mech Mortar/8", "Mech Mortar-8"],
        "techBase": "Clan",
        "rulesLevel": "Advanced",
        "shotsPerTon": 4,
        "costPerTon": 0,
        "bv": 0,
        "availability": {
            "starLeague": "C",
            "successionWars": "C",
            "clanInvasion": "C"
        },
        "source": {
            "weightSpacePage": 136,
            "battleValuePage": 0,
            "costAvailabilityPage": 0
        }
    },
};

export function getAmmoDefinition(ammoRef?: AmmoReference | AmmoOptionReference): AmmoDefinition | undefined {
  return ammoRef ? AMMO[ammoRef.ammoId] : undefined;
}
