import { side, loc } from '../constants/enums';
import { Component } from './Component';

/**
 * Class representing an arm of a unit. Contains information about the number of slots, armor, structure, and components / weapons contained within an arm.
 */
export class Arm extends Component {
    constructor(armSide: side, 
                slots: number = 12, 
                armor: number = 0, 
                structure: number = 0,
                components: string[],
                weapons: string[]) {
        const armLoc = armSide === side.left ? loc.leftArm : loc.rightArm;
        super(armLoc, armor, structure);
    }
}
