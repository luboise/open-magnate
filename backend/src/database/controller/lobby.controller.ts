import { LobbySubmissionData } from "../../utils";
import { Lobby } from "../entity/Lobby";
import { SessionKey } from "../entity/SessionKey";
import LobbyRepository from "../repository/lobby.repository";
import LobbyPlayerRepository from "../repository/lobbyplayer.repository";
import SessionKeyController from "./sessionkey.controller";

const LobbyController = {
	GetFromPlayer: async (
		player: string | null | SessionKey
	): Promise<Lobby | null> => {
		if (typeof player === "string")
			player =
				await SessionKeyController.GetBySessionKey(
					player
				);
		if (player === null) return null;

		const queryBuilder =
			LobbyPlayerRepository.createQueryBuilder(
				"lobbyPlayer"
			)
				.leftJoinAndSelect(
					"lobbyPlayer.sessionKey",
					"sessionKey"
				)
				.leftJoinAndSelect(
					"lobbyPlayer.lobby",
					"lobby"
				)
				.leftJoinAndSelect(
					"lobbyPlayer.restaurant",
					"restaurant"
				)
				.where(
					"sessionkey.sessionKey = :sessionKey",
					{
						sessionKey: player
					}
				);

		console.log(
			queryBuilder.getQueryAndParameters()[1]
		);

		const testPlayer = await queryBuilder.getOne();
		console.log(testPlayer);

		const lobbyPlayer =
			await LobbyPlayerRepository.findOne({
				relations: [
					"lobby",
					"restaurant",
					"sessionKey"
				],
				where: {
					sessionKey: player
				}
			});

		console.log(lobbyPlayer);

		return lobbyPlayer?.lobby ?? null;
	},

	Get: async (id: number) => {
		return await LobbyRepository.findOne({
			where: { lobbyId: id }
		});
	},

	NewLobby: async (
		user: SessionKey,
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
