import { battleQueue } from "../inMemoryRepos/battleQueue.js";
import { BattleRepo } from "../inMemoryRepos/battle.js";
import { PlayerRepo } from "../inMemoryRepos/player.js";
import { handleBattleEvents } from "../socket/battle.js";
import { UsualBattle } from "../battles/UsualBattle.js";
import { PlayerRepository } from "../repositories/playerRepository.js";

export function tryMatchPlayers() {
    const queue = Array.from(battleQueue.entries());

    while (queue.length >= 2) {
        const [id1, socket1] = queue.shift();
        const [id2, socket2] = queue.shift();

        const battleId = `battle-${Date.now()}`
        const battleInstance = new UsualBattle(battleId, id1, id2);
        BattleRepo.create(battleId, battleInstance);

        PlayerRepo.get(id1).data.currentBattleId = battleId;
        PlayerRepo.get(id2).data.currentBattleId = battleId;

        battleQueue.delete(id1);
        battleQueue.delete(id2);

        socket1.emit("BattleFound", { battleId: battleId, opponentId: id2 });
        socket2.emit("BattleFound", { battleId: battleId, opponentId: id1 });

        PlayerRepository.updateCurrentBattleId(id1, battleId);
        PlayerRepository.updateCurrentBattleId(id2, battleId);

        handleBattleEvents(socket1, battleId, battleInstance, id1);
        handleBattleEvents(socket2, battleId, battleInstance, id2);
    }
}