import { FindOptionsWhere } from "typeorm";
import {
	dataSource,
	entityManager
} from "../../datasource";
import {
	LobbyPlayerView,
	LobbySubmissionData,
	MagnateLobbyView
} from "../../utils";
import { GameState } from "../entity/GameState";
import { Lobby } from "../entity/Lobby";
import { LobbyPlayer } from "../entity/LobbyPlayer";
import { Restaurant } from "../entity/Restaurant";
import { UserSession } from "../entity/UserSession";
import LobbyRepository from "../repository/lobby.repository";
import LobbyPlayerRepository from "../repository/lobbyplayer.repository";
import { GetRelationsFrom } from "../repository/repositoryUtils";
import UserSessionRepository from "../repository/usersession.repository";
import UserSessionController from "./usersession.controller";

const LobbyController = {
	GetLobbyPlayerFromUserSession: async (
		player: string | null | UserSession
	): Promise<Lobby | null> => {
		if (typeof player === "string")
			player =
				await UserSessionController.GetBySessionKey(
					player
				);
		if (player === null) return null;

		const query =
			LobbyPlayerRepository.createQueryBuilder("lp")
				.leftJoinAndMapOne(
					"lp.sessionKey",
					UserSession,
					"us"
				)
				.leftJoinAndMapOne("lp.lobby", Lobby, "l")
				// .leftJoinAndMapMany(
				// 	"lp.lobbyPlayers",
				// 	LobbyPlayer,
				// 	"lp",
				// 	"lp.lobbyId = l.lobbyId"
				// )

				.where("us.sessionKey = :sessionKey", {
					sessionKey: player.sessionKey
				});

		const lobbyPlayer = await query.getOne();

		return lobbyPlayer?.lobby ?? null;
	},

	Get: async (id: number) => {
		return await LobbyRepository.findOne({
			where: { lobbyId: id }
		});
	},

	GetWithRelations: async (
		options: FindOptionsWhere<Lobby>
	) => {
		return await LobbyRepository.findOne({
			relations: GetRelationsFrom(LobbyRepository),
			where: options
		});
	},

	// GetFromJoinMessage: async (
	// 	data: JoinLobbySubmissionData
	// ) => {
	// 	const lobby = await LobbyRepository.findOne({
	// 		where: {
	// 			inviteCode: data.inviteCode,
	// 			password: data.password
	// 		}
	// 	});

	// 	return lobby
	// 		? LobbyController.GetDeep(lobby.lobbyId)
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

			const newLobby = LobbyRepository.create({
				name: newLobbyData.name,
				password: newLobbyData.password,
				playerCount: Number(
					newLobbyData.playerCount
				),
				gameState: null
			});
			await LobbyRepository.save(newLobby);

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

	async GetLobbyData(lobbyId: number) {
		// console.log(GetRelationsFrom(LobbyRepository));

		// const lobby = await LobbyRepository.findOne({
		// 	relations: GetRelationsFrom(LobbyRepository),
		// 	where: {
		// 		lobbyId: lobbyId
		// 	}
		// });

		const lobby = await dataSource
			.getRepository(Lobby)
			.createQueryBuilder("l")
			.leftJoinAndMapMany(
				"l.lobbyPlayers",
				LobbyPlayer,
				"lp"
			)
			.leftJoinAndMapOne(
				"lp.userSession",
				UserSession,
				"us"
			)
			.leftJoinAndMapOne(
				"l.gameState",
				GameState,
				"gs",
				"gs.lobbyId = l.lobbyId"
			)
			.where("l.lobbyId = :id", {
				id: lobbyId
			})
			.getOne();

		// const lobby = await LobbyRepository.preload({
		// 	lobbyId: this.lobbyId
		// });

		if (!lobby) {
			throw new Error("Could not find lobby");
		}

		return {
			lobbyName: lobby.name,
			lobbyId: lobby.lobbyId,
			lobbyPlayers: await Promise.all(
				lobby.lobbyPlayers.map(
					async (lobbyPlayer) => {
						return await this.GetLobbyPlayerView(
							lobbyPlayer
						);
					}
				)
			),

			// ? lobby.lobbyPlayers.map((lobbyPlayer) => {
			// 		return {
			// 			name: lobbyPlayer.userSession
			// 				.name,
			// 			restaurant:
			// 				lobbyPlayer.restaurant
			// 					?.name ?? null
			// 		} as LobbyPlayerView;
			// 	})
			// : [],
			inviteCode: lobby.inviteCode,
			gameState:
				lobby.gameState?.toGameStateView() || null
		} as MagnateLobbyView;
	},

	async GetLobbyPlayerView(lobbyPlayer: LobbyPlayer) {
		const lp = await LobbyPlayerRepository.findOne({
			relations: GetRelationsFrom(
				LobbyPlayerRepository
			),
			where: {
				lobbyId: lobbyPlayer.lobbyId,
				sessionKey: lobbyPlayer.sessionKey
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
				LobbyPlayerRepository.create({
					lobby: lobby,
					userSession: player,
					restaurant: restaurant || undefined
				});
			await entityManager.save(newLobbyPlayer);

			if (!newLobbyPlayer) {
				console.error(
					`Failed to create LobbyPlayer for player ${player.name} in lobby ${lobby.lobbyId}`
				);
				return null;
			}

			console.log(
				`Created LobbyPlayer for player ${player.name} in lobby ${lobby.lobbyId}`
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
			const lp = await LobbyPlayerRepository.findOne({
				where: {
					userSession: player,
					lobby: lobby
				}
			});

			if (!lp) {
				throw new Error(
					"Unable to remove player from lobby, as they are not in it."
				);
			}

			await LobbyPlayerRepository.remove(lp);
			return true;
		} catch (error) {
			console.log(error);
		}
		return false;
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

		const query =
			UserSessionRepository.createQueryBuilder("us")
				.leftJoinAndMapOne(
					"us.lobbyPlayer",
					LobbyPlayer,
					"lp"
				)
				.leftJoinAndMapOne("lp.lobby", Lobby, "l")
				.where("l.lobbyId = :lobbyId", {
					lobbyId: lobby.lobbyId
				})
				.orderBy("lp.timeJoined", "ASC");
		const users = query.getMany();

		// console.log("users: ", users);
		return users;
		// return users ?? null;
	}
};

export default LobbyController;
