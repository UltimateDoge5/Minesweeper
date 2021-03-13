"use strict";
class Cell {
    constructor(y, x, size) {
        this.isMine = false;
        this.isDiscovered = false;
        this.isFlagged = false;
        this.getNearMines = () => {
            let mines = 0;
            for (let x = -1; x <= 1; x++) {
                for (let y = -1; y <= 1; y++) {
                    if (x == 0 && y == 0)
                        continue;
                    let neighborX = this.x + x;
                    let neighborY = this.y + y;
                    const neighborCell = game.grid.getCell(neighborX, neighborY);
                    if (neighborCell != undefined && neighborCell.isMine) {
                        mines++;
                    }
                }
            }
            return mines;
        };
        this.uncover = () => {
            if (game.isPlaying == false || this.isFlagged)
                return false;
            if (this.isMine) {
                game.stop();
                document.getElementById("title").innerText = "Game over";
                return document.getElementById("title").style.color = "red";
            }
            const nearMines = this.getNearMines();
            this.nearMines = nearMines;
            this.isDiscovered = true;
            this.body.style.backgroundColor = "#acadac";
            if (nearMines == 0) {
                for (let x = -1; x <= 1; x++) {
                    for (let y = -1; y <= 1; y++) {
                        if (x == 0 && y == 0)
                            continue;
                        let neighborX = this.x + x;
                        let neighborY = this.y + y;
                        const neighborCell = game.grid.getCell(neighborX, neighborY);
                        if (neighborCell != undefined && neighborCell.isMine == false && neighborCell.isDiscovered == false) {
                            neighborCell.uncover();
                        }
                    }
                }
            }
            else {
                this.body.style.color = colors[nearMines - 1];
                this.body.innerText = nearMines + "";
                return true;
            }
        };
        this.setFlag = () => {
            if (game.avaiableFlags == 0 || !game.isPlaying || this.isDiscovered)
                return false;
            this.isFlagged = !this.isFlagged;
            this.body.innerText = this.isFlagged ? "🚩" : this.nearMines ? this.nearMines + "" : "";
            game.flags = game.avaiableFlags + (this.isFlagged ? -1 : 1);
            if (this.isFlagged) {
                game.flaggedCells.push(this);
            }
            else {
                game.flaggedCells.splice(game.flaggedCells.indexOf(this), 1);
            }
        };
        this.x = x;
        this.y = y;
        this.size = size;
        this.body = document.createElement("div");
        this.body.style.width = `${this.size}px`;
        this.body.style.height = `${this.size}px`;
        this.body.classList.add("cell");
        this.body.dataset.x = this.x.toString();
        this.body.dataset.y = this.y.toString();
        this.body.addEventListener("click", this.uncover);
        this.body.addEventListener('contextmenu', e => {
            e.preventDefault();
            this.setFlag();
        });
    }
}
class Grid {
    constructor(HTMLparent, rowsX, rowsY, cellSize) {
        this.initOverlay = () => {
            this.overlay = document.createElement("div");
            this.overlay.classList.add("overlay");
            const overlayTitle = document.createElement("h1");
            overlayTitle.innerText = "";
            overlayTitle.id = "title";
            const overlayText = document.createElement("h2");
            overlayText.innerText = "Click to start";
            overlayText.addEventListener("click", () => {
                this.overlay.style.display = "none";
                game.start();
            });
            this.overlay.append(overlayTitle);
            this.overlay.append(overlayText);
        };
        this.drawGrid = () => {
            this.HTMLparent.innerHTML = "";
            this.grid = [];
            this.HTMLparent.append(this.overlay);
            for (let i = 0; i < this.rowsY; i++) {
                this.grid.push([]);
                let row = document.createElement("div");
                row.classList.add("row");
                for (let j = 0; j < this.columnsX; j++) {
                    this.grid[i][j] = new Cell(i, j, this.cellSize);
                    row.append(this.grid[i][j].body);
                }
                this.HTMLparent.append(row);
            }
        };
        this.clearGrid = () => {
            for (let i = 0; i < this.grid.length; i++) {
                for (let j = 0; j < this.grid[i].length; j++) {
                    const cell = this.getCell(j, i);
                    cell.isMine = false;
                    cell.isDiscovered = false;
                    cell.isFlagged = false;
                    cell.body.innerText = "";
                    cell.body.style.backgroundColor = "#ffffff";
                }
            }
        };
        this.getGrid = () => {
            return this.grid;
        };
        this.getCell = (x, y) => {
            if (0 > y || this.rowsY <= y)
                return undefined;
            if (0 > x || this.columnsX <= x)
                return undefined;
            return this.grid[y][x];
        };
        this.cellSize = cellSize;
        this.grid = [];
        this.HTMLparent = HTMLparent;
        this.columnsX = rowsX;
        this.rowsY = rowsY;
        this.HTMLparent.id = "grid";
        this.initOverlay();
        this.drawGrid();
    }
}
const colors = ['blue', 'darkgreen', 'red', 'darkblue', 'darkred', 'cyan', 'black', 'gray'];
const settings = {
    "Easy": {
        "columnsX": 9,
        "rowsY": 9,
        "mines": 10,
    },
    "Medium": {
        "columnsX": 16,
        "rowsY": 16,
        "mines": 40,
    },
    "Hard": {
        "columnsX": 30,
        "rowsY": 16,
        "mines": 99,
    }
};
//# sourceMappingURL=grid.js.map