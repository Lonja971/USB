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
      socket.emit("addToBattleQueue", { playerBattleMode: "1v1_usual", isInTurn });
   };

   return (
      <>
         <div>
            {playersNumber ? <div>Active playsers: {playersNumber}</div> : ""}
            <h1>HOME page</h1>
            {playerData ? <div>Player name: {playerData.name}</div> : ""}
            <br />
            <button onClick={() => navigateToPage("testPage", { testProp: "Hiiii" })}>Test page</button>
         </div>
         {isInBattleQueue ? <BattleWaitingPopup handleGoToTheBattle={handleGoToTheBattle} /> : ""}
      </>
   );
}