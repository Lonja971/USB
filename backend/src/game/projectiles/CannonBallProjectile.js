import { Projectile } from "./Projectile.js";
import { calculateDistance } from "../utils/helpers.js";

export class CannonballProjectile extends Projectile{
   constructor(data) {
      super({
         ...data
      })

      this.target = data.target;
      this.distance = calculateDistance(this.position.x, this.position.y, this.target.x, this.target.y);
      this.flightTime = this.calculateFlightTime();
      this.damage = 1;

      this.ticksPassed = 0;
   }

   calculateFlightTime() {
      if (this.distance <= 10) return 1;
      if (this.distance <= 20) return 2;

      return Math.ceil(this.distance / 10);
   }

   tick({ spatialIndex, applyDamageToEntities, removeProjectile }) {
      console.log(`Оновлюємо снаряд в tick: ${this.id}`);
      console.log(`Початково: ${this.ticksPassed}`);
      if (this.status == "explosion") {
         removeProjectile(this.id);
         return;
      }

      if (this.ticksPassed >= this.flightTime) {
         this.status = "explosion";
         console.log(`Атакуємо!`);
         const damagedTargets = spatialIndex.get(this.target.x, this.target.y, "ship");
         console.log("Попали під атаку:");
         console.log(damagedTargets);
         if (damagedTargets) {
            applyDamageToEntities(damagedTargets, this.damage, this.teamIndex);
         }

      }else{
         console.log(`Просто збільшуємо...`);
         this.ticksPassed++;
      }
      
      console.log(`Ще чекати: ${this.ticksPassed}`);
   }
}