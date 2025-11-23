import { Position } from "../area/Units";

import { DemandType } from "../demand/Supply";

export interface RestaurantView {
	pos: Position;
	player: number;
}

export interface HouseView {
	priority: number;
	demandLimit: number;

	pos: Position;

	demand: DemandType[];
	garden: GardenView | null;
}

export interface GardenView {
	pos: Position;
	houseNumber: number;
}
