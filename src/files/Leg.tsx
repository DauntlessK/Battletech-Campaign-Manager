import { side, loc } from '../constants/enums';
import { Part } from './Part';

/**
 * Class representing a leg of a unit. Contains information about the number of slots, armor, structure, and components / weapons contained within a leg.
 */
export class Leg extends Part {
    constructor(legSide: side, 
                slots: number = 12, 
                armor: number = 0, 
                structure: number = 0,
                components: String[],
                weapons: String[]) {
        const legLoc = legSide === side.left ? loc.leftLeg : loc.rightLeg;
        super(legLoc, armor, structure);
    }
}
