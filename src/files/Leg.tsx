import { side, loc } from '../constants/enums';
import { Component } from './Component';

/**
 * Class representing a leg of a unit. Contains information about the number of slots, armor, structure, and components / weapons contained within a leg.
 */
export class Leg extends Component {
    constructor(legSide: side, 
                slots: number = 12, 
                armor: number = 0, 
                structure: number = 0,
                components: string[],
                weapons: string[]) {
        const legLoc = legSide === side.left ? loc.leftLeg : loc.rightLeg;
        super(legLoc, armor, structure);
    }
}
