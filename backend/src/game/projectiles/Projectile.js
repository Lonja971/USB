export class Projectile {
   constructor({ id, type, position, ownerId, weaponId, teamIndex}){
      this.id = id;
      this.classType = "projectile";
      this.type = type;
      this.ownerId = ownerId;
      this.weaponId = weaponId;
      this.teamIndex = teamIndex;

      this.damage = 1;
      this.position = position;

      this.status = "idle"; // attacking | explosion
   }

   tick(spatialIndex) {
      if (this.hasPhysics) {
         this.move();
         this.checkCollision(spatialIndex);
      } else {
         // Для не-фізичних снарядів
         this.updateStatus();
      }
   }

   move() {
      if (this.type === "torpedo") {
         // Для торпеди — рухаємо по координатах
         this.position.x += this.speed;
         // Перевірка на колізії
      }
      // Інші снаряди
   }

   checkCollision(spatialIndex) {
      // Перевірка на колізії для торпед (може бути різною для різних типів)
      const entities = spatialIndex.get(this.position.x, this.position.y);
      for (const entity of entities) {
         if (entity.type === "ship") {
            this.status = "attacking"; // атакуємо
            // завдати шкоду
         }
      }
   }

   updateStatus() {
      // Тут можна перевіряти для не-фізичних снарядів (наприклад, гарматний снаряд)
      if (this.status === "attacking") {
         // Завдати шкоди
      }
   }
}