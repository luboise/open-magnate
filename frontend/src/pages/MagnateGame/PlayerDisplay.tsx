import Image from "../../components/Image";
import { LobbyPlayerView } from "../../utils";

function PlayerDisplay(props: { player: LobbyPlayerView }) {
	return (
		<div className="player-display">
			<Image url={`${props.player.restaurant}`} />
			<span>{props.player.name}</span>
		</div>
	);
}

export default PlayerDisplay;

