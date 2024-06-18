export const API_BASE_URL = "/api/v1";

export enum APIRoutes {
	VALID_TOKEN = "/auth/token-check",
	SET_USERNAME = "/newuser",
	NEW_LOBBY = "/lobby/new",
	GET_LOBBY = "/lobby/"
}

export const FrontendRoutes = {
	PLAY: "/game",
	GAME: "/game",
	HOME: "/"
};
