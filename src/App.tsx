// import { useState } from "react";
import "./App.css";
import Grid from "./components/grid";

const App = () => {
	return (
		<div className="App">
			<Grid mines={50} />
		</div>
	);
};

export default App;
