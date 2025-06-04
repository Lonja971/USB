import React from "react";
import { getShipBlocks } from "../../../utils/battle";

export const PredictedShip = React.memo(function PredictedShip({ ship, cellSize }) {
   const blocks = getShipBlocks(ship.centerPosition.x, ship.centerPosition.y, ship.directionKey, ship.length);
   const coreIndex = Math.floor(ship.length / 2);

   return (
      <div style={{ position: "absolute", left: 0, top: 0, pointerEvents: "none" }}>
         {blocks.map((block, idx) => {
            const isCore = idx === coreIndex;
            return (
               <div
                  key={idx}
                  style={{
                     position: "absolute",
                     left: block.x * cellSize,
                     top: block.y * cellSize,
                     width: cellSize,
                     height: cellSize,
                     border: isCore ? "2px dashed blue" : "1px dashed gray",
                     backgroundColor: "rgba(0, 0, 255, 0.1)",
                     pointerEvents: "none"
                  }}
               />
            );
         })}
      </div>
   );
});