import { selector, useRecoilValue } from "recoil";
import { Reserve } from "../../../../backend/src/game/NewGameStructures";
import {
	CloneArray,
	GetTransposed
} from "../../../../backend/src/utils";
import { Employee } from "../../../../shared/EmployeeTypes";
import {
	IsConnecting,
	IsEdge,
	IsMaxBound,
	IsMinBound,
	PartialMap2D
} from "../../../../shared/MapData";
import { DirectionBools } from "../../../../shared/MapTiles/MapPieceTiles";
import { TileType } from "../../../../shared/MapTiles/Tile";
import {
	EmployeeNode,
	EmployeesById,
	GamePlayerViewPrivate,
	GamePlayerViewPublic,
	HouseView,
	IsValidEmployeeId,
	Map2D,
	MapTileData,
	MarketingCampaignView,
	ParseEmployeeTree,
	RestaurantView,
	TURN_PROGRESS,
	parseMapChar
} from "../../utils";
import { GameStateAtom } from "./useFullGameState";

const RECOIL_MAP_COL_ORDER_KEY = "PARSED_MAP_COL_ORDER";
const RECOIL_MAP_ROW_ORDER_KEY = "PARSED_MAP_ROW_ORDER";

const NullGamestateMsg =
	"Null gamestate. Make sure the selectors can only be called after the atom.";

type MapSelectorType = MapTileData[][];
const mapColumnOrderSelector = selector<MapSelectorType>({
	key: RECOIL_MAP_COL_ORDER_KEY,
	get: ({ get }) => {
		const gameState = get(GameStateAtom);
		if (!gameState) throw new Error(NullGamestateMsg);

		const mapString = gameState.map;

		if (!mapString)
			throw new Error("No map foudn on gamestate");

		const rowOrderMap =
			mapString
				.split(";")
				.map((line, y) =>
					line
						.split("")
						.map((char, x) =>
							parseMapChar(char, x, y)
						)
				) ?? null;

		if (rowOrderMap === null)
			throw new Error(
				"Unable to create rowOrderMap from mapString"
			);

		return addMapDetails(GetTransposed(rowOrderMap));
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
const turnProgressSelector = selector<TURN_PROGRESS>({
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
			if (!IsValidEmployeeId(employeeId)) return;

			myEmployees.push(EmployeesById[employeeId]);
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
		playerCount,
		marketingCampaigns
	};
}

function addMapDetails(baseMap: PartialMap2D): Map2D {
	const newMap = CloneArray(baseMap) as Map2D;

	// const newMap = new2DArray<MapTileData>(
	// 	baseMap.length,
	// 	baseMap[0].length
	// );

	const maxX = baseMap.length - 1;

	// function test(y, maxy, )

	// Since the data is in column major order, iterate Y first
	for (let x = 0; x <= maxX; x++) {
		const maxY = newMap[x].length - 1;

		for (let y = 0; y <= maxY; y++) {
			const val = newMap[x][y];
			const oldDetails = baseMap[x][y];

			const calculated: DirectionBools = {
				north:
					IsEdge(val.pos.y - 1) &&
					IsEdge(val.pos.y),
				south:
					IsEdge(val.pos.y + 1) &&
					IsEdge(val.pos.y),
				east:
					IsEdge(val.pos.x + 1) &&
					IsEdge(val.pos.x),
				west:
					IsEdge(val.pos.x - 1) &&
					IsEdge(val.pos.x)
			};

			const z = oldDetails.tileType;

			const newVal: MapTileData = {
				...oldDetails,
				pieceEdges: calculated,
				...(z === TileType.ROAD
					? {
							adjacentRoads: {
								north:
									(!IsMinBound(y) &&
										y > 0 &&
										newMap[x][y - 1]
											.tileType ===
											TileType.ROAD) ||
									IsConnecting(x, y - 1),
								south:
									(!IsMaxBound(y) &&
										y < maxY &&
										newMap[x][y + 1]
											.tileType ===
											TileType.ROAD) ||
									IsConnecting(x, y + 1),
								east:
									(!IsMaxBound(x) &&
										x < maxX &&
										newMap[x + 1][y]
											.tileType ===
											TileType.ROAD) ||
									IsConnecting(
										val.pos.x + 1,
										val.pos.y
									),
								west:
									(!IsMinBound(x) &&
										x > 0 &&
										newMap[x - 1][y]
											.tileType ===
											TileType.ROAD) ||
									IsConnecting(
										val.pos.x - 1,
										val.pos.y
									)
							}
						}
					: {})
			};

			newMap[x][y] = newVal;
		}
	}

	return newMap;
}

