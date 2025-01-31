export function handleBattleEvents(io, socket) {
   socket.on("startBattle", ({ player1, player2 }) => {
      console.log(`Битва між ${player1} та ${player2} розпочалась!`);
      io.emit("battleStarted", { player1, player2 });
   });

   socket.on("attack", ({ attacker, target, damage }) => {
      console.log(`${attacker} атакує ${target} на ${damage} HP`);
      io.emit("playerAttacked", { attacker, target, damage });
   });

   socket.on("endBattle", ({ winner }) => {
      console.log(`Битва завершилась! Переможець: ${winner}`);
      io.emit("battleEnded", { winner });
   });
}