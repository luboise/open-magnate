import "./PlayerList.css";

import { useMemo } from "react";
import { LobbyPlayerData } from "../../../utils";
import EmptyPlayer from "./EmptyPlayer";
import PlayerDisplay from "./PlayerDisplay";

function PlayerList(props: {
	lobbySize: number;
	players: LobbyPlayerData[];
}) {
	const jsxElements: JSX.Element[] = useMemo(() => {
		const stuff = new Array<JSX.Element>(
			props.lobbySize
		).fill(<EmptyPlayer />);
		for (let i = 0; i < props.players.length; i++) {
			// Make sure we don't go out of bounds
			if (i > props.lobbySize) break;

			stuff[i] = (
				<PlayerDisplay player={props.players[i]} />
			);
		}

		return stuff;
	}, [
		props.players,
		props.players.length,
		props.lobbySize
	]);

	return (
		<div className="player-display-container">
			{...jsxElements}
		</div>
	);
}

export default PlayerList;

