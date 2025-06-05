export function ShipControl({
   isPlayerTurn,
   currentCastomnShipData,
   setMoveData,
   moveData
}) {
   const shipId = currentCastomnShipData.id;

   const rudderFromBackend = currentCastomnShipData.rudder ?? "center";
   const speedFromBackend = currentCastomnShipData.currentSpeedIndex;

   const shipMoveUpdate = moveData.update[shipId] ?? {};

   const plannedSpeed = shipMoveUpdate.currentSpeedIndex ?? speedFromBackend;
   const turnTo = shipMoveUpdate.turnTo ?? rudderFromBackend;

   function updateShipMoveData(newSpeed = plannedSpeed, newDirection = turnTo) {
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
      updateShipMoveData(plannedSpeed, newDirection);
   }

   const indexedSpeeds = currentCastomnShipData.availableSpeeds.map((speed, index) => ({ speed, index }));
   const sorted = indexedSpeeds.slice().sort((a, b) => b.speed - a.speed);

   return (
      <div
         className="actionbar-shipcontrol"
         style={{ opacity: !isPlayerTurn ? "0.5" : "" }}
      >
         <div className="actionbar-shipcontrol__wheel">
            <div>
               <button
                  onClick={() => toggleDirection("left")}
                  style={{
                     backgroundColor: turnTo === "left" ? "lightblue" : "white"
                  }}
               >
                  Left
               </button>
            </div>
            <div>
               {sorted.map(({ speed, index }) => (
                  <div
                     key={index}
                     onClick={() => updateShipMoveData(index, turnTo)}
                     style={{
                        cursor: "pointer",
                        fontWeight: index === plannedSpeed ? "bold" : "normal",
                        color: index === speedFromBackend
                           ? "yellow"
                           : index === plannedSpeed
                           ? "green"
                           : "black"
                     }}
                  >
                     {index}: Speed {speed}
                  </div>
               ))}
            </div>
            <div>
               <button
                  onClick={() => toggleDirection("right")}
                  style={{
                     backgroundColor: turnTo === "right" ? "lightblue" : "white"
                  }}
               >
                  Right
               </button>
            </div>
         </div>
      </div>
   );
}