import React, { createContext, useContext, useState } from 'react';

const AppDataContext = createContext(null);

export const useAppData = () => useContext(AppDataContext);

export const AppDataProvider = ({ children }) => {
   const [isMainLoadingScreen, setIsMainLoadingScreen] = useState(true);
   const [mainLoadingScreenMessage, setMainLoadingScreenMessage] = useState(null);
   const [connectionInfo, setConnectionInfo] = useState(null);

   return (
      <AppDataContext.Provider value={{
         mainLoadingScreenMessage,
         setIsMainLoadingScreen,
         isMainLoadingScreen,
         setMainLoadingScreenMessage,
         setConnectionInfo,
         connectionInfo
      }}>
         {children}
      </AppDataContext.Provider>
   );
};