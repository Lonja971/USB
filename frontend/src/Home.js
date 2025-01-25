import { useEffect } from "react";
import { useSocket } from "./socket/SocketContext";

export function Home({ navigateTo, playerId }) {

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

  return (
    <>
      <div>
        <h1>HOME page</h1>
        <button onClick={handleSendId}>Start</button>
        <br />
        <button
          onClick={() => navigateTo("battle")}
        >
          Go to the battle
        </button>
      </div>
    </>
  );
}
