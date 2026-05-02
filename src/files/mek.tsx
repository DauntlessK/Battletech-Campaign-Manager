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
    public gyro: string;
    public armorType: string;           //Standard, Ferro-Fibrous, etc. - affects BV calculation but not actual armor values
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
    public bv: number;

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
        this.gyro = "Standard"; // Default to Standard Gyro
        this.armorType = "Standard"; // Default to Standard Armor
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
        this.bv = 0;

        // Call configureMek after parent initialization completes
        this.initializationPromise.then(() => this.configureMek());
    }

    // #region MTF Parsing and Mek Configuration
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

    /**
     * 
     * @param lowerLine 
     * @returns 
     */
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

    /**
     * Assigns a value to a key in the values object
     * @param values 
     * @param key 
     * @param value 
     */
    private assignValue(values: Record<string, any>, key: string, value: string): void {
        switch (key) {
            case "config":
                values.config = value;
                break;
            case "mass":
                values.mass = parseInt(value);
                break;
            case "tech base":
                values.tech_base = value;
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
            case "gyro":
                values.gyro = value;
                break;
            case "structure":
                values.structure = value;
                break;
            case "armor":
                values.armorType = value;
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
                hasCase: this.locationHasCASE(this.locations.head.slots)
            },
            centerTorso: {
                armor: { current: parseInt(this.searchMTF("CT armor")), max: parseInt(this.searchMTF("CT armor")) },
                rearArmor: { current: parseInt(this.searchMTF("RTC armor")), max: parseInt(this.searchMTF("RTC armor")) },
                structure: { current: BATTLEMECH_INTERNAL_STRUCTURE[this.mass].ct, max: BATTLEMECH_INTERNAL_STRUCTURE[this.mass].ct },
                slots: this.setSlots(locationFullName.centerTorso),
                hasCase: this.locationHasCASE(this.locations.centerTorso.slots)
            },
            leftTorso: {
                armor: { current: parseInt(this.searchMTF("LT armor")), max: parseInt(this.searchMTF("LT armor")) },
                rearArmor: { current: parseInt(this.searchMTF("RTL armor")), max: parseInt(this.searchMTF("RTL armor")) },
                structure: { current: BATTLEMECH_INTERNAL_STRUCTURE[this.mass].sideTorso, max: BATTLEMECH_INTERNAL_STRUCTURE[this.mass].sideTorso },
                slots: this.setSlots(locationFullName.leftTorso),
                hasCase: this.locationHasCASE(this.locations.leftTorso.slots)
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
                hasCase: this.locationHasCASE(this.locations.leftArm.slots)
            },
            rightArm: {
                armor: { current: parseInt(this.searchMTF("RA armor")), max: parseInt(this.searchMTF("RA armor")) },
                structure: { current: BATTLEMECH_INTERNAL_STRUCTURE[this.mass].arm, max: BATTLEMECH_INTERNAL_STRUCTURE[this.mass].arm },
                slots: this.setSlots(locationFullName.rightArm),
                hasCase: this.locationHasCASE(this.locations.rightArm.slots)
            },
            leftLeg: {
                armor: { current: parseInt(this.searchMTF("LL armor")), max: parseInt(this.searchMTF("LL armor")) },
                structure: { current: BATTLEMECH_INTERNAL_STRUCTURE[this.mass].leg, max: BATTLEMECH_INTERNAL_STRUCTURE[this.mass].leg },
                slots: this.setSlots(locationFullName.leftLeg),
                hasCase: this.locationHasCASE(this.locations.leftLeg.slots)
            },
            rightLeg: {
                armor: { current: parseInt(this.searchMTF("RL armor")), max: parseInt(this.searchMTF("RL armor")) },
                structure: { current: BATTLEMECH_INTERNAL_STRUCTURE[this.mass].leg, max: BATTLEMECH_INTERNAL_STRUCTURE[this.mass].leg },
                slots: this.setSlots(locationFullName.rightLeg),
                hasCase: this.locationHasCASE(this.locations.rightLeg.slots)
            }
        }

        // Link weapons to actual weapon objects from the database
        this.linkWeapons();

        // After all variables are set, calculate BV
        this.bv = this.setTotalBV();
    }

    // #endregion MTF Parsing and Mek Configuration

    //  #region Weapon / slots Import
    
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

    // #endregion Weapon / slots Import

    //  #region getters and setters ---------------------------------------------------------------------------

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
     * Determines if this location has CASE by checking if any of the slots contain "CASE"
     * @param location 
     * @returns true if a slot from the array has CASE
     */
    locationHasCASE(location: string[]): boolean {
        if (!this.mtfFileLines || this.mtfFileLines.length === 0) {
            console.warn("MTF file not loaded");
            return false;
        }
        for (const slot of location) {
            if (slot.toLowerCase().includes("case")) {
                return true;
            }
        }
        return false;
    }

    locationHasExplosiveAmmo(location: string[]): boolean {
        if (!this.mtfFileLines || this.mtfFileLines.length === 0) {
            console.warn("MTF file not loaded");
            return false;
        }
        for (const slot of location) {
            if (slot.toLowerCase().includes("ammo")) {
                return true;
            }
        }
        return false;
    }

    /**
     * Gets the ammo slot count for a specific location
     * @param location array of slots for a location
     * @param isCountingExplosive true if only counting explosive ammo slots - Does not count MG, flamer
     * @returns int
     */
    getAmmoSlotCountInLocation(location: string, isCountingExplosive: boolean): number {
        let ammoSlotCount = 0;
        for (const slot of location) {
            if (slot.toLowerCase().includes("ammo")) {
                if (!isCountingExplosive) {
                    ammoSlotCount++;
                    continue;
                }
                else if (!slot.toLowerCase().includes("mg") || !slot.toLowerCase().includes("flamer")) {
                    ammoSlotCount++;
                }
            }
        }
        return ammoSlotCount;
    }

    /**
     * Gets the meks' total ammo slot count through all locations by counting the number of slots that contain "ammo"
     * @param isCountingExplosive true if only counting explosive ammo slots - Does not count MG, flamer
     * @returns int
     */
    getTotalAmmoSlotCount(isCountingExplosive: boolean): number {
        let ammoSlotCount = 0;
        for (const locationKey in this.locations) {
            const location = this.locations[locationKey];
            for (const slot of location.slots) {

                if (slot.toLowerCase().includes("ammo")) {
                    if (!isCountingExplosive) {
                        ammoSlotCount++;
                        continue;
                    }
                    else if (!slot.toLowerCase().includes("mg") || !slot.toLowerCase().includes("flamer")) {
                        ammoSlotCount++;
                    }
                }
            }
        }
        return ammoSlotCount;
    }

    /**
     * Gets the total count of unprotected Gauss weapons in a specific location
     * @param location 
     * @returns int
     */
    getTotalUnprotectedGaussCountInLocation(location: string[]): number {
        let gaussCount = 0;
        for (const slot of location) {
            if (slot.toLowerCase().includes("gauss")) {
                    gaussCount++;
                }
                if (slot.toLowerCase().includes("case")) {
                    return 0;
                }
        }
        return gaussCount;
    }

    getTotalGaussCountInLocation(location: string[]): number {
        let gaussCount = 0;
        for (const slot of location) {
            if (slot.toLowerCase().includes("gauss")) {
                gaussCount++;
            }
        }
        return gaussCount;
    }

    /**
     * Gets total number of slots (and thus tons) of ammo on the entire mek
     * @param ammoType 
     */
    getAmmoCount(ammoType : string): number {
        let tonsOfAmmo = 0;
        for (const location in this.locations) {
            //TODO: loop through locations and find slots that match the specific ammo type.
        }
        return tonsOfAmmo;
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
     * Total heat sink capability of a mek, based on the number of heat sinks and their type (single or double)
     * @returns int of heat sink total capability
     */
    getTotalHeatSink(): number {
        if (this.heatSinksType.toLowerCase() === "double") {
            return this.heatSinks * 2;
        }
        return this.heatSinks;
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

    getBV(): number {
        return this.bv;
    }

    private setTotalBV(): number {
        const offensiveBV = this.getOffensiveBV();
        const defensiveBV = this.getDefensiveBV();
        return offensiveBV + defensiveBV;
    }

    // #endregion getters and setters ---------------------------------------------------------------------------

    //  #region BV Calculation

    /**
     * 
     * @returns long of defensive BV value
     */
    private getDefensiveBV(): number {
        let defensiveBV = 0;

        // get armor type modifier
        let armorTypeModifier = 1.0;
        if (this.armorType.toLowerCase().includes("commercial")) {
            armorTypeModifier = 0.5;
        }

        //Get internal structure modifier
        let structureModifier = 1.0;
        if (this.structure.toLowerCase().includes("industrial")) {
            structureModifier = .5;
        }

        let engineModifier = 1.0;
        if (this.engine.toLowerCase().includes("light")) {
            engineModifier = 0.75;
        }
        else if (this.engine.toLowerCase().includes("xl") && this.tech_base === "Inner Sphere") { 
            // inner sphere XL
            engineModifier = 0.5;
        }
        else if (this.engine.toLowerCase().includes("xl") && this.tech_base === "Clan") {
            engineModifier = 0.75;
        }

        let gyroModifier = 0.5;
        if (this.gyro.toLowerCase().includes("heavy duty")) {
            gyroModifier = 1.0;
        }

        let totalArmor = this.getArmorTotal();
        let totalInternal = this.getInternalTotal();

        let baseDefense = (totalArmor * 2.5) + (totalInternal * 1.5 * structureModifier * engineModifier) + (this.mass * gyroModifier);

        //DEFENSIVE Battle rating for equipment  -- TODO: Possibly? No anti-personnel pod or armor checks
        let defensiveEquipmentBV = 0;
        if (this.searchMTF("GuardianECM") !== "") {
            defensiveEquipmentBV += 61;
        }
        if (this.searchMTF("Anti-Missile System") !== "") {
            defensiveEquipmentBV += 32;
            //If AMS is present, add BV for each ton of ammo found:
            defensiveEquipmentBV += 11 * this.countInstancesInMTF("ams ammo");
        }
        if (this.searchMTF("Beagle") !== "") {
            defensiveEquipmentBV += 10;
        }

        //TODO: MG ammo, Flamer ammo, coolant pods / coolant ammo are not explosive in terms of BV subtractive penalty
        //Subtractive figures for non-case explosive ammo
        let explosiveAmmoSubtraction = 0;
        // Handle IS first
        if (this.tech_base === "Inner Sphere") {
            //XL engines w/ ammo (in any location)
            if (this.engine.toLowerCase().includes("xl")) {
                explosiveAmmoSubtraction += 15 * this.getTotalAmmoSlotCount(true);
            }
            //Standard or light engines
            if (this.engine.toLowerCase().includes("light") || this.engine.toLowerCase().includes("standard")) {
                for (const locationKey in this.locations) {
                    const location = this.locations[locationKey];
                    const hasCASE = location.hasCase;
                    if (hasCASE || ((location == this.locations.leftArm && this.locations.leftTorso.hasCase) || (location == this.locations.rightArm && this.locations.rightTorso.hasCase))) {
                        continue; // skip locations protected by CASE or arms protected by torso CASE
                    }
                    else {
                        explosiveAmmoSubtraction += 15 * this.getAmmoSlotCountInLocation(location.slots, true);
                        explosiveAmmoSubtraction += this.getTotalUnprotectedGaussCountInLocation(location.slots);
                    }
                }
            }
            //XL engines
            if (this.engine.toLowerCase().includes("xl")) {
                for (const locationKey in this.locations) {
                    const location = this.locations[locationKey];
                    explosiveAmmoSubtraction += 15 * this.getAmmoSlotCountInLocation(location.slots, true);
                    explosiveAmmoSubtraction += this.getTotalUnprotectedGaussCountInLocation(location.slots);
                }
            }
        }
        else { // Clan and other tech base
            for (const locationKey in this.locations) {
                const location = this.locations[locationKey];
                const hasCASE = location.hasCase;
                if (location == this.locations.centerTorso || location == this.locations.leftLeg || location == this.locations.rightLeg || location == this.locations.head) {
                    explosiveAmmoSubtraction += 15 * this.getAmmoSlotCountInLocation(location.slots, true);
                }
                explosiveAmmoSubtraction += this.getTotalGaussCountInLocation(location.slots);
            }
        }

        defensiveBV = (baseDefense - explosiveAmmoSubtraction) * this.getMovementMultiplier(this.walkMP, this.jumpMP ?? 0);

        return defensiveBV;
    }

    /**
     * gets the multiplier based on the MAX TMM a unit can achieve - from 1.0 and up
     * @param walkMP 
     * @param jumpMP 
     * @returns value
     */
    private getMovementMultiplier(walkMP: number, jumpMP: number): number {
        const effectiveMP = Math.max(walkMP, jumpMP + 1);

        if (effectiveMP <= 2) return 1.0;       // Max TMM is  0
        if (effectiveMP <= 4) return 1.1;       // Max TMM is +1
        if (effectiveMP <= 6) return 1.2;       // Max TMM is +2
        if (effectiveMP <= 9) return 1.3;       // Max TMM is +3
        if (effectiveMP <= 17) return 1.4;      // Max TMM is +4
        if (effectiveMP <= 24) return 1.5;      // Max TMM is +5
        return 1.6;
    }

    private getOffensiveBV(): number {

        type WeaponBVEntry = {
            name: string;
            bv: number;
            heat: number;
        };

        const weaponEntries: WeaponBVEntry[] = [];
        let ammoBV = 0;

        for (const weaponKey in this.weapons) {
            const weaponEntry = this.weapons[weaponKey];

            //add ammoBV of weapon
            ammoBV += weaponEntry.ammo.ammoBV * this.get;

            // Adjust these field names to match your structure
            const weapon = weaponEntry.definition ?? weaponEntry;

            const quantity = weaponEntry.quantity ?? weaponEntry.count ?? 1;

            for (let i = 0; i < quantity; i++) {
                weaponEntries.push({
                    name: weapon.name,
                    bv: weapon.bv,
                    heat: weapon.heat ?? 0,
                });
            }
        }

    // BV2 applies heat adjustment starting with the most valuable weapons.
    weaponEntries.sort((a, b) => b.bv - a.bv);

    const heatSinkCapacity = this.getTotalHeatSink();

    // For walking/running 'Mechs, movement heat is usually 0.
    // For jumping 'Mechs, use jump heat.
    const movementHeat = Math.max(2, this.jumpMP);

    const heatEfficiency = 6 + heatSinkCapacity - movementHeat;

    let runningHeat = 0;
    let baseWeaponBV = 0;
    let heatLimitReached = false;

    for (const weapon of weaponEntries) {
        if (!heatLimitReached) {
            runningHeat += weapon.heat;
            baseWeaponBV += weapon.bv;

            // Important: the weapon that reaches/exceeds heat efficiency
            // still counts at full BV.
            if (runningHeat >= heatEfficiency) {
                heatLimitReached = true;
            }
        } else {
            baseWeaponBV += weapon.bv * 0.5;
        }
    }

    // Ammo BV, offensive equipment, targeting computer, Artemis, etc.
    const offensiveEquipmentBV = this.getOffensiveEquipmentBV?.() ?? 0;

    const baseOffensiveBV =
        baseWeaponBV +
        ammoBV +
        offensiveEquipmentBV;

    // Speed factor is part of actual Offensive BV.
    const speedFactor = this.getSpeedFactor?.() ?? 1;

    return Math.round(baseOffensiveBV * speedFactor);
}

    //  #endregion BV Calculation
}