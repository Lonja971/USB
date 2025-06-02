export function handleBattleEvents(socket, battleId, battle, playerId) {
    const timeLeft = battle.getTimeLeft()
    console.log(`YES player [${playerId}] are in battle [${battleId}] ( timeLeft: [${timeLeft}])`);

    socket.emit("BattleStarted", "Бій почався");

    socket.on("BattleMove", () => {
        console.log(`Player ${playerId} ходити хоче`);
        battle.makeMove(playerId, "My move data")
    })
}