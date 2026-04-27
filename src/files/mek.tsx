import { Torso } from "./Torso";
import { Unit } from "./Unit";
import { Arm } from "./Arm";
import { Leg } from "./Leg";
import { unitType, side } from '../constants/enums';

class Mek extends Unit{

    public model: String;
    public config: String;             //Biped or Quad, etc.
    public mass: number;
    public chassis: String;


    public centerTorso: Torso;
    public leftTorso: Torso;
    public rightTorso: Torso;
    public leftArm: Arm;
    public rightArm: Arm;
    public leftLeg: Leg;
    public rightLeg: Leg;

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
        
        // Initialize all parts of the Mek
        this.centerTorso = new Torso(side.center, 12, 0, 0, 0, 0, [], []);
        this.leftTorso = new Torso(side.left, 12, 0, 0, 0, 0, [], []);
        this.rightTorso = new Torso(side.right, 12, 0, 0, 0, 0, [], []);
        this.leftArm = new Arm(side.left, 12, 0, 0, [], []);
        this.rightArm = new Arm(side.right, 12, 0, 0, [], []);
        this.leftLeg = new Leg(side.left, 12, 0, 0, [], []);
        this.rightLeg = new Leg(side.right, 12, 0, 0, [], []);

        this.configureMek();
    }

    configureMek(): void {

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