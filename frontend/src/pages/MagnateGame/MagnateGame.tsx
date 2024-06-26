import "./MagnateGame.css";

import Button from "../../components/Button";
import useClipboard from "../../hooks/useClipboard";
import useNotification from "../../hooks/useNotification";
import usePageGame from "../../hooks/usePageGame";
import {
	MagnateLobbyView
} from "../../utils";
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
							Invite code:{" "}
							{props.data.inviteCode}
						</span>
						<Button
							onClick={onCopyInviteLink}
							text="Copy invite"
						/>
					</h2>
				</div>
				<Button
					text="Leave Lobby"
					onClick={leaveLobby}
				/>
			</div>
		</div>
	);
}

export default MagnateGame;
