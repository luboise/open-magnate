import "./PlayerDisplay.css";

import RestaurantImage from "../../../global_components/RestaurantImage";
import { LobbyPlayerData } from "../../../utils";

function PlayerDisplay(props: { player: LobbyPlayerData }) {
	return (
		<div className="player-display">
			<RestaurantImage
				restaurantNumber={props.player.restaurant}
				alt={`Player ${props.player.name}'s restaurant logo`}
			/>
			<p>{props.player.name}</p>
		</div>
	);
}

export default PlayerDisplay;
