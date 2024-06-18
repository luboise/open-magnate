import { useEffect, useReducer } from "react";
import useWebSocket, {
	ReadyState
} from "react-use-websocket";
import Form from "../components/Form";
import FormInput from "../components/FormInput";
import { WEB_SOCKET_BASE_URL } from "../hooks/useAPI";
import {
	APIRoutes,
	BackendMessage,
	FrontendMessage,
	LobbySubmissionData,
	MagnateLobbyData
} from "../utils";
import MagnateGame from "./MagnateGame/MagnateGame";

// const LOCAL_STORAGE_SESSION_KEY_NAME = "sessionKey";

function PageGame() {
	// const { newGame } = useGameState();
	// const [triggerNewGame] = useTriggeredCallback(newGame);

	// const { get, set } = useLocalStorage();

	const [state, dispatch] = useReducer(
		(
			state: MagnateLobbyData | null,
			message: FrontendMessage
		): MagnateLobbyData | null => {
			switch (message.type) {
				case "NEW_LOBBY": {
					return message.data as MagnateLobbyData;
				}
				case "LOBBY_UPDATED": {
					if (!state) {
						throw new Error(
							"Attempted to update lobby with null state."
						);
					}
					return { ...state, ...message.data };
				}
				default:
					return state;
			}
		},
		null
	);

	const { sendJsonMessage, lastJsonMessage, readyState } =
		useWebSocket<FrontendMessage>(
			WEB_SOCKET_BASE_URL + APIRoutes.PLAY
		);

	useEffect(() => {
		if (!lastJsonMessage) return;
		dispatch(lastJsonMessage);
		// if (lastJsonMessage !== null) {

		// }
	}, [lastJsonMessage]);

	if (readyState === ReadyState.CONNECTING) {
		return <div>Connecting to server...</div>;
	} else if (readyState === ReadyState.OPEN) {
	} else if (readyState === ReadyState.CLOSING) {
		return <div>Disconnecting from server...</div>;
	} else if (readyState === ReadyState.CLOSED) {
		return (
			<div>
				Your connection to the server has closed.
				Please try refreshing the page.
			</div>
		);
	}

	if (!state) {
		return (
			<Form
				onSubmit={(data) => {
					sendJsonMessage({
						type: "CREATE_LOBBY",
						data: data as LobbySubmissionData
					} as BackendMessage);
				}}
			>
				<FormInput
					name="name"
					labelText="Lobby Name"
				/>
				<FormInput name="password" />
			</Form>
		);
	}

	return <MagnateGame data={state}></MagnateGame>;
}

export default PageGame;
