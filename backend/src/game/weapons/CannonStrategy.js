import { WeaponStrategy } from "./WeaponStrategy.js";
import { isWithinRadius } from "../utils/helpers.js";

export class CannonStrategy extends WeaponStrategy {
   constructor({ data }) {
      super({
         ...data
      });
      this.name = "Гармата";
      this.radius = 20;
      this.reloadMax = 1;

      this.projectileType = "cannonBallProjectile";
      this.projectileSpeed = 15;
   }

   shoot({ data, createProjectile, getCoordByEntityPointIndex, isInsideMap }) {
      if (this.reloadCurrent > 0) return;
      if (!data.target) return;
      if (!isInsideMap(data.target.x, data.target.y)) return;
      
      const weaponCoord = getCoordByEntityPointIndex(this.entityId, this.positionOffset);
      if (!weaponCoord) return;
      
      const isInRadius = isWithinRadius(weaponCoord.x, weaponCoord.y, data.target.x, data.target.y, this.radius);
      if (!isInRadius) return;

      console.log("СТВОРЮЄМО СНАРЯД");
      
      createProjectile({
         type: this.projectileType,
         position: {
            x: weaponCoord.x,
            y: weaponCoord.y,
         },
         ownerId: this.ownerId,
         weaponId: this.id,
         teamIndex: this.teamIndex,
         speed: this.projectileSpeed,
         target: {
            x: data.target.x,
            y: data.target.y
         }
      });

      this.reloadCurrent = this.reloadMax;
   }
}