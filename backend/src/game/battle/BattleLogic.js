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
         if (ship.teamIndex === teamIndex || teamIndex === "all") {
            const clone = ship.clone();
            clone.update();
            const newSegments = clone.getSegments();
            
            const conflict = newSegments.some(segment => {
               const occupants = this.state.spatialIndex.get(segment.x, segment.y);
               return occupants.size > 0 && !occupants.has(ship.id);
            });

            if (conflict) {
               console.log(`Корабель ${ship.id} не може рухатись — конфлікт.`);
               return;
            }

            this.state.spatialIndex.clearByEntityId(shipId);
            ship.update();
            this.state.updateSpatialShipSegments(ship);
         }
      });
   }
}