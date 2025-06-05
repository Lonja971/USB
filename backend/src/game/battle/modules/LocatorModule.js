import { Module } from "./Module.js";

export class LocatorModule extends Module{
   constructor({data, entityRef, radius}) {
      super({
         ...data,
         entityRef,
         health: 2
      });

      this.radius = radius ?? 15
   }

   tick(currentShip, allShips) {
      const ship = currentShip;
      const { x: x0, y: y0 } = ship.getAbsoluteSegmentPosition(this.positionOffset ?? ship.coreIndex);
      const radius = this.radius;

      for (const [id, target] of Object.entries(allShips)) {
         if (id === ship.id) continue;
         if (target.teamIndex === ship.teamIndex) continue;

         const locatorIndex = target.modules.find(m => m.type === "locator")?.positionOffset ?? target.coreIndex;
         const { x: tx, y: ty } = target.getAbsoluteSegmentPosition(locatorIndex);

         const dx = tx - x0;
         const dy = ty - y0;

         if (Math.abs(dx) <= radius && Math.abs(dy) <= radius) {
            target.setSpotting(target.enemySpottingDuration ?? 3);
            console.log(`🔭 Засвітили ${target.id} у (${tx}, ${ty})`);
         }
      }
   }

   tickSpatial(spatialIndex, currentShip, allShips) {
      const ship = currentShip;
      const { x: x0, y: y0 } = ship.getAbsoluteSegmentPosition(this.positionOffset ?? ship.coreIndex);
      const radius = this.radius;
      const spottedIds = new Set();

      for (const [coordKey, ids] of spatialIndex.cells.entries()) {
         const [cx, cy] = coordKey.split(',').map(Number);

         if (Math.abs(cx - x0) > radius || Math.abs(cy - y0) > radius) continue;

         for (const id of ids) {
            if (id === ship.id || spottedIds.has(id)) continue;

            const target = allShips[id];
            if (!target || target.teamIndex === ship.teamIndex) continue;

            const locatorIndex = target.modules.find(m => m.type === "locator")?.positionOffset ?? target.coreIndex;

            const partCoords = spatialIndex.shipCells.get(id)?.[locatorIndex];
            if (!partCoords) continue; // без координати — скіп

            const {x:tx, y:ty} = partCoords;

            if (Math.abs(tx - x0) <= radius && Math.abs(ty - y0) <= radius) {
               target.setSpotting(target.enemySpottingDuration ?? 3);
               spottedIds.add(id);
            }
         }
      }
   }
}