const Cell = ({ state, onClick }: CellProps) => {
	return <div className="cell" onClick={() => onClick()}></div>;
};

export interface CellData {
	y: number;
	x: number;
	isMine: boolean;
	state: CellState;
}

interface CellProps {
	state: CellState;
	onClick: () => void;
}

export type CellState = "hidden" | "flagged" | "revealed";

export default Cell;
