import { Battleship } from "../../game/entities/ships/Battleship.js";
import { Submarine } from "../../game/entities/ships/Submarine.js";
import { weaponTypes } from "./weaponTypes.js";

export const DIRECTION = {
  RIGHT:  { dx: 1, dy: 0, name: "→" },
  LEFT:   { dx: -1, dy: 0, name: "←" },
  DOWN:   { dx: 0, dy: 1, name: "↓" },
  UP:     { dx: 0, dy: -1, name: "↑" },
  DIAG_NE: { dx: 1, dy: -1, name: "↗" },
  DIAG_SE: { dx: 1, dy: 1, name: "↘" },
  DIAG_NW: { dx: -1, dy: -1, name: "↖" },
  DIAG_SW: { dx: -1, dy: 1, name: "↙" }
};

export const shipConfigs = {
    Battleship: {
        classRef: Battleship,
        health: 5,
        length: 5,
        coreIndex: 2,
        speed: 1,
        weapon: {type: "cannon", classRef: weaponTypes.cannon}
    },
    Submarine: {
        classRef: Submarine,
        health: 3,
        length: 3,
        coreIndex: 1,
        speed: 2,
        weapon: {type: "torpedo", classRef: weaponTypes.torpedo}
    },
    };