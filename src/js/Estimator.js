import { getRandomElement } from './utils';

export default class Estimator {
  constructor(game) {
    this.game = game;
    this.side = this.game.enemySide;
  }

  requestStrategy() {
    this.randomStrategy();
    // if (this.side === this.game.side) {
    //   console.log('random action');
    //   this.randomStrategy();
    // } else {
    //   console.log('revenge action');
    //   this.revengeStrategy();
    // }
  }

  revengeStrategy() {
    const { action, from, to } = this.game.gameState.getLastTurn();
    const availableCharacter = this.game.playerCharacterCells;
    if (action === 'attackPosition' && availableCharacter.includes(to)) {
      this.game.activatePosition(to);
      this.game.action = this.game.attackPosition;
      this.game.onCellClick(from);
    }
    this.randomStrategy();
  }

  randomStrategy() {
    const availableCharacter = this.game.playerCharacterCells;
    let loop = true;
    while (loop) {
      const selectIndex = getRandomElement(availableCharacter);
      this.game.activatePosition(selectIndex);
      this.game.distributionCells(selectIndex);
      const moveTarget = getRandomElement(this.game.transitionСells);
      const attackTarget = getRandomElement(this.game.attackСells);
      if (attackTarget) {
        this.game.action = this.game.attackPosition;
      } else if (moveTarget) {
        this.game.action = this.game.movePosition;
      } else {
        continue;
      }
      loop = false;
      this.game.onCellClick(attackTarget || moveTarget);
    }
  }
}
