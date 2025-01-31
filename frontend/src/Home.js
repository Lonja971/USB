import { useEffect, useState } from "react";
import { useSocket } from "./context/SocketContext";
import { useRoute } from "./context/RouteContext";
import { usePlayerData } from "./context/PlayerDataContext";

import { BattleWaitingPopup } from "./components/BattleWaitingPopup";

export function Home() {
   const { playerData } = usePlayerData();
   const { navigateToScreen } = useRoute();
   const socket = useSocket();
   
   const [playersNumber, setPlayersNumber] = useState();
   const [isInBattleQueue, setIsInBattleQueue] = useState(false);

   useEffect(() => {
      if (!playerData?.id) {
         navigateToScreen("mainLoadingScreen");
      }
   }, [playerData, navigateToScreen])

   useEffect(() => {
      if (!socket) return;

      socket.on("updatePlayers", (data) => {
         console.log(`Гравці:`)
         console.log(data)
      })
      socket.on("isInBattleQueue", (data) => {
         setIsInBattleQueue(data.status);
      })
      socket.on("playersNumber", (number) => {
         setPlayersNumber(number)
      });

      return () => {
         socket.off("updatePlayers");
         socket.off("isInBattleQueue");
         socket.off("playersNumber");
      };
   }, [socket]);

   const handleGoToTheBattle = (isInTurn) => {
      socket.emit('addToBattleQueue', isInTurn);
   }

   return (
      <>
         <div>
            <div>Активних гравців: {playersNumber}</div>
            <h1>HOME page</h1>
            { playerData?.data ? (
               <div>Player name: {playerData.data.name}</div>
            ) : ""}
            <br />
            <button
               onClick={() => handleGoToTheBattle(true)}
            >
               Go to the battle
            </button>
         </div>
         {isInBattleQueue ? (
            <BattleWaitingPopup handleGoToTheBattle={handleGoToTheBattle}/>
         ) : ""}
      </>
   );
}