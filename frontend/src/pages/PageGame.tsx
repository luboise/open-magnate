import { useEffect, useReducer } from "react";
import Form from "../components/Form";
import FormInput from "../components/FormInput";
import useAPI from "../hooks/useAPI";
import { useLocalStorage } from "../hooks/useLocalStorage";
import {
	APIRoutes,
	LobbySubmissionData,
	MagnateLobbyData
} from "../utils";
import MagnateGame from "./MagnateGame/MagnateGame";

interface GamePageAction {
	type: GamePageActionName;
	data?: any;
}

type GamePageActionName =
	| "setLobby"
	| "leaveLobby"
	| "startGame"
	| "endGame";

type GamePageState =
	| { lobbyId: null; data: null }
	| {
			lobbyId: number;
			data: MagnateLobbyData | null;
	  };

const LOCAL_STORAGE_LOBBY_ID_KEY = "lobbyId";

function PageGame() {
	const { post } = useAPI();

	// const { newGame } = useGameState();
	// const [triggerNewGame] = useTriggeredCallback(newGame);

	const { get, set } = useLocalStorage();

	const [state, dispatch] = useReducer(
		(
			state: GamePageState,
			action: GamePageAction
		): GamePageState => {
			switch (action.type) {
				case "setLobby": {
					if (state.lobbyId !== null) {
						throw new Error(
							"Attempted to create a lobby while already in one!"
						);
					}

					return {
						...state,
						lobbyId: action.data.lobbyId,
						data: action.data.data
					};
				}
				default:
					return state;
			}
		},
		// Initial state
		{
			lobbyId: get(LOCAL_STORAGE_LOBBY_ID_KEY),
			data: null
		} as GamePageState
	);

	async function getNewLobby(
		submissionData: LobbySubmissionData
	): Promise<void> {
		if (state.lobbyId) {
			console.debug(
				"You are already in a lobby. Unable to create a new lobby."
			);
		}

		const newLobby: MagnateLobbyData | null =
			await post(APIRoutes.NEW_LOBBY, submissionData);

		if (!newLobby) {
			console.debug("Failed to create lobby.");
			return;
		}

		console.debug(newLobby);

		dispatch({
			type: "setLobby",
			data: newLobby
		});
		set(LOCAL_STORAGE_LOBBY_ID_KEY, newLobby.lobbyId);
	}

	useEffect(() => {
		if (!state.lobbyId || state.data) return;

		(async function () {
			const lobby: MagnateLobbyData = await get(
				APIRoutes.GET_LOBBY + state.lobbyId
			);

			if (!lobby) {
				console.error(
					"Unable to fetch current lobby, as it is likely expired. Removing it from local storage."
				);
				set(LOCAL_STORAGE_LOBBY_ID_KEY, undefined);
				return;
			}

			dispatch({ type: "setLobby", data: lobby });
		})();
	}, []);

	// Returns
	if (!state.lobbyId) {
		return (
			<Form onSubmit={getNewLobby}>
				<FormInput
					name="name"
					labelText="Lobby Name"
				/>
				<FormInput name="password" />
			</Form>
		);
	}

	if (!state.data) {
		return <p>Loading lobby...</p>;
	}

	return <MagnateGame data={state.data}></MagnateGame>;
}

export default PageGame;
