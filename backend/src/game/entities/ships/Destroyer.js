import { Ship } from "./Ship.js";

export class Destroyer extends Ship {
    constructor(data) {
        super({
            ...data
        });
    }
}