import { Projectile } from "./Projectile.js";

export class TorpedoProjectile extends Projectile{
   constructor({ data }) {
      super({
         ...data
      })
   }
}