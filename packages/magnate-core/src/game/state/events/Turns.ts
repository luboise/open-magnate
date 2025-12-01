import { Employee } from "../..";
import { GameState } from "../GameState";
import { MoveTakeTurn } from "../Moves";

export function ExecuteTurn(
	state: GameState,
	playerIndex: number,
	turn: MoveTakeTurn
): GameState | string {
	const newState: GameState = GameState.clone(state);

	// TODO: Pre-sort employees by activation order for validation purposes
	for (const [
		employeeIndexStr,
		actions
	] of Object.entries(turn.actions)) {
		const employeeIndex = Number(employeeIndexStr);

		const player = newState.players[playerIndex];
		const employee = player.employees[employeeIndex];

		if (
			!Employee.canExecuteActions(
				employee,
				playerIndex,
				actions
			)
		) {
			return `Employee with index ${employeeIndex} unable to perform action list ${actions}.`;
		}

		for (const action of actions) {
			switch (action.type) {
				case "RECRUIT": {
					if (
						!(
							action.recruiting in
							newState.cardReserve
						)
					) {
						return `Unable to recruit new employee ${action.recruiting} (employee not in use this game).`;
					} else if (
						newState.cardReserve[
							action.recruiting
						] <= 0
					) {
						return `Unable to recruit new employee ${action.recruiting} (not enough in the reserve)`;
					}

					const newEmployee = Employee.fromType(
						action.recruiting
					);

					newState.cardReserve[
						action.recruiting
					] -= 1;

					if (
						newEmployee.oneOf &&
						player.employees.find(
							(e) =>
								e.employeeType ===
								newEmployee.employeeType
						)
					) {
						return `Unable to recruit 1x employee ${action.recruiting} (you already have one).`;
					}

					player.employees.push(newEmployee);

					break;
				}
				case "MARKETING": {
					// TODO: Implement this
					break;
				}
				case "TRAIN": {
					if (
						action.traineeIndex < 0 ||
						action.traineeIndex >=
							player.employees.length
					) {
						return `Invalid trainee index: ${action.traineeIndex} (player has ${player.employees.length} employees)`;
					}

					const trainee =
						player.employees[
							action.traineeIndex
						];

					if (trainee.employeeType === "CEO") {
						return "Unable to train a CEO.";
					}

					// TODO: Implement this for multi-trains, ie, ensure that guru can train through multiple actions if a step is missing
					if (
						!trainee.buildsInto.includes(
							action.newRole
						)
					) {
						return `Employee of type ${trainee.employeeType} can not train into type ${action.newRole}`;
					}

					if (
						!(
							action.newRole in
							state.cardReserve
						)
					) {
						return `Employee type ${action.newRole} not found in the card reserve this game. Card reserve: ${state.cardReserve}`;
					}

					if (
						state.cardReserve[action.newRole] <=
						0
					) {
						return `Card reserve is out of employee type ${action.newRole}.`;
					}

					// Put the old card back into the reserve
					state.cardReserve[
						trainee.employeeType
					] += 1;

					// Grab the new card from the reserve
					state.cardReserve[action.newRole] -= 1;

					// Replace the player's card
					player.employees[action.traineeIndex] =
						Employee.fromType(action.newRole);
				}
				case "GET_DRINKS": {
					// TODO: Implement this
					break;
				}
				case "CREATE_DEMAND": {
					// TODO: Implement this
					break;
				}
				default:
					action satisfies never;
			}
		}
	}

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
