export function generateBattleId(battles){
   const existingIds = Object.keys(battles).map(Number);
   const newId = existingIds.length > 0 ? Math.max(...existingIds) + 1 : 1;
   return newId;
}

export function setPlayersForBattle( battleQueueStatus, io, battleQueue, backendPlayers, battles, battleMode){

}