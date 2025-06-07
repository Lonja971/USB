export const battleModes = {
    "1v1_usual": {
        isActive: true,
        modeName: "Usual Battle",
        teams: 2,
        playersInTeam: 1,
        mapSize: {
            x: 30,
            y: 30
        },
        playerShips: [
            { type: "Battleship" },
            //{ type: "Destroyer" },
            //{ type: "Submarine"},
            { type: "Cruiser"},
        ],

        timers: {
            battle: { duration: 10, unit: "moves" },
            turn: { duration: 60, unit: "seconds" }
        }
    }
}