import {
	FullGamePlayer,
	FullGameStateInclude,
	FullHouse
} from "../../database/controller/includes";
import { CreateGameStateView } from "../../dataViews";
import {
	EmployeesById,
	GamePlayerViewPublic,
	GameStateView,
	Map2D
} from "../../utils";
import {
	HouseDistances,
	MoveTransactionFunctionUntyped
} from "./types";

export const HandleDinnertime: MoveTransactionFunctionUntyped =
	async (bundle) => {
		const { ctx, gameId } = bundle;

		const gameState =
			await ctx.gameState.findUniqueOrThrow({
				where: {
					id: gameId
				},
				include: FullGameStateInclude
			});
		const gsv = CreateGameStateView(gameState);

		const { houses, players } = gsv;

		const details = GetDinnertimeDetails(gsv);

		function CanSatisfy(
			player: FullGamePlayer,
			house: FullHouse,
			map: Map2D
		): boolean {}

		for (const house of gameState.houses.sort(
			(h1, h2) => h1.number - h2.number
		)) {
		}
	};

export interface PlayerDinnertimeDetails {
	playerNumber: number;
	distances: HouseDistances;
	unitPrice: number;
	waitresses: number;
	turnOrder: number;
}

export function GetHouseDistances(
	gsv: GameStateView
): HouseDistances {}
export function GetDinnertimeDetails(
	game: GameStateView
): PlayerDinnertimeDetails[] {
	function GetDetails(
		player: GamePlayerViewPublic
	): PlayerDinnertimeDetails {
		return {
			playerNumber: player.playerNumber,
			distances: game.houses.map((house) =>
				GetPlayerDistanceToHouse(
					player,
					house,
					game.map
				)
			),
			// TODO: Fix this to be based on employee tree
			unitPrice: 10,

			waitresses: player.employees.filter(
				(employee) =>
					EmployeesById[employee].type ===
					"WAITRESS"
			).length
		};
	}
	return game.players.map((player) => GetDetails(player));
}

export function GetPlayerDistanceToHouse(
	player: FullGamePlayer,
	house: FullHouse,
	map: Map2D
): number | null {
	// TODO: Implement pathfinding from the house to each restaurant. For now, we will assume every restaurant is the same distance
	return 0;
}

export function GetPlayerScore(
	player: FullGamePlayer,
	house: FullHouse
): number | null {
	const tileDistance = 0;
	const basePrice = 10;

	return null;
}
