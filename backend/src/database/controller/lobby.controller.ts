import {
	// GameState,
	Lobby,
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

	Get: async (lobbyId: number, fullGet?: boolean) => {
		return await LobbyRepository.findFirst({
			where: { id: lobbyId },
			include: fullGet
				? LobbyController.fullInclude
				: LobbyController.defaultInclude
		});
	},

	// GetFromJoinMessage: async (
	// 	data: JoinLobbySubmissionData
	// ) => {
	// 	const lobby = await LobbyRepository.findFirst({
	// 		where: {
	// 			inviteCode: data.inviteCode,
	// 			password: data.password
	// 		}
	// 	});

	// 	return lobby
	// 		? LobbyController.GetDeep(lobby.id)
	// 		: null;
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
									}
								}
							},
							gameState: {
								create: {
									// currentPlayer: null,
									// turnProgress: TurnProgress.SETTING_UP
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

			return newLobby;
		} catch (error) {
			console.error(error);
			return null;
		}
	},

	async GetLobbyData(id: number) {
		// console.log(GetRelationsFrom(LobbyRepository));

		const lobby = await LobbyRepository.findFirst({
			include: { players: true },
			where: {
				id: id
			}
		});

		if (!lobby) {
			throw new Error("Could not find lobby");
		}

		return {
			lobbyName: lobby.name,
			lobbyId: lobby.id,
			lobbyPlayers: await Promise.all(
				lobby.players.map(this.GetLobbyPlayerView)
			),
			inviteCode: lobby.inviteCode,
			// TODO: Fix this to be the actual GameState
			gameState: null
		} as MagnateLobbyView;
	},

	async GetLobbyPlayerView(lobbyPlayer) {
		if (!lobbyPlayer)
			throw new Error("Invalid lobbyPlayer");
		else if (!lobbyPlayer.userSession)
			console.log("todo: remove this");

		const x = await this.Get(lobbyPlayer.id, true);
		const lobbyPlayerView: LobbyPlayerView = {
			name: lp.userSession.name,
			restaurant: lp.restaurant?.name ?? null
		};
		return lobbyPlayerView;
	},

	async addPlayer(
		lobby: Lobby,
		player: UserSession,
		restaurant?: Restaurant
	) {
		try {
			const newLobbyPlayer =
				await LobbyPlayerRepository.create({
					data: {
						lobby: {
							connect: { id: lobby.id }
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
																	lobby.id
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
					`Failed to create LobbyPlayer for player ${player.name} in lobby ${lobby.id}`
				);
				return null;
			}

			console.log(
				`Created LobbyPlayer for player ${player.name} in lobby ${lobby.id}`
			);
			return newLobbyPlayer;
		} catch (error) {
			console.log(error);
		}
	},

	async removePlayer(
		lobby: Lobby,
		player: UserSession
	): Promise<boolean> {
		try {
			await LobbyPlayerRepository.delete({
				where: {
					userId: player.sessionKey,
					lobby: lobby
				}
			});
			return true;
		} catch (error) {
			console.log(error);
			return false;
		}
	},

	async getPlayersFrom(
		lobby: Lobby
	): Promise<UserSession[]> {
		// TODO: Fix no lobbyPlayers coming out
		// const users = await LobbyPlayerRepository.find({
		// 	relations: ["userSession", "lobby"],
		// 	where: {
		// 		lobby: lobby
		// 	}
		// 	// relationLoadStrategy: "query"
		// });

		const users = await UserSessionRepository.findMany({
			where: {
				lobbyPlayer: {
					lobby: { id: lobby.id }
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
