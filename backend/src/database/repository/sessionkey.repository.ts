import { dataSource } from "../../datasource";
import { SessionKey } from "../entity/SessionKey";

// const userRepo = dataSource.getRepository(User);

// const UserController = new Controller(User);

const SessionKeyRepository =
	dataSource.getRepository(SessionKey);

export default SessionKeyRepository;
