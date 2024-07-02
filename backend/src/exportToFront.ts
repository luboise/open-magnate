import {
	DEMAND_TYPE,
	House,
	ORIENTATION,
	TURN_PROGRESS as PrismaTurnProgress
} from "@prisma/client";
import { LobbyPlayerView } from "./utils";

export type GameStateView = {
	players: LobbyPlayerView[];

	turnProgress: TURN_PROGRESS;
	currentTurn: number;
	currentPlayer: number;
	houses: HouseView[];
	map: string;
	turnOrder: Array<number> | null;
};

export type TURN_PROGRESS = PrismaTurnProgress;

export type HouseView = House & {
	demand: {
		houseId: number;
		type: DEMAND_TYPE;
	}[];
	garden: {
		houseId: number;
		x: number;
		y: number;
		orientation: ORIENTATION;
	} | null;
};
