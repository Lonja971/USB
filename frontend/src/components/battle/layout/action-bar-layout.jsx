import { useState } from "react";
import { ShipControl } from "../../uikit/battle/ship-control";

export function ActionBarLayout({ isPlayerTurn, moveData, setMoveData, playerId, currentCastomnShipData }) {
   const shipId = currentCastomnShipData.id;

   const shipMove = moveData.update[shipId] ?? {
      currentSpeedIndex: currentCastomnShipData.currentSpeedIndex,
      turnTo: null
   };

   function updateShipMoveData(newSpeed = shipMove.currentSpeedIndex, newDirection = shipMove.turnTo) {
      const baseSpeed = currentCastomnShipData.currentSpeedIndex;

      const updatedEntry = {};

      if (newSpeed !== baseSpeed) {
         updatedEntry.currentSpeedIndex = newSpeed;
      }

      if (newDirection !== null) {
         updatedEntry.turnTo = newDirection;
      }

      setMoveData(prev => {
         const newUpdate = { ...prev.update };

         if (Object.keys(updatedEntry).length === 0) {
            delete newUpdate[shipId];
         } else {
            newUpdate[shipId] = updatedEntry;
         }

         return { update: newUpdate };
      });
   }

   function toggleDirection(dir) {
      const newDirection = shipMove.turnTo === dir ? null : dir;
      updateShipMoveData(shipMove.currentSpeedIndex, newDirection);
   }

   return (
      <div className="battle__actionbar">
         Action bar
         <div>---</div>
         {currentCastomnShipData.ownerId === playerId ? (
            <ShipControl
               isPlayerTurn={isPlayerTurn}
               currentCastomnShipData={currentCastomnShipData}
               plannedSpeed={shipMove.currentSpeedIndex}
               direction={shipMove.turnTo}
               setNewMoveData={(newSpeed) => updateShipMoveData(newSpeed, shipMove.turnTo)}
               toggleDirection={toggleDirection}
            />
         ) : ""}
      </div>
   );
}