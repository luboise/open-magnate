import { Restaurant } from "@prisma/client";
import { RESTAURANT_NAMES } from "../../utils";

export const seedRestaurant1 = {
	name: RESTAURANT_NAMES[0]
} as Partial<Restaurant>;
export const seedRestaurant2 = {};

export const seedUser2 = {
	browserId: "test-browser-2",
	sessionKey: "test-session-key-2",
	name: "test-player-2"
};

export const SEED_RESAURANTS = RESTAURANT_NAMES.map(
	(res) => {
		return {
			name: res
		} as Partial<Restaurant>;
	}
);
