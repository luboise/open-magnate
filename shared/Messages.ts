import { GameStateViewPerPlayer } from "../backend/src/dataViews";
import {
	JoinLobbySubmissionData,
	LobbySubmissionData,
	LobbyViewPerPlayer
} from "./LobbyTypes";

// export type FrontendMessageType =
// 	| "NEW_LOBBY"
// 	| "LOBBY_UPDATED"
// 	| "JOIN_LOBBY"
// 	| "START_GAME";

export interface BaseMessage {
	type: string;
	data: unknown;
}

export type FrontendMessage =
	// Auth messages
	| NewSessionKeyMessage
	| ClearLocalDataMessage
	| SuccessfulSessionKeyVerificationMessage
	// Joining/leaving lobbies
	| LeaveLobbyMessage
	// State updates
	| AllUpdatedMessage
	| LobbyUpdatedMessage
	| GameStateUpdatedMessage;

export interface AllUpdatedMessage extends BaseMessage {
	type: "ALL_UPDATED";
	data: {
		lobbyState: LobbyViewPerPlayer;
		gameState: GameStateViewPerPlayer;
	};
}
export interface LobbyUpdatedMessage extends BaseMessage {
	type: "LOBBY_UPDATED";
	data: LobbyViewPerPlayer;
}

export interface GameStateUpdatedMessage
	extends BaseMessage {
	type: "GAMESTATE_UPDATED";
	data: GameStateViewPerPlayer;
}

export interface NewSessionKeyMessage extends BaseMessage {
	type: "NEW_SESSION_KEY";
	data: string;
}
export interface ClearLocalDataMessage extends BaseMessage {
	type: "CLEAR_LOCAL_DATA";
}
export interface SuccessfulSessionKeyVerificationMessage
	extends BaseMessage {
	type: "SESSION_KEY_VERIFIED";
}

export type BackendMessage =
	| CheckSessionKeyMessage
	| NewSessionKeyMessage
	| CreateLobbyMessage
	| JoinLobbyMessage
	| LeaveLobbyMessage
	| StartGameMessage;

export interface CheckSessionKeyMessage
	extends BaseMessage {
	type: "CHECK_SESSION_KEY";
	data: string;
}

export interface NewSessionKeyMessage extends BaseMessage {
	type: "NEW_SESSION_KEY";
	data: string;
}

export interface CreateLobbyMessage extends BaseMessage {
	type: "CREATE_LOBBY";
	data: LobbySubmissionData;
}

export interface JoinLobbyMessage extends BaseMessage {
	type: "JOIN_LOBBY";
	data: JoinLobbySubmissionData;
}

export interface LeaveLobbyMessage extends BaseMessage {
	type: "LEAVE_LOBBY";
}

export interface StartGameMessage extends BaseMessage {
	type: "START_GAME";
}
