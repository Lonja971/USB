export class GameMap {
    constructor(width, height) {
        this.width = width;
        this.height = height;
    }

    isInsideBounds(x, y) {
        return x >= 0 && x < this.width && y >= 0 && y < this.height;
    }
}