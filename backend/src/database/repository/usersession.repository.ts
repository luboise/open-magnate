import { dataSource } from "../../datasource";
import { UserSession } from "../entity/UserSession";

// const userRepo = dataSource.getRepository(User);

// const UserController = new Controller(User);

const UserSessionRepository =
	dataSource.getRepository(UserSession);

export default UserSessionRepository;
