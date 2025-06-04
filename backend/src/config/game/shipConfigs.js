import { Battleship } from "../../game/entities/ships/Battleship.js";
import { Submarine } from "../../game/entities/ships/Submarine.js";
import { Cruiser } from "../../game/entities/ships/Cruiser.js";
import { weaponTypes } from "./weaponTypes.js";

export const DIRECTION = {
   right:   { dx: -1, dy: 0, name: "→" },
   diag_nw: { dx: -1, dy: 1, name: "↗" },
   up:     { dx: 0, dy: 1, name: "↑" },
   diag_ne: { dx: 1, dy: 1, name: "↖" },
   left:  { dx: 1, dy: 0, name: "←" },
   diag_se: { dx: 1, dy: -1, name: "↙" },
   down:   { dx: 0, dy: -1, name: "↓" },
   diag_sw: { dx: -1, dy: -1, name: "↘" }
};

export const DIRECTION_KEYS = [
   "right",
   "diag_nw",
   "up",
   "diag_ne",
   "left",
   "diag_se",
   "down",
   "diag_sw"
];

export const shipConfigs = {
   Battleship: {
      classRef: Battleship,
      health: 5,
      length: 5,
      coreIndex: 2,
      availableSpeeds : [-1, 0, 1, 2],
      weapon: {type: "cannon", classRef: weaponTypes.cannon}
   },
   Submarine: {
      classRef: Submarine,
      health: 3,
      length: 3,
      coreIndex: 0,
      availableSpeeds : [-1, 0, 1, 2],
      weapon: {type: "torpedo", classRef: weaponTypes.torpedo}
   },
   Cruiser: {
      classRef: Cruiser,
      health: 3,
      length: 4,
      coreIndex: 1,
      availableSpeeds : [-1, 0, 1, 2],
      weapon: {type: "cannon", classRef: weaponTypes.cannon}
   },
};