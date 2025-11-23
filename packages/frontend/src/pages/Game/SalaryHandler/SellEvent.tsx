import "./SellEvent.css";

import RestaurantImage from "../../../global_components/RestaurantImage";
import { useGameStateView } from "../../../hooks/game/useGameState";
import { DinnertimeSellInfo } from "../../../utils";
import House from "../Map/House";

interface Props {
	event: DinnertimeSellInfo;
}

function SellEvent({ event }: Props) {
	const { houses } = useGameStateView();

	const house = houses.find(
		(h) => h.priority === event.house
	);

	if (!house) throw new Error("House not found");

	return (
		<div className="event-dinnertime-sell-content">
			<div className="event-dinnertime-sell-diagram">
				<div className="event-sell-restaurant-img">
					<RestaurantImage
						restaurantNumber={event.player}
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
