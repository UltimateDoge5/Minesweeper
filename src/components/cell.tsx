const Cell = ({ state, isMine, neigbors, onClick }: CellProps) => {
	const getCellContnet = (state: CellState) => {
		if (state === "hidden") return "";
		if (state === "flagged") return "🚩";
		if (isMine) return "💣";
		return neigbors || "";
	};

	const getCellClass = () => {
		if (isMine && state === "hidden") return "";
		if (state === "revealed" && neigbors === 0) return "filled empty";
		if (state === "revealed" && neigbors) return "filled";
	};

	return (
		<div
			className={`cell ${getCellClass()}`}
			style={{ color: getFontColor(neigbors) }}
			onClick={(e) => onClick(e.button)}
			onContextMenu={(e) => {
				e.preventDefault();
				onClick(2);
			}}
		>
			{getCellContnet(state)}
		</div>
	);
};

const getFontColor = (neigbors: number) => {
	switch (neigbors) {
		case 1:
			return "blue";
		case 2:
			return "green";
		case 3:
			return "red";
		case 4:
			return "purple";
		case 5:
			return "maroon";
		case 6:
			return "turquoise";
		case 7:
			return "black";
		case 8:
			return "grey";
		default:
			return "black";
	}
};

export interface CellData {
	y: number;
	x: number;
	isMine: boolean;
	state: CellState;
	safe: boolean;
}

interface CellProps {
	state: CellState;
	neigbors: number;
	isMine: boolean;
	onClick: (button: number) => void;
}

export type CellState = "hidden" | "flagged" | "revealed";

export default Cell;
