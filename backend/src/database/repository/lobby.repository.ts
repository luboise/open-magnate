import { EntityManager } from "typeorm";
import { entityManager } from "../../datasource";
import { Lobby } from "../entity/Lobby";
import DBRepository from "./generic.repository";

// const userRepo = dataSource.getRepository(User);

// const UserController = new Controller(User);

class LobbyRepositoryClass extends DBRepository<Lobby> {
	constructor(em: EntityManager) {
		super(em, Lobby);
	}
}

const LobbyRepository = new LobbyRepositoryClass(
	entityManager
);

export default LobbyRepository;
