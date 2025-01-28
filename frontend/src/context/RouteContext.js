import React, { createContext, useContext, useState } from 'react';

import { Home } from "../Home.js";
import { Battle } from "../components/battle/battle.jsx";
import { MapTest } from "../MapTest.js";
import { MainLoadingScreen } from "../MainLoadingScreen.js";

const RouteContext = createContext(null);

export const useRoute = () => useContext(RouteContext);

export const RouteProvider = ({ children }) => {
   const [screenProps, setScreenProps] = useState(null);
   const [currentScreenName, setCurrentScreenName] = useState('mainLoadingScreen');

   const pages = {
      mainLoadingScreen: (props) => <MainLoadingScreen {...props} />,
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
      : pages.mainLoadingScreen;

   return (
      <RouteContext.Provider value={{ navigateToScreen, currentScreenName }}>
         {CurrentScreen(screenProps)}
         {children}
      </RouteContext.Provider>
   );
};