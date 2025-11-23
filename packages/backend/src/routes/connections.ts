import Websocket from "ws";

export const connectionsToWebsocket: Record<
	string,
	Websocket
> = {};
