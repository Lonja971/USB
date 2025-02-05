import { AppDataProvider } from "./AppData";
import { PlayerDataProvider } from "./PlayerDataContext";
import { SocketProvider } from "./SocketContext";

export const AppProviders = ({ playerIdentifier, children }) => {
   return (
      <AppDataProvider>
         <PlayerDataProvider>
            <SocketProvider playerIdentifier={playerIdentifier}>
               {children}
            </SocketProvider>
         </PlayerDataProvider>
      </AppDataProvider>
   );
};