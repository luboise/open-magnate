import "./MagnateGame.css";

import Button from "../../components/Button";
import useClipboard from "../../hooks/useClipboard";
import useNotification from "../../hooks/useNotification";
import usePageGame from "../../hooks/usePageGame";
import {
	GameStateViewPerPlayer,
	LobbyViewPerPlayer
} from "../../utils";
import MagnateMap from "./MagnateMap";
import MagnatePlayArea from "./PlayArea/MagnatePlayArea";
import PlayerList from "./PlayerList";

function MagnateGame(props: {
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

	return (
		<div id="magnate-game-page">
			<div id="lobby-outer-container">
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
					<Button
						onClick={onCopyInviteLink}
						text="Copy invite"
					/>
					<div id="lobby-btn-start-leave">
						<Button
							id="btn-leave-lobby"
							text="Leave Lobby"
							onClick={leaveLobby}
						/>
						<Button
							id="btn-start-game"
							text="Start Game"
							onClick={startGame}
							inactive={
								!lobby.hosting ||
								lobby.players.length <
									gameState.playerCount
							}
							inactiveHoverText="You must be the host to start the game."
						/>
					</div>
				</div>

				{/* </div> */}
			</div>
			{lobby.inGame ? (
				<MagnatePlayArea />
			) : (
				// <Resizable defaultWidth={1000}>
				<div id="lobby-map-preview">
					<MagnateMap type="full" />
				</div>
				// </Resizable>
			)}
		</div>
	);
}

export default MagnateGame;
