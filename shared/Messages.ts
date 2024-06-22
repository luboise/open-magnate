import {
	LobbySubmissionData,
	MagnateLobbyView
} from "./LobbyTypes";

// export type FrontendMessageType =
// 	| "NEW_LOBBY"
// 	| "LOBBY_UPDATED"
// 	| "JOIN_LOBBY"
// 	| "START_GAME";

interface BaseMessage {
	type: string;
	data: unknown;
}

export type FrontendMessage =
	| SetLobbyMessage
	| LobbyUpdatedMessage
	| NewSessionKeyMessage
	| ClearLocalDataMessage
	| SuccessfulSessionKeyVerificationMessage;

export interface SetLobbyMessage extends BaseMessage {
	type: "SET_LOBBY";
	data: MagnateLobbyView;
}
export interface LobbyUpdatedMessage extends BaseMessage {
	type: "LOBBY_UPDATED";
	data: Partial<MagnateLobbyView>;
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
	| CreateLobbyMessage;

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

