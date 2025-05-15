import { AppDataProvider } from "./AppData";
import { SocketProvider } from "./SocketContext";

export const AppProviders = ({ playerToken, children }) => {
   return (
      <AppDataProvider>
         <SocketProvider playerToken={playerToken}>
            {children}
         </SocketProvider>
      </AppDataProvider>
   );
};