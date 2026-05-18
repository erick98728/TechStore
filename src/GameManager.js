export class GameManager {
  constructor() {
    this.score = 0;
    this.coins = 0;
    this.energy = 0;
    this.speed = 6;
    this.running = false;
    this.paused = false;
    this.gameOver = false;
  }

  start() {
    this.score = 0;
    this.coins = 0;
    this.energy = 0;
    this.speed = 6;
    this.running = true;
    this.paused = false;
    this.gameOver = false;
  }

  pause() {
    this.paused = !this.paused;
  }

  addScore(value) {
    this.score += value;
  }

  addCoin(value = 1) {
    this.coins += value;
  }

  addEnergy(value = 1) {
    this.energy += value;
  }

  increaseDifficulty() {
    this.speed = Math.min(this.speed + 0.15, 15);
  }
}
