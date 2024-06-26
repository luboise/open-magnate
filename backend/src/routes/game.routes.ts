import { RouteHandler } from "../types";

import { Request } from "express";
import LobbyController from "../database/controller/lobby.controller";
import UserSessionController from "../database/controller/usersession.controller";
import {
	BackendMessage,
	BaseMessage,
	CreateLobbyMessage,
	FrontendMessage,
	JoinLobbyMessage,
	LeaveLobbyMessage,
	LobbySubmissionData,
	SetLobbyMessage
} from "../utils";

// Fixes issues from using base WebSocket without extended methods
import { UserSession } from "@prisma/client";
import WebSocket from "ws";
import prisma from "../datasource";
import { connectionsToWebsocket } from "./connections";

// Helpers

function GetUserIdentifier(req: Request): string | null {
	return req.headers["sec-websocket-key"] || null;
}

async function UserIsValid(req: Request): Promise<boolean> {
	const user = GetUserIdentifier(req);
	if (!user) return false;

	return Boolean(
		await UserSessionController.FindByBrowserId(user)
	);
}

type ParamBundle<MessageType extends BaseMessage> = {
	req: Request;
	message: MessageType;
	ws: WebSocket;
	userBrowserId: string | null;
	userSession: UserSession | null;
};

type BackendMessageHandler<T extends BaseMessage> = (
	params: ParamBundle<T>
) => void | Promise<void>;

const routeHandler: RouteHandler = (express, app) => {
	const router = express.Router();

	app.ws("/game", async (ws, req) => {
		handleNewConnection(ws, req);

		ws.on("message", async (msg: string) => {
			const userBrowserId = GetUserIdentifier(req);
			const params: ParamBundle<any> = {
				message: JSON.parse(msg) as BackendMessage,
				req: req,
				userBrowserId: userBrowserId,
				ws: ws,
				userSession:
					await UserSessionController.GetBySessionKey(
						req.query.sessionKey as string
					)
			};

			console.log(
				`\"${params.message.type}\" message received from ${params.userSession?.sessionKey ?? "anonymous user."}`
			);

			if (!UserIsValid(params.req)) {
				ws.send("Unverified request.");
				return;
			}

			switch (
				(params.message as BackendMessage).type
			) {
				case "CREATE_LOBBY": {
					handleCreateLobby(params);
				}
				case "JOIN_LOBBY": {
					handleJoinLobby(params);
				}
				case "LEAVE_LOBBY": {
					handleLeaveLobby(params);
				}
			}
		});

		ws.on("close", (code, reason) => {
			const sessionKey: string = String(
				req.query.sessionKey
			);
			if (code === 1000) {
				console.log(
					`Connection closed peacefully with ${sessionKey}`
				);
				delete connectionsToWebsocket[sessionKey];
				return;
			}
			console.log(
				`Connection closed with code ${code} and reason \"${reason}\"`
			);
		});
	});

	// Add routes to server.
	app.use("/game", router);
};

// Handlers

async function handleNewConnection(
	ws: WebSocket,
	req: Request
) {
	const sessionKey: string = String(req.query.sessionKey);

	// ws.on("connection", async (ws: WebSocket) => {
	console.log(
		`Connection started with ${sessionKey ? 'session key "' + sessionKey + '"' : "new user"}.`
	);

	if (sessionKey) {
		// Check if user is already connected
		if (sessionKey in connectionsToWebsocket) {
			ws.send("This session key is already in use.");
			ws.close(
				1008,
				"This session key is already in use."
			);
		}
		const userSession =
			await UserSessionController.GetDeep(sessionKey);

		if (!userSession) {
			ws.send(
				JSON.stringify({
					type: "CLEAR_LOCAL_DATA"
				} as FrontendMessage)
			);
			ws.close(4001, "No session key provided.");
			return;
		} else {
			console.log(`Found session key ${sessionKey}`);
			if (userSession.lobbyPlayer) {
				console.log(
					`Found an existing lobby for player ${userSession.sessionKey}`
				);
				const lobbyMessage = {
					type: "SET_LOBBY",
					data: await LobbyController.GetLobbyData(
						userSession.lobbyPlayer.lobby.id
					)
				} as FrontendMessage;
				ws.send(JSON.stringify(lobbyMessage));
			} else {
				console.log(
					`Unable to find a lobby for session key ${sessionKey}. Sending them to lobby creation.`
				);
				ws.send(
					JSON.stringify({
						type: "SESSION_KEY_VERIFIED"
					} as FrontendMessage)
				);
			}
		}
	} else {
		const browserId = GetUserIdentifier(req);
		const sessionKey =
			await UserSessionController.New(browserId);

		if (sessionKey) {
			console.log(
				`Sending a new session key to ${browserId}`
			);
			ws.send(
				JSON.stringify({
					type: "NEW_SESSION_KEY",
					data:
						sessionKey?.sessionKey ??
						"HELLOWORLD"
				} as FrontendMessage)
			);
		} else
			ws.send(
				"Internal server error. Unable to generate new session key."
			);

		ws.close();
	}
}

const handleCreateLobby: BackendMessageHandler<
	CreateLobbyMessage
> = async (params) => {
	try {
		if (!params.message.data.name) {
			params.ws.send("Invalid lobby name.");
			return;
		} else if (
			!params.message.data.playerCount ||
			params.message.data.playerCount < 2
		) {
			params.ws.send("Invalid player count.");
			return;
		} else if (!params.userSession) {
			params.ws.send(
				"Unable to create lobby without valid session."
			);
			return;
		}

		const newLobby = await LobbyController.NewLobby(
			params.userSession,
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
				type: "SET_LOBBY",
				data: await LobbyController.GetLobbyData(
					newLobby.id
				)
			} as FrontendMessage)
		);
	} catch (error) {
		console.error(error);
	}
};

const handleJoinLobby: BackendMessageHandler<
	JoinLobbyMessage
> = async (params) => {
	try {
		if (!params.userSession) {
			throw new Error(
				"Unable to join lobby without valid session."
			);
		}

		const inviteCode = params.message.data.inviteCode;
		console.log("message: ", params.message);
		console.log("inviteCode: ", inviteCode);
		if (!inviteCode)
			throw new Error(
				"Invalid invite code provided."
			);

		const lobby = await prisma.lobby.findFirst({
			include: {
				players: true,
				gameState: true
			},
			where: {
				inviteCode: inviteCode
			}
		});

		if (!lobby)
			throw new Error(
				"No lobby found for that invite code."
			);
		else if (
			lobby.password &&
			lobby.password !== params.message.data.password
		)
			throw new Error("Incorrect password provided.");

		const lobbyPlayer = await LobbyController.addPlayer(
			lobby,
			params.userSession
		);
		if (!lobbyPlayer) {
			throw new Error(
				"Unable to add player to lobby."
			);
		}

		const response = {
			type: "SET_LOBBY",
			data: await LobbyController.GetLobbyData(
				lobby.id
			)
		} as SetLobbyMessage;

		params.ws.send(JSON.stringify(response));
	} catch (error) {
		console.error(error);
		params.ws.send(String(error));
	}
};

const handleLeaveLobby: BackendMessageHandler<
	LeaveLobbyMessage
> = async (params) => {
	// TODO: Notify the other players that the lobby state has changed
	// TODO: Add SQL trigger to delete the lobby if the last player leaves
	// TODO: Fix leaving lobby as it is currently not working
	if (!params.userSession) {
		console.log(
			"Attempted to remove unverified user from session."
		);
		return;
	}

	const lobby = await prisma.lobby.findFirst({
		where: {
			players: {
				some: {
					userId: params.userSession.sessionKey
				}
			}
		}
	});

	if (!lobby) {
		params.ws.send("You are not currently in a lobby.");
		return;
	}

	const lobbyPlayers =
		await LobbyController.GetLobbyPlayerFromUserSession(
			params.userSession.sessionKey
		);

	// Remove the player from the lobby
	const removed = await LobbyController.removePlayer(
		lobby,
		params.userSession
	);

	if (!removed) {
		console.log(
			`Failed to remove player ${params.userSession.sessionKey} from lobby #${lobby.id}.`
		);
		return;
	}

	const otherPlayers =
		await LobbyController.getPlayersFrom(lobby);

	const lobbyData = await LobbyController.GetLobbyData(
		lobby.id
	);

	console.log(otherPlayers.length, otherPlayers);

	otherPlayers.forEach(async (userSession) => {
		const ws =
			connectionsToWebsocket[userSession.sessionKey];

		if (!ws) {
			console.log(
				`Unable to send lobby data to ${userSession.sessionKey}.`
			);
			return;
		}

		console.log(
			`Sending updated lobby data to ${userSession.sessionKey}.`
		);
		ws.send(
			JSON.stringify({
				type: "SET_LOBBY",
				data: lobbyData
			} as SetLobbyMessage)
		);
	});

	params.ws.send(
		JSON.stringify({
			type: "LEAVE_LOBBY"
		} as LeaveLobbyMessage)
	);
};

// const handleCheckSessionKeyMessage: BackendMessageHandler<
// 	CheckSessionKeyMessage
// > = async (params) => {
// 	if (!params.userBrowserId) return;

// 	const successfulRenew =
// 		await SessionKeyController.Renew(
// 			params.message.data,
// 			params.userBrowserId
// 		);

// 	console.log(
// 		`Renewal: ${successfulRenew ? "Success" : "Failure"}`
// 	);
// 	params.ws.send(
// 		JSON.stringify(
// 			(successfulRenew
// 				? {
// 						type: "SESSION_KEY_VERIFIED",
// 						data: params.message.data
// 					}
// 				: {
// 						type: "CLEAR_LOCAL_DATA"
// 					}) as FrontendMessage
// 		)
// 	);
// };

// const handleNewSessionKey: BackendMessageHandler<
// 	NewSessionKeyMessage
// > = async (params) => {
// 	if (!params.userBrowserId) {
// 		params.ws.send(
// 			"Unsupported connection type. Please try another browser."
// 		);
// 		return;
// 	}

// 	const existingSessionKey =
// 		await SessionKeyController.FindByBrowserId(
// 			params.userBrowserId
// 		);

// 	// Handle existing session keys
// 	if (existingSessionKey) {
// 		handleCheckSessionKeyMessage({
// 			...params,
// 			message: {
// 				type: "CHECK_SESSION_KEY",
// 				data: params.message.data
// 			}
// 		});
// 		const keyMessage = {
// 			type: "NEW_SESSION_KEY",
// 			data: existingSessionKey.lobbyPlayer.sessionKey
// 				.sessionKey
// 		} as FrontendMessage;
// 		params.ws.send(JSON.stringify(keyMessage));

// 		if (existingSessionKey.lobbyPlayer.lobby) {
// 			const lobbyMessage = {
// 				type: "SET_LOBBY",
// 				data: existingSessionKey.lobbyPlayer.lobby.toLobbyData()
// 			} as FrontendMessage;
// 			params.ws.send(JSON.stringify(lobbyMessage));
// 		}
// 		return;
// 	}

// 	// Handle new session keys
// 	const sessionKey = await SessionKeyController.New(
// 		params.userBrowserId
// 	);

// 	if (!sessionKey) {
// 		params.ws.send("Error creating session key.");
// 		return;
// 	}

// 	console.log(
// 		`Sending new session key back to ${params.userBrowserId}`
// 	);

// 	params.ws.send(
// 		JSON.stringify({
// 			type: "NEW_SESSION_KEY",
// 			data: sessionKey.sessionKey
// 		} as FrontendMessage)
// 	);

// 	return;
// };

// router.get("/", async (req, res) => {
// 	res.send("testing");
// });

// router.get(
// 	"/new",
// 	async (req: Request, res: Response) => {
// 		// const game = NewGame();
// 		res.send("New game!");
// 		console.log("Created new game.");
// 	}
// );

// app.ws("/game/:gameid/socket", (ws, req) => {
// 	ws.on("connection", (ws: WebSocket) => {
// 		ws.send("Hello world!");
// 	});

// 	ws.on("message", (msg: string) => {
// 		console.log(msg);
// 	});
// });

module.exports = routeHandler;
