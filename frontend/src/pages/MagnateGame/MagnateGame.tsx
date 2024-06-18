import { MagnateLobbyData } from "../../utils";

function MagnateGame(props: { data: MagnateLobbyData }) {
	return (
		<div>
			<h1>MagnateGame</h1>
			<p>{props.data.lobbyName}</p>
			<p>
				{props.data.lobbyPlayers.map((player) => (
					<span>{player.name}</span>
				))}
			</p>
		</div>
	);
}

export default MagnateGame;
