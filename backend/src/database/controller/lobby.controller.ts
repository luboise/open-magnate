import { LobbySubmissionData } from "../../utils";
import LobbyRepository from "../repository/lobby.repository";

const LobbyController = {
	Get: async (id: number) => {
		return await LobbyRepository.getFirst({
			lobbyId: id
		});
	},

	NewLobby: async (newLobbyData: LobbySubmissionData) => {
		const newLobby = await LobbyRepository.create({
			name: newLobbyData.name,
			password: newLobbyData.password
		});
		return newLobby;
	}
};

export default LobbyController;
