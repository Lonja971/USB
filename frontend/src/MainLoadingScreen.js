import { useEffect, useState } from "react";
import { useRoute } from "./context/RouteContext";
import { useSocket } from "./context/SocketContext";
import "./css/loading_screen.css"
import { usePlayerData } from "./context/PlayerDataContext";

export function MainLoadingScreen(){
   const [message, setMessage] = useState("");
   const { navigateToScreen } = useRoute();
   const socket = useSocket();
   const {setPlayerData} = usePlayerData();

   useEffect(() => {
      if (!socket) return;
      socket.on("playerAlreadyPlaying", (data) => {
         console.log(data);
         setMessage(data)
      });
      socket.on("playerData", (data) => {
         console.log(data);
         setPlayerData((prevPlayerData) => ({
            ...prevPlayerData,
            data: data,
         }));
         navigateToScreen("home")
      });
      return () => {
         socket.off("playerAlreadyPlaying");
         socket.off("playerData");
      };
   }, [socket, navigateToScreen, setPlayerData]);

   return(
      <div className="loading__container">
         <div className="">Ultimate Sea Battle</div>
         <div className="loading__content">
            <div className="loading__message">
               {message ?
                  <p>{message}</p>
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