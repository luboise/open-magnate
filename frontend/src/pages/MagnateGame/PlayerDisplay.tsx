import "./PlayerDisplay.css";

import Image from "../../components/Image";
import { LobbyPlayerView } from "../../utils";

function PlayerDisplay(props: { player: LobbyPlayerView }) {
	return (
		<div className="player-display">
			<Image
				url={`${props.player.restaurant}`}
				alt={`Player ${props.player.name}'s restaurant logo`}
			/>
			<p>{props.player.name}</p>
		</div>
	);
}

export default PlayerDisplay;
