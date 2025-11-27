import { EmployeeType } from "../..";
import { GameState } from "../GameState";
import { MoveTakeTurn } from "../Moves";

export function ExecuteTurn(
	state: GameState,
	playerIndex: number,
	turn: MoveTakeTurn
): GameState | undefined {
	const newState: GameState = JSON.parse(
		JSON.stringify(state)
	);

	// TODO: Add validation for valid recruiting
	const newRecruits: EmployeeType[] = [];

	const player = newState.players[playerIndex];

	for (const action of turn.actions) {
		if (action.type === "RECRUIT") {
			newRecruits.push(action.recruiting);
		} else if (action.type === "MARKETING") {
			// CreateMarketingCampaign(bundle, action);
		} else if (action.type === "GET_DEMAND") {
			player.demand[action.demand] += action.amount;
		}
	}

	// TODO: Add the new recruits to the player

	return newState;
}

/*
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
*/
