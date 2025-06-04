export function getPlayerTeamIndex(playerId, teams){
   return teams.findIndex(team => team.some(player => player.id === playerId));
}

export function joinBattleRoom(socket, playerId, battleId, teams){
   const playerTeamIndex = getPlayerTeamIndex(playerId, teams);
   socket.join(battleId);
   socket.join(`${battleId}_team_${playerTeamIndex}`);
}