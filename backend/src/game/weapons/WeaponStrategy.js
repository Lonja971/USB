export class WeaponStrategy {
    constructor() {
        this.reloadMax = 0;
        this.reloadCurrent = 0;
    }
    fire(ship) {
        if (this.reloadCurrent > 0) {
            console.log(`Weapon is reloading. ${this.reloadCurrent} moves left.`);
            return false;
        }
        throw new Error("Not implemented");
    }

    tick() {
        if (this.reloadCurrent > 0) {
            this.reloadCurrent--;
        }
    }
}