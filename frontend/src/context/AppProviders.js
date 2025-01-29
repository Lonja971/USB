import { AppDataProvider } from "./AppData";
import { PlayerDataProvider } from "./PlayerDataContext";
import { SocketProvider } from "./SocketContext";

export const AppProviders = ({ playerId, children }) => {
   return (
      <AppDataProvider>
         <PlayerDataProvider playerId={playerId}>
            <SocketProvider playerId={playerId}>
               {children}
            </SocketProvider>
         </PlayerDataProvider>
      </AppDataProvider>
   );
};