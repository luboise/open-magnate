import { Prisma } from "@prisma/client";
import {
	CreateMarketingCampaignView,
	Employee,
	GamePlayerViewPrivate,
	MarketingCampaignViewPrivate,
	ReadyStatusToBoolean,
	parseJsonArray,
	readJsonNumberArray
} from "../../utils";

export const FullHouseInclude = {
	demand: true,
	garden: true
} as const;

export type FullHouse = Prisma.HouseGetPayload<{
	include: typeof FullHouseInclude;
}>;

export const FullGamePlayerInclude = {
	restaurantData: true,
	lobbyPlayer: {
		include: {
			userSession: {
				select: {
					name: true
				}
			}
		}
	},
	marketingCampaigns: true,
	restaurants: true,
	supply: true
} as const;

export type FullGamePlayer = Prisma.GamePlayerGetPayload<{
	include: typeof FullGamePlayerInclude;
}>;

export function CreateGamePlayerView(
	player: FullGamePlayer
): GamePlayerViewPrivate {
	return {
		money: player.money,
		playerNumber: player.number,
		restaurant: player.restaurantData.id,
		milestones: readJsonNumberArray(player.milestones),
		employees: parseJsonArray(player.employees).filter(
			Employee.IsValidId
		),
		employeeTreeStr: player.employeeTree,
		ready: ReadyStatusToBoolean(player.ready),
		marketingCampaigns: player.marketingCampaigns.map(
			(campaign): MarketingCampaignViewPrivate => {
				return {
					...CreateMarketingCampaignView(
						campaign
					),
					employeeIndex: campaign.employeeIndex
				};
			}
		),
		supply: player.supply.map(
			(playerDemand) => playerDemand.type
		)
	};
}

export const FullGameStateInclude = {
	events: true,
	houses: {
		include: {
			demand: true,
			garden: true,
		}
	},
	players: {
		include: FullGamePlayerInclude
	}
} as const;

export const FullLobbyInclude = {
	playersInLobby: {
		include: {
			userSession: true
		}
	},
	gameState: {
		include: FullGameStateInclude
	} as const
} as const;

export type FullLobby = Prisma.LobbyGetPayload<{
	include: typeof FullLobbyInclude;
}>;

export type FullGameState = Prisma.GameStateGetPayload<{
	include: typeof FullGameStateInclude;
}>;
