import {
	// GameState,
	Lobby,
	LobbyPlayer,
	Restaurant,
	UserSession
} from "@prisma/client";
import {
	LobbyPlayerView,
	LobbySubmissionData,
	MagnateLobbyView
} from "../../utils";

import LobbyRepository from "../repository/lobby.repository";
import LobbyPlayerRepository from "../repository/lobbyplayer.repository";
import UserSessionRepository from "../repository/usersession.repository";

const LobbyController = {
	GetLobbyPlayerFromUserSession: async (
		sessionKey: string
	): Promise<Lobby | null> => {
		const lobbyPlayer =
			await LobbyPlayerRepository.findFirst({
				where: {
					userSession: {
						sessionKey: sessionKey
					}
				},
				include: { lobby: true }
			});

		return lobbyPlayer?.lobby ?? null;
	},

	Get: async (id: number) => {
		return await LobbyRepository.findFirst({
			where: { id: id }
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
		user: UserSession,
		newLobbyData: LobbySubmissionData
	): Promise<Lobby | null> => {
		try {
			if (!newLobbyData) {
				return null;
			}

			const newLobby = await LobbyRepository.create({
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
							userSession: { connect: user },
							restaurant: {
								connect: { id: 1 }
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

			const lobbyPlayer = LobbyController.addPlayer(
				newLobby,
				user
			);
			if (!lobbyPlayer) return null;
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

	async GetLobbyPlayerView(lobbyPlayer: LobbyPlayer) {
		const lp = await LobbyPlayerRepository.findFirst({
			include: {
				lobby: true,
				userSession: true,
				restaurant: true
			},
			where: {
				userId: lobbyPlayer.userId
			}
		});

		if (!lp)
			throw new Error("Could not find lobby player");

		const lobbyPlayerView: LobbyPlayerView = {
			name: lp.userSession.name,
			restaurant: lp.restaurant?.name ?? null
		};
		return lobbyPlayerView;
	},

	// TODO: Fix null restaurant
	async addPlayer(
		lobby: Lobby,
		player: UserSession,
		restaurant?: Restaurant
	) {
		try {
			const newLobbyPlayer =
				await LobbyPlayerRepository.create({
					data: {
						lobby: { connect: lobby },
						userSession: { connect: player },
						restaurant: { connect: restaurant }
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
					lobby: lobby
				}
			}
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
