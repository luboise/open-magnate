import "./App.css";

import { RecoilRoot } from "recoil";

import MapTile from "./components/MapTile";
import GameStores from "./game/GameStores";

function App() {
	return (
		<RecoilRoot>
			<h1>Vite + React</h1>
			<MapTile piece={GameStores.GAME_TILES[1]} />
		</RecoilRoot>
	);
}

export default App;
