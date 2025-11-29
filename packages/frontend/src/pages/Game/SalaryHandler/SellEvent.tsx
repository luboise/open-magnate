import "./SellEvent.css";

import { DinnertimeSellInfo } from "magnate-core";
import RestaurantImage from "../../../global_components/RestaurantImage";
import { useDerivedGameState } from "../../../hooks/game/useDerivedGameState";
import House from "../Map/House";

interface Props {
	event: DinnertimeSellInfo;
}

function SellEvent({ event }: Props) {
	const { houses } = useDerivedGameState();

	const house = houses.find(
		(h) => h.priority === event.house
	);

	if (!house) throw new Error("House not found");

	return (
		<div className="event-dinnertime-sell-content">
			<div className="event-dinnertime-sell-diagram">
				<div className="event-sell-restaurant-img">
					<RestaurantImage
						restaurantIndex={event.player}
					/>
				</div>
				<div>arrow</div>
				<House
					house={house}
					usePositioning={false}
				/>
			</div>
			<div className="event-dinnertime-sell-desc">
				Restaurant sold {event.sold.length} demand
				to house {house.priority}.
			</div>
		</div>
	);
}

export default SellEvent;
