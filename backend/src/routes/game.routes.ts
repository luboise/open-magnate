import { RouteHandler } from "../types";

import { Request, Response } from "express";
import LobbyController from "../database/controller/lobby.controller";
import SessionKeyController from "../database/controller/sessionkey.controller";
import {
	BackendMessage,
	CheckSessionKeyMessage,
	CreateLobbyMessage,
	FrontendMessage,
	LobbySubmissionData,
	NewSessionKeyMessage
} from "../utils";

// Fixes issues from using base WebSocket without extended methods
import WebSocket from "ws";

// Helpers

function GetUserIdentifier(req: Request): string | null {
	return req.headers["sec-websocket-key"] || null;
}

async function UserIsValid(req: Request): Promise<boolean> {
	const user = GetUserIdentifier(req);
	if (!user) return false;

	return Boolean(
		await SessionKeyController.FindByBrowserId(user)
	);
}

type ParamBundle<MessageType> = {
	req: Request;
	message: MessageType;
	ws: WebSocket;
	userBrowserId: string | null;
};

type BackendMessageHandler<T> = (
	params: ParamBundle<T>
) => void | Promise<void>;

const routeHandler: RouteHandler = (express, app) => {
	const router = express.Router();

	router.get("/", async (req, res) => {
		res.send("testing");
	});

	router.get(
		"/new",
		async (req: Request, res: Response) => {
			// const game = NewGame();
			res.send("New game!");
			console.log("Created new game.");
		}
	);

	// app.ws("/game/:gameid/socket", (ws, req) => {
	// 	ws.on("connection", (ws: WebSocket) => {
	// 		ws.send("Hello world!");
	// 	});

	// 	ws.on("message", (msg: string) => {
	// 		console.log(msg);
	// 	});
	// });

	app.ws("/game", (ws, req) => {
		ws.on("connection", (ws: WebSocket) => {
			ws.send(
				"Websocket initialised. Welcome to Open Magnate."
			);
		});

		ws.on("message", async (msg: string) => {
			const params: ParamBundle<any> = {
				message: JSON.parse(msg) as BackendMessage,
				req: req,
				userBrowserId: GetUserIdentifier(req),
				ws: ws
			};

			console.log(
				`\"${params.message.type}\" message received from ${GetUserIdentifier(req)}`
			);

			if (params.message.type === "CHECK_SESSION_KEY")
				handleCheckSessionKeyMessage(params);
			else if (
				params.message.type === "NEW_SESSION_KEY"
			) {
				handleNewSessionKey(params);
			}

			if (!UserIsValid(params.req)) return;

			switch (params.message.type) {
				case "CREATE_LOBBY": {
					handleCreateLobby(params);
				}
			}
		});
	});

	// Add routes to server.
	app.use("/game", router);
};

// Handlers

const handleCheckSessionKeyMessage: BackendMessageHandler<
	CheckSessionKeyMessage
> = async (params) => {
	if (!params.userBrowserId) return;

	const successfulRenew =
		await SessionKeyController.Renew(
			params.message.data,
			params.userBrowserId
		);

	console.log(
		`Renewal: ${successfulRenew ? "Success" : "Failure"}`
	);
	params.ws.send(
		JSON.stringify(
			(successfulRenew
				? ({
						type: "SUCCESSFUL_SESSION_KEY_VERIFICATION",
						data: params.message.data
					} as FrontendMessage)
				: {
						type: "CLEAR_LOCAL_DATA"
					}) as FrontendMessage
		)
	);
};

const handleNewSessionKey: BackendMessageHandler<
	NewSessionKeyMessage
> = async (params) => {
	if (!params.userBrowserId) {
		params.ws.send(
			"Unsupported connection type. Please try another browser."
		);
		return;
	}

	const sessionKey = await SessionKeyController.New(
		params.userBrowserId
	);

	if (!sessionKey) {
		params.ws.send("Error creating session key.");
		return;
	}

	console.log(
		`Sending new session key back to ${params.userBrowserId}`
	);

	params.ws.send(
		JSON.stringify({
			type: "NEW_SESSION_KEY",
			data: sessionKey.sessionKey
		} as FrontendMessage)
	);

	return;
};

const handleCreateLobby: BackendMessageHandler<
	CreateLobbyMessage
> = async (params) => {
	if (!params.message.data.name) {
		params.ws.send(
			JSON.stringify("Invalid lobby name.")
		);
		return;
	}

	const newLobby = await LobbyController.NewLobby(
		params.message.data as LobbySubmissionData
	);

	if (!newLobby) {
		params.ws.send("Unable to create new lobby.");
		return;
	}

	console.log(
		`Responding with ${JSON.stringify(newLobby)}`
	);

	params.ws.send(
		JSON.stringify({
			type: "NEW_LOBBY",
			data: newLobby.toLobbyData()
		} as FrontendMessage)
	);
};

module.exports = routeHandler;
