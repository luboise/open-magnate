import {
	GameEvent,
	ENTRANCE_CORNER as PrismaEntranceCorner,
	READY_STATUS as PrismaReadyStatus
} from "./database/datasource";

import {
	GamePlayerViewPrivate,
	GameStateView,
	GameStateViewPerPlayer
} from "../../shared/views/GameStateViews";
import {
	getCurrentPlayer,
	getTurnOrder
} from "./database/controller/gamestate.controller";
import {
	CreateGamePlayerView,
	FullGameState,
	FullHouse
} from "./database/controller/includes";

import { Reserve } from "../../shared/employees/Reserve";
import {
	GardenView,
	HouseView,
	RestaurantView
} from "../../shared/views/MapViews";
import {
	CreateMarketingCampaignView,
	MarketingCampaignView
} from "../../shared/views/MarketingViews";
import {
	GameEventView,
	ParseMapStringFromGSV,
	TransactionInfo,
	createDetailedMapString,
	parseJsonArray
} from "./utils";

export type READY_STATUS = PrismaReadyStatus;

export type ENTRANCE_CORNER = PrismaEntranceCorner;

export const CreateGameStateView = (
	gameState: FullGameState
): GameStateView => {
	if (!gameState)
		throw new Error(
			"Unable to fetch GameStateView from lobby, as its GameState is null."
		);

	// TODO: Fix this to be more efficient
	const turnOrder = getTurnOrder(gameState);

	const currentPlayer = getCurrentPlayer(gameState);

	const houses: HouseView[] = gameState.houses.map(
		(house) => CreateHouseView(house)
	);

	const gardens: GardenView[] = houses
		.filter((house) => Boolean(house.garden))
		.map((house) => house.garden) as GardenView[];

	const marketingCampaigns: MarketingCampaignView[] =
		gameState.players.reduce<MarketingCampaignView[]>(
			(acc, curr) => {
				return acc.concat(
					curr.marketingCampaigns.map(
						(campaign) =>
							CreateMarketingCampaignView(
								campaign
							)
					)
				);
			},
			[]
		);

	const restaurants = gameState.players
		.map((player) =>
			player.restaurants.map((res) => {
				const rv: RestaurantView = {
					player: player.number,
					pos: {
						x: res.x,
						y: res.y,
						orientation: "HORIZONTAL"
					}
				};

				return rv;
			})
		)
		.flat(1);

	const mapString = createDetailedMapString(
		gameState.rawMap,
		marketingCampaigns,
		restaurants,
		houses,
		gardens
	);

	const finalMap = ParseMapStringFromGSV(mapString);

	const history: GameEventView[] = gameState.events
		.map((event) => CreateGameEventView(event))
		.sort(
			(e1, e2) =>
				e2.time.getTime() - e1.time.getTime()
		);

	return {
		currentPlayer: currentPlayer,
		currentTurn: gameState.currentTurn,
		turnProgress: gameState.turnProgress,
		map: finalMap,
		playerCount: gameState.playerCount,
		turnOrder: turnOrder,
		history: history,
		realTurnOrder: gameState.turnOrder
			.split("")
			.map((char) =>
				!Number.isNaN(Number(char))
					? Number(char)
					: "X"
			),
		marketingCampaigns: marketingCampaigns,

		gardens: gardens,
		houses: houses,
		players: gameState.players.map(
			(player): GamePlayerViewPrivate =>
				CreateGamePlayerView(player)
		),
		restaurants: restaurants,
		reserve: gameState.reserve as Reserve
	};
};

export const GetPublicGameStateView = (
	gsv: GameStateView,
	playerNumber: number
): GameStateViewPerPlayer => {
	const player = gsv.players.find(
		(player) => player.playerNumber === playerNumber
	);
	if (!player)
		throw new Error(
			`Unable to get public game state for invalid player: ${playerNumber}`
		);

	const newVal: GameStateViewPerPlayer = {
		...gsv,
		players: gsv.players.map((eachPlayer) => {
			const { employees, ...rest } = eachPlayer;
			return {
				...rest
			};
		}),
		privateData: player
	};

	return newVal;
};

export function CreateGameEventView(
	event: GameEvent
): GameEventView {
	const arr = parseJsonArray(event.eventData).map((val) =>
		JSON.parse(val)
	) as TransactionInfo[];

	const data: GameEventView = {
		time: event.time,
		data: arr
	};

	return data;
}

export function CreateHouseView(
	house: FullHouse
): HouseView {
	return {
		demand: house.demand.map((demand) => demand.type),
		demandLimit: house.demandLimit,
		priority: house.number,
		pos: {
			x: house.x,
			y: house.y,
			orientation: "HORIZONTAL"
		},
		garden: house.garden
			? {
					houseNumber: house.garden?.houseId,
					pos: {
						x: house.garden.x,
						y: house.garden.y,
						orientation:
							house.garden?.orientation
					}
				}
			: null
	};
}

export * from "../../shared/views";
