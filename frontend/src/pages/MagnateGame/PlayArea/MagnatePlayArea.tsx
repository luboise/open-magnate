import "./MagnatePlayArea.css";

import Resizable from "../../../components/Resizable";
import useMap from "../../../hooks/useMap";
import MagnateMap from "../MagnateMap";
import TurnProgressIndicator from "./TurnProgressIndicator";

function MagnatePlayArea() {
	const { onMapObjectClicked } = useMap();

	onMapObjectClicked((event) => {
		console.log("clicked", event);
	});

	return (
		<div id="magnate-play-area">
			<Resizable
				defaultWidth={1000}
				id="magnate-map-section"
			>
				<MagnateMap type="full" />
				<TurnProgressIndicator />
			</Resizable>
		</div>
	);
}

export default MagnatePlayArea;
