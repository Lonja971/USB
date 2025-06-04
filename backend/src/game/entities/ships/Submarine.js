import { Ship } from "./Ship.js";
import { TorpedoStrategy } from "../../weapons/TorpedoStrategy.js";

export class Submarine extends Ship {
    constructor(data) {
        super({
            ...data,
            weapon: new TorpedoStrategy(),
        });
    }
}