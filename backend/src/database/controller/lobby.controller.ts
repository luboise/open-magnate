import {
	// GameState,
	Lobby,
	Prisma,
	TURN_PROGRESS,
	UserSession
} from "@prisma/client";

import {
	DEFAULT_EMPLOYEE_ARRAY,
	LobbySubmissionData,
	LobbyView,
	LobbyViewPerPlayer
} from "../../../../shared";
import prisma from "../../datasource";
import LobbyRepository from "../repository/lobby.repository";
import LobbyPlayerRepository from "../repository/lobbyplayer.repository";
import UserSessionRepository from "../repository/usersession.repository";
import GameStateController, {
	FullGameStateInclude
} from "./gamestate.controller";

const LobbyGetParams = {
	playersInLobby: {
		include: {
			userSession: true
		}
	},
	gameState: {
		include: { ...FullGameStateInclude }
	}
};

export type FullLobby = Prisma.LobbyGetPayload<{
	include: typeof LobbyGetParams;
}>;

const LobbyController = {
	_get: async <T extends boolean = false>(
		where: Prisma.LobbyWhereInput,
		fullGet?: T
	): Promise<
		(T extends true ? FullLobby : Lobby) | null
	> => {
		const lobby = await LobbyRepository.findFirst({
			where: where,

			include: fullGet ? LobbyGetParams : undefined
		});

		return lobby as T extends true ? FullLobby : Lobby;
	},

	GetByLobbyId: async (
		lobbyId: number
	): Promise<FullLobby | null> => {
		return await LobbyController._get(
			{ id: lobbyId },
			true
		);
	},

	GetByInviteCode: async (inviteCode: string) => {
		return await LobbyController._get(
			{ inviteCode: inviteCode },
			true
		);
	},

	GetFromSessionKey: async (sessionKey: string) => {
		const lobby = await LobbyController._get(
			{
				playersInLobby: {
					some: {
						userSession: {
							sessionKey: sessionKey
						}
					}
				}
			},
			true
		);

		return lobby ?? null;
	},
	// _getNewGamestatePlayers: async (
	// 	playerCount: number
	// ) => {
	// 	const data = [];

	// 	const ret: Prisma.GamePlayerCreateManyInput[] = [
	// 		1, 2, 3, 4, 5, 6
	// 	].map(
	// 		(i) =>
	// 			({
	// 				employees: [],
	// 				milestones: [],
	// 				number: i
	// 			}) as Prisma.GamePlayerCreateManyInput
	// 	);
	// 	return ret;
	// },

	NewLobby: async (
		host: UserSession,
		newLobbyData: LobbySubmissionData
	): Promise<Lobby | null> => {
		try {
			if (!newLobbyData) {
				return null;
			}

			const newLobby: Lobby =
				await prisma.$transaction(async (ctx) => {
					const [map, houses] =
						GameStateController.NewMap(
							newLobbyData.playerCount
						);

					const playerIndices = new Array(
						newLobbyData.playerCount
					)
						.fill(null)
						.map((_, index) => index + 1);

					const lobby = await ctx.lobby.create({
						data: {
							name: newLobbyData.name,
							password: newLobbyData.password,
							inviteCode:
								LobbyController.generateInviteCode(),
							gameState: {
								create: {
									playerCount:
										newLobbyData.playerCount,
									rawMap: map,
									houses: {
										createMany: {
											data: houses
										}
									},
									turnOrder: playerIndices
										.sort(
											(_a, _b) =>
												Math.random() -
												0.5
										)
										.join(""),
									players: {
										createMany: {
											data: playerIndices.map(
												(
													playerNumber
												) => ({
													number: playerNumber,
													employees:
														DEFAULT_EMPLOYEE_ARRAY,
													milestones:
														[],
													restaurantDataId:
														playerNumber
												})
											)
										}
									}
								}
							}
						}
					});

					if (!lobby) {
						throw new Error(
							"Unable to create new lobby."
						);
					}

					const lobbyPlayer =
						await ctx.lobbyPlayer.create({
							data: {
								lobby: {
									connect: {
										id: lobby.id
									}
								},
								userSession: {
									connect: {
										sessionKey:
											host.sessionKey
									}
								},
								playerData: {
									connect: {
										gamePlayerId: {
											number: 1,
											gameId: lobby.id
										}
									}
								},
								isHost: true
							}
						});

					if (!lobbyPlayer)
						throw new Error(
							"Unable to create lobby player for the host. Rolling back transaction."
						);

					return lobby;
				});

			return newLobby;
		} catch (error) {
			console.error(error);
		}

		return null;
	},

	MakeLobbyView(lobby: FullLobby) {
		const lobbyData: LobbyView = {
			inGame:
				lobby.gameState !== null &&
				lobby.gameState.turnProgress !==
					TURN_PROGRESS.PREGAME &&
				lobby.gameState.turnProgress !==
					TURN_PROGRESS.POSTGAME,

			lobbyId: lobby.id,
			lobbyName: lobby.name,

			inviteCode: lobby.inviteCode,
			players: lobby.playersInLobby.map((player) => ({
				name: player.userSession.name,
				playerNumber: player.playerNumber,
				isHost: player.isHost,
				restaurant:
					lobby.gameState?.players.find(
						(innerPlayer) =>
							innerPlayer.number ===
							player.playerNumber
					)?.restaurantData.id ?? 1
			}))
		};

		return lobbyData;
	},

	MakeLobbyViewForPlayer(
		lobby: FullLobby,
		sessionKey: string
	): LobbyViewPerPlayer | null {
		try {
			const lobbyView =
				LobbyController.MakeLobbyView(lobby);

			const player = lobby.playersInLobby.find(
				(player) =>
					player.userSession.sessionKey ===
					sessionKey
			);

			if (!player)
				throw new Error(
					"Unable to find player in lobby."
				);

			return {
				...lobbyView,
				hosting: player.isHost,
				playerNumber: player.playerNumber
			};
		} catch (error) {
			console.error(error);
		}
		return null;
	},

	async GetLobbyView(
		lobbyId: number
	): Promise<LobbyView | null> {
		try {
			const fullLobby = await this._get(
				{ id: lobbyId },
				true
			);
			if (!fullLobby) {
				throw new Error("Unable to find lobby.");
			}
			const lobbyView = this.MakeLobbyView(fullLobby);
			if (!lobbyView) {
				throw new Error(
					"Unable to get lobby view from existing lobby."
				);
			}
		} catch (error) {
			console.error(error);
		}

		return null;
	},

	async GetLobbyViewForPlayer(
		lobbyId: number,
		sessionKey: string
	): Promise<LobbyViewPerPlayer | null> {
		try {
			const lobby = await LobbyController._get(
				{ id: lobbyId },
				true
			);
			if (!lobby)
				throw new Error("Unable to find lobby.");

			return LobbyController.MakeLobbyViewForPlayer(
				lobby,
				sessionKey
			);
		} catch (error) {
			console.error(error);
		}
		return null;
	},

	async addPlayer(lobbyId: number, player: UserSession) {
		try {
			// Find an available GamePlayer (slot) in the lobby
			const availableSlot =
				await prisma.gamePlayer.findFirst({
					where: {
						gameId: lobbyId,
						lobbyPlayer: null
					}
				});

			if (!availableSlot)
				throw new Error(
					"No available slots in lobby. Unable to add player to the lobby."
				);

			const newLobbyPlayer =
				await LobbyPlayerRepository.create({
					data: {
						lobby: {
							connect: { id: lobbyId }
						},
						userSession: {
							connect: {
								sessionKey:
									player.sessionKey
							}
						},
						playerData: {
							connect: {
								gamePlayerId: {
									number: availableSlot.number,
									gameId: lobbyId
								}
							}
						}
					}
				});

			console.log(
				`Created LobbyPlayer for player ${player.name} in lobby ${lobbyId}`
			);
			return newLobbyPlayer;
		} catch (error) {
			console.error(error);
		}

		return null;
	},

	async removePlayer(
		lobbyId: number,
		player: UserSession
	): Promise<boolean> {
		try {
			await LobbyPlayerRepository.delete({
				where: {
					userId: player.sessionKey,
					lobbyId: lobbyId
				}
			});

			const players = await prisma.lobbyPlayer.count({
				where: {
					lobbyId: lobbyId
				}
			});

			// Delete the lobby if there are no more players
			// if (players === 0) {
			// 	await prisma.lobby.delete({
			// 		where: {
			// 			id: lobbyId
			// 		}
			// 	});
			// }
			return true;
		} catch (error) {
			console.log(error);
			return false;
		}
	},

	async getUserSessions(
		lobbyId: number
	): Promise<UserSession[]> {
		const users = await UserSessionRepository.findMany({
			where: {
				lobbyPlayer: {
					lobby: { id: lobbyId }
				}
			},
			distinct: "sessionKey"
		});

		return users;
	},

	async refresh(
		lobby: Lobby | FullLobby
	): Promise<FullLobby> {
		const refreshedLobby =
			await LobbyController.GetByLobbyId(lobby.id);

		if (!refreshedLobby)
			throw new Error("Unable to refresh lobby.");

		return refreshedLobby;
	},

	generateInviteCode(): string {
		const characters =
			"ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
		const array = new Uint8Array(8);
		crypto.getRandomValues(array);

		let inviteCode = "";
		for (let i = 0; i < array.length; i++) {
			inviteCode +=
				characters[array[i] % characters.length];
		}

		return array.reduce((acc, char) => {
			return (
				acc + characters[char % characters.length]
			);
		}, "");
		``;
	}
};

export default LobbyController;
