import { useReducer } from "react";
import useAPI from "../hooks/useAPI";
import { useGameState } from "../hooks/useGameState";
import { useLocalStorage } from "../hooks/useLocalStorage";
import useTriggeredCallback from "../hooks/useTriggeredCallback";
import {
	APIRoutes,
	GameState,
	RESTAURANT_NAME
} from "../utils";
import MagnateGame from "./MagnateGame/MagnateGame";

interface GamePageAction {
	type: GamePageActionName;
	data: any;
}

type GamePageActionName =
	| "setLobby"
	| "leaveLobby"
	| "startGame"
	| "endGame";

type LobbyPlayerData = {
	name: string;
	restaurant: RESTAURANT_NAME;
};

export type MagnateGameData = {
	lobbyId: number;
	lobbyName: string;
	lobbyPlayers: LobbyPlayerData[];
	gameState: GameState;
};

type GamePageState =
	| { lobbyId: null; data: null }
	| {
			lobbyId: number;
			data: MagnateGameData | null;
	  };

const LOCAL_STORAGE_LOBBY_ID_KEY = "lobbyId";

function PageGame() {
	const { post } = useAPI();

	const { newGame } = useGameState();
	const [triggerNewGame] = useTriggeredCallback(newGame);

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

	async function getNewLobby(): Promise<void> {
		const newLobby: MagnateGameData | null = await post(
			APIRoutes.NEW_LOBBY,
			{}
		);

		if (!newLobby) {
			console.debug("Failed to create lobby.");
			return;
		}

		set(LOCAL_STORAGE_LOBBY_ID_KEY, newLobby.lobbyId);
		dispatch({
			type: "setLobby",
			data: newLobby
		});
	}

	if (state.lobbyId === null) {
		return (
			<button onClick={getNewLobby}>
				Create lobby
			</button>
		);
	}

	if (state.data === null) {
		return <p>Loading lobby...</p>;
	}

	return <MagnateGame data={state.data}></MagnateGame>;
}

export default PageGame;
