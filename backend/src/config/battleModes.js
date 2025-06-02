export const battleModes = {
   "1v1_usual": {
      isActive: true,
      modeName: "Usual Battle",
      teams: 2,
      playersInTeam: 1,
      timers: {
         battle: { duration: 10, unit: "moves" },
         turn: { duration: 60, unit: "seconds" }
      }
   }
}