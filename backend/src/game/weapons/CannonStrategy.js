import { WeaponStrategy } from "./WeaponStrategy.js";

export class CannonStrategy extends WeaponStrategy {
    fire(ship) {
        console.log(`🚢 Ship ${ship.id} fires a cannon at (${ship.x}, ${ship.y})`);
        // Додаєш логіку завдання шкоди на мапі, створення об'єкта снаряду тощо
    }
}