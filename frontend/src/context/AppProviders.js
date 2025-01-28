import { PlayerDataProvider } from "./PlayerDataContext";
import { SocketProvider } from "./SocketContext";

export const AppProviders = ({ playerId, children }) => {
   return (
      <SocketProvider playerId={playerId}>
         <PlayerDataProvider playerId={playerId}>
            {children}
         </PlayerDataProvider>
      </SocketProvider>
   );
};