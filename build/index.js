"use strict";
class MineSweeper {
    constructor() {
        this.timer = 0;
        this.time = 0;
        this.minesAmount = 40;
        this.mines = [];
        this.avaiableFlags = this.minesAmount;
        this.flaggedCells = [];
        this.isPlaying = false;
        this.start = () => {
            this.grid.clearGrid();
            this.isPlaying = true;
            let possibleMines = this.flags = this.minesAmount;
            this.mines = [];
            this.flaggedCells = [];
            this.time = 0;
            while (possibleMines) {
                const random = Math.random() * (this.grid.columnsX * this.grid.rowsY);
                var x = Math.floor(random % this.grid.columnsX) || this.grid.columnsX;
                var y = Math.ceil(random / this.grid.columnsX);
                const cell = this.grid.getCell(x, y);
                if (cell != undefined && cell.isMine == false) {
                    possibleMines--;
                    this.mines.push(cell);
                    cell.isMine = true;
                }
            }
            document.getElementById("timer").innerText = `🕛 0:00`;
            document.getElementById("title").innerText = "";
            this.timer = setInterval(() => {
                this.time++;
                const time = new Date(this.time * 1000).toISOString();
                document.getElementById("timer").innerText = `🕛 ${parseInt(time.substr(14, 2))}:${time.substr(17, 2)}`;
            }, 1000);
        };
        this.stop = () => {
            document.getElementById("title").innerText = "";
            game.grid.overlay.style.display = "flex";
            clearInterval(this.timer);
            this.isPlaying = false;
            this.mines.forEach((cell) => {
                if (cell.isFlagged == false) {
                    cell.body.innerText = "💣";
                    cell.body.style.backgroundColor = "red";
                }
                else {
                    cell.body.style.backgroundColor = "green";
                }
            });
            this.flaggedCells.forEach((cell) => {
                if (cell.isMine == false) {
                    cell.body.innerText = "❌";
                }
            });
        };
        this.checkForWin = () => {
            this.flaggedCells.forEach((cell) => {
                if (cell.isFlagged == false)
                    return false;
                cell.body.style.backgroundColor = "green";
            });
            game.stop();
            document.getElementById("title").innerText = "Victory!";
            document.getElementById("title").style.color = "limegreen";
        };
        const gridParent = document.querySelector("main");
        this.grid = new Grid(gridParent, 16, 16, 25);
    }
    set settings(settings) {
        game.minesAmount = settings.mines;
        game.grid.columnsX = settings.columnsX;
        game.grid.rowsY = settings.rowsY;
    }
    set flags(flags) {
        this.avaiableFlags = flags;
        document.getElementById("flags").innerText = `🚩 ${this.avaiableFlags}`;
        if (this.avaiableFlags == 0)
            this.checkForWin();
    }
}
const game = new MineSweeper();
document.getElementById("difficulty").addEventListener("change", function () {
    game.settings = settings[this.value];
    game.stop();
    game.grid.overlay.style.display = "flex";
    game.grid.drawGrid();
});
//# sourceMappingURL=index.js.map