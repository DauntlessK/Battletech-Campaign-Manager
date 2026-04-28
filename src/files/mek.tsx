import { BATTLEMECH_INTERNAL_STRUCTURE } from '../constants/enums';
import { locationFullName } from '../constants/enums';  
import { unitType, side } from '../constants/enums';
import { Unit } from './Unit';

export class Mek extends Unit{
    
    public model: string;
    public config: string;             //Biped or Quad, etc.
    public mass: number;
    public chassis: string;
    public locations: Record<string, any>;

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
        
        // Call configureMek after parent initialization completes
        this.initializationPromise.then(() => this.configureMek());
    }

    async configureMek(): Promise<void> {
        this.config = this.searchMTF("config");
        this.mass = parseInt(this.searchMTF("mass"));
        
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
}