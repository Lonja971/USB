import { useEffect } from "react";
import { useRoute } from "./context/RouteContext";
import { useSocket } from "./context/SocketContext";
import "./css/loading_screen.css"
import { usePlayerData } from "./context/PlayerDataContext";
import { useAppData } from "./context/AppData";
import { MainLoadingLayout } from "./components/uikit/main-loading-layout";

export function MainLoadingScreen(){
   const { navigateToScreen, setIsMainLoadingScreen } = useRoute();
   const socket = useSocket();
   const {setPlayerData} = usePlayerData();
   const {mainLoadingScreenMessage, connectionInfo} = useAppData();

   useEffect(() => {
      if (!socket) return;
         socket.on("playerData", (data) => {
            console.log(data);
            setPlayerData((prevPlayerData) => ({
               ...prevPlayerData,
               data: data,
            }));
            navigateToScreen('home', {isUpdatePlayerData: true});
            setIsMainLoadingScreen(false);
         });
      return () => {
         socket.off("playerData");
      };
   }, [socket, navigateToScreen, setPlayerData, setIsMainLoadingScreen]);

   return(
      <MainLoadingLayout connectionInfo={connectionInfo} mainLoadingScreenMessage={mainLoadingScreenMessage}/>
   )
}