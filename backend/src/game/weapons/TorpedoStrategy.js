import { WeaponStrategy } from "./WeaponStrategy.js";

export class TorpedoStrategy extends WeaponStrategy {
   constructor({ data, entityRef }) {
      super({
         ...data,
         entityRef
      });
      this.reloadMax = 12;
      this.reloadCurrent = 0;
   }

   fire(ship) {
      if (this.reloadCurrent > 0) {
            console.log(`Torpedo is reloading for ${this.reloadCurrent} moves.`);
            return false;
      }
      console.log(`🛳 Ship ${ship.id} launches torpedo from (${ship.x}, ${ship.y})`);
      this.resetReload();
      return true;
   }
}