import { ShipControl } from "../../uikit/battle/ship-control";

export function ActionBarLayout({ isPlayerTurn, moveData, setMoveData, playerId, currentCastomnShipData }) {

   return (
      <div className="battle__actionbar">
         { currentCastomnShipData ? (
            <div>
               <h3>{currentCastomnShipData.id}</h3>
               <p>Health: {currentCastomnShipData.health}</p>
               <p>Team: {currentCastomnShipData.teamIndex}</p>
            </div>
         ) : ""}
         {currentCastomnShipData?.ownerId === playerId && (
            <ShipControl
               isPlayerTurn={isPlayerTurn}
               currentCastomnShipData={currentCastomnShipData}
               setMoveData={setMoveData}
               moveData={moveData}
            />
         )}

      </div>
   );
}