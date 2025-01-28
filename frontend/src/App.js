import React, { useEffect, useState } from "react";

import { RouteProvider } from './context/RouteContext.js';
import { AppProviders } from "./context/AppProviders.js";

function App() {
   const [playerId, setPlayerId] = useState();

   useEffect(() => {
      let playerIdStorage = JSON.parse(localStorage.getItem('usb_player_id'))

      if (!playerIdStorage) {
         playerIdStorage = Math.floor(10000 + Math.random() * 90000).toString();
         localStorage.setItem("usb_player_id", playerIdStorage);
      }

      setPlayerId(playerIdStorage)
   }, [])

   return (
      <>
         {playerId ? (
            <AppProviders playerId={playerId}>
               <RouteProvider />
            </AppProviders>
         ) : ""}
      </>
   );
}

export default App;
