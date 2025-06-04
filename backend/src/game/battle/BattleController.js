import { BattleState } from "./BattleState.js";
import { BattleLogic } from "./BattleLogic.js";
import { BattleTimer } from "./BattleTimer.js";
import { BattleMessenger } from "./BattleMessanger.js";

export class BattleController {
   constructor({ io, id, map, teams, config, ships }) {
      this.messenger = new BattleMessenger(io, id);
      this.state = new BattleState({ id, config, teams, ships, map });
      this.logic = new BattleLogic({ state: this.state});
      this.timer = new BattleTimer(1000);

      this.timer.start(15, "waiting", this.onTick.bind(this), this.onTimeout.bind(this));
   }

   onTick() {
      const data = this.state.getBattleData();
      this.messenger.emitToBattle("UpdateBattleData", data);
   }

   onTimeout() {
      this.messenger.emitToBattle("turnTimeout", { message: "Time is up!" });
      this.timer.start(30, "active", this.onTick.bind(this), this.onTimeout.bind(this));
   }

   makeMove(playerId, move) {
      const result = this.logic.makeMove(playerId, move);
      if (result.success) {
         this.timer.start(30, "active", this.onTick.bind(this), this.onTimeout.bind(this));
      }
   }
}