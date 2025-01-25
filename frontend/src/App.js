import React, { useEffect, useState } from "react";

import { Router } from './Router.js';
import { SocketProvider } from './socket/SocketContext.js';

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
    <SocketProvider playerId={playerId}>
      {<Router playerId={playerId}/>}
    </SocketProvider>
  );
}

export default App;