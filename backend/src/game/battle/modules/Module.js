export class Module {
   constructor({ entityId, type, positionOffset, health=1 }){
      this.entityId = entityId;
      this.type = type,
      this.positionOffset = positionOffset,
      this.health = health
   }

   isOperational() {
      return this.health > 0;
   }

   tick(){
      console.log("Пустий ахахах");
      return;
   }
}