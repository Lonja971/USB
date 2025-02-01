import { useEffect, useState } from "react";
import { useSocket } from "./context/SocketContext";
import { useRoute } from "./context/RouteContext";
import { usePlayerData } from "./context/PlayerDataContext";
import { motion, AnimatePresence } from "framer-motion";

import { BattleWaitingPopup } from "./components/BattleWaitingPopup";
import { MainLoadingLayout } from "./components/uikit/main-loading-layout";

export function Home({ isUpdatePlayerData = true }) {
   const { playerData, setPlayerData } = usePlayerData();
   const { navigateToScreen } = useRoute();
   const socket = useSocket();
   
   const [isPlayerDataLoaded, setIsPlayerDataLoaded] = useState(!isUpdatePlayerData);
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
         console.log(`Гравці:`)
         console.log(data)
      });
      socket.on("isInBattleQueue", (data) => {
         setIsInBattleQueue(data.status);
      });
      socket.on("playersNumber", (number) => {
         setPlayersNumber(number)
      });
      socket.on("playerData", (data) => {
         setPlayerData((prevPlayerData) => ({
            ...prevPlayerData,
            data: data,
         }))
         setIsPlayerDataLoaded(true);
      });

      return () => {
         socket.emit("unsubscribePlayersNumber");

         socket.off("updatePlayers");
         socket.off("isInBattleQueue");
         socket.off("playersNumber");
         socket.off("playerData");
      };
   }, [socket, setPlayerData]);

   useEffect(() => {
      if (isUpdatePlayerData){
         socket.emit('getPlayerData');
      }
   }, [isUpdatePlayerData, socket]);

   const handleGoToTheBattle = (isInTurn) => {
      socket.emit('addToBattleQueue', isInTurn);
   }

   return (
      <>
         {!isPlayerDataLoaded ? (
            <AnimatePresence>
               <motion.div
                  initial={{ opacity: 1 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, pointerEvents: "none" }}
                  transition={{ duration: 0.5 }}
               >
                  <MainLoadingLayout/>
               </motion.div>
            </AnimatePresence>
         ) : ""}
         <div>
            {playersNumber ? (
               <div>Активних гравців: {playersNumber}</div>
            ) : ""}
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