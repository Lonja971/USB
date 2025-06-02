import { UsualBattle } from "./UsualBattle.js";

const battles = new Map();

function createBattle(player1Id, player2Id) {
    const id = `battle-${Date.now()}`;
    const battle = new UsualBattle(player1Id, player2Id);
    battles.set(id, battle);
    return { id, battle };
}

function getBattle(id) {
    return battles.get(id);
}

function removeBattle(id) {
    battles.delete(id);
}

module.exports = {
    createBattle,
    getBattle,
    removeBattle,
};