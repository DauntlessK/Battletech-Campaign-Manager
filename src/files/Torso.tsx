import { side, loc } from '../constants/enums';
import { Component } from './Component';

/**
 * Class representing the torso of a unit. Contains information about the number of slots, armor, structure, and components / weapons contained within a torso.
 */
export class Torso extends Component {
    constructor(torsoSide: side, 
                slots: number = 12, 
                armor: number = 0, 
                structure: number = 0,
                rear_armor: number = 0,
                rear_structure: number = 0,
                components: string[],
                weapons: string[]) {
        super(loc.centerTorso, armor, structure);
    }
}