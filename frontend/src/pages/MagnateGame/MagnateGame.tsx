import { MagnateGameData } from "../PageGame";

function MagnateGame(props: { data: MagnateGameData }) {
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
