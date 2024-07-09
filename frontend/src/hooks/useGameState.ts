import {
	atom,
	selector,
	useRecoilState,
	useRecoilValue
} from "recoil";
import {
	CloneArray,
	GetTransposed
} from "../../../backend/src/utils";
import { Employee } from "../../../shared/EmployeeTypes";
import {
	DirectionBools,
	IsConnecting,
	IsEdge,
	IsMaxBound,
	IsMinBound,
	TileType
} from "../../../shared/MapData";
import {
	EmployeesById,
	GamePlayerViewPrivate,
	GamePlayerViewPublic,
	GameStateViewPerPlayer,
	Map2D,
	MapTileData,
	RestaurantView,
	TURN_PROGRESS,
	parseMapChar
} from "../utils";

const RECOIL_GAMESTATE_KEY = "GameState";
type GameStateAtomType = GameStateViewPerPlayer | null;
const GameStateAtom = atom<GameStateAtomType>({
	key: RECOIL_GAMESTATE_KEY, // unique ID (with respect to other atoms/selectors)
	default: null
});

const RECOIL_MAP_COL_ORDER_KEY = "PARSED_MAP_COL_ORDER";
const RECOIL_MAP_ROW_ORDER_KEY = "PARSED_MAP_ROW_ORDER";

type MapSelectorType = MapTileData[][] | null;
const mapColumnOrderSelector = selector<MapSelectorType>({
	key: RECOIL_MAP_COL_ORDER_KEY,
	get: ({ get }) => {
		const mapString = get(GameStateAtom)?.map;

		if (!mapString) return null;

		console.log("map: ", get(GameStateAtom)?.map);

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
		if (!rowOrderMap) return null;

		return addMapDetails(GetTransposed(rowOrderMap));
	}
});

const mapRowOrderSelector = selector<MapSelectorType>({
	key: RECOIL_MAP_ROW_ORDER_KEY,
	get: ({ get }) => {
		const colOrder = get(mapColumnOrderSelector);
		if (!colOrder) return null;

		return GetTransposed(colOrder);
	}
});

const RECOIL_MAP_HOUSE_KEY = "PARSED_MAP_HOUSES";
const mapHouseSelector = selector({
	key: RECOIL_MAP_HOUSE_KEY,
	get: ({ get }) => {
		return get(GameStateAtom)?.houses ?? null;
	}
});

const RECOIL_TURN_PROGRESS_KEY = "TURN_PROGRESS";
const turnProgressSelector = selector<TURN_PROGRESS | null>(
	{
		key: RECOIL_TURN_PROGRESS_KEY,
		get: ({ get }) => {
			const turnProgress =
				get(GameStateAtom)?.turnProgress;

			return turnProgress ?? null;
		}
	}
);

const RECOIL_IS_MY_TURN_KEY = "IS_MY_TURN";
const isMyTurnSelector = selector<boolean | null>({
	key: RECOIL_IS_MY_TURN_KEY,
	get: ({ get }) => {
		const gameState = get(GameStateAtom);

		if (!gameState) return null;

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
const playersSelector = selector<
	GamePlayerViewPublic[] | null
>({
	key: RECOIL_PLAYERS_KEY,
	get: ({ get }) => {
		const gameState = get(GameStateAtom);

		if (!gameState) return null;

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

		if (!gameState) return [];

		return gameState.restaurants;
	}
});

const playerDataSelector =
	selector<GamePlayerViewPrivate | null>({
		key: "PLAYER_DATA",
		get: ({ get }) => {
			const gameState = get(GameStateAtom);

			if (!gameState) return null;

			return gameState.privateData;
		}
	});

const myEmployeesSelector = selector<Employee[]>({
	key: "MY_EMPLOYEES",
	get: ({ get }) => {
		const gameState = get(GameStateAtom);
		const playerData = get(playerDataSelector);

		if (!gameState || !playerData) return [];

		const myEmployees: Employee[] = [];

		playerData.employees.forEach((employeeId) => {
			if (!(employeeId in EmployeesById)) return;

			myEmployees.push(EmployeesById[employeeId]);
		});

		// TODO: Remove temporary employee for testing purposes
		myEmployees.push(EmployeesById["mgmt_1"]);

		return myEmployees;
	}
});

export function useGameState() {
	const [state, _setState] =
		useRecoilState(GameStateAtom);
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

	return {
		state,
		mapColOrder,
		mapRowOrder,
		houses,
		setState: _setState,
		turnProgress,
		players: players,
		restaurants: restaurants,
		isMyTurn,
		playerData: playerData,
		myEmployees: myEmployees
	};
}

function addMapDetails(baseMap: Map2D): Map2D {
	const newMap = CloneArray(baseMap);

	const maxX = baseMap.length - 1;

	// function test(y, maxy, )

	// Since the data is in column major order, iterate Y first
	for (let x = 0; x <= maxX; x++) {
		const maxY = newMap[x].length - 1;

		for (let y = 0; y <= maxY; y++) {
			const val = newMap[x][y];

			val.pieceEdges = {
				north: IsEdge(val.y - 1) && IsEdge(val.y),
				south: IsEdge(val.y + 1) && IsEdge(val.y),
				east: IsEdge(val.x + 1) && IsEdge(val.x),
				west: IsEdge(val.x - 1) && IsEdge(val.x)
			};

			if (val.type === TileType.ROAD) {
				val.data = {
					north:
						(!IsMinBound(y) &&
							y > 0 &&
							newMap[x][y - 1].type ===
								TileType.ROAD) ||
						IsConnecting(x, y - 1),
					south:
						(!IsMaxBound(y) &&
							y < maxY &&
							newMap[x][y + 1].type ===
								TileType.ROAD) ||
						IsConnecting(x, y + 1),
					east:
						(!IsMaxBound(x) &&
							x < maxX &&
							newMap[x + 1][y].type ===
								TileType.ROAD) ||
						IsConnecting(val.x + 1, val.y),
					west:
						(!IsMinBound(x) &&
							x > 0 &&
							newMap[x - 1][y].type ===
								TileType.ROAD) ||
						IsConnecting(val.x - 1, val.y)
				} as DirectionBools;
			}
		}
	}

	return newMap;
}
