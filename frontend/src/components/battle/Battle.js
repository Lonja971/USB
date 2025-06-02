import { useEffect, useState } from "react";
import { useSocket } from "../../context/SocketContext";
import { useRoute } from "../../routing/RouteContext";
import { BattleLayout } from "./battleLayout";

export function Battle({ text }) {
    const { navigateToPage } = useRoute();
    const socket = useSocket();

    const [battleComment, setBattleComment] = useState("");

    useEffect(() => {
        if (!socket) return;

        socket.on("BattleStarted", (data) => {
            if (data) {
                setBattleComment(data);
            }
        })

        return () => {
            socket.off("getPlayersNumInQueue");
        };
    }, [socket, navigateToPage]);

    function handleToHome() {
        navigateToPage("home")
    }

    function sendMove() {
        console.log("Будемо ходити...");
        socket.emit("BattleMove");
    }

    return (
        <BattleLayout handleToHome={handleToHome} battleComment={battleComment} sendMove={sendMove}/>
    );
}