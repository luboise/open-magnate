import { useReducer, useRef } from "react";
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
	JoinLobbyMessage,
	JoinLobbySubmissionData,
	LobbySubmissionData,
	MagnateLobbyView
} from "../utils";
import MagnateGame from "./MagnateGame/MagnateGame";
import { useRecoilState } from "recoil";
import { PageGameAtom } from "./PageGameContext";

const LOCAL_STORAGE_SESSION_KEY_NAME = "sessionKey";

type PageState =
	| "AWAITING_VERIFICATION"
	| "UNVERIFIED"
	| "VERIFIED"
	| "CREATING_LOBBY"
	| "HOSTING_LOBBY"
	| "JOINING_LOBBY"
	| "IN_GAME";

type GamePageState = {
	pageState: PageState;
	lobbyData: MagnateLobbyView | null;
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

	const reconnectOnFail = useRef(false);
	function reconnectLater() {
		console.debug("Queued a reconnection.");
		reconnectOnFail.current = true;
	}

	const websocketUrl = `${WEB_SOCKET_BASE_URL}${APIRoutes.PLAY}?sessionKey=${sessionKey ?? ""}`;

	const [pageGameObject, setPageGameObject] = useRecoilState(PageGameAtom);

	const { sendJsonMessage, readyState } =
		useWebSocket<FrontendMessage>(websocketUrl, {
			onOpen: () => {
				console.debug(
					`Connection to the server has been opened with${sessionKey ? " session key " + sessionKey : "out a session key."}`
				);
				dispatch({
					type: "UNVERIFIED"
				});

				setPageGameObject({ ...pageGameObject, sendMessage: sendJsonMessage });
			},
			onMessage: (message: MessageEvent<any>) => {
				try {
					const data = JSON.parse(message.data);

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
			},
			onClose: () => {
				console.debug(
					"Connection to the server has been closed."
				);
			},
			shouldReconnect: (_closeEvent) => {
				if (reconnectOnFail) {
					console.debug(
						"Attempting to reconnect..."
					);
					reconnectOnFail.current = false;
					return true;
				}

				console.debug(
					"No opportunity to reconnect to the server..."
				);
				return false;
			}
		});

	const reducer = (
		state: GamePageState,
		message: FrontendMessage | GamePageStateMessage
	): GamePageState => {
		switch (message.type) {
			case "SET_LOBBY": {
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
					if (
						!message.data ||
						typeof message.data !== "string"
					)
						throw new Error(
							"Invalid session key received."
						);

					console.debug(
						"Received new session key: " +
						message.data
					);
					setSessionKey(message.data);
					reconnectLater();
				} catch (error) {
					console.error(error);
				}

				return state;
			}
			case "CLEAR_LOCAL_DATA": {
				reconnectLater();
				setSessionKey(null);

				return state;
			}
			case "SESSION_KEY_VERIFIED": {
				return {
					...state,
					pageState: "VERIFIED"
				};
			}
			case "LEAVE_LOBBY": {
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
		return <div>Verifying. Please wait.</div>;
	} else if (state.pageState === "VERIFIED") {
		return (
			<>
				<Button
					text="Create Lobby"
					onClick={() =>
						dispatch({ type: "CREATING_LOBBY" })
					}
				></Button>
				<Form
					submitText="Join Lobby"
					onSubmit={(data) => {
						sendJsonMessage({
							type: "JOIN_LOBBY",
							data: data as JoinLobbySubmissionData
						} as JoinLobbyMessage);
					}}
				>
					<FormInput
						name="inviteCode"
						defaultValue=""
						regex={/^[a-zA-Z\d]{8}$/}
						labelText="Invite Code"
					/>
					<FormInput
						name="password"
						defaultValue=""
						labelText="Lobby Password (optional)"
					/>
				</Form>
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
