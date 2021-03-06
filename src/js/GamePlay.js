import { calcHealthLevel, calcTileType, getBoard } from './utils';

export default class GamePlay {
  constructor(boardSize) {
    this.boardSize = boardSize;
    this.board = getBoard(boardSize);
    this.container = null;
    this.boardEl = null;
    this.cells = [];
    this.cellClickListeners = [];
    this.cellEnterListeners = [];
    this.cellLeaveListeners = [];
    this.newGameListeners = [];
    this.saveGameListeners = [];
    this.loadGameListeners = [];
  }

  bindToDOM(container) {
    if (!(container instanceof HTMLElement)) {
      throw new Error('container is not HTMLElement');
    }
    this.container = container;
  }

  /**
   * Draws boardEl with specific theme
   *
   * @param theme
   */
  drawUi(theme) {
    this.checkBinding();

    this.container.innerHTML = `
      <div class="operation" id="player">
        <div class="info">evil</div>
        <div class="controls">
          <button data-id="action-restart" class="btn">New Game</button>
          <button data-id="action-save" class="btn">Save Game</button>
          <button data-id="action-load" class="btn">Load Game</button>
          <button data-id="action-load" class="btn">Demo Game</button>
        </div>
        <div class="info">good</div>
      </div>
      <div class="board-container">
        <div data-id="board" class="board"id="enemy"></div>
      </div>
    `;

    this.newGameEl = this.container.querySelector('[data-id=action-restart]');
    this.saveGameEl = this.container.querySelector('[data-id=action-save]');
    this.loadGameEl = this.container.querySelector('[data-id=action-load]');
    // this.modal = document.querySelector('#modal-new-game');
    this.playerNameEl = this.container.querySelector('#player');
    this.enemyNameEl = this.container.querySelector('#enemy');

    this.newGameEl.addEventListener('click', (event) => this.onNewGameClick(event));
    this.saveGameEl.addEventListener('click', (event) => this.onSaveGameClick(event));
    this.loadGameEl.addEventListener('click', (event) => this.onLoadGameClick(event));

    this.boardEl = this.container.querySelector('[data-id=board]');
    this.boardEl.style['grid-template-columns'] = `repeat(${this.boardSize}, 1fr)`;

    this.boardEl.classList.add(theme);
    for (let i = 0; i < this.boardSize ** 2; i += 1) {
      const cellEl = document.createElement('div');
      cellEl.classList.add('cell', 'map-tile', `map-tile-${calcTileType(i, this.board)}`);
      cellEl.addEventListener('mouseenter', (event) => this.onCellEnter(event));
      cellEl.addEventListener('mouseleave', (event) => this.onCellLeave(event));
      cellEl.addEventListener('click', (event) => this.onCellClick(event));
      this.boardEl.appendChild(cellEl);
    }

    this.cells = Array.from(this.boardEl.children);
  }

  /**
   * Draws positions (with chars) on boardEl
   *
   * @param positions array of PositionedCharacter objects
   */
  redrawPositions(positions) {
    for (const cell of this.cells) {
      cell.innerHTML = '';
    }

    for (const position of positions) {
      const cellEl = this.boardEl.children[position.position];
      const charEl = document.createElement('div');
      charEl.classList.add('character', position.character.type);
      const healthEl = document.createElement('div');
      healthEl.classList.add('health-level');
      const healthIndicatorEl = document.createElement('div');
      healthIndicatorEl.classList.add('health-level-indicator',
        `health-level-indicator-${calcHealthLevel(position.character.health)}`);
      healthIndicatorEl.style.width = `${position.character.health}%`;
      healthEl.appendChild(healthIndicatorEl);
      charEl.appendChild(healthEl);
      cellEl.appendChild(charEl);
    }
  }

  /**
   * Add listener to mouse enter for cell
   *
   * @param callback
   */
  addCellEnterListener(callback) {
    this.cellEnterListeners.push(callback);
  }

  /**
   * Add listener to mouse leave for cell
   *
   * @param callback
   */
  addCellLeaveListener(callback) {
    this.cellLeaveListeners.push(callback);
  }

  /**
   * Add listener to mouse click for cell
   *
   * @param callback
   */
  addCellClickListener(callback) {
    this.cellClickListeners.push(callback);
  }

  /**
   * Add listener to "New Game" button click
   *
   * @param callback
   */
  addNewGameListener(callback) {
    this.newGameListeners.push();
  }

  /**
   * Add listener to "Save Game" button click
   *
   * @param callback
   */
  addSaveGameListener(callback) {
    this.saveGameListeners.push(callback);
  }

  /**
   * Add listener to "Load Game" button click
   *
   * @param callback
   */
  addLoadGameListener(callback) {
    this.loadGameListeners.push(callback);
  }

  onCellEnter(event) {
    event.preventDefault();
    const index = this.cells.indexOf(event.currentTarget);
    this.cellEnterListeners.forEach((o) => o.call(null, index));
  }

  onCellLeave(event) {
    event.preventDefault();
    const index = this.cells.indexOf(event.currentTarget);
    this.cellLeaveListeners.forEach((o) => o.call(null, index));
  }

  onCellClick(event) {
    const index = this.cells.indexOf(event.currentTarget);
    this.cellClickListeners.forEach((o) => o.call(null, index));
  }

  onNewGameClick(event) {
    event.preventDefault();
    this.newGameListeners.forEach((o) => o.call(null));
  }

  onSaveGameClick(event) {
    event.preventDefault();
    this.saveGameListeners.forEach((o) => o.call(null));
  }

  onLoadGameClick(event) {
    event.preventDefault();
    this.loadGameListeners.forEach((o) => o.call(null));
  }

  showError(message) {
    alert(message);
  }

  static showMessage(message) {
    alert(message);
  }

  selectCell(index, color = 'yellow') {
    this.deselectCell(index);
    this.cells[index].classList.add('selected', `selected-${color}`);
  }

  deselectCell(index) {
    const cell = this.cells[index];
    cell.classList.remove(...Array.from(cell.classList)
      .filter((o) => o.startsWith('selected')));
  }

  enterCell(index) {
    this.cells[index].classList.add('entered');
  }

  leaveCells(index) {
    this.cells[index].classList.remove('entered');
  }

  highlightCell(cells) {
    cells.forEach((i) => this.cells[i].classList.add('highlighted'));
  }

  dehighlightCell() {
    this.cells.forEach((cell) => cell.classList.remove('highlighted'));
  }

  showCellTooltip(message, index) {
    this.cells[index].title = message;
  }

  hideCellTooltip(index) {
    this.cells[index].title = '';
  }

  showDamage(index, damage) {
    return new Promise((resolve) => {
      const cell = this.cells[index];
      const damageEl = document.createElement('span');
      damageEl.textContent = damage;
      damageEl.classList.add('damage');
      cell.appendChild(damageEl);

      damageEl.addEventListener('animationend', () => {
        cell.removeChild(damageEl);
        resolve();
      });
    });
  }

  showDistanceAttack(from, to, color) {
    // console.log('showDistanceAttack');
    // console.log(color);
    return new Promise((resolve) => {
      const cellFrom = this.cells[from];
      const cellTo = this.cells[to];
      const bulletEl = document.createElement('span');
      // damageEl.textContent = damage;
      bulletEl.classList.add('bullet', color);
      cellFrom.appendChild(bulletEl);
      const {
        x: startX, y: startY, width: startW, height: startH,
      } = cellFrom.getBoundingClientRect();
      const {
        x: stopX, y: stopY, // width: stopW, height: stopH,
      } = cellTo.getBoundingClientRect();
      const deltaX = (stopX - startX) / 50;
      const deltaY = (stopY - startY) / 50;
      this.moveElement(bulletEl, startH / 2, startW / 2, deltaX, deltaY, stopX - startX, stopY - startY);
      // cellFrom.removeChild(bulletEl);
      // resolve();
    });
  }

  moveElement(element, posX, posY, deltaX, deltaY, stopX, stopY) {
    // console.log('move');
    // console.log(posX, posY, stopX);
    // console.log(Math.abs(stopX - posX), deltaX);
    if (Math.abs(stopX - posX) > Math.abs(deltaX) && Math.abs(stopY - posY) > Math.abs(deltaY)) {
      element.style.top = `${posY}px`;
      element.style.left = `${posX}px`;
      setTimeout(
        () => this.moveElement(element, posX + deltaX, posY + deltaY, deltaX, deltaY, stopX, stopY),
        1,
      );
    }
  }

  setCursor(cursor) {
    this.boardEl.style.cursor = cursor;
  }

  checkBinding() {
    if (this.container === null) {
      throw new Error('GamePlay not bind to DOM');
    }
  }

  // showModal() {
  //   console.log('asdfa');
  //   this.modal.style.display = 'block';
  //   console.log(this.modal);
  // }
}
