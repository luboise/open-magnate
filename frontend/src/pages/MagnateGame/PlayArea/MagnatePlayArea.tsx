import "./MagnatePlayArea.css";

import Resizable from "../../../components/Resizable";
import useMap from "../../../hooks/useMap";
import MagnateMap from "../MagnateMap";
import TurnOrderList from "./TurnOrderList";
import TurnProgressIndicator from "./TurnProgressIndicator";

function MagnatePlayArea() {
	const { onMapObjectClicked } = useMap();

	onMapObjectClicked((event) => {
		console.log("clicked", event);
	});

	// const logicDiv: JSX.Element = (()=>{
	// 	switch ()
	// })();

	return (
		<div id="magnate-play-area">
			<Resizable
				defaultWidth={500}
				localKey="turn-order-list"
			>
				<TurnOrderList />
			</Resizable>

			<Resizable
				defaultWidth={1000}
				localKey="magnate-map-section"
				id="magnate-map-section"
			>
				<MagnateMap type="full" />
				<TurnProgressIndicator />
			</Resizable>
		</div>
	);
}

export default MagnatePlayArea;
