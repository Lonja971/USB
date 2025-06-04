export class BattleMessenger {
   constructor(io, battleId) {
      this.io = io;
      this.battleId = battleId;
   }

   emitToBattle(event, payload) {
      console.log(`Відправляємо дані... ${this.battleId}`);
      this.io.to(this.battleId).emit(event, payload);
   }
   
   emitToTeam(teamIndex, event, payload) {
      this.io.to(`${this.battleId}_team_${teamIndex}`).emit(event, payload);
   }
}