import { Ship } from "./Ship.js";
import { CannonStrategy } from "../../weapons/CannonStrategy.js";

export class Battleship extends Ship {
    constructor(data) {
        super({
            ...data
        });
    }
}