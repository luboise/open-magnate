import { DEMAND_TYPE } from "@prisma/client";
import { EMPLOYEE_ID } from "../../../../shared/employees/types";
import {
	MarketingAction,
	MarketingCampaignView,
	TurnAction,
	parseJsonArray
} from "../../utils";
import { AddDemand, GetAffectedHouses } from "./Cleanup";
import { MoveTransactionFunctionTyped } from "./types";

export const ExecuteTurn: MoveTransactionFunctionTyped<
	TurnAction[]
> = async (bundle, turn: TurnAction[]) => {
	const gamePlayer =
		await bundle.ctx.gamePlayer.findUniqueOrThrow({
			where: {
				gamePlayerId: {
					gameId: bundle.gameId,
					number: bundle.player
				}
			}
		});

	// TODO: Add validation for valid recruiting
	const newRecruits: EMPLOYEE_ID[] = [];

	for (const action of turn) {
		if (action.type === "RECRUIT") {
			newRecruits.push(action.recruiting);
		} else if (action.type === "MARKETING") {
			await CreateMarketingCampaign(bundle, action);
		} else if (action.type === "GET_DEMAND") {
			await PlayerCreatedDemand(bundle, {
				demand: action.demand
			});
		}
	}

	// TODO: Fix recruited employees not updating in database (add unit tests for the backend)
	await bundle.ctx.gamePlayer.update({
		where: {
			gamePlayerId: {
				gameId: bundle.gameId,
				number: bundle.player
			}
		},
		data: {
			employees: [
				...parseJsonArray(gamePlayer.employees),
				...newRecruits
			]
		}
	});
};

export const BroadcastMarketing: MoveTransactionFunctionTyped<
	MarketingCampaignView
> = async (bundle, campaign) => {
	const affectedHouses = await GetAffectedHouses(
		bundle,
		campaign
	);

	for (const house of affectedHouses) {
		await AddDemand(bundle, {
			house: house,
			foodType: campaign.foodType
		});
	}
};
export const CreateMarketingCampaign: MoveTransactionFunctionTyped<
	MarketingAction
> = async (bundle, action) => {
	await bundle.ctx.marketingCampaign.create({
		data: {
			owner: {
				connect: {
					gamePlayerId: {
						gameId: bundle.gameId,
						number: bundle.player
					}
				}
			},

			priority: action.tile.tileNumber,
			orientation:
				action.tile.rotation === 0
					? "HORIZONTAL"
					: "VERTICAL",

			demand: action.tile.demand,

			// TODO: Add the actual number of turns remaining based on player choice
			turnsRemaining: 4,
			x: action.tile.pos.x,
			y: action.tile.pos.y,
			type: action.tile.marketingType,
			employeeIndex: action.tile.placingEmployee
		}
	});
};

export const PlayerCreatedDemand: MoveTransactionFunctionTyped<{
	demand: DEMAND_TYPE;
}> = async (bundle, details) => {
	const { ctx, gameId, player } = bundle;

	await ctx.gamePlayer.update({
		where: {
			gamePlayerId: {
				gameId: gameId,
				number: player
			}
		},
		data: {
			supply: {
				create: {
					type: details.demand
				}
			}
		}
	});
};
