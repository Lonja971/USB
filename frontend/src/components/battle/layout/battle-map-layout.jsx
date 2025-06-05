import { GridLayour } from "./gridLayout"
import { Ship } from "../entities/ship"
import { PredictedShip } from "../entities/predicted-ship";
import { predictShipMovement } from "../../../utils/battle";

export function BattleMapLayout({ setCurrentCastomnShip, map, ships, moveData }) {
   const cellSize = 20;

   return (
      <div className="battle__map" style={{ width: map.size.x * cellSize, height: map.size.y * cellSize }}>
         <GridLayour width={map.size.x} height={map.size.y} cellSize={cellSize} />
         {Object.values(ships).map((ship) => (
            <Ship setCurrentCastomnShip={setCurrentCastomnShip} key={ship.id} ship={ship} cellSize={cellSize} />
         ))}
         {Object.values(ships).map((ship) => {
            const update = moveData.update?.[ship.id] ?? {};

            const merged = {
               currentSpeedIndex: update.currentSpeedIndex ?? ship.currentSpeedIndex,
               turnTo: update.turnTo ?? ship.rudder ?? "center",
            };

            const predictedShip = predictShipMovement(ship, merged);

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