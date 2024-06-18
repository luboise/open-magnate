import { useEffect, useReducer } from "react";
import useAPI from "../hooks/useAPI";
import { useGameState } from "../hooks/useGameState";
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
	| "createLobby"
	| "leaveLobby"
	| "startGame"
	| "endGame";

type LobbyPlayerData = {
	name: string;
	restaurant: RESTAURANT_NAME;
};

export type MagnateGameData = {
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

function PageGame() {
	const { post } = useAPI();

	const { newGame } = useGameState();
	const [triggerNewGame] = useTriggeredCallback(newGame);

	const [state, dispatch] = useReducer(
		(
			state: GamePageState,
			action: GamePageAction
		): GamePageState => {
			switch (action.type) {
				case "createLobby": {
					if (state.lobbyId !== null) {
						throw new Error(
							"Attempted to create a lobby while already in one!"
						);
					}

					return {
						lobbyId: action.data,
						data: null
					};
				}
				default:
					return state;
			}
		},
		// Initial state
		{ lobbyId: null, data: null } as GamePageState
	);

	useEffect(() => {
		if (state.lobbyId === null || state.data !== null)
			return;

		(async function getNewLobby() {
			const x = await post(APIRoutes.NEW_LOBBY, {});
		})();
	}, [state.lobbyId]);

	console.debug("Current state: ", state);

	if (state.lobbyId === null) {
		return (
			<button onClick={triggerNewGame}>
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
