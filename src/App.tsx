import { useEffect, useRef, useState } from "react";
import Grid from "./components/grid";
import "./App.css";
import "@szhsin/react-menu/dist/index.css";
import "@szhsin/react-menu/dist/transitions/slide.css";
import { Menu, MenuButton, MenuItem } from "@szhsin/react-menu";

const App = () => {
	const restartBtn = useRef<HTMLButtonElement>(null);
	const [difficulty, setDifficulty] = useState<Difficulty>(difficulties[1]);
	const [ui, setUI] = useState({ time: 0, flags: difficulty.mines });

	useEffect(() => {
		const updateTimer = setInterval(() => {
			if (ui.time < 999) setUI((ui) => ({ ...ui, time: ui.time + 1 }));
		}, 1000);

		return () => clearInterval(updateTimer);
	}, [ui.time]);

	return (
		<div className="App">
			<div className="infoBar">
				<button ref={restartBtn} onClick={() => setUI({ ...ui, time: 0 })}>
					<RestartIcon />
					Restart
				</button>

				<div className="menu">
					<Menu
						menuButton={
							<MenuButton>
								<DownArrowIcon />
								{capitalize(difficulty.name)}
							</MenuButton>
						}
						transition
					>
						{difficulties.map((diff) => (
							<MenuItem
								key={diff.name}
								disabled={diff.name === difficulty.name}
								onClick={() => {
									setUI({ time: 0, flags: diff.mines });
									setDifficulty(diff);
								}}
							>
								{capitalize(diff.name)}
							</MenuItem>
						))}
					</Menu>
				</div>
				<div>
					<ClockIcon />
					<span className="label">{"0".repeat(3 - ui.time.toString().length) + ui.time}</span>
				</div>

				<span className="label">{`🚩 ${ui.flags}`}</span>
			</div>
			<Grid
				mines={difficulty.mines}
				size={difficulty.size}
				restartBtn={restartBtn}
				onUiUpdate={(flags) => setUI({ ...ui, flags: ui.flags + flags })}
			/>
		</div>
	);
};

const RestartIcon = () => (
	<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width={24} height={24}>
		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
		/>
	</svg>
);

const ClockIcon = () => (
	<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width={32} height={32}>
		<path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
	</svg>
);

const DownArrowIcon = () => (
	<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width={24} height={24}>
		<path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
	</svg>
);

const capitalize = (str: string) => str[0].toUpperCase() + str.slice(1);

const difficulties: Difficulty[] = [
	{ size: [9, 9], mines: 10, name: "beginner" },
	{ size: [16, 16], mines: 40, name: "intermediate" },
	{ size: [16, 30], mines: 99, name: "expert" }
];

interface Difficulty {
	size: [number, number];
	mines: number;
	name: string;
}

export default App;
