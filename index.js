// TODO: Remove Name mask layer & apply name as mask on Game start

class Board {
  /**
   * Create a 2d interface for a Uint8 array
   * @param {number} cellsWide
   * @param {number} cellsHigh
   */
  constructor(cellsWide, cellsHigh) {
    if (!cellsHigh || !cellsWide)
      throw "Must have both cell width and cell height";
    /** @type number */
    this.width = cellsWide;
    /** @type number */
    this.height = cellsHigh;
    /** @type Uint8Array */
    this.board = new Uint8Array(cellsWide * cellsHigh).fill(0);
  }

  /**
   * Get value at a position
   * @param {number} x
   * @param {number} y
   * @returns {number} (Uint8)
   */
  get(x, y) {
    // wrap board like a tourus
    if (y < 0) y = this.height + y;
    if (x < 0) x = this.width + x;
    if (y >= this.height) y = this.height - y;
    if (x >= this.width) x = this.width - x;

    return this.board[y * this.width + x];
  }

  /**
   * Set content at position
   * @param {number} x
   * @param {number} y
   * @param {number} value (valid Uint8)
   */
  set(x, y, value) {
    this.board[y * this.width + x] = value;
  }
}

class GameOfLife {
  static COLOR_ENABLED = "black";
  static COLOR_DISABLED = "white";
  /**
   * @param {HTMLCanvasElement} canvas
   */
  constructor(canvas) {
    /** @type HTMLCanvasElement */
    this.canvas = canvas;
    this.resizeCanvas();
    /** @type CanvasRenderingContext2D */
    this.ctx = canvas.getContext("2d");

    const width = this.canvas.parentElement.clientWidth;
    if (width < 500) {
      /** @const {number} */
      this.SQUARE_SIZE = 9;
    } else {
      /** @const {number} */
      this.SQUARE_SIZE = 15;
    }

    /** @type number */
    this.cellsWide = Math.ceil(this.canvas.width / this.SQUARE_SIZE);
    /** @type number */
    this.cellsHigh = Math.ceil(this.canvas.height / this.SQUARE_SIZE);

    /** @type Board */
    this.board = new Board(this.cellsWide, this.cellsHigh);
    /** @type Board */
    this.nextBoard = new Board(this.cellsWide, this.cellsHigh);
  }

  /**
   * Draws the board to the canvas context
   */
  draw() {
    for (let y = 0; y < this.cellsHigh; y++) {
      for (let x = 0; x < this.cellsWide; x++) {
        this.ctx.fillStyle = this.board.get(x, y)
          ? GameOfLife.COLOR_ENABLED
          : GameOfLife.COLOR_DISABLED;
        this.ctx.fillRect(
          x * this.SQUARE_SIZE,
          y * this.SQUARE_SIZE,
          this.SQUARE_SIZE,
          this.SQUARE_SIZE
        );

        this.ctx.strokeStyle = "black";
        this.ctx.strokeRect(
          x * this.SQUARE_SIZE,
          y * this.SQUARE_SIZE,
          this.SQUARE_SIZE,
          this.SQUARE_SIZE
        );
      }
    }
  }

  /**
   * Resizes the canvas element to fit the window
   * @param {HTMLCanvasElement} canvas
   */
  resizeCanvas() {
    const ele = this.canvas.parentElement;
    const height = ele.clientHeight;
    const width = ele.clientWidth;

    this.canvas.width = width;
    this.canvas.height = height;
    this.canvas.style.width = `${width}px`;
    this.canvas.style.height = `${height}px`;
  }

  /**
   * Counts the neighbors at a location
   * @param {number} x
   * @param {number} y
   * @returns {number}
   */
  #countNeighbors(x, y) {
    let n = 0;
    // dx and dy are deltas from the given (x, y) point,
    // Here is a graph:
    /*
     * (x-1, y-1) | (x, y-1) | (x+1, y-1)
     * (x-1, y  ) | (x, y  ) | (x+1, y  )
     * (x-1, y+1) | (x, y+1) | (x+1, y+1)
     */
    for (let dx = -1; dx <= 1; dx++)
      for (let dy = -1; dy <= 1; dy++)
        // make sure we don't count the square we're checking around
        if (x + dx != x || y + dy != y)
          if (this.board.get(x + dx, y + dy) == 1)
            // count alive squares
            n++;
    return n;
  }

  /**
   * Sets the value of the next board, as to not
   * interfere with the logic of the current pass.
   * @param {number} x
   * @param {number} y
   * @param {number} value
   */
  #setNext(x, y, value) {
    this.nextBoard.set(x, y, value);
  }

  /**
   * Applies the rules of Conway's game of life
   * @param {number} x
   * @param {number} y
   */
  #applyRules(x, y) {
    let n = this.#countNeighbors(x, y);

    // Any live cell
    if (this.board.get(x, y) == 1) {
      if (n < 2)
        // with fewer than two live neighbours
        // dies, as if by underpopulation.
        this.#setNext(x, y, 0);
      else if (n > 3)
        // with more than three live neighbours
        // dies, as if by overpopulation.
        this.#setNext(x, y, 0);
      // with two or three live neighbours
      // lives on to the next generation.
      else this.#setNext(x, y, 1);
    } else {
      // Any dead cell with exactly three live neighbours
      // becomes a live cell, as if by reproduction.
      if (n == 3) this.#setNext(x, y, 1);
      else this.#setNext(x, y, 0);
    }
  }

  /**
   * Updates the game state
   */
  tick() {
    // generate next frame
    for (let y = 0; y < this.cellsHigh; y++) {
      for (let x = 0; x < this.cellsWide; x++) {
        this.#applyRules(x, y);
      }
    }

    // swaps the two buffers
    let tmp = this.board;
    this.board = this.nextBoard;
    this.nextBoard = tmp;
  }

  /**
   * @param {number[][]} mask
   * @param {number} offsetX
   * @param {number} offsetY
   */
  applyMask(mask, offsetX, offsetY) {
    for (let y = 0; y < mask.length; y++) {
      for (let x = 0; x < mask[0].length; x++) {
        this.board.set(x + offsetX, y + offsetY, mask[y][x]);
      }
    }
  }

  /**
   *
   * @param {number[][]} mask
   */
  centerMask(mask) {
    let nameHeight = GRID.length;
    let nameWidth = GRID[0].length;
    let leftOffset = Math.ceil(this.cellsWide / 2 - nameWidth / 2);
    let topOffset = Math.ceil(this.cellsHigh / 2 - nameHeight / 2);
    this.applyMask(mask, leftOffset, topOffset);
  }

  randomize() {
    this.board.board = this.board.board.map(() => 1 * (Math.random() > 0.5));
  }
}

// prettier-ignore
const GRID = [
  [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
  [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
  [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
  [ 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
  [ 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0 ],
  [ 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0 ],
  [ 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0 ],
  [ 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0 ],
  [ 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0 ],
  [ 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0 ],
  [ 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0 ],
  [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
  [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
  [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
];

const conwayCanvas = document.getElementById("conway-canvas");

if (conwayCanvas.getContext) {
  const conway = new GameOfLife(conwayCanvas);

  conway.randomize();
  conway.centerMask(GRID);

  conway.draw();

  let gameInterval;
  setTimeout(() => {
    gameInterval = setInterval(() => {
      conway.tick();
      conway.draw();
    }, 100);
  }, 3_000);

  const callback = () => {
    // needed to maintain the proper `this` context
    conway.resizeCanvas();
  };
  // window.addEventListener("resize", callback, true);

  // TODO: create better button handling (e.g. reset button)
  document.getElementById("stop-game").addEventListener("click", () => {
    clearInterval(gameInterval);
    window.removeEventListener("resize", callback);
  });
} else {
  alert("canvas isn't supported lol");
  // TODO: have backup image
}
