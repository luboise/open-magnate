import { entityManager } from "../../datasource";
import { GameState } from "../entity/GameState";
import DBRepository from "./generic.repository";

const GameStateRepository = new DBRepository(
	entityManager,
	GameState
);

export default GameStateRepository;
