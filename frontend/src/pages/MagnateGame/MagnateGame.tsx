import "./MagnateGame.css";

import Button from "../../components/Button";
import useClipboard from "../../hooks/useClipboard";
import useNotification from "../../hooks/useNotification";
import usePageGame from "../../hooks/usePageGame";
import { MagnateLobbyView } from "../../utils";
import MapPreview from "./MapPreview";
import PlayerList from "./PlayerList";

function MagnateGame(props: { data: MagnateLobbyView }) {
	const { writeClipboard } = useClipboard();
	const { sendNotification } = useNotification();

	const { leaveLobby } = usePageGame();

	function onCopyInviteLink() {
		writeClipboard(props.data.inviteCode);
		sendNotification(
			"Copied invite link to clipboard.",
			"Notification stuff."
		);
	}

	// console.debug(props.data);
	return (
		<>
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
							onClick={alert}
						/>
					</div>
				</div>

				{/* </div> */}
			</div>
			<div id="lobby-map-preview">
				<MapPreview type="full" />
			</div>
		</>
	);
}

export default MagnateGame;
