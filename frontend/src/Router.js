import React, { useState } from "react";
import { useSocket } from "./socket/SocketContext";

import { Home } from "./Home";
import { Battle } from "./components/battle/battle.jsx";
import { MapTest } from "./MapTest.js";

export function Router({ playerId }) {
   const socket = useSocket();
   const [currentScreen, setCurrentScreen] = useState('home');
 
   const handleSendId = () => {
      if (socket) {
         const playerId = "iddi"
         socket.emit('sendId', (playerId))
      }
   };

   const pages = {
      home: <Home navigateTo={navigateTo} playerId={playerId} />,
      battle: <Battle navigateTo={navigateTo} />,
      mapTest: <MapTest />,
   };

   function navigateTo(screen) {
      setCurrentScreen(pages[screen] ? screen : 'home');
   }
 
   return (
      <>
         <button onClick={handleSendId}>Це</button>
         {pages[currentScreen]}
      </>
   );
 }