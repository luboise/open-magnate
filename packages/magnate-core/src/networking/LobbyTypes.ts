import { GameState, PlayerCount } from "@/game";

export interface LobbySubmissionData {
	name: string;
	password?: string;
	playerCount: PlayerCount;
	gameState?: GameState;
}

export interface JoinLobbySubmissionData {
	inviteCode: string;
	password?: string;
}

/*
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
*/

export interface LobbyPlayerData {
	name: string;
	playerIndex: number;
	isHost: boolean;
	restaurant: number;
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
	playerIndex: number;
}
