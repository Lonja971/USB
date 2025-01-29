import { useEffect } from "react";
import { useRoute } from "./context/RouteContext";
import { useSocket } from "./context/SocketContext";
import "./css/loading_screen.css"
import { usePlayerData } from "./context/PlayerDataContext";
import { useAppData } from "./context/AppData";

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
            navigateToScreen("home");
            setIsMainLoadingScreen(false);
         });
      return () => {
         socket.off("playerData");
      };
   }, [socket, navigateToScreen, setPlayerData, setIsMainLoadingScreen]);

   return(
      <div className="loading__container">
         <div className="">Ultimate Sea Battle</div>
         <div className="loading__content">
            <div className="loading__message">
               {mainLoadingScreenMessage ?
                  <p>{mainLoadingScreenMessage}</p>
                  : ""
               }
               {connectionInfo ?
                  <p>{connectionInfo}</p>
                  : ""
               }
            </div>
            <div className="loading__content-loader">
               <div className="loader"></div>
            </div>
         </div>
      </div>
   )
}