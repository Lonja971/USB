import { useState, useEffect } from "react";
import { useSocket } from "../context/SocketContext";
import { useRoute } from "../routing/RouteContext";

import "../css/battle_waiting_window.css"

export function BattleWaitingPopup({ handleGoToTheBattle }) {
   const socket = useSocket();
   const { navigateToPage } = useRoute();
   const [playersNumInQueue, setPlayersNumInQueue] = useState(null);

   useEffect(() => {
      if (!socket) return;

      socket.on("getPlayersNumInQueue", (num) => {
         setPlayersNumInQueue(num);
      })
      socket.on("BattleFound", (status) => {
         if (status) {
            navigateToPage("battle");
         }
      })

      return () => {
         socket.off("getPlayersNumInQueue");
      };
   }, [socket, navigateToPage]);


   return (
      <BattleWaitingPopupLayout handleGoToTheBattle={handleGoToTheBattle} playersNumInQueue={playersNumInQueue} />
   )
}

function BattleWaitingPopupLayout({ handleGoToTheBattle, playersNumInQueue }) {
   return (
      <div className="waiting">
         <div>
            Чекаємо на битву
         </div>
         <div>
            Гравців в черзі: {playersNumInQueue ? playersNumInQueue : "-"}
         </div>
         <button onClick={() => handleGoToTheBattle(false)}>вийти</button>
      </div>
   );
}