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
      socket.on("UpdateMoveData", handleMoveData)
      socket.on("CatchBattleState", handleCatchBattleState)
      return () => {
         socket.off("UpdateBattleData", handleUpdateBattleData);
         socket.off("UpdateMoveData");
         socket.off("CatchBattleState");
      };
   }, [socket]);

   useEffect(() => {
      if (!map) {
         socket.emit("getBattleState");
      }
   }, [map, socket])

   useEffect(() => {
   if (playerteamIndex !== undefined && currentTurn !== undefined) {
      setIsPlayerTurn(playerteamIndex === currentTurn);
   }
   }, [currentTurn, playerteamIndex]);

   function handleCatchBattleState(data){
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
   }

   function handleMoveData(data) {
      setShips(prevShips => {
         const updatedShips = { ...prevShips };

         for (const [id, newShip] of Object.entries(data.ships)) {
            const oldShip = prevShips[id];

            // якщо новий корабель такий самий — не перезаписуємо (щоб не спричинити rerender або втрату стану)
            const sameShip = JSON.stringify(oldShip) === JSON.stringify(newShip);
            if (!sameShip) {
               updatedShips[id] = newShip;
            }
         }

         return updatedShips;
      });
   }

   function handleUpdateBattleData(data) {
      setBattlePhase(data.phase);
      setCurrentTurn(data.currentTurn);
   }

   function sendMove() {
      socket.emit("BattleMove", moveData);
      setMoveData(prev => {
         const newUpdate = { ...prev.update };
         for (const shipId of Object.keys(newUpdate)) {
            delete newUpdate[shipId];
         }
         return { update: newUpdate };
      });
   }

   return (
      <div className="battle-window">
         {isLoadingScreen ? (
            <BattleLoadingLayout teams={teams} playerTeamIndex={playerteamIndex} modeInfo={modeInfo} />
         ) : ""}
         {isBattleData ? (
            <div className="battle-continer">
               <ActionBarLayout isPlayerTurn={isPlayerTurn} moveData={moveData} setMoveData={setMoveData} playerId={playerData.id} currentCastomnShipData={ships[currentCastomnShip]} />
               <BattleMapLayout playerteamIndex={playerteamIndex} setCurrentCastomnShip={setCurrentCastomnShip} map={map} ships={ships} moveData={moveData} />
               <RightBarLayout sendMove={sendMove} />
            </div>
         ) : ""}
      </div>
   );
}