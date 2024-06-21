import { entityManager } from "../../datasource";
import { LobbyPlayer } from "../entity/LobbyPlayer";
import DBRepository from "./generic.repository";

const LobbyPlayerRepository = new DBRepository(
	entityManager,
	LobbyPlayer
);

export default LobbyPlayerRepository;
