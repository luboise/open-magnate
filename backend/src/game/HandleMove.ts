import {
	ENTRANCE_CORNER,
	GamePlayer,
	PrismaClient
} from "@prisma/client";
import { MOVE_TYPE, MoveData } from "../../../shared/Moves";
import { FullGameState } from "../database/controller/gamestate.controller";

interface UpdateCalculation {
	status: "UPDATED" | "FAILED";
	updateGame: boolean;
	updates: UpdateCalculationItem[];
}

export function CalculateMove(
	gameState: FullGameState,
	moveMade: MoveData
): UpdateCalculation {
	if (moveMade.MoveType === MOVE_TYPE.PLACE_RESTAURANT) {
		const success =
			await GameStateController.AddNewRestaurant(
				gamePlayer,
				{
					x: moveMade.x,
					y: moveMade.y,
					entrance: moveMade.entrance
				}
			);

		if (!success) {
			console.error(
				"Unable to create new restaurant."
			);
			return;
		}

		advance = true;
	} else if (moveMade.MoveType === MOVE_TYPE.TAKE_TURN) {
		const success =
			await GameStateController.ExecuteTurn(
				lobby.id,
				moveMade.actions
			);

		if (!success) {
		}

		advance = true;
	} else if (
		moveMade.MoveType === MOVE_TYPE.NEGOTIATE_SALARIES
	) {
		if (
			lobby.gameState?.turnProgress !==
			"SALARY_PAYOUTS"
		) {
			const msg =
				"Invalid salary negotiation attempted in lobby #${lobby.id}`";
			console.debug(msg);
			params.ws.send(msg);
			return;
		}

		if (!params.playerNumber) {
			console.debug(
				`No player number provided for negotiating salaries in lobby #${lobby.id}`
			);
			return;
		}

		const success =
			await GameStateController.NegotiateSalaries(
				lobby.id,
				params.playerNumber,
				moveMade.employeesToFire
			);

		if (!success) {
			console.debug(
				`Failed to negotiate salaries for player ${params.playerNumber} in lobby #${lobby.id}`
			);
			return;
		}
	}
}

export async function TransactMove(
	ctx: PrismaClient,
	moves: MoveData[]
): Promise<void> {
	for (const move of moves) {
		if (move.MoveType === MOVE_TYPE.PLACE_RESTAURANT) {
		}
	}
	ctx.gameState;
}

interface NewRestaurantDetails {
	x: number;
	y: number;
	entrance: ENTRANCE_CORNER;
}

export const TransactionMoves = {
	addNewRestaurant: async (
		ctx: PrismaClient,
		player: GamePlayer,
		details: NewRestaurantDetails
	) => {
		{
			// TODO: Add validation
			const updated =
				await ctx.gamePlayerRestaurant.create({
					data: {
						gameId: player.gameId,
						playerNumber: player.number,

						x: details.x,
						y: details.y,
						entrance: details.entrance
					}
				});

			return Boolean(updated);

			return false;
		}
	}
};
