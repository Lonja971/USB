import { useEffect, useState } from "react";
import { useSocket } from "../../context/SocketContext";
import { useRoute } from "../../routing/RouteContext";
import { BattleLoadingLayout } from "../uikit/battle-loading-layout";
import { BattleMapLayout } from "./layout/battle-map-layout";
import { ActionBarLayout } from "./layout/action-bar-layout";
import "../../css/battle.css";
import { RightBarLayout } from "./layout/right-bar-layout";
import { useAppData } from "../../context/AppData";

export function Battle({ text }) {
   const { playerData } = useAppData();
   const { navigateToPage } = useRoute();
   const socket = useSocket();

   const [isLoadingScreen, setIsLoadingScreen] = useState(true);
   const [isBattleData, setIsBattleData] = useState(false);

   const [modeInfo, setModeInfo] = useState({});
   const [currentTurn, setCurrentTurn] = useState(null);
   
   const [map, setMap] = useState(null);
   const [teams, setTeams] = useState([]);
   const [playerteamIndex, setPlayerTeamIndex] = useState();
   const [isPlayerTurn, setIsPlayerTurn] = useState(null);
   const [ships, setShips] = useState({});
   const [battlePhase, setBattlePhase] = useState("");

   const [currentCastomnShip, setCurrentCastomnShip] = useState(null);
   const [moveData, setMoveData] = useState({
      update: {}
   });

   useEffect(() => {
      if (!socket) return;
      socket.on("UpdateBattleData", handleUpdateBattleData)
      socket.on("UpdateMoveData", (data) => {
         console.log(data);
         setShips((prevShips) => {
            const updated = {};
            for (const [id, newShip] of Object.entries(data.ships)) {
               const oldShip = prevShips[id];
               const hasChanged = !oldShip || JSON.stringify(oldShip) !== JSON.stringify(newShip);
               if (hasChanged) {
                  updated[id] = newShip;
               } else {
                  updated[id] = oldShip;
               }
            }

            return updated;
         });
      })
      socket.on("CatchBattleState", (data) => {
         console.log("Новий стейт");
         console.log(data);
         setShips(data.ships);
         setMap(data.map);
         setModeInfo(data.mode);
         setBattlePhase(data.phase);
         setCurrentTurn(data.currentTurn);
         setPlayerTeamIndex(data.playerTeamIndex);
         setTeams(data.teams);

         setIsBattleData(true);
         setTimeout(() => {
            setIsLoadingScreen(false)
         }, 5000);
      })
      return () => {
         socket.off("UpdateBattleData", handleUpdateBattleData);
         socket.off("UpdateMoveData");
         socket.off("CatchBattleState");
      };
   }, [socket, navigateToPage, ships]);

   useEffect(() => {
      if (!map) {
         socket.emit("getBattleState");
      }
   }, [map, socket])

   useEffect(() => {
      if (!currentCastomnShip && ships && Object.keys(ships).length > 0) {
         setCurrentCastomnShip(Object.keys(ships)[0]);
      }
   }, [ships, currentCastomnShip]);

   useEffect(() => {
   if (playerteamIndex !== undefined && currentTurn !== undefined) {
      setIsPlayerTurn(playerteamIndex === currentTurn);
   }
   }, [currentTurn, playerteamIndex]);

   function handleUpdateBattleData(data) {
      setBattlePhase(data.phase);
      setCurrentTurn(data.currentTurn);
   }

   function sendMove() {
      socket.emit("BattleMove", moveData);
      setMoveData({
         update: {}
      });
   }

   return (
      <div className="battle-window">
         {isLoadingScreen ? (
            <BattleLoadingLayout teams={teams} playerTeamIndex={playerteamIndex} modeInfo={modeInfo} />
         ) : ""}
         {isBattleData ? (
            <div className="battle-continer">
               {currentCastomnShip ? (
                  <ActionBarLayout isPlayerTurn={isPlayerTurn} moveData={moveData} setMoveData={setMoveData} playerId={playerData.id} currentCastomnShipData={ships[currentCastomnShip]} />
               ) : ""}
               <BattleMapLayout setCurrentCastomnShip={setCurrentCastomnShip} map={map} ships={ships} moveData={moveData} />
               <RightBarLayout sendMove={sendMove} />
            </div>
         ) : ""}
      </div>
   );
}