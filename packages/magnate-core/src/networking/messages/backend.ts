import { Move } from "@/game";
import { BaseMessage, SharedMessage } from ".";
import {
	JoinLobbySubmissionData,
	LobbySubmissionData
} from "../LobbyTypes";

export type BackendMessage =
	| SharedMessage
	| CheckSessionKeyMessage
	| CreateLobbyMessage
	| JoinLobbyMessage
	| MakeMoveMessage
	| StartGameMessage;

export interface CheckSessionKeyMessage
	extends BaseMessage {
	type: "CHECK_SESSION_KEY";
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

export interface MakeMoveMessage extends BaseMessage {
	type: "MAKE_MOVE";
	data: Move;
}

export interface StartGameMessage extends BaseMessage {
	type: "START_GAME";
}
