export class Ship {
    constructor({ id, ownerId, teamIndex, x = null, y = null, health, length, speed, weaponStrategy, coreIndex, direction }) {
        this.id = id;
        this.ownerId = ownerId;
        this.teamIndex = teamIndex;

        this.length = length;
        this.x = x;
        this.y = y;
        this.direction = direction;
        this.coreIndex = coreIndex;

        this.health = health;
        this.speed = speed;

        this.weapon = weaponStrategy; 
    }

    fire() {
        this.weapon.fire(this);
    }

    getParts() {
        const parts = [];
        const { dx, dy } = this.direction;
        for (let i = 0; i < this.length; i++) {
        parts.push({
            x: this.x + dx * i,
            y: this.y + dy * i,
            isCore: i === this.coreIndex
        });
        }
        return parts;
    }

    getCorePosition() {
        const { dx, dy } = this.direction;
        return {
        x: this.x + dx * this.coreIndex,
        y: this.y + dy * this.coreIndex
        };
    }

    moveForward() {
        const { dx, dy } = this.direction;
        this.x += dx;
        this.y += dy;
    }
}