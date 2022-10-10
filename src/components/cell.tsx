const Cell = ({ state, isMine, neighbors, larger, showMine, onClick }: CellProps) => {
	const getCellContent = (state: CellState) => {
		if (!isMine && state === "flagged" && showMine) return "❌";
		if (state === "flagged") return "🚩";
		if (isMine && (state === "revealed" || showMine)) return "💣";
		if (state === "hidden") return "";
		return neighbors || "";
	};

	const getCellClass = () => {
		if (state === "revealed" && neighbors === 0) return "filled empty";
		if (state === "revealed" && neighbors) return "filled";
		if (isMine && state === "hidden") return "";
		return "";
	};

	return (
		<div
			className={`cell ${getCellClass()} ${larger ? "larger" : ""}`}
			style={{ color: fontColors[neighbors - 1] }}
			onClick={(e) => onClick(e.button)}
			onContextMenu={(e) => {
				e.preventDefault();
				onClick(2);
			}}
		>
			{getCellContent(state)}
		</div>
	);
};

const fontColors = ["blue", "green", "red", "purple", "orange", "turquoise", "black", "grey"]

export interface CellData {
	y: number;
	x: number;
	isMine: boolean;
	state: CellState;
	safe: boolean;
}

interface CellProps {
	state: CellState;
	neighbors: number;
	isMine: boolean;
	showMine: boolean;
	larger: boolean;
	onClick: (button: number) => void;
}

export type CellState = "hidden" | "flagged" | "revealed";

export default Cell;
