// import { House } from "@prisma/client";
import { RESTAURANT_NAME } from "./RestaurantNames";

export interface LobbySubmissionData {
	name: string;
	password?: string;
	playerCount: number;
}

export interface JoinLobbySubmissionData {
	inviteCode: string;
	password?: string;
}

export type LobbyPlayerView = {
	name: string;
	restaurant: RESTAURANT_NAME;
};

export type MagnateLobbyView = {
	lobbyId: number;
	lobbyName: string;
	lobbyPlayers: LobbyPlayerView[];
	// TODO: Fix GameState in view
	gameState: null; // | GameStateView;
	inviteCode: string;
};

// export type GameStateView = {
// 	players: LobbyPlayerView[];
// 	turnProgress: TurnProgress;
// 	currentTurn: number;
// 	currentPlayer: number;
// 	mapPieces: MapPieceData[];
// 	houses: Array<House>;
// 	turnOrder: Array<number> | null;
// };

