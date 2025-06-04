import { getPlayerTeamIndex } from "../../utils/battles/battle.js";

export class BattleLogic {
   constructor({ state }) {
      this.state = state;
   }

   makeMove(playerId, moveData) {
      const playerTeam = getPlayerTeamIndex(playerId, this.state.teams);

      if (playerTeam !== this.state.currentTurn) {
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
            }
         });
      }

      this.state.playersWhoMoved.push(playerId);
      this.checkAndAdvanceTurn(playerTeam);

      return { success: true, gameOver: false };
   }

   checkAndAdvanceTurn(playerTeam) {
      if (this.state.playersWhoMoved.length === this.state.teams[playerTeam].length){
         this.processTurn();

         const totalTeams = this.state.teams.length;
         let nextTurn = (this.state.currentTurn + 1) % totalTeams;
         while (!this.state.teams[nextTurn] || this.state.teams[nextTurn].length === 0) {
            nextTurn = (nextTurn + 1) % totalTeams;
         }
         this.state.currentTurn = nextTurn;
         this.state.playersWhoMoved = [];
      }
   }

   processTurn() {
      Object.entries(this.state.ships).forEach(([key, ship]) => {
         ship.update();
      });
   }
}