import { DIRECTION, DIRECTION_KEYS } from "../../../config/game/shipConfigs.js";

export class Ship {
   constructor({ id, ownerId, teamIndex, x=null, y=null, health, length, availableSpeeds, weaponStrategy, coreIndex, direction }) {
      this.id = id;
      this.type = "ship";
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
      this.availableSpeeds = availableSpeeds;
      this.weapon = weaponStrategy; 

      this.currentSpeedIndex = 1;
      this.health = health;
   }

   setPosition(xPos, yPos) {
      this.centerPosition = {
         x: xPos,
         y: yPos
      };
   }

   fire() {
      this.weapon.fire(this);
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

   getCorePosition() {
      const { dx, dy } = this.direction;
      return {
      x: this.centerPosition.x + dx * this.coreIndex,
      y: this.centerPosition.y + dy * this.coreIndex
      };
   }

   getCurrentSpeed() {
      return this.availableSpeeds[this.currentSpeedIndex];
   }

   updateFromPlayer(data) {
      if (data.currentSpeedIndex !== undefined) {
         this.currentSpeedIndex = this.availableSpeeds[data.currentSpeedIndex] ? data.currentSpeedIndex : 1;
      }

      if (data.turnTo !== undefined) {
         this.applyTurn(data.turnTo);
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

   clone() {
      const Cls = this.constructor;
      const newShip = new Cls({
         id: this.id,
         directionKey: this.directionKey,
         teamIndex: this.teamIndex,
         ownerId: this.ownerId,
         config: this.config,
         availableSpeeds: [...this.availableSpeeds],
         direction: this.direction,
         length: this.length
      });
      newShip.centerPosition = { ...this.centerPosition };
      newShip.currentSpeedIndex = this.currentSpeedIndex;
      newShip.direction = this.direction;

      return newShip;
   }
}