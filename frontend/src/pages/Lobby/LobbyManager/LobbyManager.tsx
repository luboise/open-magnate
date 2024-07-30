import "./LobbyManager.css";

import Button from "../../../global_components/Button";
import usePageGame from "../../../hooks/game/usePageGame";
import useClipboard from "../../../hooks/useClipboard";
import useNotification from "../../../hooks/useNotification";
import {
	GameStateViewPerPlayer,
	LobbyViewPerPlayer
} from "../../../utils";
import MagnateMap from "../../Game/Map/MagnateMap";
import PageGame from "../../Game/PageGame";
import PlayerList from "./PlayerList";

function LobbyManager(props: {
	lobby: LobbyViewPerPlayer;
	gameState: GameStateViewPerPlayer;
}) {
	const { lobby, gameState } = props;

	const { writeClipboard } = useClipboard();
	const { sendNotification } = useNotification();

	const { leaveLobby, startGame } = usePageGame();

	function onCopyInviteLink() {
		writeClipboard(lobby.inviteCode);
		sendNotification(
			"Copied invite link to clipboard.",
			"Notification stuff."
		);
	}

	if (lobby.inGame) return <PageGame />;

	return (
		<div id="magnate-game-page">
			<div
				id="lobby-outer-container"
				onContextMenu={(e) => {
					e.preventDefault();
				}}
			>
				{/* <h2>Lobby</h2> */}
				{/* <div id="lobby-inner-container"> */}
				<div id="lobby-player-container">
					<p>Lobby: {lobby.lobbyName}</p>
					<div className="lobby-container">
						<h2>
							Players: {lobby.players.length}
						</h2>
						<PlayerList
							lobbySize={
								gameState.playerCount
							}
							players={lobby.players}
						/>
					</div>
					<span>
						Invite code: {lobby.inviteCode}
					</span>
					<Button onClick={onCopyInviteLink}>
						Copy invite
					</Button>
					<div id="lobby-btn-start-leave">
						<Button
							id="btn-leave-lobby"
							onClick={leaveLobby}
						>
							Leave Lobby
						</Button>
						<Button
							id="btn-start-game"
							onClick={startGame}
							inactive={
								!lobby.hosting ||
								lobby.players.length <
									gameState.playerCount
							}
							inactiveHoverText="You must be the host to start the game."
						>
							Start Game
						</Button>
					</div>
				</div>

				{/* </div> */}
			</div>
			{lobby.inGame ? (
				// <Game />
				<></>
			) : (
				// <Resizable defaultWidth={1000}>
				<div id="lobby-map-preview">
					<MagnateMap />
				</div>
				// </Resizable>
			)}
		</div>
	);
}

export default LobbyManager;
