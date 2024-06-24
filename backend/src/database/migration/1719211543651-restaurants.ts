import { MigrationInterface, QueryRunner } from "typeorm";
import RestaurantRepository from "../repository/restaurant.repository";
import { SEED_RESAURANTS } from "../seeds/RestaurantSeeds";

export class Restaurants1719211543651
	implements MigrationInterface
{
	public async up(
		queryRunner: QueryRunner
	): Promise<void> {
		RestaurantRepository.save(SEED_RESAURANTS);
	}

	public async down(
		queryRunner: QueryRunner
	): Promise<void> {}
}
