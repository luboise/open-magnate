import { EntityManager } from "typeorm";
import { entityManager } from "../../datasource";
import { LobbyPlayer } from "../entity/LobbyPlayer";
import DBRepository from "./generic.repository";

class LobbyPlayerRepositoryClass extends DBRepository<LobbyPlayer> {
	constructor(em: EntityManager) {
		super(em, LobbyPlayer);
	}
}

const LobbyPlayerRepository =
	new LobbyPlayerRepositoryClass(entityManager);

export default LobbyPlayerRepository;
