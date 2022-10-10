import { RefObject, useEffect, useRef, useState } from "react";
import Cell, { CellData } from "./cell";

const Grid = ({ mines, restartBtn, size, disabled, showMines, onUiUpdate, onStateUpdate, onSoundEvent }: GridProps) => {
	const [data, setData] = useState<CellData[][]>([]);
	const isFirstClick = useRef(true);

	//Generate the grid for the game
	useEffect(() => {
		isFirstClick.current = true;
		constructGrid(size);
	}, [size]);

	useEffect(() => {
		const resetBoard = () => {
			isFirstClick.current = true;
			constructGrid(size);
		};

		const button = restartBtn.current;
		button?.addEventListener("click", resetBoard);

		return () => button?.removeEventListener("click", resetBoard);
	}, [restartBtn, size]);

	const constructGrid = (size: [number, number]) => {
		const grid: CellData[][] = [];
		for (let y = 0; y < size[0]; y++) {
			grid.push([]);
			for (let x = 0; x < size[1]; x++) {
				grid[y].push({
					y,
					x,
					state: "hidden",
					isMine: false,
					safe: false
				});
			}
		}

		setData(grid);
	};

	//Mines are placed after the first click to prevent the first click from being a mine
	const placeMines = (grid: CellData[][]) => {
		let minesPlaced = 0;
		while (minesPlaced < mines) {
			const y = Math.floor(Math.random() * size[0]);
			const x = Math.floor(Math.random() * size[1]);

			if (grid[y][x].isMine || grid[y][x].safe) continue;

			grid[y][x].isMine = true;
			minesPlaced++;
		}

		return grid;
	};

	const handleCellClick = (cell: CellData, button: number) => {
		if (disabled) return;
		let newGrid = [...data];

		//Left click
		if (button === 0) {
			if (cell.state !== "hidden") return;

			if (isFirstClick.current) {
				isFirstClick.current = false;

				cell.safe = true;
				getCellNeighbors(cell, newGrid).forEach((neighbor) => (neighbor.safe = true));

				newGrid = placeMines(newGrid);
				newGrid = revealNeighbors(cell, newGrid);
				setData(newGrid);
				onSoundEvent("uncover")
				onStateUpdate("playing");
				return;
			}

			if (cell.isMine) {
				newGrid[cell.y][cell.x].state = "revealed";
				onStateUpdate("lost");
			} else {
				newGrid = [...revealNeighbors(cell, newGrid)];
				onSoundEvent("uncover")
			}

			const state = checkGameState(newGrid);
			if (state === "won") onStateUpdate("won");
			setData(newGrid);
		} else if (button === 2) {
			//Right click
			if (cell.state === "revealed" || isFirstClick.current) return;
			const flags = data.flat().filter((cell) => cell.state === "flagged").length;
			if (flags >= mines && cell.state === "hidden") return;

			newGrid[cell.y][cell.x].state = cell.state === "hidden" ? "flagged" : "hidden";
			onSoundEvent(cell.state === "flagged" ? "flag" : "unflag");
			const state = checkGameState(newGrid);

			if (state === "won") onStateUpdate("won");
			onUiUpdate(cell.state === "flagged" ? -1 : 1);
			setData(newGrid);
		}
	};

	const checkGameState = (grid: CellData[][]) => {
		const flaggedCells: CellData[] = [];
		for (const row of grid) {
			for (const cell of row) {
				if (cell.state === "flagged") flaggedCells.push(cell);
				else if (cell.state === "hidden" && !cell.isMine) return "playing";
			}
		}

		if (flaggedCells.filter((cell) => cell.isMine).length !== mines) return "playing";
		return "won";
	};

	return (
		<div className="grid">
			{data.map((row, rowIndex) => {
				return (
					<div className="row" key={rowIndex}>
						{row.map((cell, colIndex) => {
							return (
								<Cell
									state={cell.state}
									onClick={(button) => handleCellClick(cell, button)}
									key={`${rowIndex}-${colIndex}`}
									larger={size[0] == 10 && rowIndex <= 9 && colIndex <= 9}
									neighbors={getCellNeighbors(cell, data).filter((neighbor) => neighbor.isMine).length}
									showMine={showMines}
									isMine={cell.isMine}
								/>
							);
						})}
					</div>
				);
			})}
		</div>
	);
};

//Reveal cells around the clicked cell without neighbors nearby using recursion
const revealNeighbors = (cell: CellData, grid: CellData[][]) => {
	grid[cell.y][cell.x].state = "revealed";

	const neighbors = getCellNeighbors(cell, grid);
	if (neighbors.filter((neighbor) => neighbor.isMine).length > 0) return grid;

	for (const neighbor of neighbors) {
		if (neighbor.state === "hidden" && !neighbor.isMine) {
			const neighborNeighbors = getCellNeighbors(neighbor, grid);
			if (neighborNeighbors.filter((neighbor) => neighbor.isMine).length === 0) {
				revealNeighbors(neighbor, grid);
			} else {
				grid[neighbor.y][neighbor.x].state = "revealed";
			}
		}
	}

	return grid;
};

//Get the neighbors of a cell
const getCellNeighbors = (cell: CellData, data: CellData[][]): CellData[] => {
	const neighbors: CellData[] = [];
	//Get the cells above
	for (let y = cell.y - 1; y <= cell.y + 1; y++) {
		for (let x = cell.x - 1; x <= cell.x + 1; x++) {
			if (y >= 0 && y < data.length && x >= 0 && x < data[0].length && !(y === cell.y && x === cell.x)) {
				neighbors.push(data[y][x]);
			}
		}
	}

	return neighbors;
};

export type GameState = "playing" | "won" | "waiting"| "lost";

interface GridProps {
	mines: number;
	size: [number, number];
	restartBtn: RefObject<HTMLButtonElement>;
	disabled: boolean;
	showMines: boolean;
	onUiUpdate: (flags: number) => void;
	onStateUpdate: (state: GameState) => void;
	onSoundEvent: (event: "uncover" | "flag" | "unflag") => void;
}

export default Grid;
