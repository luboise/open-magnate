import { GameState, newGame } from "magnate-core";

import {
	LobbyPlayerData,
	LobbySubmissionData,
	LobbyView,
	PlayerLobbyView
} from "magnate-core/networking";

import { Lobby, UserSession, prisma } from "../datasource";
import { LOBBY_STATUS } from "../datasource/generated/enums";
import {
	LobbyGetPayload,
	LobbyWhereInput
} from "../datasource/generated/models/Lobby";
import LobbyRepository from "../repository/lobby.repository";
import LobbyPlayerRepository from "../repository/lobbyplayer.repository";
import UserSessionRepository from "../repository/usersession.repository";

const LobbyController = {
	_get: async <T extends boolean = false>(
		where: LobbyWhereInput,
		fullGet?: T
	): Promise<
		(T extends true ? FullLobby : Lobby) | null
	> => {
		const lobby = await LobbyRepository.findFirst({
			where: where,

			include: fullGet ? FullLobbyInclude : undefined
		});

		return lobby as T extends true ? FullLobby : Lobby;
	},

	getByLobbyId: async (
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
					const lobby = await ctx.lobby.create({
						data: {
							name: newLobbyData.name,
							password: newLobbyData.password,
							inviteCode:
								LobbyController.generateInviteCode(),
							gameState: JSON.parse(
								JSON.stringify(
									newLobbyData.gameState ??
										newGame({
											playerCount:
												newLobbyData.playerCount
										})
								)
							)
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

								playerIndex: 0,
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

	async queryLobbyView(
		lobbyId: number
	): Promise<LobbyView | null> {
		try {
			const lobby = await this._get(
				{ id: lobbyId },
				true
			);
			if (!lobby) {
				throw new Error("Unable to find lobby.");
			}

			const lobbyView = FullLobby.getLobbyView(lobby);
			if (!lobbyView) {
				throw new Error(
					"Unable to get lobby view from existing lobby."
				);
			}

			return lobbyView;
		} catch (error) {
			console.error(error);
		}

		return null;
	},

	async addPlayer(lobbyId: number, player: UserSession) {
		try {
			// Find an available GamePlayer (slot) in the lobby

			const lobby =
				await LobbyController.getByLobbyId(lobbyId);

			if (!lobby) {
				throw Error(
					"No lobby found for lobby ID " + lobbyId
				);
			}

			const slotsInUse = lobby.playersInLobby.length;

			// If the number of people in the lobby matches the number of players in the game, ie, if all players are already in
			if (
				slotsInUse ===
				lobby.gameState.players.length
			) {
				throw Error(
					"Lobby " + lobbyId + " is already full."
				);
			}

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
						playerIndex: slotsInUse
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
			await LobbyController.getByLobbyId(lobby.id);

		if (!refreshedLobby)
			throw new Error("Unable to refresh lobby.");

		return refreshedLobby;
	},

	async setLobbyStatus(
		lobbyId: number,
		status: LOBBY_STATUS
	): Promise<boolean> {
		try {
			await LobbyRepository.update({
				where: {
					id: lobbyId
				},
				data: {
					lobbyStatus: status
				}
			});
			return true;
		} catch (e) {
			console.error(
				"Error occurred setting lobby status: " + e
			);
		}
		return false;
	},

	async setGameState(
		lobbyId: number,
		newState: GameState
	): Promise<boolean> {
		try {
			await LobbyRepository.update({
				where: {
					id: lobbyId
				},
				data: {
					gameState: JSON.parse(
						JSON.stringify(newState)
					)
				}
			});
			return true;
		} catch (e) {
			console.error(
				"Error occurred setting lobby status: " + e
			);
		}
		return false;
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
	}

	// TODO: Figure out if can get rid of this or not
	/*
	allPlayersReady: async (
		gameId: number
	): Promise<boolean> => {
		try {
			const players =
				await prisma.gamePlayer.findMany({
					where: {
						gameId: gameId
					}
				});

			return (
				players.every(
					(player) =>
						player.ready === READY_STATUS.READY
				) ||
				players.every(
					(player) =>
						player.ready ===
						READY_STATUS.NOT_APPLICABLE
				)
			);
		} catch (error) {
			console.debug(error);
			return false;
		}
	}
	*/
};

export default LobbyController;
export const FullLobbyInclude = {
	playersInLobby: {
		include: {
			userSession: true
		}
	}
} as const;
export type FullLobby = Omit<
	LobbyGetPayload<{
		include: typeof FullLobbyInclude;
	}>,
	"gameState"
> & { gameState: GameState };

export const FullLobby = {
	getLobbyView(lobby: FullLobby): LobbyView {
		const lobbyData: LobbyView = {
			inGame: lobby.lobbyStatus === "IN_GAME",

			lobbyId: lobby.id,
			lobbyName: lobby.name,

			inviteCode: lobby.inviteCode,
			players: lobby.playersInLobby.map(
				(player): LobbyPlayerData => ({
					name: player.userSession.name,
					playerIndex: player.playerIndex,
					isHost: player.isHost
				})
			)
		};

		return lobbyData;
	},

	getPlayerLobbyView(
		lobby: FullLobby,
		sessionKey: string
	): PlayerLobbyView | undefined {
		const lobbyView = FullLobby.getLobbyView(lobby);

		const player = lobby.playersInLobby.find(
			(player) =>
				player.userSession.sessionKey === sessionKey
		);

		if (!player) return undefined;

		return {
			...lobbyView,
			hosting: player.isHost,
			playerIndex: player.playerIndex
		};
	}
};
