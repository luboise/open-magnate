import { RouteHandler } from "../types";

import { Request, Response } from "express";
import LobbyController from "../database/controller/lobby.controller";
import SessionKeyController from "../database/controller/sessionkey.controller";
import {
	BackendMessage,
	FrontendMessage,
	LobbySubmissionData
} from "../utils";

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
			const message = JSON.parse(
				msg
			) as BackendMessage;

			console.log(
				`New message from ${req.headers.origin}, ${JSON.stringify(message)}`
			);

			switch (message.type) {
				case "CREATE_LOBBY": {
					if (!message.data.name) {
						ws.send(
							JSON.stringify(
								"Invalid lobby name."
							)
						);
						return;
					}

					const newLobby =
						await LobbyController.NewLobby(
							message.data as LobbySubmissionData
						);

					if (!newLobby) {
						return null;
					}

					console.log(
						`Responding with ${JSON.stringify(newLobby)}`
					);
					ws.send(
						JSON.stringify({
							type: "NEW_LOBBY",
							data: newLobby.toLobbyData()
						} as FrontendMessage)
					);
				}

				case "CHECK_SESSION_KEY": {
					const userBrowserId =
						req.headers.origin;

					console.log(userBrowserId);
				}
				case "NEW_SESSION_KEY": {
					const userBrowserId =
						req.headers.origin;

					if (!userBrowserId) {
						ws.send(
							"Unsupported connection type. Please try another browser."
						);
						return;
					}

					const sessionKey =
						await SessionKeyController.New(
							userBrowserId
						);

					if (!sessionKey) {
						ws.send(
							"Error creating session key."
						);
						return;
					}

					ws.send(
						JSON.stringify({
							type: "NEW_SESSION_KEY",
							data: sessionKey.sessionKey
						} as FrontendMessage)
					);
				}
			}
		});
	});

	// Add routes to server.
	app.use("/game", router);
};

module.exports = routeHandler;
