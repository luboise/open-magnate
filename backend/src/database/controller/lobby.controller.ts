import { LobbySubmissionData } from "../../utils";
import { Lobby } from "../entity/Lobby";
import { SessionKey } from "../entity/SessionKey";
import LobbyRepository from "../repository/lobby.repository";

const LobbyController = {
	Get: async (id: number) => {
		return await LobbyRepository.getFirst({
			lobbyId: id
		});
	},

	NewLobby: async (
		user: SessionKey,
		newLobbyData: LobbySubmissionData
	): Promise<Lobby | null> => {
		if (!newLobbyData) {
			return null;
		}

		const newLobby = await LobbyRepository.create({
			name: newLobbyData.name,
			password: newLobbyData.password,
			playerCount: Number(newLobbyData.playerCount),
			lobbyPlayers: [],
			gameState: null
		});

		return newLobby;
	}
};

export default LobbyController;
