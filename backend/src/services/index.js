import { serializeShip } from "./shipSerializer.js";

const serializers = {
   ship: serializeShip
};

export function serializeEntity(entity, viewerId, viewerTeamIndex) {
   const fn = serializers[entity.classType];
   return fn ? fn(entity, viewerId, viewerTeamIndex) : null;
}