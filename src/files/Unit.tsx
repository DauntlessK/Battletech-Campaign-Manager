import { parse } from 'uuid';
import { unitType } from '../constants/enums';

export abstract class Unit {

    public mul_id: number;              //id within the MTF database, used for matching units to MTF files
    public id: number;                  //id within the campaign database
    public year: number;                 //Year the unit was introduced
    public role: string;
    public source: string;               //Sourcebook the unit is from     
    public rules_level: number;          //Rules level of the unit
    public tech_base: string;            //Tech base of the unit
    public mtfFile: string;              //Full MTF file content
    public mtfFileLines: string[];       //MTF file split into lines for easy searching
    public chassis: string;
    public model: string;
    public ut: unitType;                 //unit type (Battlearmor, Mek, Infantry, Vehicle)
    public owner: number | null;                //id of player that owns the unit
    public force: number | null;                //id of force the unit belongs to
    public bv: number;
    protected initializationPromise: Promise<void>;  //Promise that resolves when unit initialization is complete

    constructor(ut: unitType,                   //unit type (Battlearmor, Mek, Infantry, Vehicle)
                owner: number | null,                  //id of player that owns the unit
                force: number | null,                  //id of force the unit belongs to
                chassis: string = "",                //chassis of the unit
                model: string = ""                   //model of the unit
                ) {
        this.ut = ut;
        this.owner = owner;
        this.force = force;
        this.chassis = chassis;
        this.model = model;
        this.mul_id = -1; 
        this.id = -1;                   //TODO: Generate unique ID for the unit
        this.year = -1;
        this.role = "";
        this.source = "";
        this.rules_level = -1
        this.tech_base = "";
        this.mtfFile = "";
        this.mtfFileLines = [];
        this.bv = 0;

        // Store the initialization promise so subclasses can wait for it
        this.initializationPromise = this.configureUnit();
    }

    async configureUnit(): Promise<void> {
        try {
            await this.getMTF();

            this.setMulId(parseInt(this.searchMTF("mul id")));
            this.setId(parseInt(this.searchMTF("id")));
            this.setYear(parseInt(this.searchMTF("era")));

            if (this.year === -1 || Number.isNaN(this.year)) {
                this.setYear(parseInt(this.searchMTF("year")));
            }

            this.setRole(this.searchMTF("role"));
            this.setSource(this.searchMTF("source"));
            this.setRulesLevel(parseInt(this.searchMTF("rules level")));
            this.setTechBase(this.searchMTF("techbase"));
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    private getUnitTypeFolder(): string {
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

    async getMTF(): Promise<string> {
        const unitTypeFolder = this.getUnitTypeFolder();
        const fileName = `${this.chassis} ${this.model}.mtf`;
        const encodedFileName = encodeURIComponent(fileName);
        const filePath = `/units/${unitTypeFolder}/${encodedFileName}`;

        const response = await fetch(filePath);

        this.mtfFile = await response.text();

        if (!response.ok || !this.isValidMTF(this.mtfFile)) {
            throw new Error(`MTF not found or invalid: ${filePath}`);
        }

        this.mtfFileLines = this.mtfFile.split("\n");

        return this.mtfFile;
    }

    private async findFileInSubfolders(folderPath: string, fileName: string): Promise<string | null> {
        // Define known subfolders for each unit type based on actual workspace structure
        const subfoldersByUnitType: { [key: string]: string[] } = {
            battlearmor: [
                "3058Uu", "3075", "3085u", "3145", "3150", "Golden Century", 
                "Jihad FR", "OTP", "ProtoTypes", "Rec Guides ilClan", "Shrapnel", 
                "ToS", "TRO VA", "XTRs"
            ],
            meks: [
                "3039u", "3050U", "3055U", "3058Uu", "3060u", "3067", "3067 Unabridged", 
                "3075", "3085u", "3145", "3150", "Arano Restoration", "Battlecorps", 
                "Dark Age", "Dominions Divided (April)", "Dossiers", "ER 2750", 
                "Era Digests", "Force Manuals", "Force Packs", "Golden Century", "Gothic", 
                "HBMPS", "Historicals", "Iron Wind Metals", "ISP", "ISP2", "ISP3", 
                "Jihad Final Reckoning", "Jihad Secrets", "LAMS", "Operation Klondike", 
                "ProtoTypes", "QuadVees", "Rec Guides ilClan", "RS Jihad", 
                "RS Succession Wars", "RS Unique", "Shattered Fortress", "Shrapnel", 
                "Spotlight On", "Starterbook Sword and Dragon", "Starterpack Sword and Dragon", 
                "ToS", "Total Chaos", "TRO Irregulars", "TRO SW", "TRO Vehicle Annex", 
                "Tukayyid", "Turning Points", "Urbanfest", "Videogame (Apocryphal)", 
                "Wolf and Blake", "WoR Supplemental", "WWEs", "XTRs"
            ],
            vehicles: [
                "2750 IS Land", "3025 IS Land", "3039u", "3050U", "3058Uu", "3060u", 
                "3067", "3067 Unabridged", "3075", "3075 Support tanks", "3085u", 
                "3145", "3150", "AToW Companion", "DarkAge", "Era Digests", "FM DC", 
                "Golden Century", "HB HD", "HB HK", "HB HL", "HB HM", "Hist LOT II", 
                "Hist Reunification War", "House Arano", "Operation Klondike", "ProtoTypes", 
                "Rec Guides ilClan", "Shrapnel", "Somerset Strikers", "TOS", 
                "TRO Irregulars", "TRO Vehicle Annex", "Turning Points", "Urbanfest", "XTRs"
            ],
            infantry: [
                "3085", "Beast Mounted", "Clan", "CS WOB", "DCMS", "Field Gunners", 
                "FWLM", "HBHD", "HBHM", "HBHS", "LCAF", "MHAF", "Mobs", 
                "Taurian Infantry", "TP Vega 3039", "TW"
            ]
        };

        try {
            // Get the unit type folder name to look up subfolders
            const unitTypeFolder = this.getUnitTypeFolder();
            const subfolders = subfoldersByUnitType[unitTypeFolder] || [];
            
            // URL-encode the filename to handle spaces and special characters
            const encodedFileName = encodeURIComponent(fileName);

            // Search through known subfolders systematically
            // Files are always in subfolders (era/source folders), not in the root
            for (const subfolder of subfolders) {
                const encodedSubfolder = encodeURIComponent(subfolder);
                const subfolderPath = `${folderPath}/${encodedSubfolder}/${encodedFileName}`;
                const response = await fetch(subfolderPath);
                if (response.ok) {
                    return subfolderPath;
                }
            }

            console.warn(`File not found in any subfolder: ${fileName}`);
            return null;
        } catch (error) {
            console.error(`Error searching for file: ${fileName}`, error);
            return null;
        }
    }

    private isValidMTF(text: string): boolean {
        const lower = text.toLowerCase();

        return (
            lower.includes("megamek") &&
            lower.includes("data")
        );
    }
    
    searchMTF(searchKey: string, warn: boolean = true): string {
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

        if (warn) { console.warn(`Key "${searchKey}" not found in MTF file`); }
        return "";
    }

    /**
     * Method uses searchMTF to find and count the number of instances in a file
     * @returns the count of instances found
     */
    countInstancesInMTF(searchKey: string): number {
        if (!this.mtfFileLines || this.mtfFileLines.length === 0) {
            console.warn("MTF file not loaded");
            return 0;
        }

        let count = 0;
        for (const line of this.mtfFileLines) {
            if (line.toLowerCase().includes(searchKey.toLowerCase())) {
                count++;
            }
        }
        return count;
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
    getRole(): string {
        return this.role;
    }

    setRole(role: string): void {
        this.role = role;
    }

    // source
    getSource(): string {
        return this.source;
    }

    setSource(source: string): void {
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
    getTechBase(): string {
        return this.tech_base;
    }

    setTechBase(tech_base: string): void {
        this.tech_base = tech_base;
    }

    // getOwner(): number {
    //     return this.owner;
    // }

    setOwner(owner: number): void {
        this.owner = owner;
    }

    // getForce(): number {
    //     return this.force || null;
    // }

    setForce(force: number): void {
        this.force = force;
    }

    getChassis(): string {
        return this.chassis;
    }

    setChassis(chassis: string): void {
        this.chassis = chassis;
    }
}