import { GameState } from "./GameState";
import { RESTAURANT_NAME } from "./RestaurantNames";

export interface LobbySubmissionData {
	name: string;
	password?: string;
}

type LobbyPlayerData = {
	name: string;
	restaurant: RESTAURANT_NAME;
};

export type MagnateLobbyData = {
	lobbyId: number;
	lobbyName: string;
	lobbyPlayers: LobbyPlayerData[];
	gameState: GameState;
};
