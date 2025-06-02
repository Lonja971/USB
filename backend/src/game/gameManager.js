import { Battleship } from "./entities/ships/Battleship.js";
import { Submarine } from "./entities/ships/Submarine.js";

import { BattleMap } from "./map/BattleMap.js";

function createShipsForPlayer(playerId) {
    return [
        new Battleship(`${playerId}-battleship`, playerId, 1, 1),
        new Submarine(`${playerId}-submarine`, playerId, 3, 5),
    ];
}

function createBattle(io, player1Id, player2Id) {
    const battleId = `battle-${Date.now()}`;
    const battle = new UsualBattle(io, battleId, player1Id, player2Id);
    BattleRepo.create(battleId, battle);
    return [battleId, battle];
}

export function createGame(players) {
    const battleMap = new BattleMap(30, 30);
    const ships = []

    for (i = 0; i < players.length(); i++) {
        ships.push = createShipsForPlayer(i);
    };

    const battleId = `battle-${Date.now()}`;
    const battle = new UsualBattle(io, battleId, players, battleMap, ships);
    BattleRepo.create(battleId, battle);
    return [battleId, battle];
}

