import { FindOptionsWhere } from "typeorm";
import {
	JoinLobbySubmissionData,
	LobbySubmissionData
} from "../../utils";
import { Lobby } from "../entity/Lobby";
import { LobbyPlayer } from "../entity/LobbyPlayer";
import { UserSession } from "../entity/UserSession";
import LobbyRepository from "../repository/lobby.repository";
import LobbyPlayerRepository from "../repository/lobbyplayer.repository";
import { GetRelationsFrom } from "../repository/repositoryUtils";
import UserSessionController from "./usersession.controller";

const LobbyController = {
	GetFromPlayer: async (
		player: string | null | UserSession
	): Promise<Lobby | null> => {
		if (typeof player === "string")
			player =
				await UserSessionController.GetBySessionKey(
					player
				);
		if (player === null) return null;

		const queryBuilder =
			LobbyPlayerRepository.createQueryBuilder("l")
				.leftJoinAndMapMany(
					"l.lobbyPlayers",
					LobbyPlayer,
					"lp",
					"lp.lobbyId = l.lobbyId"
				)
				.leftJoinAndSelect(
					UserSession,
					"us",
					"us.sessionKey = lp.sessionKey"
				)
				.where("us.sessionKey = :sessionKey", {
					sessionKey: player.sessionKey
				});

		const lobbyPlayer = await queryBuilder.getOne();

		return lobbyPlayer?.lobby ?? null;
	},

	Get: async (id: number) => {
		return await LobbyRepository.findOne({
			where: { lobbyId: id }
		});
	},

	GetWithRelations: async (options: FindOptionsWhere<Lobby>) => {
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

			const lobbyPlayer = LobbyRepository.addPlayer(
				newLobby,
				user
			);
			if (!lobbyPlayer) return null;
			return newLobby;
		} catch (error) {
			console.error(error);
			return null;
		}
	}
};

export default LobbyController;
