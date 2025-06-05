import { GridLayour } from "./gridLayout"
import { Ship } from "../entities/ship"
import { PredictedShip } from "../entities/predicted-ship";
import { predictShipMovement } from "../../../utils/battle";

export function BattleMapLayout({ setCurrentCastomnShip, map, ships, moveData, playerteamIndex }) {
   const cellSize = 20;

   return (
      <div className="battle__map" style={{ width: map.size.x * cellSize, height: map.size.y * cellSize }}>
         <GridLayour width={map.size.x} height={map.size.y} cellSize={cellSize} />
         {Object.values(ships).map((ship) => (
            <Ship setCurrentCastomnShip={setCurrentCastomnShip} key={ship.id} ship={ship} cellSize={cellSize} />
         ))}
         {Object.values(ships).map((ship) => {
            console.log(ship.teamIndex);
            console.log(playerteamIndex);
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