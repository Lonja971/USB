export class SpatialIndex {
   constructor() {
      this.cells = new Map();
      this.entityCells = new Map();
   }

   coordToKey(x, y) {
      return `${x},${y}`;
   }

   add(x, y, entityId) {
      const key = `${x},${y}`;
      if (!this.cells.has(key)) this.cells.set(key, new Set());
      this.cells.get(key).add(entityId);

      if (!this.entityCells.has(entityId)) this.entityCells.set(entityId, []);

      const exists = this.entityCells.get(entityId).some(c => c.x === x && c.y === y);
      if (!exists) {
         this.entityCells.get(entityId).push({ x, y });
      }
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

   getCoordByEntityPointIndex(entityId, pointIndex) {
      const entity = this.entityCells.get(entityId);
      if (!entity) return;

      return entity[pointIndex];
   }

   clearByEntityId(entityId) {
      const cells = this.entityCells.get(entityId) ?? [];
      console.log("=== " + entityId + " ===");
      console.log(cells);
      for (const { x, y } of cells) {
         const key = `${x},${y}`;
         const set = this.cells.get(key);
         if (set) {
            set.delete(entityId);
            if (set.size === 0) {
               this.cells.delete(key);
            }
         }
      }
      this.entityCells.delete(entityId);
      console.log("===");
      console.log(this.cells);
      console.log(this.entityCells);
   }
}