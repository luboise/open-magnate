import { MagnateLobbyData } from "../../utils";

function MagnateGame(props: { data: MagnateLobbyData }) {
	return (
		<div>
			<div>
				<h2>Lobby</h2>
				<p>Lobby: {props.data.lobbyName}</p>
				<p>
					Players:{" "}
					{props.data.lobbyPlayers.length}
					{props.data.lobbyPlayers.map(
						(player) => (
							<span>{player.name}</span>
						)
					)}
				</p>
			</div>
		</div>
	);
}

export default MagnateGame;
