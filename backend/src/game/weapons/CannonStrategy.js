import { WeaponStrategy } from "./WeaponStrategy.js";

export class CannonStrategy extends WeaponStrategy {
   constructor({ data, entityRef }) {
      super({
         ...data,
         entityRef
      });
      this.reloadMax = 12;
      this.reloadCurrent = 0;
   }

   fire(ship) {
      console.log(`🚢 Ship ${ship.id} fires a cannon at (${ship.x}, ${ship.y})`);
      // Додаєш логіку завдання шкоди на мапі, створення об'єкта снаряду тощо
    }
}