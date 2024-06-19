import { entityManager } from "../../datasource";
import { SessionKey } from "../entity/SessionKey";
import DBRepository from "./generic.repository";

// const userRepo = dataSource.getRepository(User);

// const UserController = new Controller(User);

const SessionKeyRepository = new DBRepository<SessionKey>(
	entityManager,
	SessionKey
);

export default SessionKeyRepository;
