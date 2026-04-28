import { side, loc } from '../constants/enums';

/**
 * Represents a component of a unit, such as an arm, leg, or torso. Contains information about the location of the component, as well as its armor and structure values.
 */
export abstract class Component {
    public location: loc;
    public armor: number;
    public structure: number;

    constructor(location: loc,
                armor: number = 0, 
                structure: number = 0) {
        this.location = location;
        this.armor = armor;
        this.structure = structure;
        
    }

    
    getArmor(): number {
        return this.armor;
    }

    getStructure(): number {
        return this.structure;
    }

    isPresent(): boolean {
        if (this.structure == 0) {  //TODO: likely need to check if blown off or other ways of losing part
            return false;
        }
        return true;
    }
}
