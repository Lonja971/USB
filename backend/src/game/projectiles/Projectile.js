export class Projectile {
   constructor({ id, type, position, ownerId, weaponId, teamIndex}){
      this.id = id;
      this.type = type;
      this.position = position;
      this.ownerId = ownerId;
      this.weaponId = weaponId;
      this.teamIndex = teamIndex;
      this.damage = 1;
      this.destroyingOnImpact = true;

      this.status = {
         isAttacking: false,
         isDestroyed: false
      };
   }

   tick() {
      return;
   }
}