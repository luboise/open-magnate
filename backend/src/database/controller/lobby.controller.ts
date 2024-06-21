import { LobbySubmissionData } from "../../utils";
import { Lobby } from "../entity/Lobby";
import LobbyRepository from "../repository/lobby.repository";

const LobbyController = {
	Get: async (id: number) => {
		return await LobbyRepository.getFirst({
			lobbyId: id
		});
	},

	NewLobby: async (
		newLobbyData: LobbySubmissionData
	): Promise<Lobby | null> => {
		if (!newLobbyData) {
			return null;
		}

		const newLobby = await LobbyRepository.create({
			name: newLobbyData.name,
			password: newLobbyData.password,
			playerCount: Number(newLobbyData.playerCount)
		});

		return newLobby;
	}
};

export default LobbyController;

