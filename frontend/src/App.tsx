import "./App.css";

import { RecoilRoot } from "recoil";

import MapPiece from "./components/MapPiece";
import GameStores from "./game/GameStores";

function App() {
	return (
		<RecoilRoot>
			<h1>Vite + React</h1>
			<MapPiece piece={GameStores.GAME_TILES[1]} />
			<MapPiece piece={GameStores.GAME_TILES[2]} />
			<MapPiece piece={GameStores.GAME_TILES[3]} />
		</RecoilRoot>
	);
}

export default App;
