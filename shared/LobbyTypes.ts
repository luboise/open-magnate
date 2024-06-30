// import { House } from "@prisma/client";
import { GameStateView } from "../backend/src/utils";
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
	playerCount: number;
	hosting: boolean;
	lobbyPlayers: LobbyPlayerView[];
	gameState: GameStateView;
	inviteCode: string;
};

