import { useEffect } from "react";
import { useSocket } from "./context/SocketContext";
import { useRoute } from "./context/RouteContext";

export function Home({ screenProps }) {
   const { navigateToScreen } = useRoute();
   const socket = useSocket();

   useEffect(() => {
      if (!socket) return;

      socket.on("connect", () => {
         console.log("Connected to server with socket ID:", socket.id);
      });
      socket.on("updatePlayers", (data) => {
         console.log(`Гравці:`)
         console.log(data)
      })
      socket.on("helloYou", (data) => {
         console.log(`Саме тобі передається ${data}!`)
      })
      socket.on("helloAll", (data) => {
         console.log(`Всім передається ${data}!`)
      })

      return () => {
         socket.off("connect");
         socket.off("updatePlayers");
         socket.off("helloYou");
         socket.off("helloAll");
      };
   }, [socket]);

   const handleSendId = () => {
      const playerId = "iddi"
      socket.emit('sendId', (playerId))
   }

   const handleChangeCurrentScreen = (screen) => {
      navigateToScreen(screen, { text: "LOL" });
   };

   return (
      <>
         <div>
            <h1>HOME page</h1>
            <button onClick={handleSendId}>Start</button>
            <br />
            <button
               onClick={() => handleChangeCurrentScreen("battle")}
            >
               Go to the battle
            </button>
         </div>
      </>
   );
}