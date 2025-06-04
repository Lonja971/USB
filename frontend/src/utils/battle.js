export const getEntityParts = (entity) => {
  const { x, y, length, direction, coreIndex } = entity;
  const parts = [];

  for (let i = 0; i < length; i++) {
    parts.push({
      x: x + i * direction.dx,
      y: y + i * direction.dy,
      isCore: i === coreIndex,
      isNose: i === 0,
      entity,
    });
  }

  return parts;
};

export const directionKeys = [
   "right",
   "diag_nw",
   "up",
   "diag_ne",
   "left",
   "diag_se",
   "down",
   "diag_sw"
];

export const directionsMap = {
  left:  { dx: 1, dy: 0, name: "←" },
  right:   { dx: -1, dy: 0, name: "→" },
  down:   { dx: 0, dy: -1, name: "↓" },
  up:     { dx: 0, dy: 1, name: "↑" },
  diag_ne: { dx: 1, dy: 1, name: "↖" },
  diag_se: { dx: 1, dy: -1, name: "↙" },
  diag_nw: { dx: -1, dy: 1, name: "↗" },
  diag_sw: { dx: -1, dy: -1, name: "↘" }
};

export function getShipBlocks(x, y, directionKey, length) {
  const dir = directionsMap[directionKey];
  if (!dir) throw new Error("Unknown direction");

  const half = Math.floor(length / 2);
  const blocks = [];

  for (let i = -half; i <= half; i++) {
    if (blocks.length >= length) break;

    blocks.push({
      x: x + dir.dx * i,
      y: y + dir.dy * i,
    });
  }

  return blocks;
}

export function turnLeft(current) {
   const index = directionKeys.indexOf(current);
   return directionKeys[(index + 1) % directionKeys.length];
}

export function turnRight(current) {
   const index = directionKeys.indexOf(current);
   return directionKeys[(index + directionKeys.length - 1) % directionKeys.length];
}

export function predictShipMovement(ship, update) {
   let direction = ship.directionKey;
   if (update.turnTo === "left") direction = turnLeft(direction);
   if (update.turnTo === "right") direction = turnRight(direction);

   const speedIndex = update.currentSpeedIndex ?? ship.currentSpeedIndex;
   const speed = ship.availableSpeeds[speedIndex];
   const offset = directionsMap[direction];

   const dx = offset.dx * speed;
   const dy = offset.dy * speed;

   return {
      ...ship,
      directionKey: direction,
      centerPosition: {
         x: ship.centerPosition.x - dx,
         y: ship.centerPosition.y - dy
      }
   };
}