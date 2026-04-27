import { unitType } from '../constants/enums';

export abstract class Unit {

    public mul_id: number;              //id within the MTF database, used for matching units to MTF files
    public id: number;                  //id within the campaign database
    public year: number;                 //Year the unit was introduced
    public role: String;
    public source: String;               //Sourcebook the unit is from     
    public rules_level: number;          //Rules level of the unit
    public tech_base: String;            //Tech base of the unit
    public mtfFile: String;              //Full MTF file content
    public mtfFileLines: String[];       //MTF file split into lines for easy searching
    public chassis: String;
    public ut: unitType;                 //unit type (Battlearmor, Mek, Infantry, Vehicle)
    public owner: number;                //id of player that owns the unit
    public force: number;                //id of force the unit belongs to

    constructor(ut: unitType,                   //unit type (Battlearmor, Mek, Infantry, Vehicle)
                owner: number,                  //id of player that owns the unit
                force: number                   //id of force the unit belongs to
                ) {
        this.ut = ut;
        this.owner = owner;
        this.force = force;
        this.mul_id = 0;
        this.id = 0;
        this.year = 0;
        this.role = "";
        this.source = "";
        this.rules_level = 0;
        this.tech_base = "";
        this.mtfFile = "";
        this.mtfFileLines = [];
        this.chassis = "";
    }

    getSourceLoc(): String {
        const matches = this.source.match(/\d{4}/g);
        
        // If we found a 4-digit number, use it as the subfolder name
        if (matches && matches.length > 0) {
            return matches[0];
        }
        
        // Otherwise, return the source name itself as the subfolder
        console.log(`No year found in source: ${this.source}. Using source name as subfolder.`);

        return this.source;
    }

    private getUnitTypeFolder(): String {
        switch (this.ut) {
            case unitType.Battlearmor:
                return "battlearmor";
            case unitType.Mek:
                return "meks";
            case unitType.Infantry:
                return "infantry";
            case unitType.Vehicle:
                return "vehicles";
            default:
                throw new Error(`Unknown unit type: ${this.ut}`);
        }
    }

    async getMTF(): Promise<String> {
        try {
            const unitTypeFolder = this.getUnitTypeFolder();
            const sourceFolder = this.getSourceLoc();
            
            // Construct the path: Units/[unitType]/[source]/[filename].blk
            const filePath = `/Units/${unitTypeFolder}/${sourceFolder}/${this.chassis}.blk`;
            
            const response = await fetch(filePath);
            if (!response.ok) {
                throw new Error(`Failed to load MTF file: ${filePath} (${response.status})`);
            }
            
            this.mtfFile = await response.text();
            this.mtfFileLines = this.mtfFile.split('\n');
            return this.mtfFile;
        } catch (error) {
            console.error(`Error loading MTF file for ${this.chassis}:`, error);
            throw error;
        }
    }
    
    searchMTF(searchKey: String): String {
        if (!this.mtfFileLines || this.mtfFileLines.length === 0) {
            console.warn("MTF file not loaded");
            return "";
        }

        for (const line of this.mtfFileLines) {
            // Case-insensitive search for the key
            if (line.toLowerCase().includes(searchKey.toLowerCase())) {
                // Extract the value after the colon
                const colonIndex = line.indexOf(':');
                if (colonIndex !== -1) {
                    const value = line.substring(colonIndex + 1).trim();
                    return value;
                }
            }
        }

        console.warn(`Key "${searchKey}" not found in MTF file`);
        return "";
    }

    // id
    getId(): number {
        return this.id;
    }

    setId(id: number): void {
        this.id = id;
    }

    // mul_id
    getMulId(): number {
        return this.mul_id;
    }

    setMulId(mul_id: number): void {
        this.mul_id = mul_id;
    }

    // ut (unitType)
    getUnitType(): unitType {
        return this.ut;
    }

    setUnitType(ut: unitType): void {
        this.ut = ut;
    }

    // year
    getYear(): number {
        return this.year;
    }

    setYear(year: number): void {
        this.year = year;
    }

    // role
    getRole(): String {
        return this.role;
    }

    setRole(role: String): void {
        this.role = role;
    }

    // source
    getSource(): String {
        return this.source;
    }

    setSource(source: String): void {
        this.source = source;
    }

    // rules_level
    getRulesLevel(): number {
        return this.rules_level;
    }

    setRulesLevel(rules_level: number): void {
        this.rules_level = rules_level;
    }

    // tech_base
    getTechBase(): String {
        return this.tech_base;
    }

    setTechBase(tech_base: String): void {
        this.tech_base = tech_base;
    }

    getOwner(): number {
        return this.owner;
    }

    setOwner(owner: number): void {
        this.owner = owner;
    }

    getForce(): number {
        return this.force;
    }

    setForce(force: number): void {
        this.force = force;
    }

    getChassis(): String {
        return this.chassis;
    }

    setChassis(chassis: String): void {
        this.chassis = chassis;
    }
}