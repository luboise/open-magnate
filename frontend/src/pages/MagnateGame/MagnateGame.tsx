import "./MagnateGame.css";

import { MagnateLobbyView } from "../../utils";
import PlayerDisplay from "./PlayerDisplay";

function MagnateGame(props: { data: MagnateLobbyView }) {
	console.debug(props.data);
	return (
		<div>
			<div>
				<h1>Lobby</h1>
				<p>Lobby: {props.data.lobbyName}</p>
				<div className="lobby-container">
					<h2>
						Players:{" "}
						{props.data.lobbyPlayers.length}
						<div className="player-display-container">
							{props.data.lobbyPlayers.map(
								(player) => (
									<PlayerDisplay
										player={player}
									/>
								)
							)}
						</div>
					</h2>
				</div>
			</div>
		</div>
	);
}

export default MagnateGame;
