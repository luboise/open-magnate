import "./PageAllMapPieces.css";

import MapPiece from "../components/MapPiece";
import GameStores from "../game/GameStores";

function PageAllMapPieces() {
	const allTiles: Array<JSX.Element> = Object.values(
		GameStores.GAME_TILES
	).map((piece) => <MapPiece piece={piece} />);

	return (
		<div className="all-tiles-container">
			{...allTiles}
		</div>
	);
}

export default PageAllMapPieces;
