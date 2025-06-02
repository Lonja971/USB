import { UsualBattle } from "./Battle.js";
import { BattleRepo } from "../../inMemoryRepos/battle.js";

function createBattle(io, player1Id, player2Id) {
    const battleId = `battle-${Date.now()}`;
    const battle = new UsualBattle(io, battleId, player1Id, player2Id);
    BattleRepo.create(battleId, battle);
    return [battleId, battle];
}

function getBattle(id) {
    return BattleRepo.get(id);
}

function removeBattle(id) {
    BattleRepo.delete(id);
}

export {
    createBattle,
    getBattle,
    removeBattle,
};