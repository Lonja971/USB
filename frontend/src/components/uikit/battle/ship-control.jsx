export function ShipControl({
   isPlayerTurn,
   currentCastomnShipData,
   plannedSpeed,
   direction,
   setNewMoveData,
   toggleDirection
}) {
   const indexedSpeeds = currentCastomnShipData.availableSpeeds.map((speed, index) => ({ speed, index }));
   const sorted = indexedSpeeds.slice().sort((a, b) => b.speed - a.speed);

   return (
      <div
         className="actionbar-shipcontrol"
         style={{ opacity: !isPlayerTurn ? "0.5" : "" }}
      >
         <h3>{currentCastomnShipData.id}</h3>
         <div className="actionbar-shipcontrol__wheel">
            <div>
               <button
                  onClick={() => toggleDirection("left")}
                  style={{
                     backgroundColor: direction === "left" ? "lightblue" : "white"
                  }}
               >
                  Left
               </button>
            </div>
            <div>
               {sorted.map(({ speed, index }) => (
                  <div
                     key={index}
                     onClick={() => setNewMoveData(index)}
                     style={{
                        cursor: "pointer",
                        fontWeight: index === plannedSpeed ? "bold" : "normal",
                        color: index === currentCastomnShipData.currentSpeedIndex ? "yellow" : index === plannedSpeed ? "green" : "black"
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
                     backgroundColor: direction === "right" ? "lightblue" : "white"
                  }}
               >
                  Right
               </button>
            </div>
         </div>
      </div>
   );
}