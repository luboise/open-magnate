import "./MagnatePlayArea.css";

import Resizable from "../../../components/Resizable";
import { MapTileData } from "../../../utils";
import MagnateMap from "../MagnateMap";
import TurnProgressIndicator from "./TurnProgressIndicator";

function MagnatePlayArea() {
	function onTileClicked(tile: MapTileData) {
		console.debug(tile);
	}

	return (
		<div id="magnate-play-area">
			<Resizable
				defaultWidth={1000}
				id="magnate-map-section"
			>
				<MagnateMap
					type="full"
					onTileClicked={onTileClicked}
				/>
				<TurnProgressIndicator />
			</Resizable>
		</div>
	);
}

export default MagnatePlayArea;
