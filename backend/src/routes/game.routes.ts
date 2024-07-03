import { RouteHandler } from "../types";

import { Request } from "express";
import LobbyController, {
	FullLobby
} from "../database/controller/lobby.controller";
import UserSessionController from "../database/controller/usersession.controller";
import {
	BackendMessage,
	BaseMessage,
	CreateLobbyMessage,
	FrontendMessage,
	JoinLobbyMessage,
	LeaveLobbyMessage,
	LobbySubmissionData,
	StartGameMessage
} from "../utils";

// Fixes issues from using base WebSocket without extended methods
import { UserSession } from "@prisma/client";
import WebSocket from "ws";
import GameStateController from "../database/controller/gamestate.controller";
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

	if (!userSession.lobbyPlayer) {
		console.log(
			`Unable to find a lobby for session key ${sessionKey}. Sending them to lobby creation.`
		);
		ws.send(
			JSON.stringify({
				type: "SESSION_KEY_VERIFIED"
			} as FrontendMessage)
		);
		return;
	}

	const lobby = await LobbyController.GetByLobbyId(
		userSession.lobbyPlayer.gameStateId
	);

	if (!lobby) {
		const msg = `Unable to find a lobby for session key ${sessionKey}.`;
		console.error(msg);
		ws.send(msg);
		return;
	}

	updateOnePlayer(lobby, userSession, "ALL");
}

const handleCreateLobby: BackendMessageHandler<
	CreateLobbyMessage
> = async (params) => {
	try {
		if (!params.message.data.name)
			throw new Error("Invalid lobby name.");
		if (
			!params.message.data.playerCount ||
			params.message.data.playerCount < 2
		)
			throw new Error("Invalid player count.");
		if (!params.userSession)
			throw new Error(
				"Unable to create lobby without valid session."
			);

		const newLobby = await LobbyController.NewLobby(
			params.userSession,
			params.message.data as LobbySubmissionData
		);

		if (!newLobby)
			throw new Error("Unable to create new lobby.");

		console.log(
			`Responding with ${JSON.stringify(newLobby)}`
		);

		const fullLobby =
			await LobbyController.GetByLobbyId(newLobby.id);
		if (!fullLobby) {
			console.error(
				"Unable to get freshly created lobby. "
			);
			return;
		}

		updateOnePlayer(
			fullLobby,
			params.userSession,
			"ALL"
		);
	} catch (error) {
		console.error(error);
		params.ws.send(String(error));
	}
};

type UPDATE_TYPE = "LOBBY" | "GAMESTATE" | "ALL";

function updateOnePlayer(
	lobby: FullLobby,
	player: UserSession,
	updateType: UPDATE_TYPE
) {
	const sessionKey = player.sessionKey;
	const ws = connectionsToWebsocket[sessionKey];

	if (!ws) return;

	if (updateType === "LOBBY") {
		ws.send(
			JSON.stringify({
				type: "LOBBY_UPDATED",
				data: LobbyController.MakeLobbyViewForPlayer(
					lobby,
					sessionKey
				)
			} as FrontendMessage)
		);
	} else if (updateType === "GAMESTATE") {
		ws.send(
			JSON.stringify({
				type: "GAMESTATE_UPDATED",
				data: GameStateController.GetGameStateView(
					lobby
				)
			} as FrontendMessage)
		);
	} else if (updateType === "ALL") {
		ws.send(
			JSON.stringify({
				type: "ALL_UPDATED",
				data: {
					lobbyState:
						LobbyController.MakeLobbyViewForPlayer(
							lobby,
							sessionKey
						),
					gameState:
						GameStateController.GetGameStateView(
							lobby
						)
				}
			} as FrontendMessage)
		);
	}
}

function updateAllPlayers(
	lobby: FullLobby,
	updateType: UPDATE_TYPE
) {
	for (const player of lobby.playersInLobby.map(
		(player) => player.userSession
	)) {
		updateOnePlayer(lobby, player, updateType);
	}
}

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

		updateAllPlayers(
			await LobbyController.refresh(lobby),
			"ALL"
		);

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
		await LobbyController.GetFromSessionKey(
			params.userSession.sessionKey
		)
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

	updateAllPlayers(lobby, "LOBBY");

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
			player.isHost &&
			player.userId === params.userSession!.sessionKey
	);

	if (!playerAsHost) {
		params.ws.send(
			"You must be the host of the lobby to start the game."
		);
		return;
	}

	if (
		lobby.playersInLobby.length !==
		lobby.gameState?.playerCount
	) {
		params.ws.send(
			"Not all players have joined the lobby."
		);
		return;
	}

	const gameStarted =
		await GameStateController.StartGame(lobby);

	if (!gameStarted) {
		params.ws.send("Unable to start game.");
		return;
	}

	updateAllPlayers(
		await LobbyController.refresh(lobby),
		"ALL"
	);
};

module.exports = routeHandler;
