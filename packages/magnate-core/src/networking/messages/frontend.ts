import { BaseMessage, SharedMessage } from ".";
import { LobbyViewPerPlayer } from "../LobbyTypes";
import { GameStateView } from "../views";

export type FrontendMessage =
	| SharedMessage
	| AllUpdatedMessage
	| ClearLocalDataMessage
	| GameStateUpdatedMessage
	| LobbyUpdatedMessage
	| SuccessfulSessionKeyVerificationMessage;

export interface AllUpdatedMessage extends BaseMessage {
	type: "ALL_UPDATED";
	data: {
		lobbyState: LobbyViewPerPlayer;
		gameState: GameStateView;
	};
}

export interface ClearLocalDataMessage extends BaseMessage {
	type: "CLEAR_LOCAL_DATA";
}

export interface SuccessfulSessionKeyVerificationMessage
	extends BaseMessage {
	type: "SESSION_KEY_VERIFIED";
}

export interface GameStateUpdatedMessage
	extends BaseMessage {
	type: "GAMESTATE_UPDATED";
	data: GameStateView;
}
export interface LobbyUpdatedMessage extends BaseMessage {
	type: "LOBBY_UPDATED";
	data: LobbyViewPerPlayer;
}
