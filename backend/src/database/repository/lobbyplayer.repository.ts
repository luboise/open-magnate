import { dataSource } from "../../datasource";
import { LobbyPlayer } from "../entity/LobbyPlayer";

const LobbyPlayerRepository =
	dataSource.getRepository(LobbyPlayer);

export default LobbyPlayerRepository;
