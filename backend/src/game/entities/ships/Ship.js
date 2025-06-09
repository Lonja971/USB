import { DIRECTION, DIRECTION_KEYS } from "../../../config/game/shipConfigs.js";

export class Ship {
   constructor({
      id, name, ownerId, teamIndex, x = null, y = null, type,
      speedsNullPointIndex, health, length,
      availableSpeeds, maneuverPoints, maneuverCosts,
      coreIndex, detectionRadius, direction,
      configModules = [], configWeapons = []
   }) {
      this.id = id;
      this.name = name;
      this.classType = "ship";
      this.type = type;
      this.ownerId = ownerId;
      this.teamIndex = teamIndex;

      this.length = length;
      this.centerPosition = {
         x: x,
         y: y
      },
      this.directionKey = direction;
      this.direction = DIRECTION[this.directionKey];
      this.coreIndex = coreIndex;
      this.detectionRadius = detectionRadius;

      this.availableSpeeds = availableSpeeds;
      this.maneuverPoints = maneuverPoints;
      this.maneuverCosts = maneuverCosts;
      this.speedsNullPointIndex = speedsNullPointIndex;
      this.rudder = "center";
      this.currentSpeedIndex = this.speedsNullPointIndex;
      this.health = health;

      this.defaultSpottingDuration = 4;

      this.weapons = {};
      this.modules = [];

      if (Array.isArray(configModules)) {
         configModules.forEach(({ type, classRef, positionOffset = null, options = null }) => {
            const moduleInstance = new classRef({
               data: {
                  type,
                  entityId: this.id,
                  positionOffset,
               },
               ...(options ?? {})
            });
            this.modules.push(moduleInstance);
         });
      }
      if (Array.isArray(configWeapons)) {
         configWeapons.forEach(({ type, name, classRef, positionOffset, options = null }, index) => {
            const weaponId = `${type}-${index}`;
            const weaponInstance = new classRef({
               data: {
                  id: weaponId,
                  name,
                  type,
                  entityId: this.id,
                  teamIndex: this.teamIndex,
                  ownerId: this.ownerId,
                  positionOffset,
               },
               ...(options ?? {})
            });

            this.weapons[weaponId] = weaponInstance;
         });
      }
   }

   setPosition(xPos, yPos) {
      this.centerPosition = {
         x: xPos,
         y: yPos
      };
   }

   getSegments() {
      const segments = [];
      const half = Math.floor(this.length / 2);

      for (let i = -half; i <= half; i++) {
         segments.push({
            x: this.centerPosition.x + i * this.direction.dx,
            y: this.centerPosition.y + i * this.direction.dy
         });
      }

      return segments;
   }

   getCurrentSpeed() {
      return this.availableSpeeds[this.currentSpeedIndex];
   }

   updateFromPlayer(data) {
      if (data.currentSpeedIndex !== undefined) {
         this.currentSpeedIndex = this.availableSpeeds[data.currentSpeedIndex] ? data.currentSpeedIndex : 1;
      }

      if (data.turnTo !== undefined) {
         this.rudder = data.turnTo;
      }
   }

   applyTurn(turn) {
      const currentIndex = DIRECTION_KEYS.indexOf(this.directionKey);
      if (currentIndex === -1) return;

      let newIndex;
      if (turn === "left") {
         newIndex = (currentIndex + 1) % DIRECTION_KEYS.length;
      } else if (turn === "right") {
         newIndex = (currentIndex - 1 + DIRECTION_KEYS.length) % DIRECTION_KEYS.length;
      } else {
         return;
      }

      this.directionKey = DIRECTION_KEYS[newIndex];
      this.direction = DIRECTION[this.directionKey];
   }

   update() {
      const { dx, dy } = this.direction;
      const speed = this.availableSpeeds[this.currentSpeedIndex];

      this.centerPosition.x += -dx * speed;
      this.centerPosition.y += -dy * speed;
   }

   applyDamage(damageAmount) {
      this.health -= damageAmount;
      console.log(`Корабель ${this.id} отримав дамаг, тепер: ${this.health}`);
      if (this.health <= 0){
         console.log(`${this.id} знищений`);
      }
   }

   clone() {
      const Cls = this.constructor;
      const newShip = new Cls({
         id: this.id,
         teamIndex: this.teamIndex,
         length: this.length,
         ownerId: this.ownerId,
         availableSpeeds: [...this.availableSpeeds],
         direction: this.direction,
      });
      newShip.centerPosition = { ...this.centerPosition };
      newShip.directionKey = this.directionKey,
      newShip.currentSpeedIndex = this.currentSpeedIndex;
      newShip.rudder = this.rudder;
      newShip.direction = this.direction;

      return newShip;
   }
}