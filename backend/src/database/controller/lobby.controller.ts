import {
	GameState,
	// GameState,
	Lobby,
	LobbyPlayer,
	Prisma,
	Restaurant,
	UserSession
} from "@prisma/client";
import {
	LobbyPlayerView,
	LobbySubmissionData,
	MagnateLobbyView
} from "../../utils";

import prisma from "../../datasource";
import LobbyRepository from "../repository/lobby.repository";
import LobbyPlayerRepository from "../repository/lobbyplayer.repository";
import RestaurantRepository from "../repository/restaurant.repository";
import UserSessionRepository from "../repository/usersession.repository";
import GameStateController from "./gamestate.controller";

interface FullLobbyPlayer extends LobbyPlayer {
	userSession: UserSession;
	restaurant: Restaurant;
}

export interface FullLobby extends Lobby {
	players: FullLobbyPlayer[];
	gameState: GameState;
}

const LobbyController = {
	defaultInclude: {
		players: {
			include: {
				restaurant: true
			}
		}
	},

	fullInclude: {
		players: {
			include: {
				restaurant: true,
				userSession: true
			}
		},
		gameState: true
	},

	_get: async <T extends boolean = false>(
		where: Prisma.LobbyWhereInput,
		fullGet?: T
	): Promise<
		(T extends true ? FullLobby : Lobby) | null
	> => {
		const lobby = await LobbyRepository.findFirst({
			where: where,

			include: fullGet
				? LobbyController.fullInclude
				: LobbyController.defaultInclude
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
		users: UserSession | UserSession[],
		newLobbyData: LobbySubmissionData
	): Promise<Lobby | null> => {
		try {
			if (!newLobbyData) {
				return null;
			}

			let restaurantCounter = 1;

			const receivedArray = Array.isArray(users);

			const hostUser = receivedArray
				? users[0]
				: users;

			const newLobby: Lobby =
				await prisma.$transaction(async (ctx) => {
					const lobby = await ctx.lobby.create({
						data: {
							name: newLobbyData.name,
							password: newLobbyData.password,
							playerCount: Number(
								newLobbyData.playerCount
							),
							inviteCode:
								LobbyController.generateInviteCode(),
							players: {
								create: {
									userSession: {
										connect: hostUser
									},
									restaurant: {
										connect: {
											id: restaurantCounter++
										}
									},
									host: true
								}
							}
						}
					});

					if (!lobby) {
						throw new Error(
							"Unable to create new lobby"
						);
					}

					if (receivedArray) {
						for (const userSession of users.slice(
							1
						)) {
							const newPlayer =
								await ctx.lobbyPlayer.create(
									{
										data: {
											userSession: {
												connect:
													userSession
											},
											restaurant: {
												connect: {
													id: restaurantCounter++
												}
											},
											lobby: {
												connect:
													lobby as Lobby
											}
										}
									}
								);

							if (!newPlayer) {
								throw new Error(
									"Unable to create new player"
								);
							}
						}
					}

					return lobby;
				});

			const addedState =
				await GameStateController.AddStateToLobby(
					newLobby
				);

			if (!addedState) return null;

			const lob = await LobbyController.GetByLobbyId(
				newLobby.id
			);

			return lob;
		} catch (error) {
			console.error(error);
			return null;
		}
	},

	async GetLobbyData(
		id: number,
		requesteeSessionKey?: string
	) {
		// console.log(GetRelationsFrom(LobbyRepository));

		const lobby = await this.GetByLobbyId(id);

		// const lobby = await LobbyRepository.findFirst({
		// 	include: { players: true },
		// 	where: {
		// 		id: id
		// 	}
		// });

		if (!lobby) {
			throw new Error("Could not find lobby");
		}

		const lobbyHost = lobby.players.find(
			(player) => player.host
		);

		return {
			lobbyName: lobby.name,
			lobbyId: lobby.id,
			lobbyPlayers: await Promise.all(
				lobby.players.map(this.GetLobbyPlayerView)
			),
			playerCount: lobby.playerCount,
			inviteCode: lobby.inviteCode,
			gameState:
				await GameStateController.GetGameStateView(
					lobby.gameState
				),
			hosting:
				lobbyHost &&
				requesteeSessionKey &&
				lobbyHost.userId === requesteeSessionKey
		} as MagnateLobbyView;
	},

	async GetLobbyPlayerView(
		lobbyPlayer: FullLobbyPlayer
	): Promise<LobbyPlayerView> {
		if (
			!lobbyPlayer ||
			!lobbyPlayer.userSession ||
			!lobbyPlayer.restaurant
		)
			throw new Error("Invalid lobbyPlayer");

		const lobbyPlayerView: LobbyPlayerView = {
			name: lobbyPlayer.userSession.name,
			restaurant:
				lobbyPlayer.restaurant?.name ?? null,
			host: lobbyPlayer.host
		};
		return lobbyPlayerView;
	},

	async addPlayer(
		lobbyId: number,
		player: UserSession,
		restaurant?: Restaurant
	) {
		try {
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
						restaurant: {
							connect: {
								id:
									restaurant?.id ??
									(
										await RestaurantRepository.findFirst(
											{
												where: {
													lobbyPlayers:
														{
															none: {
																lobbyId:
																	lobbyId
															}
														}
												}
											}
										)
									)?.id
							}
						}
					}
				});

			if (!newLobbyPlayer) {
				console.error(
					`Failed to create LobbyPlayer for player ${player.name} in lobby ${lobbyId}`
				);
				return null;
			}

			console.log(
				`Created LobbyPlayer for player ${player.name} in lobby ${lobbyId}`
			);
			return newLobbyPlayer;
		} catch (error) {
			console.log(error);
		}
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

		// console.log("users: ", users);
		return users;
		// return users ?? null;
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
