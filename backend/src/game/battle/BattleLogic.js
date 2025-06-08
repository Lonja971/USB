import { getPlayerTeamIndex } from "../../utils/battles/battle.js";
import { isWithinRadius } from "../utils/helpers.js";

export class BattleLogic {
   constructor({ state }) {
      this.state = state;
   }

   makeMove(playerId, moveData) {
      const playerTeamIndex = this._getPlayerTeamIndex(playerId);
      console.log(this.state.spatialIndex.cells);

      if (!this._isPlayerTurn(playerTeamIndex)) {
         return { success: false, message: 'Not your turn!' };
      }
      if (this._hasPlayerMoved(playerId)) {
         return { success: false, message: 'You already moved!' };
      }

      if (moveData.update) {
         this._applyUpdates(playerId, moveData.update);
      }
      if (moveData.shots) {
         this._applyShoots(playerId, moveData.shots);
      }

      this.state.playersWhoMoved.push(playerId);
      this.checkAndAdvanceTurn(playerTeamIndex);

      return { success: true, gameOver: false };
   }

   _getPlayerTeamIndex(playerId) {
      return getPlayerTeamIndex(playerId, this.state.teams);
   }

   _isPlayerTurn(teamIndex) {
      return teamIndex === this.state.currentTurn;
   }

   _hasPlayerMoved(playerId) {
      return this.state.playersWhoMoved.includes(playerId);
   }

   _applyUpdates(playerId, updates) {
      Object.entries(updates).forEach(([key, data]) => {
         const entity = this.state.entities[key];
         if (!entity) return;
         if (entity.ownerId !== playerId) return;

         if (entity.type === "ship") {
            entity.updateFromPlayer(data);
         }
      });
   }

   _applyShoots(playerId, shots) {
      shots.forEach(shot => {
         let shooter = this.state.entities[shot.shooterId];
         if (!shooter || playerId !== shooter.ownerId) return;

         let weapon = shooter.weapons[shot.cannonId];
         if (!weapon) return;

         weapon.shoot({
            data: shot.data,
            createProjectile: this.state.createProjectile.bind(this.state),
            getCoordByEntityPointIndex: this.state.spatialIndex.getCoordByEntityPointIndex.bind(this.state.spatialIndex),
            isInsideMap: this.state.map.isInside.bind(this.state.map)
         });
      });
   }

   checkAndAdvanceTurn(playerTeamIndex) {
      if (this.state.playersWhoMoved.length === this.state.teams[playerTeamIndex].length) {
         this.tick(playerTeamIndex);
         this._setNextTurn();
         this.state.playersWhoMoved = [];
      }
   }

   _setNextTurn() {
      const totalTeams = this.state.teams.length;
      let nextTurn = (this.state.currentTurn + 1) % totalTeams;

      while (!this.state.teams[nextTurn] || this.state.teams[nextTurn].length === 0) {
         nextTurn = (nextTurn + 1) % totalTeams;
      }

      this.state.currentTurn = nextTurn;
   }

   tick(teamIndex = "all") {
      Object.entries(this.state.entities).forEach(([entityId, entity]) => {
         if (entity.teamIndex !== teamIndex && teamIndex !== "all") return;

         if (entity.type === "ship") {
            this.processShipTurn(entityId, entity);
            this._processEntityWeapons(entity);
            this._processEntityModules(entity);
         }

         this.checkIfEnteredEnemyDetectionZone(entity);
      });

      this.state.tick(teamIndex);
   }

   _processEntityWeapons(entity) {
      for (const weapon of  Object.values(entity.weapons || {})) {   
         weapon.tick();
      }
   }

   _processEntityModules(entity) {
      for (const module of entity.modules || []) {
         if (module.type === "locator") {
            module.tick(ship, this.state.entities, this.state.setSpottedEntity.bind(this.state));
         }
      }
   }

   processShipTurn(shipId, ship) {
      const mapWidth = this.state.map.width;
      const mapHeight = this.state.map.height;
      const spatialIndex = this.state.spatialIndex;

      let maneuverPoints = ship.maneuverPoints;
      const originalSpeedIndex = ship.currentSpeedIndex;
      const isStationary = originalSpeedIndex === ship.speedsNullPointIndex;
      const hasTurn = ship.rudder !== "center";

      if (isStationary && hasTurn) return;

      const checked = new Set();
      const tryQueue = [];

      const trySpeed = (speedIndex, applyTurn) => {
         const key = `${speedIndex}_${applyTurn}`;
         if (checked.has(key)) return;
         checked.add(key);
         tryQueue.push({ speedIndex, applyTurn });
      };

      trySpeed(originalSpeedIndex, hasTurn);
      
      for (let delta = 1; delta < ship.availableSpeeds.length; delta++) {
         if (originalSpeedIndex - delta >= 0)
            trySpeed(originalSpeedIndex - delta, hasTurn);
         if (originalSpeedIndex + delta < ship.availableSpeeds.length)
            trySpeed(originalSpeedIndex + delta, hasTurn);
      }

      if (hasTurn) {
         trySpeed(originalSpeedIndex, false);
         for (let delta = 1; delta < ship.availableSpeeds.length; delta++) {
            if (originalSpeedIndex - delta >= 0)
               trySpeed(originalSpeedIndex - delta, false);
            if (originalSpeedIndex + delta < ship.availableSpeeds.length)
               trySpeed(originalSpeedIndex + delta, false);
         }
      }

      let bestAttempt = null;

      for (const config of tryQueue) {
         const result = this.attemptPlacement({
            ship,
            applyTurn: config.applyTurn,
            speedIndex: config.speedIndex,
            maneuverPoints,
            spatialIndex,
            mapWidth,
            mapHeight,
         });

         if (result.success) {
            bestAttempt = result;
            break;
         }
      }

      if (bestAttempt) {
         const finalShip = bestAttempt.shipClone;

         spatialIndex.clearByEntityId(shipId);
         ship.applyTurn(ship.rudder);
         ship.currentSpeedIndex = finalShip.currentSpeedIndex;
         ship.update();
         
         ship.rudder = "center";
         this.state.updateSpatialShipSegments(ship);

         maneuverPoints -= bestAttempt.costUsed;
      } else {
         ship.rudder = "center";
      }
   }

   attemptPlacement({ ship, applyTurn = false, speedIndex, maneuverPoints, spatialIndex, mapWidth, mapHeight }) {
      const clone = ship.clone();

      if (applyTurn && clone.rudder !== "center") {
         clone.applyTurn(clone.rudder);
      }

      clone.currentSpeedIndex = speedIndex;
      clone.update();

      const speedValue = Math.abs(clone.availableSpeeds[speedIndex]);
      const speedCost = ship.maneuverCosts.moveForward * speedValue;
      const turnCost = applyTurn && clone.rudder !== "center" ? ship.maneuverCosts.turn : 0;
      const totalCost = speedCost + turnCost;

      if (totalCost > maneuverPoints) {
         return {
            success: false,
            reason: "insufficient_points",
            costUsed: totalCost,
         };
      }

      const segments = clone.getSegments();

      for (const { x, y } of segments) {
         if (x < 0 || y < 0 || x >= mapWidth || y >= mapHeight) {
            return {
               success: false,
               reason: "out_of_bounds",
               costUsed: totalCost,
            };
         }

         const occupants = spatialIndex.get(x, y);
         if (occupants.size > 0 && !occupants.has(ship.id)) {
            return {
               success: false,
               reason: "collision",
               costUsed: totalCost,
            };
         }
      }

      return {
         success: true,
         reason: "ok",
         costUsed: totalCost,
         speedIndex,
         shipClone: clone,
      };
   }

   checkIfEnteredEnemyDetectionZone(ourEntity) {
      const entityCells = this.state.spatialIndex.entityCells;
      const ourEntityCells = entityCells.get(ourEntity.id);

      if (!ourEntityCells) return;

      if (ourEntity.coreIndex < 0 || ourEntity.coreIndex >= ourEntityCells.length) return;

      const ourCoreCoord = ourEntityCells[ourEntity.coreIndex];

      for (const [enemyId, enemyEntity] of Object.entries(this.state.entities)) {
         if (!enemyEntity.coreIndex) continue;
         if (enemyEntity.teamIndex === ourEntity.teamIndex) continue;

         const enemyCells = entityCells.get(enemyId);
         if (!enemyCells || enemyEntity.coreIndex >= enemyCells.length) continue;

         const enemyCoreCoord = enemyCells[enemyEntity.coreIndex];

         if (isWithinRadius(
               ourCoreCoord.x,
               ourCoreCoord.y,
               enemyCoreCoord.x,
               enemyCoreCoord.y,
               enemyEntity.detectionRadius
            )) {
            this.state.setSpottedEntity(
               enemyId,
               enemyEntity.defaultSpottingDuration,
               ourEntity.teamIndex
            );
         }
      }
   }

   handleHit(projectileId) {
      console.log("Статус атакуємо у " + projectileId + ", перевіряємо...");
      const projectile = this.state.projectiles.get(projectileId);
      if (!projectile) return;

      const coordItems = this.state.spatialIndex.get(projectile.position.x, projectile.position.y);
      if (!coordItems) return;
      console.log(`Всі елементи в цьому квадраті:`);
      console.log(coordItems);
      console.log(projectile.position.x, projectile.position.y);

      coordItems.forEach(itemId => {
         console.log(`${itemId} попався на атаку!`);
         const damagedEntity = this.state.entities[itemId];
         if (!damagedEntity) return;

         damagedEntity.applyDamage ? damagedEntity.applyDamage(projectile.damage) : "";
      });
      if (projectile.destroyingOnImpact) {
         projectile.status.isDestroyed = true;
      }
   }
}
