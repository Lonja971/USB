export class SpatialIndex {
   constructor() {
      this.cells = new Map();
      this.entityCells = new Map();
   }

   coordToKey(x, y) {
      return `${x},${y}`;
   }

   add(x, y, shipId) {
      const key = `${x},${y}`;
      if (!this.cells.has(key)) this.cells.set(key, new Set());
      this.cells.get(key).add(shipId);

      if (!this.entityCells.has(shipId)) this.entityCells.set(shipId, []);
      this.entityCells.get(shipId).push({ x, y });
   }

   clear(x, y) {
      this.cells.delete(this.coordToKey(x, y));
   }

   isOccupied(x, y) {
      return this.cells.has(this.coordToKey(x, y));
   }

   get(x, y) {
      const key = `${x},${y}`;
      return this.cells.get(key) ?? new Set();
   }

   clearByEntityId(shipId) {
      const cells = this.entityCells.get(shipId) ?? [];
      for (const { x, y } of cells) {
         const key = `${x},${y}`;
         const set = this.cells.get(key);
         if (set) {
            set.delete(shipId);
            if (set.size === 0) {
               this.cells.delete(key);
            }
         }
      }
      this.entityCells.delete(shipId);
   }
}