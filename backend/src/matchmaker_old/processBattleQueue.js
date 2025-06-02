export function processBattleQueue(battleMode, io, backendPlayers, battles) {
   const queueStatus = battleQueuesStatus[battleMode];

   if (!queueStatus) return;

   queueStatus.isWorking = true;
   queueStatus.isNeedToRepeat = false;

   setPlayersForBattle({
      battleQueueStatus: queueStatus,
      io,
      battleQueue: battleQueues[battleMode],
      backendPlayers,
      battles,
      battleMode
   });

   queueStatus.isWorking = false;

   if (queueStatus.isNeedToRepeat) {
      processBattleQueue(battleMode, io, backendPlayers, battles);
   }
}
