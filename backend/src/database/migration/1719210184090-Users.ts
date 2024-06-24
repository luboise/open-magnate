import { MigrationInterface, QueryRunner } from "typeorm";
import LobbyRepository from "../repository/lobby.repository";
import UserSessionRepository from "../repository/usersession.repository";
import { SEED_LOBBIES } from "../seeds/Lobby";
import { SEED_USERS } from "../seeds/UserSession";

export class Users1719210184090
	implements MigrationInterface
{
	public async up(_: QueryRunner): Promise<void> {
		await UserSessionRepository.save(SEED_USERS);
		LobbyRepository.save(SEED_LOBBIES);
	}

	public async down(_: QueryRunner): Promise<void> {}
}
