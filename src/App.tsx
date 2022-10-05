import { useEffect, useRef, useState } from "react";
import { Menu, MenuButton, MenuItem } from "@szhsin/react-menu";
import Grid, { GameState } from "./components/grid";
import { createPortal } from "react-dom";
import JSConfetti from "js-confetti";
import AudioPlayer from "./components/audioPlayer";
import "./App.css";

const jsConfetti = new JSConfetti();
const initialMute = localStorage.getItem("muted") === "true";

const App = () => {
	const restartBtn = useRef<HTMLButtonElement>(null);
	const timerRef = useRef(0);
	const [difficulty, setDifficulty] = useState<Difficulty>(difficulties[1]);
	const [ui, setUI] = useState({ time: 0, flags: difficulty.mines });
	const [state, setState] = useState<GameState>("waiting");
	const [muted, setMuted] = useState(initialMute);
	const player = useRef(new AudioPlayer());

	useEffect(() => {
		if (muted) {
			player.current.music.pause();
			localStorage.setItem("muted", "true");
		} else if (player.current.music.paused) {
			player.current.music.play();
			localStorage.setItem("muted", "false");
		}
	}, [muted]);

	useEffect(() => {
		timerRef.current = setInterval(() => {
			if (state == "playing" && ui.time < 999) setUI((ui) => ({ ...ui, time: ui.time + 1 }));
		},1000)

		return () => clearInterval(timerRef.current);
	}, [state, ui.time]);

	useEffect(() => {
		if (state === "won") {
			jsConfetti.addConfetti();
			clearInterval(timerRef.current);
			player.current.play("win");
		} else if (state === "lost") {
			clearInterval(timerRef.current);
			player.current.play("gameover");
		} else if (state === "playing") {
			setUI({ time: 0, flags: difficulty.mines });
			player.current.stop("gameover")
		} else{
			clearInterval(timerRef.current);
		}
	}, [state]);

	return (
		<div className="App">
			<div className="infoBar">
				<button
					ref={restartBtn}
					onClick={() => {
						setState("playing");
						setUI({ time: 0, flags: difficulty.mines });
					}}
				>
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
									setState("playing");
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
				
				<span
					className="label"
				>{`🚩 ${"0".repeat(difficulty.mines.toString().length - ui.flags.toString().length) + ui.flags}`}</span>
			</div>
			<Grid
				mines={difficulty.mines}
				size={difficulty.size}
				disabled={state === "won" || state === "lost"}
				showMines={state === "lost"}
				restartBtn={restartBtn}
				onUiUpdate={(flags) => setUI({ ...ui, flags: ui.flags + flags })}
				onStateUpdate={(state) => setState(state)}
				onSoundEvent={(sound) => player.current.play(sound)}
			/>

			{state === "won" || state === "lost" &&
				createPortal(
					<div className="overlay">
						<h1>{state === "lost" ? "Game over" : "Well done!"}</h1>

						{state !== "lost" && <p style={{ fontSize: "1.8em" }}>You won in {ui.time} seconds</p>}
						<span
							style={{ marginBottom: "8px" }}
						>Click the restart button to {state === "lost" ? "Restart" : "Play again"}</span>
						<button onClick={() => restartBtn.current?.click()}>{state === "lost" ? "Restart" : "Play again"}</button>
					</div>,
					(document.querySelector(".grid") as Element))}

			<button className="musicBtn" onClick={() => setMuted(!muted)}>
				<MusicIcon muted={muted} />
			</button>
			
			<footer>
				v1.0.3
				<span>
					<a href="https://pkozak.org">Piotr Kozak</a> - 2022
				</span>
				<a href="https://github.com/UltimateDoge5/Minesweeper">Source code</a>
			</footer>
		</div>
	);
};

const MusicIcon = ({ muted }: { muted: boolean }) => {
	if (muted) {
		return (
			<svg
				xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
				stroke="currentColor" width={32} height={32}
			>
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					d="M17.25 9.75L19.5 12m0 0l2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25m-10.5-6l4.72-4.72a.75.75 0 011.28.531V19.94a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.506-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.395C2.806 8.757 3.63 8.25 4.51 8.25H6.75z"
				/>
			</svg>
		);
	}

	return (
		<svg
			xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"
			width={32} height={32}
		>
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z"
			/>
		</svg>
	);
};

const RestartIcon = () => (
	<svg
		xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"
		width={24} height={24}
	>
		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
		/>
	</svg>
);

const ClockIcon = () => (
	<svg
		xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"
		width={32} height={32}
	>
		<path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
	</svg>
);

const DownArrowIcon = () => (
	<svg
		xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"
		width={24} height={24}
	>
		<path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
	</svg>
);

const capitalize = (str: string) => str[0].toUpperCase() + str.slice(1);

const difficulties: Difficulty[] = [
	{ size: [10, 10], mines: 10, name: "beginner" },
	{ size: [16, 16], mines: 40, name: "intermediate" },
	{ size: [16, 30], mines: 99, name: "expert" }
];

interface Difficulty {
	size: [number, number];
	mines: number;
	name: string;
}

export default App;
