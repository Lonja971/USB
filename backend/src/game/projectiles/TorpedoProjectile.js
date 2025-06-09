import { Projectile } from "./Projectile.js";

export class TorpedoProjectile extends Projectile{
   constructor({ data }) {
      super({
         ...data
      })

      this.damage = 2;
      this.status = "attacking";

      this.speed = 2;
      this.direction = data.direction;
   }
}