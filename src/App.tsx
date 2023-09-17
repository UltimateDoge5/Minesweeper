import { useEffect, useRef, useState } from "react";
import { Menu, MenuButton, MenuItem } from "@szhsin/react-menu";
import Grid, { GameState } from "./components/grid";
import { createPortal } from "react-dom";
import JSConfetti from "js-confetti";
import AudioPlayer from "./components/audioPlayer";
import { ClockIcon, DownArrowIcon, MusicIcon, RestartIcon } from "./components/icons";
import "./App.css";

const jsConfetti = new JSConfetti();
const initialMute = localStorage.getItem("muted") === null ? true : localStorage.getItem("muted") === "true";

const App = () => {
	const restartBtn = useRef<HTMLButtonElement>(null);
	const timerRef = useRef(0);
	const [difficulty, setDifficulty] = useState<Difficulty>(difficulties[1]);
	const [ui, setUI] = useState({ time: 0, flags: difficulty.mines });
	const [state, setState] = useState<GameState>("waiting");
	const [muted, setMuted] = useState(initialMute);
	const [fontSize, setFontSize] = useState(parseInt(localStorage.getItem("fontSize") ?? "0"));
	const player = useRef(new AudioPlayer());

	useEffect(() => {
		//We can ignore the promises
		if (muted) {
			localStorage.setItem("muted", "true");
			player.current.muted = true;
		} else {
			localStorage.setItem("muted", "false");
			player.current.muted = false;
		}
	}, [muted]);

	useEffect(() => {
		timerRef.current = window.setInterval(() => {
			if (state == "playing" && ui.time < 999) setUI((ui) => ({ ...ui, time: ui.time + 1 }));
		}, 1000);

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
		} else {
			clearInterval(timerRef.current);
			player.current.stop("gameover");
		}
	}, [state]);

	useEffect(() => {
		localStorage.setItem("fontSize", fontSize.toString());
		document.documentElement.style.setProperty("--cell-font-size", `${fontSize}px`);
	}, [fontSize]);

	return (
		<div className="App">
			<div className="infoBar">
				<button
					ref={restartBtn}
					onClick={() => {
						setState("waiting");
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

				<span className="label">{`🚩 ${"0".repeat(difficulty.mines.toString().length - ui.flags.toString().length) + ui.flags}`}</span>
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

			{(state === "won" || state === "lost") &&
				createPortal(
					<div className="overlay">
						<h1>{state === "lost" ? "Game over" : "Well done!"}</h1>

						{state !== "lost" && <p style={{ fontSize: "1.8em" }}>You won in {ui.time} seconds</p>}
						<span style={{ marginBottom: "8px" }}>Click the restart button to {state === "lost" ? "Restart" : "Play again"}</span>
						<button onClick={() => restartBtn.current?.click()}>{state === "lost" ? "Restart" : "Play again"}</button>
					</div>,
					document.querySelector(".grid") as Element
				)}

			<div
				style={{
					position: "absolute",
					display: "flex",
					justifyContent: "center",
					gap: "8px",
					top: "8px",
					right: "8px",
					transition: "all 0.3s ease"
				}}
			>
				<button className="musicBtn" onClick={() => setMuted(!muted)}>
					<MusicIcon muted={muted} />
				</button>
				<button
					title="Increase font size"
					onClick={() => {
						if (fontSize < 10) {
							setFontSize(fontSize + 2);
						} else {
							setFontSize(0);
						}
					}}
					style={{
						fontSize: "18px"
					}}
				>
					Aa
				</button>
			</div>

			<footer>
				v1.0.7
				<span>
					<a href="https://pkozak.org">Piotr Kozak</a> - {new Date().getFullYear()}
				</span>
				<a href="https://github.com/UltimateDoge5/Minesweeper">Source code</a>
			</footer>
		</div>
	);
};
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
