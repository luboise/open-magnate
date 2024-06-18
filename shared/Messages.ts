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
	  };

export type BackendMessage = {
	type: "CREATE_LOBBY";
	data: LobbySubmissionData;
};
