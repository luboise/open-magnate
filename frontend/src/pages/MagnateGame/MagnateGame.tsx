import "./MagnateGame.css";

import Button from "../../components/Button";
import useClipboard from "../../hooks/useClipboard";
import useNotification from "../../hooks/useNotification";
import usePageGame from "../../hooks/usePageGame";
import { MagnateLobbyView } from "../../utils";
import MagnateMap from "./MagnateMap";
import MagnatePlayArea from "./PlayArea/MagnatePlayArea";
import PlayerList from "./PlayerList";

function MagnateGame(props: { data: MagnateLobbyView }) {
	const { writeClipboard } = useClipboard();
	const { sendNotification } = useNotification();

	const { leaveLobby, startGame } = usePageGame();

	function onCopyInviteLink() {
		writeClipboard(props.data.inviteCode);
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
					<p>Lobby: {props.data.lobbyName}</p>
					<div className="lobby-container">
						<h2>
							Players:{" "}
							{props.data.lobbyPlayers.length}
						</h2>
						<PlayerList
							lobbySize={
								props.data.playerCount
							}
							players={
								props.data.lobbyPlayers
							}
						/>
					</div>
					<span>
						Invite code: {props.data.inviteCode}
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
								!props.data.hosting ||
								props.data.lobbyPlayers
									.length <
									props.data.playerCount
							}
							inactiveHoverText="You must be the host to start the game."
						/>
					</div>
				</div>

				{/* </div> */}
			</div>
			{props.data.inGame ? (
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
