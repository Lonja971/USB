import { Projectile } from "./Projectile.js";
import { calculateDistance } from "../utils/helpers.js";

export class CannonBallProjectile extends Projectile{
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

   tick() {
      console.log(`Оновлюємо снаряд в tick: ${this.id}`);
      console.log(`Початково: ${this.ticksPassed}`);
      this.position = {
         x: this.target.x,
         y: this.target.y,
      }
      
      if (this.ticksPassed >= this.flightTime) {
         console.log(`Атакуємо!`);
         this.status.isAttacking = true;
      }else{
         console.log(`Просто збільшуємо...`);
         this.ticksPassed++;
      }
      
      console.log(`Ще чекати: ${this.ticksPassed}`);
   }
}