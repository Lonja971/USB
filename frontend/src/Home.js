import { useEffect, useState } from "react";
import { useSocket } from "./context/SocketContext";
import { useRoute } from "./context/RouteContext";
import { usePlayerData } from "./context/PlayerDataContext";

import { BattleWaitingPopup } from "./components/BattleWaitingPopup";

export function Home() {
   const { playerData, setPlayerData } = usePlayerData();
   const { navigateToScreen } = useRoute();
   const socket = useSocket();
   
   const [isInBattleQueue, setIsInBattleQueue] = useState(false);
   const [playersNumber, setPlayersNumber] = useState();
   
   useEffect(() => {
      if (!playerData?.id) {
         navigateToScreen("mainLoadingScreen");
      }
   }, [playerData, navigateToScreen, socket]);

   useEffect(() => {
      if (!socket) return;

      socket.emit("subscribePlayersNumber");

      socket.on("updatePlayers", (data) => {
         console.log("Гравці:");
         console.log(data);
      });

      socket.on("isInBattleQueue", (data) => {
         setIsInBattleQueue(data.status);
      });

      socket.on("playersNumber", (number) => {
         setPlayersNumber(number);
      });

      return () => {
         socket.emit("unsubscribePlayersNumber");

         socket.off("updatePlayers");
         socket.off("isInBattleQueue");
         socket.off("playersNumber");
         socket.off("playerData");
      };
   }, [socket, setPlayerData]);

   const handleGoToTheBattle = (isInTurn) => {
      socket.emit("addToBattleQueue", isInTurn);
   };

   return (
      <>
         <div>
            {playersNumber ? <div>Активних гравців: {playersNumber}</div> : ""}
            <h1>HOME page</h1>
            {playerData ? <div>Player name: {playerData.name}</div> : ""}
            <br />
            <button onClick={() => handleGoToTheBattle(true)}>Go to the battle</button>
         </div>
         {isInBattleQueue ? <BattleWaitingPopup handleGoToTheBattle={handleGoToTheBattle} /> : ""}
      </>
   );
}