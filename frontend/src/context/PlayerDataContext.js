import React, { createContext, useContext, useState } from 'react';

const PlayerContext = createContext(null);

export const usePlayerData = () => useContext(PlayerContext);

export const PlayerDataProvider = ({ children }) => {
   const [playerData, setPlayerData] = useState({});
   const [isMainLoadingScreen, setIsMainLoadingScreen] = useState(true);
   const [mainLoadingScreenMessage, setMainLoadingScreenMessage] = useState(null);

   return (
      <PlayerContext.Provider value={{ playerData, setPlayerData, mainLoadingScreenMessage, setIsMainLoadingScreen, isMainLoadingScreen, setMainLoadingScreenMessage }}>
         {children}
      </PlayerContext.Provider>
   );
};