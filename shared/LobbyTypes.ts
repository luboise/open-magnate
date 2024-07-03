// import { House } from "@prisma/client";
import {
	GameStateViewPerPlayer,
	RESTAURANT_NAME
} from "../backend/src/utils";

export interface LobbySubmissionData {
	name: string;
	password?: string;
	playerCount: number;
}

export interface JoinLobbySubmissionData {
	inviteCode: string;
	password?: string;
}

export type MagnateLobbyView = {
	lobbyId: number;
	lobbyName: string;
	playerCount: number;
	hosting: boolean;
	lobbyPlayers: LobbyPlayerData[];
	inGame: boolean;
	gameState: GameStateViewPerPlayer;
	inviteCode: string;
};

export interface LobbyPlayerData {
	name: string;
	playerNumber: number;
	isHost: boolean;
	restaurant: RESTAURANT_NAME;
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
