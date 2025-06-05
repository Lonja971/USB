import { ShipControl } from "../../uikit/battle/ship-control";

export function ActionBarLayout({ isPlayerTurn, moveData, setMoveData, playerId, currentCastomnShipData }) {
   const shipId = currentCastomnShipData.id;

   const rudderFromBackend = currentCastomnShipData.rudder ?? "center";
   const speedFromBackend = currentCastomnShipData.currentSpeedIndex;

   const shipMoveUpdate = moveData.update[shipId] ?? {};

   const currentSpeedIndex = shipMoveUpdate.currentSpeedIndex ?? speedFromBackend;
   const turnTo = shipMoveUpdate.turnTo ?? rudderFromBackend;

   function updateShipMoveData(newSpeed = currentSpeedIndex, newDirection = turnTo) {
      const updatedEntry = {};

      if (newSpeed !== speedFromBackend) {
         updatedEntry.currentSpeedIndex = newSpeed;
      }

      if (newDirection !== rudderFromBackend) {
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
      const newDirection = turnTo === dir ? "center" : dir;
      updateShipMoveData(currentSpeedIndex, newDirection);
   }

   return (
      <div className="battle__actionbar">
         {currentCastomnShipData.ownerId === playerId && (
            <ShipControl
               isPlayerTurn={isPlayerTurn}
               currentCastomnShipData={currentCastomnShipData}
               plannedSpeed={currentSpeedIndex}
               direction={turnTo}
               setNewMoveData={(newSpeed) => updateShipMoveData(newSpeed, turnTo)}
               toggleDirection={toggleDirection}
            />
         )}
      </div>
   );
}