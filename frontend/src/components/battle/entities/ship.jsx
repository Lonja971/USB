import React from "react";
import { directionsMap, getShipBlocks } from "../../../utils/battle";

export const Ship = React.memo(function Ship({ currentCastomnShip, setCurrentCastomnShip, ship, cellSize }) {
   const blocks = getShipBlocks(ship.centerPosition.x, ship.centerPosition.y, ship.directionKey, ship.length);
   const coreIndex = ship.coreIndex;

   const isSelected = ship.id === currentCastomnShip;
   const detectionRadius = ship.detectionRadius;

   const coreBlock = blocks[coreIndex];

   return (
      <div
         onClick={() => setCurrentCastomnShip(ship.id)}
         style={{ position: "absolute", left: 0, top: 0, pointerEvents: "auto", zIndex: "3", cursor: "pointer" }}
      >
         {isSelected && typeof detectionRadius === "number" && (
            <div
               style={{
                  position: "absolute",
                  left: (coreBlock.x - detectionRadius) * cellSize,
                  top: (coreBlock.y - detectionRadius) * cellSize,
                  width: (detectionRadius * 2 + 1) * cellSize,
                  height: (detectionRadius * 2 + 1) * cellSize,
                  border: "2px solid rgba(0, 0, 255, 0.5)",
                  pointerEvents: "none", 
                  boxSizing: "border-box",
                  backgroundColor: "transparent",
                  zIndex: 2,
               }}
            />
         )}

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
                     userSelect: "none",
                  }}
               >
                  {isNose ? directionsMap[ship.directionKey].name : null}
               </div>
            );
         })}
      </div>
   );
});