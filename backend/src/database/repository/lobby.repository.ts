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

	public addPlayer(
		Lobby: Lobby,
		player: SessionKey,
		restaurant: Restaurant
	) {
		const x = LobbyPlayerRepository.create({
			lobby: Lobby,
			restaurant: Restaurant
		});
		if (!x) {
			return null;
		}
	}
}

const LobbyRepository = new LobbyRepositoryClass(
	entityManager
);

export default LobbyRepository;

