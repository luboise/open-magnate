import {
	LobbySubmissionData,
	MagnateLobbyData
} from "./LobbyTypes";

// export type FrontendMessageType =
// 	| "NEW_LOBBY"
// 	| "LOBBY_UPDATED"
// 	| "JOIN_LOBBY"
// 	| "START_GAME";

export type FrontendMessage =
	| {
			type: "NEW_LOBBY";
			data: MagnateLobbyData;
	  }
	| {
			type: "LOBBY_UPDATED";
			data: Partial<MagnateLobbyData>;
	  }
	| {
			type: "NEW_SESSION_KEY";
			data: string;
	  };

export type BackendMessage =
	| {
			type: "CREATE_LOBBY";
			data: LobbySubmissionData;
	  }
	| {
			type: "CHECK_SESSION_KEY";
			data: string;
	  }
	| {
			type: "NEW_SESSION_KEY";
	  };
