import { getPlayerTeamIndex } from "../../utils/battles/battle.js";

export class BattleLogic {
   constructor({ state }) {
      this.state = state;
   }

   makeMove(playerId, moveData) {
      const playerTeamIndex = getPlayerTeamIndex(playerId, this.state.teams);

      if (playerTeamIndex !== this.state.currentTurn) {
         return { success: false, message: 'Not your turn!' };
      }
      if (this.state.playersWhoMoved.includes(playerId)) {
         return { success: false, message: 'You already moved!' };
      }

      if (moveData.update){
         Object.entries(moveData.update).forEach(([key, data]) => {
            const ship = this.state.ships[key];
            if (!ship) return;
            if (ship.ownerId !== playerId) return;

            if (ship.type === "ship") {
               ship.updateFromPlayer(data);
            }else{
               return;
            }
         });
      }

      this.state.playersWhoMoved.push(playerId);
      this.checkAndAdvanceTurn(playerTeamIndex);

      return { success: true, gameOver: false };
   }

   checkAndAdvanceTurn(playerTeamIndex) {
      if (this.state.playersWhoMoved.length === this.state.teams[playerTeamIndex].length){
         this.processTurn(playerTeamIndex);

         const totalTeams = this.state.teams.length;
         let nextTurn = (this.state.currentTurn + 1) % totalTeams;
         while (!this.state.teams[nextTurn] || this.state.teams[nextTurn].length === 0) {
            nextTurn = (nextTurn + 1) % totalTeams;
         }
         this.state.currentTurn = nextTurn;
         this.state.playersWhoMoved = [];
      }
   }

   processTurn(teamIndex = "all") {
      Object.entries(this.state.ships).forEach(([shipId, ship]) => {
         if (ship.teamIndex !== teamIndex && teamIndex !== "all") return;

         this.processShipTurn(shipId, ship);
      });
   }

   processShipTurn(shipId, ship) {
      this.tryApplyTurn(shipId, ship);
      this.tryApplyMovement(shipId, ship);

      ship.updateSpotting();

      for (const module of ship.modules) {
         if (module.type === "locator") {
            module.tick(ship, this.state.ships);
         }
      }
   }

   tryApplyTurn(shipId, ship) {
      if (!ship.rudder || ship.rudder === "center") return;
      const clone = ship.clone();
      clone.applyTurn(ship.rudder);
      clone.update();
      
      const segments = clone.getSegments();
      const mapWidth = this.state.map.width;
      const mapHeight = this.state.map.height;

      const hasConflict = segments.some(({ x, y }) => {
         const outOfBounds = x < 0 || y < 0 || x >= mapWidth || y >= mapHeight;

         const occupants = this.state.spatialIndex.get(x, y);
         const collision = occupants.size > 0 && !occupants.has(ship.id);

         return outOfBounds || collision;
      });

      if (!hasConflict) {
         ship.applyTurn(ship.rudder);
      } else {
         console.log(`Поворот ${ship.rudder} для ${ship.id} неможливий — конфлікт.`);
      }

      ship.rudder = "center";
   }

   tryApplyMovement(shipId, ship) {
      const mapWidth = this.state.map.width;
      const mapHeight = this.state.map.height;

      const clone = ship.clone();
      let speedIndex = clone.currentSpeedIndex;
      let foundSafe = false;

      for (let i = speedIndex; i >= 0; i--) {
         const attemptClone = ship.clone();
         attemptClone.currentSpeedIndex = i;
         attemptClone.update();

         const segments = attemptClone.getSegments();
         const conflict = segments.some(({ x, y }) => {
            const outOfBounds = x < 0 || y < 0 || x >= mapWidth || y >= mapHeight;
            const occupants = this.state.spatialIndex.get(x, y);
            const collision = occupants.size > 0 && !occupants.has(ship.id);
            return outOfBounds || collision;
         });

         if (!conflict) {
            speedIndex = i;
            foundSafe = true;
            break;
         }
      }

      if (!foundSafe) return;

      this.state.spatialIndex.clearByEntityId(shipId);

      const originalSpeedIndex = ship.currentSpeedIndex;
      ship.currentSpeedIndex = speedIndex;
      ship.update();
      ship.currentSpeedIndex = originalSpeedIndex;

      this.state.updateSpatialShipSegments(ship);
   }
}