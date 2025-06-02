import { SpatialIndex } from "../map/SpatialIndex.js";

export class Battle {
    constructor({ io, battleId, map, teams, config, entities }) {
        this.io = io;
        this.spatialIndex = new SpatialIndex();
        this.map = map;

        this.entities = entities;
        this.teams = teams;
        this.config = config;
        this.battleId = battleId;
        this.currentTurn = 0;
        this.moves = [];
        this.gameStatus = {
            is_going: true,
            result: null
        };

        this.tickInterval = 1000; // 1 секунда
        this.timeLeft = 0;
        this.timerRef = null;
        this.phase = 'waiting'; // або 'active'

        this.startPreGameTimer(15); // Наприклад, 15 сек до початку бою
    }

    startPreGameTimer(seconds) {
        this.phase = 'waiting';
        this.timeLeft = seconds;
        this.clearTimer();
        this.tick();
    }

    startTurnTimer(seconds = 30) {
        this.phase = 'active';
        this.timeLeft = seconds;
        this.clearTimer();
        this.tick();
    }

    clearTimer() {
        if (this.timerRef) clearTimeout(this.timerRef);
        this.timerRef = null;
    }

    tick() {
        this.onUpdateTime();

        if (this.timeLeft <= 0) {
            this.onTimeout();
            return;
        }

        this.timeLeft -= 1;

        this.timerRef = setTimeout(() => this.tick(), this.tickInterval);
    }

    makeMove(playerId, moveData) {
        if (this.players[this.currentTurn] !== playerId) {
            return { success: false, message: 'Not your turn!' };
        }

        this.moves.push({ playerId, moveData });

        if (this.moves.length >= 6) {
            this.winner = playerId;
            this.clearTimer();
            this.phase = 'ended';
            return { success: true, gameOver: true, winner: playerId };
        }

        this.currentTurn = 1 - this.currentTurn;
        this.startTurnTimer(); // починаємо новий хід

        return { success: true, gameOver: false };
    }

    getState() {
        return {
            moves: this.moves,
            timeLeft: this.timeLeft,
            winner: this.winner,
            phase: this.phase,
            entities: this.entities,
        };
    }

    getTimeLeft() {
        return this.timeLeft;
    }

    onUpdateTime() {
        this.emitToBattleRoom("UpdateBattleInfo", this.getState());
    }

    onTimeout() {
        if (this.phase === 'waiting') {
            this.startTurnTimer(); // Почати перший хід після прегейму
        } else if (this.phase === 'active') {
            this.emitToBattleRoom("turnTimeout", { message: "Time is up!" });
            this.currentTurn = 1 - this.currentTurn;
            this.startTurnTimer(); // новий хід
        }
    }

    emitToBattleRoom(event, data) {
        console.log(`Відправляємо дані... ${this.battleId}`);
        this.io.to(this.battleId).emit(event, data);
    }
}