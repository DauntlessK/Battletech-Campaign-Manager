class Mek extends Unit{

    public model: String;
    public config: String;             //Biped or Quad, etc.
    public mass: number;

    constructor(ut: unitType,
                owner: number,
                force: number,
                chassis: String,
                model: String
                ) {           
        super(ut, owner, force);
        this.chassis = chassis;
        this.model = model;
        this.config = "";
        this.mass = 0;

        this.configureMek();
    }

    configureMek(): void {
        this.year = 0;
    }

    getModel(): String {
        return this.model;
    }

    setModel(model: String): void {
        this.model = model;
    }

    getConfig(): String {
        return this.config;
    }

    setConfig(config: String): void {
        this.config = config;
    }

    getMass(): number {
        return this.mass;
    }

    setMass(mass: number): void { 
        this.mass = mass;
    }
}