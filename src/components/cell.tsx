const Cell = ({ state, isMine, neigbors, larger, showMine, onClick }: CellProps) => {
	const getCellContnet = (state: CellState) => {
		if (!isMine && state === "flagged" && showMine) return "❌";
		if (state === "flagged") return "🚩";
		if (isMine && (state === "revealed" || showMine)) return "💣";
		if (state === "hidden") return "";
		return neigbors || "";
	};

	const getCellClass = () => {
		if (state === "revealed" && neigbors === 0) return "filled empty";
		if (state === "revealed" && neigbors) return "filled";
		if (isMine && state === "hidden") return "";
		return "";
	};

	return (
		<div
			className={`cell ${getCellClass()} ${larger ? "larger" : ""}`}
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
	showMine: boolean;
	larger: boolean;
	onClick: (button: number) => void;
}

export type CellState = "hidden" | "flagged" | "revealed";

export default Cell;
