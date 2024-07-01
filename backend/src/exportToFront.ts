import {
	DEMAND_TYPE,
	House,
	ORIENTATION
} from "@prisma/client";
import { LobbyPlayerView } from "./utils";

type FullHouseType = House & {
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

export type GameStateView = {
	players: LobbyPlayerView[];

	// turnProgress: TurnProgress;
	currentTurn: number;
	currentPlayer: number;
	houses: FullHouseType[];
	map: string;
	turnOrder: Array<number> | null;
};
