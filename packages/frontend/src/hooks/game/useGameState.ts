import { selector, useRecoilValue } from "recoil";

import { GetTransposed } from "magnate-core/area/AreaUtils";
import { Employee } from "magnate-core/employees/types";
import {
	EmployeeNode,
	GameEventView,
	GamePlayerViewPrivate,
	GamePlayerViewPublic,
	HouseView,
	MapBackgroundTile,
	MarketingCampaignView,
	ParseEmployeeTree,
	Reserve,
	RestaurantView,
	TurnProgress,
	getEmployeeById,
	isValidEmployeeId
} from "../../utils";
import { GameStateAtom } from "./useFullGameState";

const RECOIL_MAP_COL_ORDER_KEY = "PARSED_MAP_COL_ORDER";
const RECOIL_MAP_ROW_ORDER_KEY = "PARSED_MAP_ROW_ORDER";

const NullGamestateMsg =
	"Null gamestate. Make sure the selectors can only be called after the atom.";

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

const RECOIL_MAP_HOUSE_KEY = "PARSED_MAP_HOUSES";
const mapHouseSelector = selector<HouseView[]>({
	key: RECOIL_MAP_HOUSE_KEY,
	get: ({ get }) => {
		const gameState = get(GameStateAtom);
		if (!gameState) throw new Error(NullGamestateMsg);

		return gameState.houses;
	}
});

const RECOIL_TURN_PROGRESS_KEY = "TURN_PROGRESS";
const turnProgressSelector = selector<TurnProgress>({
	key: RECOIL_TURN_PROGRESS_KEY,
	get: ({ get }) => {
		const gameState = get(GameStateAtom);
		if (!gameState) throw new Error(NullGamestateMsg);

		return gameState.turnProgress;
	}
});

const RECOIL_IS_MY_TURN_KEY = "IS_MY_TURN";
const isMyTurnSelector = selector<boolean | null>({
	key: RECOIL_IS_MY_TURN_KEY,
	get: ({ get }) => {
		const gameState = get(GameStateAtom);
		if (!gameState) throw new Error(NullGamestateMsg);

		if (
			gameState.turnProgress === "RESTRUCTURING" ||
			gameState.turnProgress === "SALARY_PAYOUTS"
		)
			return !gameState.privateData.ready;

		return (
			gameState.privateData.playerNumber ===
			gameState.currentPlayer
		);
	}
});

// export function isMyTurn() {
// 	return useRecoilValue(isMyTurnSelector);
// }

const RECOIL_PLAYERS_KEY = "PLAYERS";
const playersSelector = selector<GamePlayerViewPublic[]>({
	key: RECOIL_PLAYERS_KEY,
	get: ({ get }) => {
		const gameState = get(GameStateAtom);
		if (!gameState) throw new Error(NullGamestateMsg);

		return gameState.players;
	}
});
// export function usePlayers() {
// 	return useRecoilValue(playersSelector);
// }

const restaurantsSelector = selector<RestaurantView[]>({
	key: "RESTAURANTS",
	get: ({ get }) => {
		const gameState = get(GameStateAtom);
		if (!gameState) throw new Error(NullGamestateMsg);

		return gameState.restaurants;
	}
});

const playerDataSelector = selector<GamePlayerViewPrivate>({
	key: "PLAYER_DATA",
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

		const playerData = get(playerDataSelector);

		if (!playerData) return [];

		const myEmployees: Employee[] = [];

		playerData.employees.forEach((employeeId) => {
			if (!isValidEmployeeId(employeeId)) return;

			myEmployees.push(getEmployeeById(employeeId));
		});

		return myEmployees;
	}
});

const currentPlayerSelector =
	selector<GamePlayerViewPublic | null>({
		key: "CURRENT_PLAYER",
		get: ({ get }) => {
			const gameState = get(GameStateAtom);
			if (!gameState)
				throw new Error(NullGamestateMsg);

			const currentPlayer = gameState.players.find(
				(player) =>
					player.playerNumber ===
					gameState.currentPlayer
			);

			if (!currentPlayer) return null;

			return currentPlayer;
		}
	});

const currentTreeSelector = selector<EmployeeNode | null>({
	key: "CURRENT_TREE",
	get: ({ get }) => {
		const currentPlayer = get(playerDataSelector);
		if (!currentPlayer) return null;

		const tree = ParseEmployeeTree(
			currentPlayer.employeeTreeStr
		);
		return tree;
	}
});

const reserveSelector = selector<Reserve>({
	key: "RESERVE",
	get: ({ get }) => {
		const gameState = get(GameStateAtom);
		if (!gameState) throw new Error(NullGamestateMsg);

		return gameState.reserve;
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

			return gameState.realTurnOrder;
		}
	}
);

const playerCountSelector = selector<number>({
	key: "PLAYER_COUNT",
	get: ({ get }) => {
		const gameState = get(GameStateAtom);
		if (!gameState) throw new Error(NullGamestateMsg);

		return gameState.playerCount;
	}
});

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

const historySelector = selector<GameEventView[]>({
	key: "GAME_HISTORY",
	get: ({ get }) => {
		const gameState = get(GameStateAtom);
		if (!gameState) throw new Error(NullGamestateMsg);

		return gameState.history;
	}
});

const lastEventSelector = selector<GameEventView | null>({
	key: "LAST_EVENT",
	get: ({ get }) => {
		const history = get(historySelector);
		if (history.length === 0) return null;

		return history[0];
	}
});

export function useGameStateView() {
	const mapColOrder = useRecoilValue(
		mapColumnOrderSelector
	);
	const mapRowOrder = useRecoilValue(mapRowOrderSelector);

	const houses = useRecoilValue(mapHouseSelector);

	const turnProgress = useRecoilValue(
		turnProgressSelector
	);

	const players = useRecoilValue(playersSelector);

	const restaurants = useRecoilValue(restaurantsSelector);

	const isMyTurn = useRecoilValue(isMyTurnSelector);

	const playerData = useRecoilValue(playerDataSelector);

	const myEmployees = useRecoilValue(myEmployeesSelector);

	const currentPlayer = useRecoilValue(
		currentPlayerSelector
	);

	const currentTree = useRecoilValue(currentTreeSelector);

	const reserve = useRecoilValue(reserveSelector);

	const turnOrder = useRecoilValue(turnOrderSelector);

	const playerCount = useRecoilValue(playerCountSelector);

	const marketingCampaigns = useRecoilValue(
		marketingCampaignSelector
	);

	const realTurnOrder = useRecoilValue(
		realTurnOrderSelector
	);

	const history = useRecoilValue(historySelector);
	const lastEvent = useRecoilValue(lastEventSelector);

	return {
		mapColOrder,
		mapRowOrder,
		houses,
		turnProgress,
		players: players,
		restaurants: restaurants,
		isMyTurn,
		playerData: playerData,
		myEmployees: myEmployees,
		currentPlayer,
		currentTree,
		reserve,
		turnOrder,
		realTurnOrder,
		playerCount,
		marketingCampaigns,
		history,
		lastEvent
	};
}
