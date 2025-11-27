import { selector, useRecoilValue } from "recoil";

import { GameStateAtom } from "./useGameStateView";

import {
	CardReserve,
	Employee,
	EmployeeNode,
	GameState,
	GameStatus,
	PlayerPrivateView,
	PlayerPublicView,
	RestaurantTile,
	RestaurantView
} from "magnate-core";

// const RECOIL_MAP_COL_ORDER_KEY = "PARSED_MAP_COL_ORDER";
// const RECOIL_MAP_ROW_ORDER_KEY = "PARSED_MAP_ROW_ORDER";

const NullGamestateMsg =
	"Null gamestate. Make sure the selectors can only be called after the atom.";

/*
type MapSelectorType = MapBackgroundTile[][];
const mapColumnOrderSelector = selector<MapSelectorType>({
	key: RECOIL_MAP_COL_ORDER_KEY,
	get: ({ get }) => {
		const gameState = get(GameStateAtom);
		if (!gameState) throw new Error(NullGamestateMsg);

		//const parsedMap = ParseMapStringFromGSV(
		//gameState.map
		//);
		return gameState.map;
	}
});

const mapRowOrderSelector = selector<MapSelectorType>({
	key: RECOIL_MAP_ROW_ORDER_KEY,
	get: ({ get }) => {
		const colOrder = get(mapColumnOrderSelector);
		if (!colOrder)
			throw new Error(
				"Unable to fetch column order selector."
			);

		return GetTransposed(colOrder);
	}
});
*/

const RECOIL_GAME_STATUS_KEY = "GAME_STATUS";
const gameStatusSelector = selector<GameStatus>({
	key: RECOIL_GAME_STATUS_KEY,
	get: ({ get }) => {
		const gameState = get(GameStateAtom);
		if (!gameState) throw new Error(NullGamestateMsg);

		return gameState.status;
	}
});

const RECOIL_IS_MY_TURN_KEY = "IS_MY_TURN";
const isMyTurnSelector = selector<boolean>({
	key: RECOIL_IS_MY_TURN_KEY,
	get: ({ get }) => {
		const gameState = get(GameStateAtom);
		if (!gameState) throw new Error(NullGamestateMsg);

		if (
			gameState.status === "RESTRUCTURING" ||
			gameState.status === "SALARY_PAYOUTS"
		)
			return !gameState.readyStatuses[
				gameState.playerIndex
			];

		return (
			gameState.playerIndex ===
			gameState.currentPlayer
		);
	}
});

// export function isMyTurn() {
// 	return useRecoilValue(isMyTurnSelector);
// }

const RECOIL_PLAYERS_KEY = "PLAYERS";
const playersSelector = selector<PlayerPublicView[]>({
	key: RECOIL_PLAYERS_KEY,
	get: ({ get }) => {
		const gameState = get(GameStateAtom);
		if (!gameState) throw new Error(NullGamestateMsg);

		return gameState.players;
	}
});

const restaurantsSelector = selector<RestaurantView[]>({
	key: "RESTAURANTS",
	get: ({ get }) => {
		const gameState = get(GameStateAtom);
		if (!gameState) throw new Error(NullGamestateMsg);

		return gameState.map.tiles
			.filter(
				(tile) => tile.tileType === "RESTAURANT"
			)
			.map((t) => {
				const tile = t as RestaurantTile;

				return {
					playerIndex: tile.ownerIndex,
					pos: { ...tile.position }
				};
			});
	}
});

const publicViewSelector = selector<PlayerPublicView>({
	key: "PLAYER_PUBLIC_DATA",
	get: ({ get }) => {
		const gameState = get(GameStateAtom);
		if (!gameState) throw new Error(NullGamestateMsg);

		return gameState.players[gameState.playerIndex];
	}
});

const privateViewSelector = selector<PlayerPrivateView>({
	key: "PLAYER_PRIVATE_DATA",
	get: ({ get }) => {
		const gameState = get(GameStateAtom);
		if (!gameState) throw new Error(NullGamestateMsg);

		return gameState.privateData;
	}
});

const myEmployeesSelector = selector<Employee[]>({
	key: "MY_EMPLOYEES",
	get: ({ get }) => {
		const gameState = get(GameStateAtom);
		if (!gameState) throw new Error(NullGamestateMsg);

		const playerData = get(privateViewSelector);

		if (!playerData) return [];

		return playerData.employees;
	}
});

const currentPlayerSelector =
	selector<PlayerPublicView | null>({
		key: "CURRENT_PLAYER",
		get: ({ get }) => {
			const gameState = get(GameStateAtom);
			if (!gameState)
				throw new Error(NullGamestateMsg);

			const nextMove = GameState.nextMove(
				gameState as unknown as GameState
			);

			if (
				!nextMove ||
				nextMove.playerIndices.length === 0
			) {
				return null;
			}

			return gameState.players[
				nextMove.playerIndices[0]
			];
		}
	});

const currentTreeSelector = selector<EmployeeNode | null>({
	key: "CURRENT_TREE",
	get: ({ get }) => {
		const currentPlayer = get(privateViewSelector);
		if (!currentPlayer) return null;

		return currentPlayer.tree;
	}
});

const cardReserveSelector = selector<CardReserve>({
	key: "RESERVE",
	get: ({ get }) => {
		const gameState = get(GameStateAtom);
		if (!gameState) throw new Error(NullGamestateMsg);

		return gameState.cardReserve;
	}
});

const turnOrderSelector = selector<number[]>({
	key: "TURN_ORDER",
	get: ({ get }) => {
		const gameState = get(GameStateAtom);
		if (!gameState) throw new Error(NullGamestateMsg);

		return gameState.turnOrder;
	}
});

const realTurnOrderSelector = selector<Array<number | "X">>(
	{
		key: "REAL_TURN_ORDER",
		get: ({ get }) => {
			const gameState = get(GameStateAtom);
			if (!gameState)
				throw new Error(NullGamestateMsg);

			return gameState.turnOrder;
		}
	}
);

const playerCountSelector = selector<number>({
	key: "PLAYER_COUNT",
	get: ({ get }) => {
		const gameState = get(GameStateAtom);
		if (!gameState) throw new Error(NullGamestateMsg);

		return gameState.players.length;
	}
});

/*
const marketingCampaignSelector = selector<
	MarketingCampaignView[]
>({
	key: "MARKETING_CAMPAIGNS",
	get: ({ get }) => {
		const gameState = get(GameStateAtom);
		if (!gameState) throw new Error(NullGamestateMsg);

		return gameState.marketingCampaigns;
	}
});
*/

/*
const historySelector = selector<GameEventView[]>({
	key: "GAME_HISTORY",
	get: ({ get }) => {
		const gameState = get(GameStateAtom);
		if (!gameState) throw new Error(NullGamestateMsg);

		return gameState.history;
	}
});
*/

/*
const lastEventSelector = selector<GameEventView | null>({
	key: "LAST_EVENT",
	get: ({ get }) => {
		const history = get(historySelector);
		if (history.length === 0) return null;

		return history[0];
	}
});
*/

export function useDerivedGameState() {
	const gameStatus = useRecoilValue(gameStatusSelector);
	const players = useRecoilValue(playersSelector);
	const restaurants = useRecoilValue(restaurantsSelector);
	const isMyTurn = useRecoilValue(isMyTurnSelector);

	const publicPlayerData = useRecoilValue(
		publicViewSelector
	);
	const privatePlayerData = useRecoilValue(
		privateViewSelector
	);

	const employees = useRecoilValue(myEmployeesSelector);
	const currentPlayer: PlayerPublicView | null =
		useRecoilValue(currentPlayerSelector);

	const currentTree = useRecoilValue(currentTreeSelector);

	const reserve = useRecoilValue(cardReserveSelector);

	const turnOrder = useRecoilValue(turnOrderSelector);

	const playerCount = useRecoilValue(playerCountSelector);

	/*
	const marketingCampaigns = useRecoilValue(
		marketingCampaignSelector
	);
	*/

	const realTurnOrder = useRecoilValue(
		realTurnOrderSelector
	);

	// const history = useRecoilValue(historySelector);
	// const lastEvent = useRecoilValue(lastEventSelector);

	return {
		gameStatus,
		players: players,
		restaurants: restaurants,
		isMyTurn,
		publicPlayerData,
		privatePlayerData,
		employees,
		currentPlayer,
		currentTree,
		reserve,
		turnOrder,
		realTurnOrder,
		playerCount
		// marketingCampaigns,
		// history,
		// lastEvent
	};
}
