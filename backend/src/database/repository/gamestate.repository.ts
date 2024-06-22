import { dataSource } from "../../datasource";
import { GameState } from "../entity/GameState";

const GameStateRepository =
	dataSource.getRepository(GameState);

export default GameStateRepository;
