export class BattleTimer {
   constructor(tickInterval = 1000, messenger) {
      this.tickInterval = tickInterval;
      this.messenger = messenger;
      this.timerRef = null;
      this.timeLeft = 0;
      this.phase = "waiting";
   }

   start(seconds, phase, onTick, onTimeout) {
      if (this.timerRef) {
         clearTimeout(this.timerRef);
         this.timerRef = null;
      }

      this.phase = phase;
      this.timeLeft = seconds;
      this.onTick = onTick;
      this.onTimeout = onTimeout;
      this.tick();
   }

   tick() {
      this.onTick();

      if (this.timeLeft <= 0) {
         this.onTimeout();
         return;
      }

      this.timeLeft -= 1;
      this.timerRef = setTimeout(() => this.tick(), this.tickInterval);
   }

   getTimeLeft() {
      return this.timeLeft;
   }
}