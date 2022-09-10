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
				const isMine = Math.random() < mines / (size[0] * size[1]);
				grid[y].push({
					y,
					x,
					state: "hidden",
					isMine: isMine
				});
			}
		}

		setData(grid);
	}, [mines, size]);

	return (
		<div>
			{data.map((row, rowIndex) => {
				return (
					<div className="row" key={rowIndex}>
						{row.map((cell, colIndex) => {
							return <Cell state={cell.state} onClick={() => {}} key={`${rowIndex}-${colIndex}`} />;
						})}
					</div>
				);
			})}
		</div>
	);
};

export default Grid;
