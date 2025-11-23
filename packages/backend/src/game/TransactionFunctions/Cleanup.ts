import { DemandType } from "magnate-core/demand/Supply";
import {
	FullGameState,
	FullGameStateInclude,
	FullHouse
} from "../../database/controller/includes";
import {
	CreateGameStateView,
	CreateHouseView,
	HouseView
} from "../../dataViews";
import {
	Area,
	MarketingCampaignView,
	MarketingTilesByNumber
} from "../../utils";
import { BroadcastMarketing } from "./Turns";
import {
	MoveTransactionFunctionTyped,
	MoveTransactionFunctionUntyped
} from "./types";

export const HandleEndOfRound: MoveTransactionFunctionUntyped =
	async (bundle) => {
		const { ctx } = bundle;

		const gameState =
			await ctx.gameState.findUniqueOrThrow({
				where: {
					id: bundle.gameId
				},
				include: FullGameStateInclude
			});

		if (gameState.turnProgress !== "SALARY_PAYOUTS")
			throw new Error(
				`Attempted to handle end of round for a game that is not in the salary stage in lobby #${gameState.id}`
			);

		const gsv = CreateGameStateView(gameState);

		for (const campaign of gsv.marketingCampaigns) {
			await BroadcastMarketing(bundle, campaign);
		}

		const updated = await ctx.gameState.update({
			where: {
				id: gameState.id
			},
			data: {
				currentTurn: gameState.currentTurn + 1,
				turnProgress: "RESTRUCTURING"
			}
		});

		if (!updated)
			throw new Error("Unable to update game state.");
	};

export const AddDemand: MoveTransactionFunctionTyped<{
	house: HouseView;
	foodType: DemandType;
}> = async (bundle, details): Promise<void> => {
	const { ctx, gameId } = bundle;
	const { house, foodType } = details;
	try {
		const existingHouse =
			await ctx.house.findUniqueOrThrow({
				where: {
					gameId_number: {
						gameId: gameId,
						number: house.priority
					}
				},
				include: {
					demand: true
				}
			});

		if (
			existingHouse.demand.length >=
			existingHouse.demandLimit
		) {
			console.log("House at demand limit. Skipping");
			return;
		}

		await ctx.house.update({
			where: {
				gameId_number: {
					gameId: gameId,
					number: existingHouse.number
				}
			},
			data: {
				demand: {
					create: {
						type: foodType
					}
				}
			}
		});
	} catch (error) {
		console.error(`Error finding house: ${error}`);
		return;
	}
};

export const GetAffectedHouses: MoveTransactionFunctionTyped<
	MarketingCampaignView
> = async (bundle, campaign): Promise<HouseView[]> => {
	const { ctx, gameId } = bundle;
	const game: FullGameState =
		await ctx.gameState.findUniqueOrThrow({
			where: { id: gameId },
			include: FullGameStateInclude
		});

	return game.houses
		.filter((house) =>
			HouseIsAffectedByMarketing(house, campaign)
		)
		.map((house) => CreateHouseView(house));
};

export const HouseIsAffectedByMarketing = (
	house: FullHouse,
	campaign: MarketingCampaignView
): boolean => {
	if (campaign.type === "BILLBOARD") {
		return Area.IsAdjacent(
			{
				pos: { x: house.x, y: house.y },
				width: 2,
				height: 2
			},
			{
				...MarketingTilesByNumber[
					campaign.priority
				],

				pos: {
					x: campaign.pos.x,
					y: campaign.pos.y
				}
			}
		);
	}
	// TODO: Account for the other marketing types
	return false;
};
