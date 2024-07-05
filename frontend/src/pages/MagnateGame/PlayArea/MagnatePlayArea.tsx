import "./MagnatePlayArea.css";

import Resizable from "../../../components/Resizable";
import { useGameState } from "../../../hooks/useGameState";
import useMap from "../../../hooks/useMap";
import MagnateMap from "../MagnateMap";
import RestaurantPlacer from "./Conditionals/RestaurantPlacer";
import TurnOrderList from "./TurnOrderList";
import TurnProgressIndicator from "./TurnProgressIndicator";

function MagnatePlayArea() {
	const { turnProgress, isMyTurn } = useGameState();
	const { onMapObjectClicked } = useMap();

	const conditionalRender: JSX.Element = (() => {
		if (!isMyTurn) return <></>;

		if (turnProgress === "RESTAURANT_PLACEMENT") {
			return <RestaurantPlacer />;
		}

		return <></>;
	})();

	onMapObjectClicked((event) => {
		if (
			isMyTurn &&
			turnProgress === "RESTAURANT_PLACEMENT"
		)
			console.log("clicked", event);
	});

	// const logicDiv: JSX.Element = (()=>{
	// 	switch ()
	// })();

	return (
		<div id="magnate-play-area">
			<Resizable
				defaultWidth={300}
				localKey="turn-order-list"
			>
				<TurnOrderList />
			</Resizable>

			<Resizable
				defaultWidth={1000}
				localKey="magnate-map-section"
				id="magnate-map-section"
			>
				<MagnateMap type="full">
					{conditionalRender}
				</MagnateMap>
				<TurnProgressIndicator />
			</Resizable>
		</div>
	);
}

export default MagnatePlayArea;
