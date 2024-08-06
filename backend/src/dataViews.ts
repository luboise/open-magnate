import {
	ORIENTATION,
	DEMAND_TYPE as PrismaDemandType,
	ENTRANCE_CORNER as PrismaEntranceCorner,
	MARKETING_TYPE as PrismaMarketingType,
	READY_STATUS as PrismaReadyStatus
} from "@prisma/client";
import { createDetailedMapString } from "../../shared";
import {
	GamePlayerViewPrivate,
	GameStateView,
	GameStateViewPerPlayer,
	ReadyStatusToBoolean
} from "../../shared/views/GameStateViews";
import {
	getCurrentPlayer,
	getTurnOrder
} from "./database/controller/gamestate.controller";

import { FullLobby } from "./database/controller/lobby.controller";
import { Reserve } from "./game/NewGameStructures";
import {
	parseJsonArray,
	readJsonNumberArray
} from "./utils";

export type READY_STATUS = PrismaReadyStatus;

export type ENTRANCE_CORNER = PrismaEntranceCorner;
export type DEMAND_TYPE = PrismaDemandType;

export type MarketingType = PrismaMarketingType;

export interface RestaurantView extends Position {
	player: number;
}

export interface MarketingCampaignView extends Position {
	priority: number;
	playerNumber: number;

	type: MarketingType;

	turnsRemaining: number;
}

export interface MarketingCampaignViewPrivate
	extends MarketingCampaignView {
	employeeIndex: number;
}

export interface HouseView extends Position {
	priority: number;
	demandLimit: number;

	demand: DEMAND_TYPE[];
	garden: GardenView | null;
}

export interface GardenView extends Position {
	houseNumber: number;
}

export interface Position {
	x: number;
	y: number;
	orientation?: ORIENTATION;
}

export const GetGameStateView = (
	lobby: FullLobby
): GameStateView => {
	const gameState = lobby.gameState;
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
		(house) => ({
			demand: house.demand.map(
				(demand) => demand.type
			),
			demandLimit: house.demandLimit,
			priority: house.number,
			x: house.x,
			y: house.y,
			garden: house.garden
				? {
						houseNumber: house.garden?.houseId,
						x: house.garden?.x,
						y: house.garden?.y,
						orientation:
							house.garden?.orientation
					}
				: null,
			orientation: "HORIZONTAL"
		})
	);

	const gardens = gameState.houses
		.filter((house) => house.garden)
		.map((house): GardenView => {
			// Can safely ignore TypeScript type complaints since we pre-filtered the list
			return {
				houseNumber: house.number,
				x: house.garden!.x,
				y: house.garden!.y,
				orientation: house.garden!.orientation
			};
		});

	const marketingCampaigns: MarketingCampaignView[] =
		gameState.players.reduce<MarketingCampaignView[]>(
			(acc, curr) => {
				return acc.concat(
					curr.marketingCampaigns.map(
						(campaign) => ({
							playerNumber:
								campaign.playerNumber,
							priority:
								campaign.marketingNumber,
							turnsRemaining:
								campaign.turnsRemaining,

							type: campaign.type,
							x: campaign.x,
							y: campaign.y,
							orientation:
								campaign.orientation
						})
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
					x: res.x,
					y: res.y,
					orientation: "HORIZONTAL"
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
		map: gameState.rawMap,
		playerCount: gameState.playerCount,
		turnOrder: turnOrder,
		marketingCampaigns: marketingCampaigns,

		gardens: gardens,
		houses: houses,
		players: gameState.players.map(
			(player): GamePlayerViewPrivate => ({
				money: player.money,
				playerNumber: player.number,
				restaurant: player.restaurantData.id,
				milestones: readJsonNumberArray(
					player.milestones
				),
				employees: parseJsonArray(player.employees),
				employeeTreeStr: player.employeeTree,
				ready: ReadyStatusToBoolean(player.ready),
				marketingCampaigns:
					player.marketingCampaigns.map(
						(campaign) => ({
							playerNumber:
								campaign.playerNumber,
							priority:
								campaign.marketingNumber,
							turnsRemaining:
								campaign.turnsRemaining,

							type: campaign.type,
							x: campaign.x,
							y: campaign.y,
							orientation:
								campaign.orientation,
							employeeIndex:
								campaign.employeeIndex
						})
					)
			})
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

