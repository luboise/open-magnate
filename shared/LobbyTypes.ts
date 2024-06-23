import { House } from "../backend/src/database/entity/House";
import { TurnProgress } from "./GameState";
import { MapPieceData } from "./MapData";
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
	gameState: GameStateView | null;
	inviteCode: string;
};

export type GameStateView = {
	players: LobbyPlayerView[];
	turnProgress: TurnProgress;
	currentTurn: number;
	currentPlayer: number;
	mapPieces: MapPieceData[];
	houses: Array<House>;
	turnOrder: Array<number> | null;
};

