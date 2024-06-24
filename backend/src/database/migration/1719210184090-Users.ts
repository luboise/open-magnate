import { MigrationInterface, QueryRunner } from "typeorm";
import LobbyRepository from "../repository/lobby.repository";
import UserSessionRepository from "../repository/usersession.repository";
import { SEED_LOBBIES } from "../seeds/LobbySeeds";
import { SEED_USERS } from "../seeds/UserSessionSeeds";

export class Users1719210184090
	implements MigrationInterface
{
	public async up(_: QueryRunner): Promise<void> {
		await UserSessionRepository.save(SEED_USERS);
		await LobbyRepository.save(SEED_LOBBIES);
	}

	public async down(_: QueryRunner): Promise<void> {}
}
