export function serializeShip(ship, viewerId, viewerTeamIndex) {
   const data = {
      id: ship.id,
      type: ship.type,
      ownerId: ship.ownerId,
      teamIndex: ship.teamIndex,
      length: ship.length,
      centerPosition: ship.centerPosition,
      directionKey: ship.directionKey,
      direction: ship.direction,
      health: ship.health,
      isSpotted: ship.isSpotted,
   };

   if (ship.teamIndex === viewerTeamIndex) {
      Object.assign(data, {
         coreIndex: ship.coreIndex,
         weapons: ship.weapons,
         modules: ship.modules,
         currentSpeedIndex: ship.currentSpeedIndex,
         rudder: ship.rudder,
         availableSpeeds: ship.availableSpeeds,
      });

      //if (ship.ownerId === viewerId) {
      //   Object.assign(data, {
      //   });
      //}
   }

   return data;
}