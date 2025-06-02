import { useEffect, useState } from "react";
import { useSocket } from "../../context/SocketContext";
import { useRoute } from "../../routing/RouteContext";
import { BattleLayout } from "./battleLayout";

export function Battle({ text }) {
    const { navigateToPage } = useRoute();
    const socket = useSocket();

    const [battleComment, setBattleComment] = useState("");
    const [battleInfo, setBattleInfo] = useState(null);

    useEffect(() => {
        if (!socket) return;

        socket.on("BattleStarted", (data) => {
            if (data) {
                setBattleComment(data);
            }
        })

        socket.on("UpdateBattleInfo", (data) => {
            if (data){
                setBattleInfo(data)
            }
        })

        socket.on("turnTimeout", (data) => {
            if (data){
                console.log(data);
            }
        })

        return () => {
            socket.off("BattleStarted");
            socket.off("UpdateBattleInfo");
            socket.off("turnTimeout");
        };
    }, [socket, navigateToPage, battleInfo]);

    function handleToHome() {
        navigateToPage("home")
    }

    function sendMove() {
        console.log("Будемо ходити...");
        socket.emit("BattleMove");
    }

    return (
        <BattleLayout 
            handleToHome={handleToHome}
            battleComment={battleComment}
            sendMove={sendMove}
            battleInfo={battleInfo}
        />
    );
}