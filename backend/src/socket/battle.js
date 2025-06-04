export function handleBattleEvents(socket, battleId, battle, playerId) {
   const timeLeft = battle.timer.getTimeLeft()

   console.log(`YES player [${playerId}] are in battle [${battleId}] ( timeLeft: [${timeLeft}])`);
   socket.on("getBattleState", () => {
      const gameState = battle.state.getState(playerId);
      socket.emit("CatchBattleState", gameState);
   })

   socket.on("BattleMove", (data) => {
      console.log(`Player ${playerId} ходити хоче`);
      battle.makeMove(playerId, data)
   })
}