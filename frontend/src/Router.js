import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useSocket } from "./context/SocketContext.js";
import { usePlayer } from "./context/PlayerDataContext.js";

import { Home } from "./Home";
import { Battle } from "./components/battle/battle.jsx";
import { MapTest } from "./MapTest.js";
import { LoadingScreen } from "./components/uikit/loading-screen.jsx";

export function Router() {
   const socket = useSocket();
   const { playerData, setPlayerData } = usePlayer();
   const [currentScreen, setCurrentScreen] = useState('loadingScreen');
   const [loadingScreenMessage, setLoadingScreenMessage] = useState(null);
   const pages = {
      loadingScreen: <LoadingScreen message={loadingScreenMessage} />,
      home: <Home navigateTo={navigateTo} />,
      battle: <Battle navigateTo={navigateTo} />,
      mapTest: <MapTest />,
   };

   function addMessageToLoadingScreen(message) {
      if (setCurrentScreen !== "loadingScreen") {
         setCurrentScreen("loadingScreen")
      }
      setLoadingScreenMessage(message)
   }

   function navigateTo(screen) {
      setCurrentScreen(pages[screen] ? screen : 'home');
   };

   useEffect(() => {
      if (!socket) return;

      socket.on("playerAlreadyPlaying", (data) => {
         console.log(data);
         addMessageToLoadingScreen(data);
      });

      socket.on("playerData", (data) => {
         console.log(data);
         setPlayerData((prevPlayerData) => ({
            ...prevPlayerData,
            data: data,
         }));
         navigateTo("home")
      });

      return () => {
         socket.off("playerAlreadyPlaying");
         socket.off("playerData");
      };
   }, [socket, setPlayerData]);

   console.log(playerData)

   return (
      <>
         {pages[currentScreen]}
         {playerData && playerData.data && playerData.data.name ? playerData.data.name : ""}
      </>
   );
}