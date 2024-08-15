import {
	ORIENTATION,
	DEMAND_TYPE as PrismaDemandType,
	ENTRANCE_CORNER as PrismaEntranceCorner,
	READY_STATUS as PrismaReadyStatus
} from "@prisma/client";
import { createDetailedMapString } from "../../shared";
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
	FullGameState
} from "./database/controller/includes";

import {
	GardenView,
	HouseView,
	RestaurantView
} from "../../shared/views/MapViews";
import {
	CreateMarketingCampaignView,
	MarketingCampaignView
} from "../../shared/views/MarketingViews";
import { Reserve } from "./game/NewGameStructures";
import { CreateHouseView } from "./utils";

export type READY_STATUS = PrismaReadyStatus;

export type ENTRANCE_CORNER = PrismaEntranceCorner;
export type DEMAND_TYPE = PrismaDemandType;

export interface Position {
	x: number;
	y: number;
	orientation?: ORIENTATION;
}

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

	// gameState.marketingCampaigns.map(
	// 	(campaign) => {
	// 		return {
	// 			priority: campaign.number,
	// 			turnsRemaining:
	// 				campaign.turnsRemaining,
	// 			type: campaign.type,
	// 			x: campaign.x,
	// 			y: campaign.y,
	// 			orientation:
	// 				campaign.orientation
	// 		};
	// 	}
	// ),
	const houses: HouseView[] = gameState.houses.map(
		(house) => CreateHouseView(house)
	);

	const gardens: GardenView[] = houses
		.filter((house) => Boolean(house.garden))
		.map((house) => house.garden) as GardenView[];

	//    const gardens = gameState.houses
	//.filter((house) => house.garden)
	//.map((house): GardenView => {
	//// Can safely ignore TypeScript type complaints since we pre-filtered the list
	//return {
	//houseNumber: house.number,
	//pos: {
	//x: house.garden!.x,
	//y: house.garden!.y,
	//orientation: house.garden!.orientation
	//}
	//};
	//});

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

	const finalMap = createDetailedMapString(
		gameState.rawMap,
		marketingCampaigns,
		restaurants,
		houses,
		gardens
	);

	return {
		currentPlayer: currentPlayer,
		currentTurn: gameState.currentTurn,
		turnProgress: gameState.turnProgress,
		map: finalMap,
		playerCount: gameState.playerCount,
		turnOrder: turnOrder,
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

export * from "../../shared/views";
