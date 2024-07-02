// import { House } from "@prisma/client";
import { GameStateViewPerPlayer } from "../backend/src/utils";
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
	host: boolean;
};

export type MagnateLobbyView = {
	lobbyId: number;
	lobbyName: string;
	playerCount: number;
	hosting: boolean;
	lobbyPlayers: LobbyPlayerView[];
	inGame: boolean;
	gameState: GameStateViewPerPlayer;
	inviteCode: string;
};

interface LobbyPlayerData {
	name: string;
	playerNumber: number;
	host: boolean;
}

// The base lobby view that is player agnostic
export interface LobbyView {
	lobbyId: number;
	lobbyName: string;
	inGame: boolean;

	players: LobbyPlayerData[];

	inviteCode: string;
}

// The lobby view sent back to the player, that contains their player number and whether they are the host
export interface LobbyViewPerPlayer extends LobbyView {
	hosting: boolean;
	playerNumber: number;
}
