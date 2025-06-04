import React from "react";
import { directionsMap, getShipBlocks } from "../../../utils/battle";

export const Ship = React.memo(function Ship({ setCurrentCastomnShip, ship, cellSize }) {
   const blocks = getShipBlocks(ship.centerPosition.x, ship.centerPosition.y, ship.directionKey, ship.length);
   const coreIndex = ship.coreIndex;

   return (
      <div onClick={() => setCurrentCastomnShip(ship.id)} style={{ position: "absolute", left: 0, top: 0, pointerEvents: "auto", zIndex: "3", cursor: "pointer" }}>
         {blocks.map((block, idx) => {
            const isCore = idx === coreIndex;
            const isNose = idx === 0;
            return (
               <div
                  key={idx}
                  style={{
                     position: "absolute",
                     left: block.x * cellSize,
                     top: block.y * cellSize,
                     width: cellSize,
                     height: cellSize,
                     border: isCore ? "2px solid red" : "1px solid black",
                     backgroundColor: isCore ? "#ffcccb" : "#ddd",
                     display: "flex",
                     alignItems: "center",
                     justifyContent: "center",
                     fontWeight: "bold",
                     userSelect: "none"
                  }}
               >
                  {isNose ? directionsMap[ship.directionKey].name : null}
               </div>
            );
         })}
      </div>
   );
});