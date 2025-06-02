import { CannonStrategy } from "../../game/weapons/CannonStrategy.js";
import { TorpedoStrategy } from "../../game/weapons/TorpedoStrategy.js";

export const weaponTypes = {
    cannon: CannonStrategy,
    torpedo: TorpedoStrategy,
};