import { Prisma, TURN_PROGRESS } from "@prisma/client";
import { DEFAULT_EMPLOYEE_ARRAY } from "../../../../shared/game/defaults";
import { GetNewReserve } from "../../game/NewGameStructures";
import { seedLobby1 } from "./seed_lobbies";
import {
	seedRestaurant1,
	seedRestaurant2
} from "./seed_restaurants";

export const seedGameState1: Prisma.GameStateCreateInput = {
	currentTurn: 0,
	lobby: {
		connect: { id: seedLobby1.id }
	},
	turnProgress: TURN_PROGRESS.RESTAURANT_PLACEMENT,
	playerCount: 2,
	rawMap: "RRRRRRRRRRRRRRR;RRRRRRRRRRRRRRR;RRRRRRRRRRRRRRR",
	turnOrder: "12",
	oldTurnOrder: "12",
	players: {
		createMany: {
			data: [
				{
					number: 1,
					employees: DEFAULT_EMPLOYEE_ARRAY,
					milestones: [],
					restaurantDataId: seedRestaurant1.id
				},
				{
					number: 2,
					employees: DEFAULT_EMPLOYEE_ARRAY,
					milestones: [],
					restaurantDataId: seedRestaurant2.id
				}
			]
		}
	},
	reserve: GetNewReserve(2)
};
