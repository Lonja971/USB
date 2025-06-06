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
      let remainingManeuverPoints = ship.maneuverPoints;
      console.log(`=== ${shipId} ===`);
      remainingManeuverPoints = this.tryApplyTurn(remainingManeuverPoints, shipId, ship);
      remainingManeuverPoints = this.tryApplyMovement(remainingManeuverPoints, shipId, ship);

      this.state.updateSpotting();

      for (const module of ship.modules) {
         if (module.type === "locator") {
            module.tick(ship, this.state.ships, this.state.setSpottedEntity.bind(this.state));
         }
      }
   }

   tryApplyTurn(remainingManeuverPoints, shipId, ship) {
      if (!ship.rudder || ship.rudder === "center") return remainingManeuverPoints;

      const turnCost = ship.maneuverCosts.turn;
      const moveCostPerStep = ship.maneuverCosts.moveForward;
      const mapWidth = this.state.map.width;
      const mapHeight = this.state.map.height;

      let found = false;
      let chosenSpeedIndex = ship.currentSpeedIndex;
      let totalCost = 0;

      for (let i = ship.currentSpeedIndex; i >= 0; i--) {
         const clone = ship.clone();
         clone.applyTurn(ship.rudder);
         clone.currentSpeedIndex = i;
         clone.update();

         const segments = clone.getSegments();
         const hasConflict = segments.some(({ x, y }) => {
            const outOfBounds = x < 0 || y < 0 || x >= mapWidth || y >= mapHeight;
            const occupants = this.state.spatialIndex.get(x, y);
            const collision = occupants.size > 0 && !occupants.has(ship.id);
            return outOfBounds || collision;
         });

         const moveCost = moveCostPerStep * Math.abs(ship.availableSpeeds[i]);
         totalCost = turnCost + moveCost;

         if (!hasConflict && totalCost <= remainingManeuverPoints) {
            chosenSpeedIndex = i;
            found = true;
            break;
         }
      }

      if (!found) {
         ship.rudder = "center";
         return remainingManeuverPoints;
      }

      ship.applyTurn(ship.rudder);
      ship.currentSpeedIndex = chosenSpeedIndex;
      ship.update();

      ship.rudder = "center";
      return remainingManeuverPoints - totalCost;
   }

   tryApplyMovement(remainingManeuverPoints, shipId, ship) {
      const mapWidth = this.state.map.width;
      const mapHeight = this.state.map.height;
      
      const moveForwardManeuverCosts = ship.maneuverCosts.moveForward;
      if (remainingManeuverPoints - moveForwardManeuverCosts < 0) return remainingManeuverPoints;

      const clone = ship.clone();
      let speedIndex = clone.currentSpeedIndex;
      let foundSafe = false;
      let currentManeuverCost = 0;

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

         currentManeuverCost = moveForwardManeuverCosts * Math.abs(ship.availableSpeeds[i]);
         const avaibleManeuverPoints = remainingManeuverPoints - currentManeuverCost;

         if (!conflict && avaibleManeuverPoints >= 0) {
            speedIndex = i;
            foundSafe = true;
            break;
         }
      }

      if (!foundSafe) return remainingManeuverPoints;

      this.state.spatialIndex.clearByEntityId(shipId);

      remainingManeuverPoints -= currentManeuverCost;
      const originalSpeedIndex = ship.currentSpeedIndex;
      ship.currentSpeedIndex = speedIndex;
      ship.update();
      ship.currentSpeedIndex = originalSpeedIndex;

      this.state.updateSpatialShipSegments(ship);

      return remainingManeuverPoints;
   }
}
