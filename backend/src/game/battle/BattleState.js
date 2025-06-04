import { PlayerRepo } from "../../inMemoryRepos/player.js";

export class BattleState {
   constructor({ id, config, teams, ships, map }) {
      this.id = id;
      this.config = config;
      this.map = map;
      this.teams = teams;
      this.phase = "waiting";

      this.ships = ships;
      this.projectiles = [];

      this.currentTurn = 0;
      this.playersWhoMoved = [];
   }

   getTeamEntities(desiredTeamIndex){
      return Object.fromEntries(
         Object.entries(this.ships)
            .filter(([id, ship]) => ship.teamIndex === desiredTeamIndex)
      );
   }
   getState(playerId) {
      const playerTeamIndex = this.teams.findIndex(team =>
            team.some(player => player.id === playerId)
      );
      const playersTeamEntities = this.getTeamEntities(playerTeamIndex);
      let teams = []
      this.teams.forEach(team => {
            const players = {}
            team.forEach(player => {
               const playerName = PlayerRepo.get(player.id).data.name;
               players[player.id] = { name: playerName };
            })
            teams.push(players);
      });
      return {
            teams: teams,
            playerTeamIndex: playerTeamIndex,
            phase: this.phase,
            ships: playersTeamEntities,
            mode: {
               name: this.config.modeName
            },
            map: {
               size: this.config.mapSize,
            }
      };
   }

   getBattleData(){
      return {
         ships: this.ships,
         phase: this.phase,
         currentTurn: this.currentTurn
      }
   }
}