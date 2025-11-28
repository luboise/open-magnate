import { GameState, Player } from "../../game";

export const ReadyStatuses = [
	"NOT_READY",
	"READY",
	"NOT_APPLICABLE"
] as const;
export type ReadyStatus = (typeof ReadyStatuses)[number];

export type GameStateView = Omit<GameState, "players"> & {
	currentPlayer: number | null;
	playerIndex: number;
	players: PlayerPublicView[];
	privateData: PlayerPrivateView;
};

export const GameStateView = {
	fromGameState(
		state: GameState,
		playerIndex: number
	): GameStateView {
		// TODO: Fix this to be more efficient
		const nextMove = GameState.nextMove(state);

		const currentPlayer =
			nextMove?.playerIndices.length === 1
				? nextMove?.playerIndices[0]
				: null;

		// TODO: Figure out how to reimplement this
		/*
		const history: GameEventView[] = state.events
			.map((event) => CreateGameEventView(event))
			.sort(
				(e1, e2) =>
					e2.time.getTime() - e1.time.getTime()
			);
			*/

		const player = state.players[playerIndex];

		const privateData: PlayerPrivateView =
			PlayerPrivateView.fromPlayer(player);

		return {
			currentPlayer,
			playerIndex,
			...state,

			players: state.players.map(
				(player): PlayerPublicView =>
					PlayerPublicView.fromPlayer(player)
			),

			privateData
		};
	}
};

export type PlayerPublicView = Omit<
	Player,
	"tree" | "employees" | "bankReserveAmount"
>;

export type PlayerPrivateView = Pick<
	Player,
	Exclude<keyof Player, keyof PlayerPublicView>
>;

export const PlayerPublicView = {
	fromPlayer({
		demand,
		money,
		previousTree,
		restaurantIndex
	}: Player): PlayerPublicView {
		return {
			demand,
			money,
			previousTree,
			restaurantIndex
		};
	}
};

export const PlayerPrivateView = {
	fromPlayer({
		tree,
		employees
	}: Player): PlayerPrivateView {
		return { tree, employees };
	}
};

export function parseTurnOrder(
	serialisedTurnOrder: string
): (number | null)[] {
	return serialisedTurnOrder
		.split("")
		.map((str) => (str === "X" ? null : Number(str)));
}
export function serialiseTurnOrder(
	turnOrder: (number | null)[]
): string {
	return turnOrder
		.map((player) =>
			player === null ? "X" : player.toString()
		)
		.join("");
}
export function ReadyStatusToBoolean(
	status: ReadyStatus
): boolean | null {
	switch (status) {
		case "READY":
			return true;
		case "NOT_READY":
			return false;
		default:
			return null;
	}
}
