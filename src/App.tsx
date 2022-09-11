// import { useState } from "react";
import { useRef } from "react";
import Grid from "./components/grid";
import "./App.css";

const App = () => {
	const restartBtn = useRef<HTMLButtonElement>(null);

	return (
		<div className="App">
			<div className="infoBar">
				<button ref={restartBtn}>
					<RestartIcon />
					Restart
				</button>
			</div>
			<Grid mines={50} restartBtn={restartBtn} />
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

export default App;
