import { BATTLEMECH_INTERNAL_STRUCTURE } from '../constants/enums';
import { locationFullName } from '../constants/enums';  
import { unitType, side } from '../constants/enums';
import { Unit } from './Unit';
import { WEAPONS } from '../data/weapons';

export class Mek extends Unit{
    
    public model: string;
    public config: string;             //Biped or Quad, etc.
    public mass: number;
    public chassis: string;
    public locations: Record<string, any>;
    public quirks: string[];
    public heatSinksType : string;     //Standard, Double, etc.
    public heatSinks: number;
    public engine: string;
    public structure: string;           // Mek structure is a string like "Standard", "Endo Steel", etc. - the actual structure points are determined by the mass and the BATTLEMECH_INTERNAL_STRUCTURE constant
    public myomer: string;              // Mek myomer is a string like "Standard", "Endo Steel", etc.
    public walkMP: number;
    public jumpMP: number;
    public weapons: Record<string, any>;
    public overview: string;
    public capabilities: string;
    public deployment: string;
    public history: string;
    public manufacturer: string[];
    public primaryfactory: string[];
    public hasCASE: boolean;
    public hasECM: boolean;

    constructor(ut: unitType,
                owner: number,
                force: number,
                chassis: string,
                model: string
                ) {           
        super(ut, owner, force, chassis, model);
        this.chassis = chassis;
        this.model = model;
        this.config = "";
        this.mass = 0;
        this.locations = {};
        this.quirks = [];
        this.heatSinksType = "Single"; // Default to Single Heat Sinks
        this.heatSinks = 0;
        this.engine = "";
        this.structure = "";
        this.myomer = "";
        this.walkMP = 0;
        this.jumpMP = 0;
        this.weapons = {};
        this.overview = "";
        this.capabilities = "";
        this.deployment = "";
        this.history = "";
        this.manufacturer = [];
        this.primaryfactory = [];
        this.hasCASE = false;
        this.hasECM = false;

        // Call configureMek after parent initialization completes
        this.initializationPromise.then(() => this.configureMek());
    }

    /**
     * Gets all relevant variables for the Mek from the MTF file and returns them in an object
     * @returns record of all relevant Mek variables extracted from the MTF file, with default values if not found
     */
    private extractMekVariables(): Record<string, any> {
        const values: Record<string, any> = {
            config: "",
            mass: 0,
            heatSinksType: "Single",
            heatSinks: 0,
            engine: "",
            structure: 0,
            myomer: "",
            walkMP: 0,
            jumpMP: 0,
            quirks: [],
            weapons: {},
            overview: "",
            capabilities: "",
            deployment: "",
            history: "",
            manufacturer: [],
            primaryfactory: []
        };

        if (!this.mtfFileLines || this.mtfFileLines.length === 0) {
            console.warn("MTF file not loaded");
            return values;
        }

        let inWeaponsSection = false;
        let weaponCount = 0;
        let weaponsCollected = 0;

        for (let i = 0; i < this.mtfFileLines.length; i++) {
            const line = this.mtfFileLines[i];
            const lowerLine = line.toLowerCase().trim();

            // Check for weapons section start (e.g., "Weapons:7")
            if (lowerLine.startsWith("weapons:")) {
                inWeaponsSection = true;
                // Extract the weapon count if present
                const colonIndex = line.indexOf(':');
                const countStr = line.substring(colonIndex + 1).trim();
                weaponCount = parseInt(countStr) || 0;
                weaponsCollected = 0;
                continue;
            }

            // If we're in weapons section, collect weapons until we reach the count or a location header
            if (inWeaponsSection) {
                // Check if we hit a location header (ends with colon and is a known location)
                if (lowerLine.endsWith(":") && this.isLocationHeader(lowerLine)) {
                    inWeaponsSection = false;
                } else if (weaponsCollected < weaponCount && lowerLine !== "") {
                    // Parse weapon entry: "WeaponName, Location"
                    const weaponParts = line.trim().split(',').map(p => p.trim());
                    if (weaponParts.length >= 2) {
                        values.weapons[weaponsCollected.toString()] = {
                            weapon: weaponParts[0],
                            location: weaponParts[1]
                        };
                    } else if (weaponParts.length === 1) {
                        // Single value, might be just weapon name
                        values.weapons[weaponsCollected.toString()] = {
                            weapon: weaponParts[0],
                            location: ""
                        };
                    }
                    weaponsCollected++;
                    continue;
                } else if (lowerLine === "") {
                    // Empty line, could be end of weapons section
                    continue;
                }
            }

            // Handle quirks (lines starting with "quirk:")
            if (lowerLine.startsWith("quirk:")) {
                const colonIndex = line.indexOf(':');
                const quirkValue = line.substring(colonIndex + 1).trim();
                if (quirkValue) {
                    values.quirks.push(quirkValue);
                }
                continue;
            }

            // Parse standard key: value lines
            const colonIndex = line.indexOf(':');
            if (colonIndex !== -1) {
                const key = line.substring(0, colonIndex).trim().toLowerCase();
                const value = line.substring(colonIndex + 1).trim();
                this.assignValue(values, key, value);
            }
        }

        return values;
    }

    private isLocationHeader(lowerLine: string): boolean {
        const locationHeaders = [
            "head:",
            "center torso:",
            "left torso:",
            "right torso:",
            "left arm:",
            "right arm:",
            "left leg:",
            "right leg:"
        ];
        return locationHeaders.includes(lowerLine);
    }

    private assignValue(values: Record<string, any>, key: string, value: string): void {
        switch (key) {
            case "config":
                values.config = value;
                break;
            case "mass":
                values.mass = parseInt(value);
                break;
            case "heat sinks type":
                values.heatSinksType = value;
                break;
            case "heat sinks":
                values.heatSinks = parseInt(value);
                break;
            case "engine":
                values.engine = value;
                break;
            case "structure":
                values.structure = value;
                break;
            case "myomer":
                values.myomer = value;
                break;
            case "walk mp":
                values.walkMP = parseInt(value);
                break;
            case "jump mp":
                values.jumpMP = parseInt(value);
                break;
            case "overview":
                values.overview = value;
                break;
            case "capabilities":
                values.capabilities = value;
                break;
            case "deployment":
                values.deployment = value;
                break;
            case "history":
                values.history = value;
                break;
            case "manufacturer":
                values.manufacturer = [value];
                break;
            case "primaryfactory":
                values.primaryfactory = [value];
                break;
        }
    }

    /**
     * Configures the Mek by extracting all relevant variables from the MTF file and initializing the locations with armor, structure, and slots
     * Done after parent initialization to ensure MTF file is loaded and model/mass are set for structure initialization
     */
    async configureMek(): Promise<void> {
        const mekVars = this.extractMekVariables();
        
        this.config = mekVars.config;
        this.mass = mekVars.mass;
        this.quirks = mekVars.quirks;
        this.heatSinksType = mekVars.heatSinksType;
        this.heatSinks = mekVars.heatSinks;
        this.engine = mekVars.engine;
        this.structure = mekVars.structure;
        this.myomer = mekVars.myomer;
        this.walkMP = mekVars.walkMP;
        this.jumpMP = mekVars.jumpMP;
        this.overview = mekVars.overview;
        this.capabilities = mekVars.capabilities;
        this.deployment = mekVars.deployment;
        this.history = mekVars.history;
        this.manufacturer = mekVars.manufacturer;
        this.primaryfactory = mekVars.primaryfactory;
        this.weapons = mekVars.weapons;

        if (this.searchMTF("CASE") !== "") {
            this.hasCASE = true;
        }

        if (this.searchMTF("ECM") !== "") {
            this.hasECM = true;
        }

        // Initialize all locations of the Mek  //TODO: Bipedal vs quad - need to change arms -> legs etc
        this.locations = {
            head: {
                armor: { current: parseInt(this.searchMTF("HD armor")), max: parseInt(this.searchMTF("HD armor")) },
                structure: { current: 3, max: 3 },      // Mek heads have a fixed structure of 3
                slots: this.setSlots(locationFullName.head),
            },
            centerTorso: {
                armor: { current: parseInt(this.searchMTF("CT armor")), max: parseInt(this.searchMTF("CT armor")) },
                rearArmor: { current: parseInt(this.searchMTF("RTC armor")), max: parseInt(this.searchMTF("RTC armor")) },
                structure: { current: BATTLEMECH_INTERNAL_STRUCTURE[this.mass].ct, max: BATTLEMECH_INTERNAL_STRUCTURE[this.mass].ct },
                slots: this.setSlots(locationFullName.centerTorso),
            },
            leftTorso: {
                armor: { current: parseInt(this.searchMTF("LT armor")), max: parseInt(this.searchMTF("LT armor")) },
                rearArmor: { current: parseInt(this.searchMTF("RTL armor")), max: parseInt(this.searchMTF("RTL armor")) },
                structure: { current: BATTLEMECH_INTERNAL_STRUCTURE[this.mass].sideTorso, max: BATTLEMECH_INTERNAL_STRUCTURE[this.mass].sideTorso },
                slots: this.setSlots(locationFullName.leftTorso),
            },
            rightTorso: {
                armor: { current: parseInt(this.searchMTF("RT armor")), max: parseInt(this.searchMTF("RT armor")) },
                rearArmor: { current: parseInt(this.searchMTF("RTR armor")), max: parseInt(this.searchMTF("RTR armor")) },
                structure: { current: BATTLEMECH_INTERNAL_STRUCTURE[this.mass].sideTorso, max: BATTLEMECH_INTERNAL_STRUCTURE[this.mass].sideTorso },
                slots: this.setSlots(locationFullName.rightTorso),
            },
            leftArm: {
                armor: { current: parseInt(this.searchMTF("LA armor")), max: parseInt(this.searchMTF("LA armor")) },
                structure: { current: BATTLEMECH_INTERNAL_STRUCTURE[this.mass].arm, max: BATTLEMECH_INTERNAL_STRUCTURE[this.mass].arm },
                slots: this.setSlots(locationFullName.leftArm),
            },
            rightArm: {
                armor: { current: parseInt(this.searchMTF("RA armor")), max: parseInt(this.searchMTF("RA armor")) },
                structure: { current: BATTLEMECH_INTERNAL_STRUCTURE[this.mass].arm, max: BATTLEMECH_INTERNAL_STRUCTURE[this.mass].arm },
                slots: this.setSlots(locationFullName.rightArm),
            },
            leftLeg: {
                armor: { current: parseInt(this.searchMTF("LL armor")), max: parseInt(this.searchMTF("LL armor")) },
                structure: { current: BATTLEMECH_INTERNAL_STRUCTURE[this.mass].leg, max: BATTLEMECH_INTERNAL_STRUCTURE[this.mass].leg },
                slots: this.setSlots(locationFullName.leftLeg),
            },
            rightLeg: {
                armor: { current: parseInt(this.searchMTF("RL armor")), max: parseInt(this.searchMTF("RL armor")) },
                structure: { current: BATTLEMECH_INTERNAL_STRUCTURE[this.mass].leg, max: BATTLEMECH_INTERNAL_STRUCTURE[this.mass].leg },
                slots: this.setSlots(locationFullName.rightLeg),
            }
        }

        // Link weapons to actual weapon objects from the database
        this.linkWeapons();
    }

    /**
     * Links weapon objects from the WEAPONS database based on weapon names and locations found in MTF
     * Searches the slots in each location to find the weapon ID (like CLLRM10) and retrieves full weapon data
     * Handles rear-facing weapons marked with (R) and multiple instances of the same weapon
     */
    private linkWeapons(): void {
        const linkedWeapons: Record<string, any> = {};
        const slotUsageMap: Record<string, number> = {}; // Track which slots have been used per location

        for (const weaponKey in this.weapons) {
            const weaponEntry = this.weapons[weaponKey];
            const weaponName = weaponEntry.weapon;
            const locationName = weaponEntry.location;

            if (!locationName) {
                console.warn(`Weapon "${weaponName}" has no location specified`);
                linkedWeapons[weaponKey] = { ...weaponEntry, weaponId: null, data: null };
                continue;
            }

            // Normalize location name to match locationFullName enum values
            const normalizedLocation = this.normalizeLocationName(locationName);
            
            if (!normalizedLocation || !this.locations[normalizedLocation]) {
                console.warn(`Location "${locationName}" not found for weapon "${weaponName}". Normalized: ${normalizedLocation}`);
                linkedWeapons[weaponKey] = { ...weaponEntry, weaponId: null, data: null };
                continue;
            }

            const slots = this.locations[normalizedLocation].slots;
            const slotKey = normalizedLocation;
            if (!slotUsageMap[slotKey]) {
                slotUsageMap[slotKey] = 0;
            }


            // Search for weapon entries in the slots that match the weapon name
            // Start from the last used index in this location to handle multiple instances
            let foundWeaponId: string | null = null;
            let foundSlotContent: string | null = null;
            let weaponData: any = null;
            let instanceCount = 0;
            
            for (let i = 0; i < slots.length; i++) {
                const slot = slots[i];
                if (!slot || slot === "-Empty-") continue;
                
                // Check if the slot entry matches or contains the weapon name
                if (slot.toLowerCase().includes(weaponName.toLowerCase())) {
                    if (instanceCount === slotUsageMap[slotKey]) {
                        // This is the next instance we need
                        foundSlotContent = slot;
                        
                        // Try to extract a weapon ID first (for Clan weapons like CLLRM10)
                        foundWeaponId = this.extractWeaponId(slot);
                        
                        if (foundWeaponId) {
                            // We have an ID - look it up in the database
                            if (WEAPONS[foundWeaponId]) {
                                weaponData = WEAPONS[foundWeaponId];
                            } else {
                                // ID didn't exist, fall back to name search
                                const result = this.findWeaponByName(weaponName);
                                if (result) {
                                    foundWeaponId = result.id;
                                    weaponData = result.weapon;
                                }
                            }
                        } else {
                            // No ID extracted, search by weapon name directly
                            const result = this.findWeaponByName(weaponName);
                            if (result) {
                                foundWeaponId = result.id;
                                weaponData = result.weapon;
                            }
                        }
                        
                        slotUsageMap[slotKey]++;
                        break;
                    }
                    instanceCount++;
                }
            }

            // If not found by name match, search for any weapon in the location
            if (!foundWeaponId && !weaponData) {
                instanceCount = 0;
                for (let i = 0; i < slots.length; i++) {
                    const slot = slots[i];
                    if (!slot || slot === "-Empty-") continue;
                    // Skip heat sinks, armor, structure, etc.
                    if (this.isWeaponSlot(slot)) {
                        if (instanceCount === slotUsageMap[slotKey]) {
                            foundSlotContent = slot;
                            const extractedId = this.extractWeaponId(slot);
                            if (extractedId && WEAPONS[extractedId]) {
                                foundWeaponId = extractedId;
                                weaponData = WEAPONS[extractedId];
                            } else {
                                const result = this.findWeaponByName(slot);
                                if (result) {
                                    foundWeaponId = result.id;
                                    weaponData = result.weapon;
                                }
                            }
                            slotUsageMap[slotKey]++;
                            break;
                        }
                        instanceCount++;
                    }
                }
            }

            // Check if this is a rear-facing weapon
            const isRearFacing = foundSlotContent ? foundSlotContent.includes('(R)') : false;

            linkedWeapons[weaponKey] = {
                ...weaponEntry,
                weaponId: foundWeaponId,
                isRearFacing: isRearFacing,
                data: weaponData
            };
        }

        this.weapons = linkedWeapons;
    }

    /**
     * Finds a weapon in the WEAPONS database by name
     * Checks exact name match, then altNames
     * @param weaponName Name of the weapon from MTF (e.g., "Medium Laser")
     * @returns Object with id and weapon definition, or null if not found
     */
    private findWeaponByName(weaponName: string): { id: string; weapon: any } | null {
        const normalizedSearch = weaponName.toLowerCase().trim();

        // Search through all weapons
        for (const weaponKey in WEAPONS) {
            const weapon = WEAPONS[weaponKey];
            
            // Check exact name match
            if (weapon.name.toLowerCase() === normalizedSearch) {
                return { id: weaponKey, weapon };
            }

            // Check altNames if they exist
            if (weapon.altNames) {
                for (const altName of weapon.altNames) {
                    if (altName.toLowerCase() === normalizedSearch) {
                        return { id: weaponKey, weapon };
                    }
                }
            }
        }

        return null;
    }

    /**
     * Normalizes location names from MTF format to internal enum format
     * @param location Location name from MTF (e.g., "Left Arm", "Left Torso")
     * @returns Normalized location key or null if not found
     */
    private normalizeLocationName(location: string): string | null {
        const normalized = location.toLowerCase().replace(/\s+/g, ' ');
        
        const locationMap: Record<string, string> = {
            'head': 'head',
            'center torso': 'centerTorso',
            'ct': 'centerTorso',
            'left torso': 'leftTorso',
            'lt': 'leftTorso',
            'right torso': 'rightTorso',
            'rt': 'rightTorso',
            'left arm': 'leftArm',
            'la': 'leftArm',
            'right arm': 'rightArm',
            'ra': 'rightArm',
            'left leg': 'leftLeg',
            'll': 'leftLeg',
            'right leg': 'rightLeg',
            'rl': 'rightLeg'
        };

        return locationMap[normalized] || null;
    }

    /**
     * Extracts a weapon ID from a slot entry
     * Handles entries like "CLLRM10" or "Medium Laser (R)"
     */
    private extractWeaponId(slot: string): string | null {
        // Remove parenthetical notes like "(R)" for rear weapons
        const cleaned = slot.split('(')[0].trim();
        
        // If it looks like a weapon ID (alphanumeric, no spaces), use it as-is
        if (/^[A-Z0-9]+$/.test(cleaned)) {
            return cleaned;
        }
        
        // Otherwise, try to construct a weapon ID from the name
        // This is a fallback for weapons that don't have a clear ID format
        return null;
    }

    /**
     * Determines if a slot entry is likely a weapon (not ammo, heat sink, or equipment)
     */
    private isWeaponSlot(slot: string): boolean {
        const lowerSlot = slot.toLowerCase();
        
        // Exclude common non-weapon items
        const exclusions = [
            'heat sink', 'fusion engine', 'gyro', 'actuator', 'armor',
            'ammo', 'life support', 'sensors', 'cockpit', 'shoulder', 
            'hip', 'foot', 'hand', 'ecm', 'void signature', 'jump',
            'empty'
        ];
        
        return !exclusions.some(exclusion => lowerSlot.includes(exclusion));
    }

    getSlots(location: string): string[] {
        return this.locations[location].slots;
    }

    /**
     * Sets the location's slots based on the MTF file for the mek
     * @param location string
     * @returns string[] Array of 12 slots for the given location, or an empty array if the location is not found or MTF file is not loaded
     */
    setSlots(location: string): string[] {
        if (!this.mtfFileLines || this.mtfFileLines.length === 0) {
            console.warn("MTF file not loaded");
            return [];
        }

        // Find the location line (e.g., "Left Arm:", "Right Arm:", etc.)
        let locationIndex = -1;
        const locationWithColon = `${location}:`;
        for (let i = 0; i < this.mtfFileLines.length; i++) {
            if (this.mtfFileLines[i].trim().toLowerCase() === locationWithColon.toLowerCase()) {
                locationIndex = i;
                break;
            }
        }

        if (locationIndex === -1) {
            console.warn(`Location "${location}" not found in MTF file`);
            return [];
        }

        // Extract the next 12 lines as slots
        const slots: string[] = [];
        for (let i = 1; i <= 12; i++) {
            if (locationIndex + i < this.mtfFileLines.length) {
                slots.push(this.mtfFileLines[locationIndex + i].trim());
            } else {
                slots.push(""); // Add empty string if we run out of lines
            }
        }

        return slots;
    }

    /**
     * Gets the quirks for the mek from the MTF file
     * @returns array of quirks
     */
    setQuirks(): string[] {
        if (!this.mtfFileLines || this.mtfFileLines.length === 0) {
            console.warn("MTF file not loaded");
            return [];
        }

        for (let i = 0; i < this.mtfFileLines.length; i++) {
            if (this.mtfFileLines[i].trim().toLowerCase() === "quirks:") {
                this.quirks.push(...this.mtfFileLines.slice(i + 1).map(line => line.trim()).filter(line => line.length > 0));
                break;
            }
        }
        return this.quirks;
    }

    getModel(): string {
        return this.model;
    }

    setModel(model: string): void {
        this.model = model;
    }

    getConfig(): string {
        return this.config;
    }

    setConfig(config: string): void {
        this.config = config;
    }

    getMass(): number {
        return this.mass;
    }

    setMass(mass: number): void { 
        this.mass = mass;
    }

    /**
     * Gets the total armor of the Mek by summing armor of all locations
     * @returns int of armor total
     */
    private getArmorTotal(): number {
        let totalArmor = 0; 
        for (const locationKey in this.locations) {
            const location = this.locations[locationKey];
            if (location.armor) {
                totalArmor += location.armor.max;
            }
        }
        return totalArmor;
    }

    /**
     * Gets the total internal structure of the mek by summing structure of all locations
     * @returns int of internal structure total
     */
    private getInternalTotal(): number {
        let totalInternal = 0;
        for (const locationKey in this.locations) {
            const location = this.locations[locationKey];
            if (location.structure) {
                totalInternal += location.structure.max;
            }
        }
        return totalInternal;
    }

    //  #region BV Calculation
    private getDefensiveBV(): number {
        let defensiveBV = 0;
        let totalArmor = this.getArmorTotal();
        let totalInternal = this.getInternalTotal();

        let baseDefense = totalArmor * 2.5 + totalInternal * 1.5;

        if (this.hasCASE) baseDefense += 20;
        if (this.hasECM) baseDefense += 50;

        const movementMultiplier = this.getMovementMultiplier(this.walkMP, this.jumpMP ?? 0);

        return defensiveBV * movementMultiplier;
    }

    private getMovementMultiplier(walkMP: number, jumpMP: number): number {
        const effectiveMP = Math.max(walkMP, jumpMP);

        if (effectiveMP <= 2) return 0.8;
        if (effectiveMP <= 4) return 1.0;
        if (effectiveMP <= 6) return 1.2;
        if (effectiveMP <= 8) return 1.4;
        return 1.6;
    }

/*     private getOffensiveBV(): number {
        const weaponBV = mek.weapons.reduce((sum, weapon) => {
            return sum + calculateWeaponBV(weapon);
        }, 0);

        const totalWeaponHeat = mek.weapons.reduce((sum, weapon) => sum + weapon.heat, 0);
        const heatCapacity = mek.heatSinks;

        const heatEfficiencyMultiplier =
            totalWeaponHeat <= heatCapacity
            ? 1
            : Math.max(0.65, heatCapacity / totalWeaponHeat);

        return weaponBV * heatEfficiencyMultiplier;
    }

    private calculateWeaponBV(weapon: Weapon): number {
        const rangeFactor = this.getRangeFactor(weapon);
        const ammoFactor = weapon.ammoLimited ? 0.9 : 1;

        return weapon.damage * rangeFactor * ammoFactor * 10;
    }

    private getRangeFactor(weapon: Weapon): number {
        if (weapon.longRange >= 18) return 1.4;
        if (weapon.longRange >= 12) return 1.2;
        if (weapon.longRange >= 6) return 1.0;
        return 0.8;
    } */

    //  #endregion BV Calculation
}