export class WeaponStrategy {
   constructor({ id, name, entityId, teamIndex, ownerId, type, health=1, positionOffset }) {
      this.id = id,
      this.name = name;
      this.entityId = entityId;
      this.ownerId = ownerId;
      this.teamIndex = teamIndex;
      this.type = type;
      this.reloadMax = 0;
      this.reloadCurrent = 0;
      this.health = health;
      this.positionOffset = positionOffset;
   }
   
   shoot(ship) {
      throw new Error("Not implemented");
   }

   tick() {
      if (this.reloadCurrent > 0) {
         this.reloadCurrent--;
      }
   }
}