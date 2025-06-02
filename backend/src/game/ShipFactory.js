import { Battleship } from "./entities/ships/Battleship.js";
import { Submarine } from "./entities/ships/Submarine.js";
import { shipTypes } from "../config/game/shipTypes.js";

export class ShipFactory {
  static create(type, options = {}) {
    const ShipClass = shipTypes[type];
    if (!ShipClass) {
      throw new Error(`Unknown ship type: ${type}`);
    }
    return new ShipClass(options);
  }
}