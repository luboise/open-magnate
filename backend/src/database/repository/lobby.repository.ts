import { dataSource } from "../../datasource";
import { Lobby } from "../entity/Lobby";

const LobbyRepository = dataSource
	.getRepository(Lobby)
	.extend({});

export default LobbyRepository;
