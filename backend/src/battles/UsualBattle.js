export class UsualBattle {
    constructor(battleId, player1Id, player2Id, onUpdateTime=30, onTimeout=10) {
        this.players = [player1Id, player2Id];
        this.currentTurn = 0;
        this.moves = [];
        this.winner = null;

        this.timeLeft = 30;
        this.timerRef = null;

        this.onUpdateTime = onUpdateTime;
        this.onTimeout = onTimeout;

        //this.startTurnTimer();
    }

    startTurnTimer() {
        this.timeLeft = 30;
        if (this.timerRef) clearTimeout(this.timerRef);
        this.tick();
    }

    tick() {
        this.onUpdateTime?.(this); // оновлюємо час на фронті

        if (this.timeLeft <= 0) {
            this.onTimeout?.(this);
            return;
        }

        this.timeLeft -= 1;

        // Зберігаємо посилання на таймер для зупинки, якщо треба
        this.timerRef = setTimeout(() => this.tick(), 1000);
    }

    makeMove(playerId, moveData) {
        if (this.players[this.currentTurn] !== playerId) {
            return { success: false, message: 'Not your turn!' };
        }

        this.moves.push({ playerId, moveData });

        if (this.moves.length >= 6) {
            this.winner = playerId;
            if (this.timerRef) clearTimeout(this.timerRef);
            return { success: true, gameOver: true, winner: playerId };
        }

        this.currentTurn = 1 - this.currentTurn;
        this.startTurnTimer();

        return { success: true, gameOver: false };
    }

    getState() {
        return {
            currentTurn: this.players[this.currentTurn],
            moves: this.moves,
            timeLeft: this.timeLeft,
            winner: this.winner,
        };
    }

    getTimeLeft() {
        return this.timeLeft
    }
}