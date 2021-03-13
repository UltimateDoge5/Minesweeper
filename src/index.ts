class MineSweeper {
    grid: Grid;
    timer: number = 0;
    private time: number = 0;
    minesAmount: number = 40;
    mines: Cell[] = [];
    avaiableFlags: number = this.minesAmount;
    flaggedCells: Cell[] = [];
    isPlaying: boolean = false;

    constructor() {
        const gridParent = document.querySelector("main") as HTMLDivElement;
        this.grid = new Grid(gridParent, 16, 16, 25);
    }

    start = () => {
        this.grid.clearGrid()
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
        document.getElementById("timer")!.innerText = `🕛 0:00`;
        document.getElementById("title")!.innerText = ""

        this.timer = setInterval(() => {
            this.time++;
            const time = new Date(this.time * 1000).toISOString();
            document.getElementById("timer")!.innerText = `🕛 ${parseInt(time.substr(14, 2))}:${time.substr(17, 2)}`;
        }, 1000)
    }

    stop = () => {
        document.getElementById("title")!.innerText = "";
        game.grid.overlay!.style.display = "flex";
        clearInterval(this.timer)
        this.isPlaying = false;
        this.mines.forEach((cell: Cell) => {
            if (cell.isFlagged == false) {
                cell.body.innerText = "💣";
                cell.body.style.backgroundColor = "red";
            } else {
                cell.body.style.backgroundColor = "green"
            }
        })

        this.flaggedCells.forEach((cell: Cell) => {
            if (cell.isMine == false) {
                cell.body.innerText = "❌";
            }
        })
    }

    private checkForWin = () => {
        this.flaggedCells.forEach((cell: Cell) => {
            if (cell.isMine == false) return false;
            cell.body.style.backgroundColor = "green"
        });

        game.stop();
        document.getElementById("title")!.innerText = "Victory!"
        document.getElementById("title")!.style.color = "limegreen"
    }

    public set settings(settings: SettingsType) {
        game.minesAmount = settings.mines;
        game.grid.columnsX = settings.columnsX;
        game.grid.rowsY = settings.rowsY;
    }

    public set flags(flags: number) {
        this.avaiableFlags = flags;
        document.getElementById("flags")!.innerText = `🚩 ${this.avaiableFlags}`;
        if (this.avaiableFlags == 0) this.checkForWin();
    }
}

const game = new MineSweeper();

document.getElementById("difficulty")!.addEventListener("change", function (this: HTMLSelectElement) {
    game.settings = settings[this.value as difficulty];
    game.stop()
    game.grid.overlay!.style.display = "flex";
    game.grid.drawGrid()
})