import { useEffect } from "react";
import { useRoute } from "./routing/RouteContext";
import { useSocket } from "./context/SocketContext";
import "./css/loading_screen.css"
import { useAppData } from "./context/AppData";
import { MainLoadingLayout } from "./components/uikit/main-loading-layout";

export function MainLoadingScreen() {
   const { navigateToPage, setIsMainLoadingScreen } = useRoute();
   const socket = useSocket();
   const { setPlayerData } = useAppData();
   const { mainLoadingScreenMessage, connectionInfo } = useAppData();

   useEffect(() => {
      if (!socket) return;
      socket.on("playerData", (data) => {
         console.log(data);
         setPlayerData(data);
         navigateToPage('home');
         setIsMainLoadingScreen(false);
      });
      return () => {
         socket.off("playerData");
      };
   }, [socket, navigateToPage, setPlayerData, setIsMainLoadingScreen]);

   return (
      <MainLoadingLayout connectionInfo={connectionInfo} mainLoadingScreenMessage={mainLoadingScreenMessage} />
   )
}