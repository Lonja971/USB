import { Ship } from "./Ship.js";
import { TorpedoStrategy } from "../../weapons/TorpedoStrategy.js";

export class Submarine extends Ship {
   constructor(data) {
      super({
         ...data
      });

      this.enemySpottingDuration = 3;
   }
}