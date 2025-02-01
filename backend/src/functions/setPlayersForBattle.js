export function generateBattleId(battles){
   const existingIds = Object.keys(battles).map(Number);
   const newId = existingIds.length > 0 ? Math.max(...existingIds) + 1 : 1;
   return newId;
}

export function setPlayersForBattle(io, battleQueue, backendPlayers, battles, battleMode) {
   let matches = [];

   while (battleQueue.length >= (battleMode.teams * battleMode.playersInTeam)) {
      let teams = {};
       
      for (let teamI = 0; teamI < battleMode.teams; teamI++) {
         teams[teamI + 1] = {};
         let foundPlayersNum = 0;

         while (foundPlayersNum < battleMode.playersInTeam) {
            const player = battleQueue.shift();
            if (player) {
               console.log(`Player ${backendPlayers[player].name} with status: ${backendPlayers[player].status}`);
               if (backendPlayers[player].inBattle === false) {
                  teams[teamI + 1][foundPlayersNum + 1] = player;
                  foundPlayersNum++;
               } else {
                  console.log("--Player deleted");
                  // Виправлення: Не викликаємо battleQueue.shift() ще раз
               }
            }
         }
         console.log('Гравці знайдені');
      }

      matches.push(teams);
   }

   matches.forEach(match => {
      let battleId = generateBattleId(battles);
      battles[battleId] = match;
       
      Object.values(match).forEach(team => {
         Object.values(team).forEach(player => {
            battleQueue = battleQueue.filter(id => id !== player);
               
            if (backendPlayers[player] && backendPlayers[player].socketId) {
               backendPlayers[player].inBattle = true;
               console.log(`--Player ${backendPlayers[player].name} with status: ${backendPlayers[player].status}`);
               io.to(backendPlayers[player].socketId).emit("BattleFound", true);
            }
         });
      });
   });
}
