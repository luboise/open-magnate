import "./MagnateGame.css";

import Button from "../../components/Button";
import useClipboard from "../../hooks/useClipboard";
import useNotification from "../../hooks/useNotification";
import usePageGame from "../../hooks/usePageGame";
import { MagnateLobbyView } from "../../utils";
import MapPreview from "./MapPreview";
import PlayerDisplay from "./PlayerDisplay";

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
		<div>
			<div>
				<h1>Lobby</h1>
				<p>Lobby: {props.data.lobbyName}</p>
				<div className="lobby-container">
					<h2>
						Players:{" "}
						{props.data.lobbyPlayers.length}
					</h2>
					<div className="player-display-container">
						{...props.data.lobbyPlayers.map(
							(player) => (
								<PlayerDisplay
									player={player}
								/>
							)
						)}
					</div>
					<span>
						Invite code: {props.data.inviteCode}
					</span>
					<Button
						onClick={onCopyInviteLink}
						text="Copy invite"
					/>
				</div>
				<Button
					text="Leave Lobby"
					onClick={leaveLobby}
				/>
				<MapPreview
					map={props.data.gameState.map}
				/>
			</div>
		</div>
	);
}

export default MagnateGame;
