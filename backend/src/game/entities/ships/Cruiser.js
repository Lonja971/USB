import { Ship } from "./Ship.js";

export class Cruiser extends Ship {
    constructor(data) {
        super({
            ...data
        });
    }
}