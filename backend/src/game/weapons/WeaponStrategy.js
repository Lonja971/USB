export class WeaponStrategy {
   constructor({ entityId, type, health=1, positionOffset }) {
      this.entityId = entityId;
      this.type = type;
      this.reloadMax = 0;
      this.reloadCurrent = 0;
      this.health = health;
      this.positionOffset = positionOffset;
   }
   fire(ship) {
      if (this.reloadCurrent > 0) {
         console.log(`Weapon is reloading. ${this.reloadCurrent} moves left.`);
         return false;
      }
      throw new Error("Not implemented");
    }

   tick() {
      if (this.reloadCurrent > 0) {
         this.reloadCurrent--;
      }
   }
}