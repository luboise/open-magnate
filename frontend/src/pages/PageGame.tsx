import { useReducer } from "react";
import useWebSocket, {
	ReadyState
} from "react-use-websocket";
import Button from "../components/Button";
import Form from "../components/Form/Form";
import FormInput from "../components/Form/FormInput";
import SelectionButtonList from "../components/Form/SelectionButtonList";
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
	| "VERIFIED"
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

	const { sendJsonMessage, readyState } =
		useWebSocket<FrontendMessage>(
			WEB_SOCKET_BASE_URL + APIRoutes.PLAY,
			{
				onOpen: () => {
					if (
						sessionKey &&
						sessionKey.length > 0
					) {
						console.debug(
							`Checking existing session key: ${sessionKey}`
						);
						sendJsonMessage({
							type: "CHECK_SESSION_KEY",
							data: sessionKey
						});
					} else {
						console.debug(
							"No existing session key found. Requesting new session key."
						);
						sendJsonMessage({
							type: "NEW_SESSION_KEY"
						});
					}
				},
				onMessage: (message: MessageEvent<any>) => {
					try {
						const data = JSON.parse(
							message.data
						);

						if (typeof data === "string") {
							console.debug(data);
							return;
						}

						dispatch(data as FrontendMessage);
					} catch (error) {
						console.error(
							"Unable to parse message: ",
							message.data
						);
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

					console.debug(
						"Received new session key: " +
							message.data
					);
					setSessionKey(message.data);
					sendJsonMessage({
						type: "CHECK_SESSION_KEY",
						data: message.data
					});
				} catch (error) {
					console.error(error);
				}

				return state;
			}
			case "CLEAR_LOCAL_DATA": {
				setSessionKey(null);
				return state;
			}
			case "SUCCESSFUL_SESSION_KEY_VERIFICATION": {
				return {
					...state,
					pageState: "VERIFIED"
				};
			}
			default:
				console.debug(
					"No message handler could handler the following message. Please report this.",
					message
				);
				return state;
		}
	};

	const [state, dispatch] = useReducer<typeof reducer>(
		reducer,
		{
			pageState: "UNVERIFIED",
			lobbyData: null
		} as GamePageState
	);

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

	if (state.pageState === "UNVERIFIED") {
		console.debug(
			"Page is in an unverified state. Unable to access game."
		);
		return <div>Verifying. Please wait.</div>;
	} else if (state.pageState === "VERIFIED") {
		console.debug(
			"Page is in a verified state. Accessing game."
		);
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
					console.log(
						data as LobbySubmissionData
					);
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
				<SelectionButtonList
					name="playerCount"
					// regex={/2|3|4|5|6/}
					defaultValue={2}
					valueList={[2, 3, 4, 5, 6]}
				/>
				<FormInput
					name="password"
					labelText="Password (optional)"
				/>
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

