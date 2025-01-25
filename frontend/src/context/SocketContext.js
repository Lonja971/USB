import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { io } from "socket.io-client";

const SocketContext = createContext(null);

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children, playerId }) => {
   const socketRef = useRef(null);
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

   return (
      <SocketContext.Provider value={socket}>
         {children}
      </SocketContext.Provider>
   );
};