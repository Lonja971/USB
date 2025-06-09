export class SpatialIndex {
   constructor() {
      this.cells = new Map(); // key: "x,y" => Array<{ id, type }>
      this.entityCells = new Map(); // entityId => Array<{ x, y }>
   }

   coordToKey(x, y) {
      return `${x},${y}`;
   }

   add(x, y, entityId, type) {
      const key = this.coordToKey(x, y);
      if (!this.cells.has(key)) {
         this.cells.set(key, []);
      }

      const cell = this.cells.get(key);
      // Додаємо тільки якщо ще немає такого id
      if (!cell.some(e => e.id === entityId)) {
         cell.push({ id: entityId, type });
      }

      if (!this.entityCells.has(entityId)) {
         this.entityCells.set(entityId, []);
      }

      const exists = this.entityCells.get(entityId).some(c => c.x === x && c.y === y);
      if (!exists) {
         this.entityCells.get(entityId).push({ x, y });
      }
   }

   clear(x, y) {
      this.cells.delete(this.coordToKey(x, y));
   }

   isOccupied(x, y, typeFilter = null) {
      const cell = this.cells.get(this.coordToKey(x, y));
      if (!cell) return false;

      if (typeFilter) {
         return cell.some(e => e.type === typeFilter);
      }

      return cell.length > 0;
   }

   get(x, y) {
      const key = `${x},${y}`;
      return this.cells.get(key) ?? [];
   }

   getCoordByEntityPointIndex(entityId, pointIndex) {
      const entity = this.entityCells.get(entityId);
      if (!entity) return;
      return entity[pointIndex];
   }

   clearByEntityId(entityId) {
      const cells = this.entityCells.get(entityId) ?? [];
      for (const { x, y } of cells) {
         const key = this.coordToKey(x, y);
         const cell = this.cells.get(key);
         if (cell) {
            const index = cell.findIndex(e => e.id === entityId);
            if (index !== -1) {
               cell.splice(index, 1);
            }
            if (cell.length === 0) {
               this.cells.delete(key);
            }
         }
      }
      this.entityCells.delete(entityId);
   }
}