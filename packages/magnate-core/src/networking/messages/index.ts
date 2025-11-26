export * from "./backend";
export * from "./frontend";

export interface BaseMessage {
	type: string;
	data: unknown;
}

export type SharedMessage =
	| NewSessionKeyMessage
	| LeaveLobbyMessage;

export interface NewSessionKeyMessage extends BaseMessage {
	type: "NEW_SESSION_KEY";
	data: string;
}

export interface LeaveLobbyMessage extends BaseMessage {
	type: "LEAVE_LOBBY";
}
