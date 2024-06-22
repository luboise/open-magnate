import { EntityManager } from "typeorm";
import { entityManager } from "../../datasource";
import { Lobby } from "../entity/Lobby";
import { Restaurant } from "../entity/Restaurant";
import { SessionKey } from "../entity/SessionKey";
import DBRepository from "./generic.repository";
import LobbyPlayerRepository from "./lobbyplayer.repository";

// const userRepo = dataSource.getRepository(User);

// const UserController = new Controller(User);

class LobbyRepositoryClass extends DBRepository<Lobby> {
	constructor(em: EntityManager) {
		super(em, Lobby);
	}

	// TODO: Fix null restaurant
	public addPlayer(
		lobby: Lobby,
		player: SessionKey,
		restaurant?: Restaurant
	) {
		const newLobbyPlayer = LobbyPlayerRepository.create(
			{
				lobby: lobby,
				sessionKey: player,
				restaurant: restaurant || undefined
			}
		);
		if (!newLobbyPlayer) {
			console.log(
				`Failed to create LobbyPlayer for player ${player.name} in lobby ${lobby.lobbyId}`
			);
			return null;
		}

		console.log(
			`Created LobbyPlayer for player ${player.name} in lobby ${lobby.lobbyId}`
		);
		return newLobbyPlayer;
	}
}

const LobbyRepository = new LobbyRepositoryClass(
	entityManager
);

export default LobbyRepository;
