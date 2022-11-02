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
  /**
   * @param {number} cellWidth
   * @param {number} cellHeight
   * @param {HTMLCanvasElement} canvas
   */
  constructor(canvas) {
    /** @type HTMLCanvasElement */
    this.canvas = canvas;
    /** @type CanvasRenderingContext2D */
    this.ctx = canvas.getContext("2d");

    const SQUARE_SIZE = 5; // size of cell in pixels
    /** @const {number} */
    this.SQUARE_SIZE = SQUARE_SIZE;

    /** @type number */
    this.cellsWide = Math.ceil(this.canvas.width / SQUARE_SIZE);
    /** @type number */
    this.cellsHigh = Math.ceil(this.canvas.height / SQUARE_SIZE);

    /** @type Board */
    this.board = new Board(this.cellsWide, this.cellsHigh);
  }

  /**
   * Draws the board to the canvas context
   */
  draw() {
    for (let y = 0; y < this.cellsHigh; y++) {
      for (let x = 0; x < this.cellsWide; x++) {
        this.ctx.fillStyle = this.board.get(x, y) ? "black" : "white";
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
}

/**
 * @type HTMLCanvasElement
 */
const canvas = document.getElementById("conway-canvas");

if (canvas.getContext) {
  const conway = new GameOfLife(canvas);
  conway.board.set(0, 0, 1);
  conway.board.set(1, 0, 1);
  console.log(conway.board);
  conway.draw();

  conway.board.set(1, 2, 1);
  conway.draw();
  // TODO: Handle association with an array
  // TODO: Create class for CGOL

  // TODO: for each ele in UINT8ARRAY, either draw a black rectangle or a clear rectangle
  // TODO: draw the minmum amount of rects necessary
} else {
  alert("canvas isn't supported lol");
  // TODO: have backup image
}
