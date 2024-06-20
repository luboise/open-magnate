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

	async function UserIsValid(
		req: Request
	): Promise<boolean> {
		const user = GetUserIdentifier(req);
		if (!user) return false;

		return Boolean(
			await SessionKeyController.FindByBrowserId(user)
		);
	}

	function GetUserIdentifier(
		req: Request
	): string | null {
		return req.headers["sec-websocket-key"] || null;
	}

	app.ws("/game", (ws, req) => {
		ws.on("connection", (ws: WebSocket) => {
			ws.send(
				"Websocket initialised. Welcome to Open Magnate."
			);
		});

		ws.on("message", async (msg: string) => {
			const userBrowserId = GetUserIdentifier(req);

			const message = JSON.parse(
				msg
			) as BackendMessage;

			console.log(
				`\"${message.type}\" message received from ${GetUserIdentifier(req)}`
			);

			if (message.type === "CHECK_SESSION_KEY") {
				if (!userBrowserId) return;

				const successfulRenew =
					await SessionKeyController.Renew(
						message.data,
						userBrowserId
					);

				console.log(
					`Renewal: ${successfulRenew ? "Success" : "Failure"}`
				);
				ws.send(
					JSON.stringify(
						(successfulRenew
							? ({
									type: "SUCCESSFUL_SESSION_KEY_VERIFICATION",
									data: message.data
								} as FrontendMessage)
							: {
									type: "CLEAR_LOCAL_DATA"
								}) as FrontendMessage
					)
				);
			} else if (message.type === "NEW_SESSION_KEY") {
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
					ws.send("Error creating session key.");
					return;
				}

				console.log(
					`Sending new session key back to ${userBrowserId}`
				);

				ws.send(
					JSON.stringify({
						type: "NEW_SESSION_KEY",
						data: sessionKey.sessionKey
					} as FrontendMessage)
				);

				return;
			}

			if (!UserIsValid(req)) return;

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
			}
		});
	});

	// Add routes to server.
	app.use("/game", router);
};

module.exports = routeHandler;
