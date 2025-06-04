import { GridLayour } from "./gridLayout"
import { Ship } from "./ship"

export function BattleMapLayout({ setCurrentCastomnShip, map, ships }){
   const cellSize = 20;
   map = { size: { x: 30, y: 30} };

   return (
      <div className="battle__map" style={{ width: map.size.x * cellSize, height: map.size.y * cellSize }}>
         <GridLayour width={map.size.x} height={map.size.y} cellSize={cellSize} />
         {Object.values(ships).map((ship) => (
            <Ship setCurrentCastomnShip={setCurrentCastomnShip} key={ship.id} ship={ship} cellSize={cellSize} />
         ))}
      </div>
   )
}