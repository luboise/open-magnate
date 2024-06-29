// import { House } from "@prisma/client";
import { GameStateView } from "../backend/src/database/controller/gamestate.controller";
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
	gameState: GameStateView;
	inviteCode: string;
};
