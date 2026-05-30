import type { AmmoDefinition, AmmoReference, AmmoOptionReference } from "./weaponTypes";
export type { AmmoDefinition, AmmoReference, AmmoOptionReference } from "./weaponTypes";

export const AMMO: Record<string, AmmoDefinition> = {
    // Inner Sphere ammo
"is_a_pod_ammo": {
        "id": "is_a_pod_ammo",
        "name": "A-Pod Ammo",
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
    "is_autocannon_10_ammo": {
        "id": "is_autocannon_10_ammo",
        "name": "Autocannon/10 Ammo",
        "ammoType": "is_standard_ac",
        "weaponIds": ["is_autocannon_10"],
        "compatibleWeaponNames": ["Autocannon/10"],
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
    "is_autocannon_20_ammo": {
        "id": "is_autocannon_20_ammo",
        "name": "Autocannon/20 Ammo",
        "ammoType": "is_standard_ac",
        "weaponIds": ["is_autocannon_20"],
        "compatibleWeaponNames": ["Autocannon/20"],
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
    "is_autocannon_2_ammo": {
        "id": "is_autocannon_2_ammo",
        "name": "Autocannon/2 Ammo",
        "ammoType": "is_standard_ac",
        "weaponIds": ["is_autocannon_2"],
        "compatibleWeaponNames": ["Autocannon/2"],
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
    "is_autocannon_5_ammo": {
        "id": "is_autocannon_5_ammo",
        "name": "Autocannon/5 Ammo",
        "ammoType": "is_standard_ac",
        "weaponIds": ["is_autocannon_5"],
        "compatibleWeaponNames": ["Autocannon/5"],
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
    "is_light_ac_2_ammo": {
        "id": "is_light_ac_2_ammo",
        "name": "Light AC/2 Ammo",
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

    // Clan ammo
"clan_a_pod_ammo": {
        "id": "clan_a_pod_ammo",
        "name": "A-Pod Ammo",
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
    "clan_anti_missile_system_ammo": {
        "id": "clan_anti_missile_system_ammo",
        "name": "Anti-Missile System Ammo",
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
    "clan_light_machine_gun_ammo": {
        "id": "clan_light_machine_gun_ammo",
        "name": "Light Machine Gun Ammo",
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
    }
};

export function getAmmoDefinition(ammoRef?: AmmoReference | AmmoOptionReference): AmmoDefinition | undefined {
  return ammoRef ? AMMO[ammoRef.ammoId] : undefined;
}
