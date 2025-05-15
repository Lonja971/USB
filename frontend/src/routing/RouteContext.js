import { createContext, useContext, useState, useMemo } from 'react';

import { useAppData } from '../context/AppData.js';
import { DEFAULT_SCREEN, PAGES } from "./routes.js";
import { LoadingOverlay } from './LoadingOverlay.js';

/**
 * @typedef {Object} ScreenProps
 * @property {string} [example] - Example prop. Replace with real props used in screens.
 */

/**
 * @typedef {Object} RouteContextValue
 * @property {string} currentScreenName - The name of the currently active screen.
 * @property {ScreenProps | null} screenProps - Props that are passed to the active screen.
 * @property {(screenName: string, newScreenProps?: ScreenProps) => void} navigateToPage - Function for switching between screens.
 * @property {(isLoading: boolean) => void} setIsMainLoadingScreen - Function for displaying/hiding the loading screen.
 */

const RouteContext = createContext({
   currentScreenName: DEFAULT_SCREEN,
   screenProps: null,
   navigateToPage: () => { },
   setIsMainLoadingScreen: () => { },
});

export const useRoute = () => useContext(RouteContext);

export const RouteProvider = ({ children }) => {
   const [currentScreenName, setCurrentScreenName] = useState(DEFAULT_SCREEN);
   const [screenProps, setScreenProps] = useState(null);
   const { isMainLoadingScreen, setIsMainLoadingScreen } = useAppData();

   /**
    * @param {string} screenName
    * @param {ScreenProps} [newScreenProps]
    */
   const navigateToPage = (screenName = null, newScreenProps = null) => {
      if (screenName === null || !PAGES[screenName]) {
         setCurrentScreenName(DEFAULT_SCREEN);
         setScreenProps(null);
      } else {
         setCurrentScreenName(screenName);
         setScreenProps(newScreenProps);
      }
   };

   const CurrentScreen = useMemo(() => {
      return PAGES[currentScreenName] || PAGES[DEFAULT_SCREEN];
   }, [currentScreenName]);

   return (
      <RouteContext.Provider value={{
         currentScreenName,
         screenProps,
         navigateToPage,
         setIsMainLoadingScreen,
      }}
      >
         {children}
         <LoadingOverlay isVisible={isMainLoadingScreen} />
         <CurrentScreen {...screenProps} />
      </RouteContext.Provider>
   );
};