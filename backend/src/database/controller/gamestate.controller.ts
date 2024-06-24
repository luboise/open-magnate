import { Lobby } from "@prisma/client";
import GameStateRepository from "../repository/gamestate.repository";
import LobbyRepository from "../repository/lobby.repository";

const GameStateController = {
	Get: async (id: number) => {
		return await LobbyRepository.findFirst({
			where: {
				id: id
			}
		});
	},

	Create: async (lobby: Lobby) => {
		// TODO: Fix for prisma
		return await GameStateRepository.create({
			data: {
				lobby: { connect: lobby }
				// currentTurn: 0,
				// currentPlayer: null,
				// turnProgress: TurnProgress.SETTING_UP
			}
		});
	}
};

export default GameStateController;
