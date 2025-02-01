import React, { useEffect, useState } from "react";

import { RouteProvider } from './context/RouteContext.js';
import { AppProviders } from "./context/AppProviders.js";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Register } from "./Register.js";
import { Login } from "./Login.js";

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
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
         <Routes>
            <Route path="/" element={
               playerId ? (
                  <AppProviders playerId={playerId}>
                     <RouteProvider />
                  </AppProviders>
               ) : null
            }/>
            <Route path="/register" element={<Register/>} />
            <Route path="/login" element={<Login/>} />
         </Routes>
      </Router>
   );
}

export default App;
