import { GameMap } from "./map/GameMap.js";
import { shipConfigs } from "../config/game/shipConfigs.js";
import { Battle } from "./battle/Battle.js";
import { DIRECTION } from "../config/game/shipConfigs.js";

export class BattleFactory {
    static createBattle(io, teams, modeConfig) {
        const battleId = `battle-${Date.now()}`;
        const map = new GameMap(modeConfig.mapSize.x, modeConfig.mapSize.y);
        const entities = [];

        const zones = [
            { xStart: 0, xEnd: map.width, yStart: 0, yEnd: Math.floor(map.height / 2) - 1 },
            { xStart: 0, xEnd: map.width, yStart: Math.ceil(map.height / 2), yEnd: map.height - 1 },
        ];

        teams.forEach((team, teamIndex) => {
            const spawnZone = zones[teamIndex];

            team.forEach(player => {
                player.ships = [];

                for (const { type, count } of modeConfig.playerShips) {
                    const shipConfig = shipConfigs[type];
                    if (!shipConfig) {
                        console.warn(`Unknown ship type: ${type}`);
                        continue;
                    }

                    for (let i = 0; i < count; i++) {
                        const shipId = `ship-${player.id}-${i}`;
                        const direction = DIRECTION.UP;
                        const length = shipConfig.length;
                        const coreIndex = shipConfig.corePosition ?? Math.floor(length / 2);

                        let placed = false;

                        for (let y = spawnZone.yStart; y <= spawnZone.yEnd && !placed; y++) {
                            for (let x = spawnZone.xStart; x <= spawnZone.xEnd - length; x++) {
                                const tempShip = new shipConfig.classRef({
                                    id: shipId,
                                    ownerId: player.id,
                                    teamIndex,
                                    x,
                                    y,
                                    direction,
                                    health: shipConfig.health,
                                    length,
                                    speed: shipConfig.speed,
                                    coreIndex: coreIndex,
                                    weaponStrategy: new shipConfig.weapon.classRef()
                                });

                                const parts = tempShip.getParts();
                                const collision = parts.some(part =>
                                    entities.some(e => e.getParts().some(ep =>
                                        ep.x === part.x && ep.y === part.y
                                    ))
                                );

                                if (!collision) {
                                    player.ships.push(tempShip);
                                    entities.push(tempShip);
                                    placed = true;
                                    break;
                                }
                            }
                        }

                        if (!placed) {
                            console.warn(`Could not place ship ${shipId}`);
                        }
                    }
                }
            });
        });

        const battle = new Battle({
            io,
            battleId,
            map,
            teams,
            config: modeConfig,
            entities
        });

        return [battleId, battle];
    }
}