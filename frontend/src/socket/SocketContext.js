import React, { createContext, useContext, useEffect, useRef } from 'react';
import { io } from "socket.io-client";

const SocketContext = createContext(null);

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children, playerId }) => {
  const socket = useRef(null);

  useEffect(() => {
    if (playerId){
      socket.current = io(
        'http://localhost:3002', {
          auth: {
            playerId: playerId
          }
        }
      );

      socket.current.on('connect', () => {
        console.log('Socket connected:', socket.current);
      });
  
      return () => {
        socket.current.disconnect();
      };
    }
  }, [playerId]);

  return (
    <SocketContext.Provider value={socket.current}>
      {children}
    </SocketContext.Provider>
  );
};