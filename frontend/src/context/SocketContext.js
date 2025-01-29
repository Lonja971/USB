import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { io } from "socket.io-client";
import { useAppData } from './AppData';

const SocketContext = createContext(null);

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children, playerId }) => {
   const socketRef = useRef(null);
   const { setMainLoadingScreenMessage, setIsMainLoadingScreen, setConnectionInfo } = useAppData();
   const [socket, setSocket] = useState(null);

   useEffect(() => {
      if (playerId) {
         socketRef.current = io('http://localhost:3002', {
            auth: {
               playerId,
            },
         });

         setSocket(socketRef.current);

         return () => {
            socketRef.current.disconnect();
            setSocket(null);
         };
      }
   }, [playerId]);

   //---ПЕРЕВІРКА-НАЯВНОСТІ-ПРОБЛЕМ-З-ПІДКЛЮЧЕННЯМ---
   useEffect(() => {
      if (!socket) return;
         socket.on("connect_error", (err) => {
            setMainLoadingScreenMessage("Сервер не відповідає");
            setIsMainLoadingScreen(true);
         });
         socket.on("disconnectReason", (data) => {
            setMainLoadingScreenMessage(data);
            setIsMainLoadingScreen(true);
         });
         socket.on("disconnect", (reason) => {
            setConnectionInfo(`Socket disconnected: ${reason}`);
            setIsMainLoadingScreen(true);
         });
      return () => {
         socket.off("playerAlreadyPlaying");
         socket.off("disconnect");
         socket.off("connect_error");
      };
   }, [socket, setIsMainLoadingScreen, setMainLoadingScreenMessage, setConnectionInfo]);

   return (
      <SocketContext.Provider value={socket}>
         {children}
      </SocketContext.Provider>
   );
};