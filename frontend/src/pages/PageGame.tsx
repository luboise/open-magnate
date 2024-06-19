import { useEffect, useReducer } from "react";
import useWebSocket, {
	ReadyState
} from "react-use-websocket";
import Button from "../components/Button";
import Form from "../components/Form";
import FormInput from "../components/FormInput";
import { WEB_SOCKET_BASE_URL } from "../hooks/useAPI";
import useLocalVal from "../hooks/useLocalVal";
import {
	APIRoutes,
	BackendMessage,
	FrontendMessage,
	LobbySubmissionData,
	MagnateLobbyData
} from "../utils";
import MagnateGame from "./MagnateGame/MagnateGame";

const LOCAL_STORAGE_SESSION_KEY_NAME = "sessionKey";

type PageState =
	| "UNVERIFIED"
	| "IDLE"
	| "CREATING_LOBBY"
	| "HOSTING_LOBBY"
	| "JOINING_LOBBY"
	| "IN_GAME";

type GamePageState = {
	pageState: PageState;
	lobbyData: MagnateLobbyData | null;
};

type GamePageStateMessage = {
	type: PageState;
};

function PageGame() {
	// const { newGame } = useGameState();
	// const [triggerNewGame] = useTriggeredCallback(newGame);

	const [sessionKey, setSessionKey] = useLocalVal<string>(
		LOCAL_STORAGE_SESSION_KEY_NAME
	);

	const { sendJsonMessage, lastJsonMessage, readyState } =
		useWebSocket<FrontendMessage>(
			WEB_SOCKET_BASE_URL + APIRoutes.PLAY,
			{
				onOpen: () => {
					if (sessionKey) {
						sendJsonMessage({
							type: "CHECK_SESSION_KEY",
							data: sessionKey
						});
					}
				}
				// onClose: () => {
				// 	dispatch({
				// 		type: "UNVERIFIED"
				// 	} as GamePageStateMessage);
				// }
			},
			// Want autoreconnect on
			true
		);

	const reducer = (
		state: GamePageState,
		message: FrontendMessage | GamePageStateMessage
	): GamePageState => {
		switch (message.type) {
			case "NEW_LOBBY": {
				return {
					...state,
					pageState: "HOSTING_LOBBY",
					lobbyData: message.data
				} as GamePageState;
			}
			case "LOBBY_UPDATED": {
				if (!state) {
					throw new Error(
						"Attempted to update lobby with null state."
					);
				}
				return {
					...state
				} as GamePageState;
			}
			case "CREATING_LOBBY": {
				if (state.lobbyData) {
					throw new Error(
						"Attempted to create lobby while already in lobby."
					);
				}

				return {
					...state,
					pageState: "CREATING_LOBBY"
				};
			}
			case "NEW_SESSION_KEY": {
				try {
					if (!message.data)
						throw new Error(
							"Invalid session key received."
						);

					setSessionKey(message.data);
				} catch (error) {
				} finally {
					return state;
				}
			}
			default:
				return state;
		}
	};

	const [state, dispatch] = useReducer<typeof reducer>(
		reducer,
		{
			pageState: "IDLE",
			lobbyData: null
		} as GamePageState
	);

	useEffect(() => {
		if (!lastJsonMessage) return;
		else if (typeof lastJsonMessage === "string") {
			console.error(lastJsonMessage);
			return;
		}

		dispatch(lastJsonMessage);
		// if (lastJsonMessage !== null) {

		// }
	}, [lastJsonMessage]);

	// Check for bad ready states
	switch (readyState) {
		case ReadyState.OPEN:
			break;
		case ReadyState.CLOSED: {
			return (
				<div>
					Your connection to the server has
					closed. Please try refreshing the page.
				</div>
			);
		}
		case ReadyState.CLOSING:
			return <div>Disconnecting from server...</div>;
		case ReadyState.CONNECTING:
			return <div>Connecting to server...</div>;
		default:
			return <div>Unknown error.</div>;
	}

	if (state.pageState === "IDLE") {
		return (
			<>
				<Button
					text="Create Lobby"
					onClick={() =>
						dispatch({ type: "CREATING_LOBBY" })
					}
				></Button>
				<Button
					text="Join Lobby"
					onClick={() =>
						dispatch({ type: "JOINING_LOBBY" })
					}
				></Button>
			</>
		);
	} else if (state.pageState === "CREATING_LOBBY") {
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
	} else if (state.lobbyData !== null) {
		return (
			<MagnateGame
				data={state.lobbyData}
			></MagnateGame>
		);
	} else return <div>Unknown error.</div>;
}

export default PageGame;
