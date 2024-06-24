import { MigrationInterface, QueryRunner } from "typeorm";
import RestaurantRepository from "../repository/restaurant.repository";
import { SEED_RESAURANTS } from "../seeds/RestaurantSeeds";

export class Restaurants1719211543651
	implements MigrationInterface
{
	public async up(_: QueryRunner): Promise<void> {
		const restaurants =
			await RestaurantRepository.save(
				SEED_RESAURANTS
			);
	}

	public async down(_: QueryRunner): Promise<void> {}
}
