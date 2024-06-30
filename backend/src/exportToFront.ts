import { House } from "@prisma/client";
import { LobbyPlayerView } from "./utils";

export type GameStateView = {
	players: LobbyPlayerView[];
	// turnProgress: TurnProgress;
	currentTurn: number;
	currentPlayer: number;
	map: string;
	houses: House[];
	turnOrder: Array<number> | null;
};
