export class SpatialIndex {
    constructor() {
        this.index = {};
    }

    _key(x, y) {
        return `${x},${y}`;
    }

    add(entity) {
        const key = this._key(entity.x, entity.y);
        if (!this.index[key]) {
            this.index[key] = [];
        }
        this.index[key].push(entity);
    }

    remove(entity) {
        const key = this._key(entity.x, entity.y);
        if (!this.index[key]) return;

        this.index[key] = this.index[key].filter(e => e !== entity);
        if (this.index[key].length === 0) {
            delete this.index[key];
        }
    }

    move(entity, newX, newY) {
        this.remove(entity);
        entity.x = newX;
        entity.y = newY;
        this.add(entity);
    }

    getAt(x, y) {
        return this.index[this._key(x, y)] || [];
    }

    isBlocked(x, y) {
        return this.getAt(x, y).length > 0;
    }

    clear() {
        this.index = {};
    }
}