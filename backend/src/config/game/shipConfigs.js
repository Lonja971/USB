import { Battleship } from "../../game/entities/ships/Battleship.js";
import { Submarine } from "../../game/entities/ships/Submarine.js";
import { Cruiser } from "../../game/entities/ships/Cruiser.js";
import { weaponTypes } from "./weaponTypes.js";
import { moduleTypes } from "./moduleTypes.js";

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
      modules: [
         {
            type: "locator",
            classRef: moduleTypes.locator,
            positionOffset: 2,
            options: {
               radius: 10
            }
         },
      ],
      availableSpeeds : [-1, 0, 1, 2],
      speedsNullpoint: 1,
      weapons: [
         { type: "cannon", classRef: weaponTypes.cannon, positionOffset: -1 }
      ]
   },
   Submarine: {
      classRef: Submarine,
      health: 3,
      length: 3,
      coreIndex: 0,
      availableSpeeds : [-1, 0, 1, 2],
      speedsNullpoint: 1,
      modules: [
         {
            type: "locator",
            classRef: moduleTypes.locator,
            positionOffset: 0,
            options: {
               radius: 20
            }
         }
      ],
      weapons: [
         { type: "torpedo", classRef: weaponTypes.torpedo, positionOffset: -1 }
      ]
   },
   Cruiser: {
      classRef: Cruiser,
      health: 3,
      length: 4,
      coreIndex: 1,
      availableSpeeds : [-1, 0, 1, 2],
      speedsNullpoint: 1,
      modules: [
         {
            type: "locator",
            classRef: moduleTypes.locator,
            positionOffset: 1,
            options: {
               radius: 25
            }
         },
      ],
      weapons: [
         { type: "cannon", classRef: weaponTypes.cannon, positionOffset: -1 }
      ]
   },
};