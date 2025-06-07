import { serializeShip } from "./shipSerializer.js";

const serializers = {
   ship: serializeShip
};

export function serializeEntity(entity, viewerId, viewerTeamIndex) {
   const fn = serializers[entity.type];
   return fn ? fn(entity, viewerId, viewerTeamIndex) : null;
}