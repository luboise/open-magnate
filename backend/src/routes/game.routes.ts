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
	SetLobbyMessage,
	StartGameMessage
} from "../utils";

// Fixes issues from using base WebSocket without extended methods
import { UserSession } from "@prisma/client";
import WebSocket from "ws";
import GameStateController from "../database/controller/gamestate.controller";
import LobbyRepository from "../database/repository/lobby.repository";
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
					return;
				}
				case "JOIN_LOBBY": {
					handleJoinLobby(params);
					return;
				}
				case "LEAVE_LOBBY": {
					handleLeaveLobby(params);
					return;
				}
				case "START_GAME": {
					handleStartGame(params);
					return;
				}
			}
		});

		ws.on("close", (code, reason) => {
			const sessionKey: string = String(
				req.query.sessionKey
			);
			if (code !== 1008) {
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

	if (!sessionKey) {
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

		return;
	}

	// Check if user is already connected
	if (sessionKey in connectionsToWebsocket) {
		ws.send("This session key is already in use.");
		ws.close(
			1008,
			"This session key is already in use."
		);
		return;
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
	}

	console.log(
		`Found session key ${sessionKey}. Adding them to the list of connections.`
	);

	connectionsToWebsocket[sessionKey] = ws;

	if (userSession.lobbyPlayer) {
		console.log(
			`Found an existing lobby for player ${userSession.sessionKey}`
		);
		const lobbyMessage = {
			type: "SET_LOBBY",
			data: {
				lobby: await LobbyController.GetLobbyView(
					userSession.lobbyPlayer.lobby.id
				),
				gamestate:
					await GameStateController.GetGameStateData(
						userSession.lobbyPlayer.lobby.id,
						userSession.sessionKey
					)
			}
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
				data: await LobbyController.GetLobbyView(
					newLobby.id,
					params.userSession.sessionKey
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

		const lobby =
			await LobbyController.GetByInviteCode(
				inviteCode
			);

		if (!lobby)
			throw new Error(
				"No lobby found for that invite code."
			);
		else if (
			lobby.password &&
			lobby.password !== params.message.data.password
		)
			throw new Error("Incorrect password provided.");

		const newLobbyPlayers =
			await LobbyController.addPlayer(
				lobby.id,
				params.userSession
			);
		if (!newLobbyPlayers) {
			throw new Error(
				"Unable to add player to lobby."
			);
		}

		await resendLobby(lobby.id);

		// const response = {
		// 	type: "SET_LOBBY",
		// 	data: await LobbyController.GetLobbyData(
		// 		lobby.id
		// 	)
		// } as SetLobbyMessage;

		// params.ws.send(JSON.stringify(response));
	} catch (error) {
		console.error(error);
		params.ws.send(String(error));
	}
};

const handleLeaveLobby: BackendMessageHandler<
	LeaveLobbyMessage
> = async (params) => {
	if (
		!params.userSession ||
		!params.userSession.sessionKey
	) {
		console.log(
			"Attempted to remove unverified user from session."
		);
		return;
	}

	const lobbyId = (
		await LobbyRepository.findFirst({
			where: {
				players: {
					some: {
						userId: params.userSession
							.sessionKey
					}
				}
			},
			select: { id: true }
		})
	)?.id;

	if (!lobbyId) {
		params.ws.send("You are not currently in a lobby.");
		return;
	}

	// Remove the player from the lobby
	const removed = await LobbyController.removePlayer(
		lobbyId,
		params.userSession
	);

	if (!removed) {
		console.log(
			`Failed to remove player ${params.userSession.sessionKey} from lobby #${lobbyId}.`
		);
		return;
	}

	const lobby =
		await LobbyController.GetByLobbyId(lobbyId);

	if (!lobby)
		throw new Error(
			"Lobby couldn't be found from valid lobbyId. A serious backend error has occured."
		);

	resendLobby(lobby.id);

	console.log(
		`Telling player ${params.userSession.sessionKey} to leave the lobby.`
	);

	params.ws.send(
		JSON.stringify({
			type: "LEAVE_LOBBY"
		} as LeaveLobbyMessage)
	);
};

const handleStartGame: BackendMessageHandler<
	StartGameMessage
> = async (params) => {
	if (
		!params.userSession ||
		!params.userSession.sessionKey
	) {
		console.log(
			"Unable to start game without valid session."
		);
		return;
	}

	const lobby = await LobbyController.GetFromSessionKey(
		params.userSession.sessionKey
	);

	if (!lobby) {
		params.ws.send("You are not currently in a lobby.");
		return;
	}

	const playerAsHost = lobby.playersInLobby.find(
		(player) =>
			player.host &&
			player.userId === params.userSession!.sessionKey
	);

	if (!playerAsHost) {
		params.ws.send(
			"You must be the host of the lobby to start the game."
		);
		return;
	}

	if (lobby.playersInLobby.length !== lobby.playerCount) {
		params.ws.send(
			"Not all players have joined the lobby."
		);
		return;
	}

	const gameStarted =
		await GameStateController.StartGame(lobby);

	if (gameStarted) {
		resendLobby(lobby.id);
	} else {
		params.ws.send("Unable to start game.");
	}
};

// TODO: Fix resendLobby() altering the host on the frontend
export async function resendLobby(lobbyId: number) {
	const lobbyData =
		await LobbyController.GetLobbyView(lobbyId);

	const lobbyPlayers =
		await LobbyController.getUserSessions(lobbyId);

	lobbyPlayers.forEach(async (lobbyPlayer) => {
		const sessionKey = lobbyPlayer.sessionKey;

		const ws = connectionsToWebsocket[sessionKey];

		if (!ws) {
			console.log(
				`Unable to send lobby data to ${sessionKey}.`
			);
			return;
		}

		console.log(
			`Sending updated lobby data to ${sessionKey}.`
		);

		const { hosting, ...restOfLobbyData } = lobbyData;

		ws.send(
			JSON.stringify({
				type: "SET_LOBBY",
				data: restOfLobbyData
			} as SetLobbyMessage)
		);
	});
}

module.exports = routeHandler;
