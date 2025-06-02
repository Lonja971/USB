import { useEffect, useState } from "react";
import { useSocket } from "./context/SocketContext";
import { useRoute } from "./routing/RouteContext";
import { useAppData } from "./context/AppData";

import { BattleWaitingPopup } from "./components/BattleWaitingPopup";

export function Home() {
   const { playerData, setPlayerData } = useAppData();
   const { navigateToPage } = useRoute();
   const socket = useSocket();

   const [isInBattleQueue, setIsInBattleQueue] = useState(false);
   const [playersNumber, setPlayersNumber] = useState();

   useEffect(() => {
      if (!playerData?.id) {
         navigateToPage("mainLoadingScreen");
      }
   }, [playerData, navigateToPage, socket]);

   useEffect(() => {
      if (!socket) return;

      socket.emit("subscribePlayersNumber");

      socket.on("updatePlayers", (data) => {
         console.log("Гравці:");
         console.log(data);
      });

      socket.on("queueStatus", (data) => {
         if (data.status === "joined"){
            setIsInBattleQueue(true);
         }
         else if (data.status === "left"){
            setIsInBattleQueue(false);
         }
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

   const handleGoToTheBattle = () => {
      socket.emit("findBattle");
   };

   return (
      <>
         <div>
            {playersNumber ? <div>Active playsers: {playersNumber}</div> : ""}
            <h1>HOME page</h1>
            {playerData ? <div>Player name: {playerData.name}</div> : ""}
            <br />
            <button onClick={() => navigateToPage("testPage", { testProp: "Hiiii" })}>Test page</button>
            <br />
            <button onClick={handleGoToTheBattle}>Go to Battle</button>
         </div>
         {isInBattleQueue ? <BattleWaitingPopup handleGoToTheBattle={handleGoToTheBattle} /> : ""}
      </>
   );
}