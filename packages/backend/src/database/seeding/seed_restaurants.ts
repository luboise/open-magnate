import { RESTAURANT_NAMES } from "../../utils";

// import prisma from "../src/datasource";
// const [
// 	seedRestaurant1,
// 	seedRestaurant2,
// 	seedRestaurant3,
// 	seedRestaurant4,
// 	seedRestaurant5,
// 	seedRestaurant6
// ]: Partial<Restaurant>[] = RESTAURANT_NAMES.map((res) => ({
// 	name: res
// }));

export const SEED_RESAURANTS = RESTAURANT_NAMES.map(
	(res, index) => {
		return {
			id: index + 1,
			name: res
		};
	}
);
export const [
	seedRestaurant1,
	seedRestaurant2,
	seedRestaurant3,
	seedRestaurant4,
	seedRestaurant5,
	seedRestaurant6
] = SEED_RESAURANTS;
