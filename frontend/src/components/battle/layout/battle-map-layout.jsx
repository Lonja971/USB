import { GridLayour } from "./gridLayout"
import { Ship } from "../entities/ship"
import { PredictedShip } from "../entities/predicted-ship";
import { predictShipMovement } from "../../../utils/battle";
import { LastSpottedShip } from "../entities/last-spotted-ship";

export function BattleMapLayout({ currentCastomnShip, lastKnownEnemyShips, setCurrentCastomnShip, map, ships, moveData, playerteamIndex }) {
   const cellSize = 20;
   console.log(currentCastomnShip);

   return (
      <div className="battle__map" style={{ width: map.size.x * cellSize, height: map.size.y * cellSize }}>
         <GridLayour width={map.size.x} height={map.size.y} cellSize={cellSize} />
         {Object.values(ships).map((ship) => (
            <Ship currentCastomnShip={currentCastomnShip} setCurrentCastomnShip={setCurrentCastomnShip} key={ship.id} ship={ship} cellSize={cellSize} />
         ))}
         {Object.values(lastKnownEnemyShips).map((lastKnownEnemyShip) => (
            <LastSpottedShip key={lastKnownEnemyShip.id} ship={lastKnownEnemyShip} cellSize={cellSize} />
         ))}
         {Object.values(ships).map((ship) => {
            if (ship.teamIndex !== playerteamIndex) return null;

            const update = moveData.update?.[ship.id] ?? {};
            const merged = {
               ...ship,
               currentSpeedIndex: update.currentSpeedIndex ?? ship.currentSpeedIndex,
               rudder: update.turnTo ?? ship.rudder ?? "center",
            };

            const predictedShip = predictShipMovement(merged);
            if (!predictedShip) return null;

            return (
               <PredictedShip
                  key={ship.id + "-predicted"}
                  ship={predictedShip}
                  cellSize={cellSize}
               />
            );
         })}
      </div>
   )
}