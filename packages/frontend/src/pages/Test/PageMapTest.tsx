import { BASE_GAME_MAP_PIECES, GameMap } from "magnate-core";
import MagnateMap from "../Game/Map/MagnateMap";

function PageMapTest() {

	const gameMap: GameMap = GameMap.create(2, BASE_GAME_MAP_PIECES);

	return (
		<>
			<MagnateMap
				id="magnate-map"
				gameMap={gameMap}
				style={{
					zIndex: -1,
				}}
				onContextMenu={(e) => {
					e.preventDefault();
					e.stopPropagation();
				}}
			>
				{/* <TilePlacer /> */}
				{/* {mapConditional} */}
			</MagnateMap>

			<div>
				Map test
			</div>
		</>
	)
}

export default PageMapTest
