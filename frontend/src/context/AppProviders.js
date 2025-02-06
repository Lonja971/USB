import { AppDataProvider } from "./AppData";
import { PlayerDataProvider } from "./PlayerDataContext";
import { SocketProvider } from "./SocketContext";

export const AppProviders = ({ playerToken, children }) => {
   return (
      <AppDataProvider>
         <PlayerDataProvider>
            <SocketProvider playerToken={playerToken}>
               {children}
            </SocketProvider>
         </PlayerDataProvider>
      </AppDataProvider>
   );
};