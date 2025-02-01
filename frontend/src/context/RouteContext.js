import React, { createContext, useContext, useState } from 'react';

import { Home } from "../Home.js";
import { Battle } from "../components/battle/battle.jsx";
import { MapTest } from "../MapTest.js";
import { MainLoadingScreen } from "../MainLoadingScreen.js";
import { motion, AnimatePresence } from "framer-motion";
import { useAppData } from './AppData.js';

const RouteContext = createContext(null);

export const useRoute = () => useContext(RouteContext);

export const RouteProvider = () => {
   const [screenProps, setScreenProps] = useState(null);
   const {setIsMainLoadingScreen, isMainLoadingScreen} = useAppData();
   const [currentScreenName, setCurrentScreenName] = useState();

   const pages = {
      home: (props) => <Home {...props} />,
      battle: (props) => <Battle {...props} />,
      mapTest: (props) => <MapTest {...props} />,
   };

   const navigateToScreen = (screenName = 'home', newScreenProps = null) => {
      setCurrentScreenName(screenName);
      setScreenProps(newScreenProps);
   };

   const CurrentScreen = pages[currentScreenName]
      ? pages[currentScreenName]
      : pages.home;

   return (
      <RouteContext.Provider value={{ navigateToScreen, currentScreenName, setIsMainLoadingScreen }}>
         <AnimatePresence>
            {isMainLoadingScreen && (
               <motion.div
                  initial={{ opacity: 1 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, pointerEvents: "none" }}
                  transition={{ duration: 0.5 }}
               >
                  <MainLoadingScreen />
               </motion.div>
            )}
         </AnimatePresence>
         {currentScreenName ? CurrentScreen(screenProps) : ""}
      </RouteContext.Provider>
   );
};