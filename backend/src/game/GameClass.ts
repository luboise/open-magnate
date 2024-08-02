import { TurnAction } from "../../../shared";
import { MOVE_TYPE, MoveData } from "../../../shared/Moves";
import { FullGameState } from "../database/controller/gamestate.controller";

// The game class creates a simulation of the game in memory and throws an error if an invalid move is attempted
export class GameClass {
	private gameState: FullGameState;
	private movesMade: MoveData[];

	constructor(gameState: FullGameState) {
		this.gameState = JSON.parse(
			JSON.stringify(gameState)
		);
		this.movesMade = [];
	}

	public executeMove(
		player: number,
		move: MoveData
	): void {
		if (move.MoveType === MOVE_TYPE.PLACE_RESTAURANT) {
		}
		this.movesMade.push(move);
	}

	private executeAction(action: TurnAction): void {}

	public serialise(): FullGameState {
		return JSON.parse(JSON.stringify(this.gameState));
	}

	public getMovesMade(): MoveData[] {
		return JSON.parse(JSON.stringify(this.movesMade));
	}
}

