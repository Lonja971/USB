import React, { createContext, useContext, useState } from 'react';

const PlayerContext = createContext(null);

export const usePlayer = () => useContext(PlayerContext);

export const PlayerDataProvider = ({ children, playerId }) => {
   const [playerData, setPlayerData] = useState({
      id: playerId
   });

   return (
      <PlayerContext.Provider value={{ playerData, setPlayerData }}>
         {children}
      </PlayerContext.Provider>
   );
};