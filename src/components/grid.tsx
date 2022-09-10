import { useEffect, useState } from "react";
import Cell, { CellData } from "./cell";

const Grid = ({ mines }: { mines: number }) => {
	const [data, setData] = useState<CellData[][]>([]);
	const [size, setSize] = useState([16, 16]);

	//Generate the grid for the game
	useEffect(() => {
		const grid: CellData[][] = [];
		for (let y = 0; y < size[0]; y++) {
			grid.push([]);
			for (let x = 0; x < size[1]; x++) {
				grid[y].push({
					y,
					x,
					state: "hidden",
					isMine: false
				});
			}
		}

		//Place mines
		let minesPlaced = 0;
		while (minesPlaced < mines) {
			const y = Math.floor(Math.random() * size[0]);
			const x = Math.floor(Math.random() * size[1]);

			if (grid[y][x].isMine) continue;

			grid[y][x].isMine = true;
			minesPlaced++;
		}

		setData(grid);
	}, [mines, size]);

	const handleCellClick = (cell: CellData, button: number) => {
		//Left click
		if (button === 0) {
			if (cell.state !== "hidden") return;

			let newGrid = [...data];
			if (cell.isMine) {
				//Todo: Handle game over
				newGrid[cell.y][cell.x].state = "revealed";
			} else {
				newGrid = [...revealNeighbors(cell, newGrid)];
			}

			setData(newGrid);
		} else if (button === 2) {
			if (cell.state === "revealed") return;

			const newGrid = [...data];
			newGrid[cell.y][cell.x].state = cell.state === "hidden" ? "flagged" : "hidden";

			setData(newGrid);
		}
	};

	return (
		<div>
			{data.map((row, rowIndex) => {
				return (
					<div className="row" key={rowIndex}>
						{row.map((cell, colIndex) => {
							return (
								<Cell
									state={cell.state}
									onClick={(button) => handleCellClick(cell, button)}
									key={`${rowIndex}-${colIndex}`}
									neigbors={getCellNeighbors(cell, data).filter((neighbor) => neighbor.isMine).length}
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

	for (let neighbor of neighbors) {
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

export default Grid;
