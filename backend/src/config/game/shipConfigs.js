import { Battleship } from "../../game/entities/ships/Battleship.js";
import { Submarine } from "../../game/entities/ships/Submarine.js";
import { Cruiser } from "../../game/entities/ships/Cruiser.js";
import { Destroyer } from "../../game/entities/ships/Destroyer.js";
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
      name: "Лінкор",
      classRef: Battleship,
      health: 5,
      length: 5,
      coreIndex: 2,
      detectionRadius: 10,
      modules: [],
      availableSpeeds : [-1, 0, 1, 2],
      maneuverPoints: 3,
      maneuverCosts: {
         moveForward: 1,
         turn: 2
      },
      speedsNullPointIndex: 1,
      weapons: [
         { type: "cannon", classRef: weaponTypes.cannon, positionOffset: 1 },
         { type: "cannon", classRef: weaponTypes.cannon, positionOffset: 2 },
         { type: "cannon", classRef: weaponTypes.cannon, positionOffset: 4 },
         { type: "cannon", classRef: weaponTypes.cannon, positionOffset: 5 },
      ]
   },
   Cruiser: {
      name: "Крейсер",
      classRef: Cruiser,
      health: 3,
      length: 4,
      coreIndex: 2,
      detectionRadius: 10,
      availableSpeeds : [-1, 0, 1, 2],
      maneuverPoints: 5,
      maneuverCosts: {
         moveForward: 1,
         turn: 2
      },
      speedsNullPointIndex: 1,
      modules: [],
      weapons: [
         { type: "cannon", classRef: weaponTypes.cannon, positionOffset: 1 },
      ]
   },
   Destroyer: {
      name: "Есмінець",
      classRef: Destroyer,
      health: 4,
      length: 3,
      coreIndex: 0,
      detectionRadius: 10,
      availableSpeeds : [-1, 0, 1, 2, 3],
      speedsNullPointIndex: 1,
      maneuverPoints: 5,
      maneuverCosts: {
         moveForward: 1,
         turn: 2
      },
      modules: [],
      weapons: [
         { type: "cannon", classRef: weaponTypes.cannon, positionOffset: 1 },
      ]
   },
   Submarine: {
      name: "Підводний човен",
      classRef: Submarine,
      health: 3,
      length: 3,
      coreIndex: 0,
      detectionRadius: 10,
      availableSpeeds : [-1, 0, 1, 2],
      speedsNullPointIndex: 1,
      maneuverPoints: 5,
      maneuverCosts: {
         moveForward: 1,
         turn: 2
      },
      modules: [],
      weapons: [
         { type: "TorpedoLauncher", classRef: weaponTypes.TorpedoLauncher, positionOffset: 1 },
      ]
   },
};