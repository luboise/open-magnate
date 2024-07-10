import { useEffect, useReducer, useRef } from "react";
import useWebSocket, {
	ReadyState
} from "react-use-websocket";
import { useRecoilState } from "recoil";
import Button from "../components/Button";
import Form from "../components/Form/Form";
import FormInput from "../components/Form/FormInput";
import SelectionButtonList from "../components/Form/SelectionButtonList";
import { WEB_SOCKET_BASE_URL } from "../hooks/useAPI";
import { useGameState } from "../hooks/useGameState";
import useLocalVal from "../hooks/useLocalVal";
import {
	APIRoutes,
	BackendMessage,
	FrontendMessage,
	GameStateViewPerPlayer,
	JoinLobbyMessage,
	JoinLobbySubmissionData,
	LobbySubmissionData,
	LobbyViewPerPlayer
} from "../utils";
import LobbyManager from "./MagnateGame/LobbyManager";
import { PageGameAtom } from "./PageGameContext";

const LOCAL_STORAGE_SESSION_KEY_NAME = "sessionKey";
const LOCAL_STORAGE_INVITE_CODE_NAME = "inviteCode";

type PageState =
	| "AWAITING_VERIFICATION"
	| "UNVERIFIED"
	| "VERIFIED"
	| "CREATING_LOBBY";

type GamePageState = {
	pageState: PageState;
	lobbyState: LobbyViewPerPlayer | null;
	gameState: GameStateViewPerPlayer | null;
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

	const [inviteCode, setInviteCode] = useLocalVal<string>(
		LOCAL_STORAGE_INVITE_CODE_NAME
	);

	const { setState: setGameState } = useGameState();

	const reconnectOnFail = useRef(false);
	function reconnectLater() {
		console.debug("Queued a reconnection.");
		reconnectOnFail.current = true;
	}

	const websocketUrl = `${WEB_SOCKET_BASE_URL}${APIRoutes.PLAY}?sessionKey=${sessionKey ?? ""}`;

	const [pageGameObject, setPageGameObject] =
		useRecoilState(PageGameAtom);

	const { sendJsonMessage, readyState } =
		useWebSocket<FrontendMessage>(websocketUrl, {
			onOpen: () => {
				console.debug(
					`Connection to the server has been opened with${sessionKey ? " session key " + sessionKey : "out a session key."}`
				);
				dispatch({
					type: "UNVERIFIED"
				});

				setPageGameObject({
					...pageGameObject,
					sendMessage: sendJsonMessage
				});
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
		console.debug(message);

		switch (message.type) {
			case "ALL_UPDATED": {
				const newState: GamePageState = {
					...state,
					pageState: "VERIFIED",
					lobbyState: message.data.lobbyState,
					gameState: message.data.gameState
				};
				// if (newState.lobbyState) {
				// 	if (newState.lobbyState.inGame) {
				// 		newState.;
				// 	}
				// }

				return newState;
			}
			case "LOBBY_UPDATED": {
				if (!state) {
					throw new Error(
						"Attempted to update lobby with null state."
					);
				}
				const newState: GamePageState = {
					...state,
					lobbyState: message.data
				};
				return newState;
			}
			case "GAMESTATE_UPDATED": {
				return {
					...state,
					gameState: message.data
				};
			}
			case "CREATING_LOBBY": {
				if (state.lobbyState) {
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
				console.debug("Leaving lobby.");

				const newState: GamePageState = {
					...state,
					pageState: "VERIFIED",
					lobbyState: null
				};
				setGameState(null);
				return newState;
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
			lobbyState: null
		} as GamePageState
	);

	useEffect(() => {
		console.debug("Page state updated: ", state);
	}, [
		state.gameState,
		state.lobbyState,
		state.pageState
	]);

	// Update the gamestate when it changes
	useEffect(() => {
		setGameState(state.gameState);
	}, [state.gameState]);

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

	// If unverified
	if (state.pageState === "UNVERIFIED") {
		return <div>Verifying. Please wait.</div>;
	}
	// If creating a lobby
	else if (state.pageState === "CREATING_LOBBY") {
		return (
			<Form
				onSubmit={(data: any) => {
					console.debug(
						`Attempting to create a lobby using the following data: `,
						data
					);

					sendJsonMessage({
						type: "CREATE_LOBBY",
						data: {
							...data,
							playerCount: Number(
								data.playerCount
							)
						} as LobbySubmissionData
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
	}
	// If out of lobby
	else if (!state.lobbyState) {
		return (
			<>
				<Button
					onClick={() =>
						dispatch({ type: "CREATING_LOBBY" })
					}
				>
					Create Lobby
				</Button>
				<Form
					submitText="Join Lobby"
					onSubmit={(data) => {
						const formData =
							data as JoinLobbySubmissionData;

						sendJsonMessage({
							type: "JOIN_LOBBY",
							data: formData
						} as JoinLobbyMessage);
						setInviteCode(formData.inviteCode);
					}}
				>
					<FormInput
						name="inviteCode"
						defaultValue={inviteCode ?? ""}
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
	}
	// If creating a lobby
	else if (
		state.lobbyState !== null &&
		state.gameState !== null
	) {
		return (
			<LobbyManager
				lobby={state.lobbyState}
				gameState={state.gameState}
			></LobbyManager>
		);
	} else return <div>Unknown error.</div>;
}

export default PageGame;
