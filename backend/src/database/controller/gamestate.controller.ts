import { TurnProgress } from "../../utils";
import { Lobby } from "../entity/Lobby";
import GameStateRepository from "../repository/gamestate.repository";
import LobbyRepository from "../repository/lobby.repository";

const GameStateController = {
	Get: async (id: number) => {
		return await LobbyRepository.findOne({
			where: {
				lobbyId: id
			}
		});
	},

	Create: async (lobby: Lobby) => {
		return await GameStateRepository.create({
			lobby: lobby,
			currentTurn: 0,
			currentPlayer: null,
			turnProgress: TurnProgress.SETTING_UP
		});
	}
};

export default GameStateController;
