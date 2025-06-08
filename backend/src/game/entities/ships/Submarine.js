import { Ship } from "./Ship.js";

export class Submarine extends Ship {
   constructor(data) {
      super({
         ...data
      });

      this.defaultSpottingDuration = 3;
   }
}