import { DemandType } from "../../game";
import { Position } from "../../game/map/area";

export interface RestaurantView {
	pos: Position;
	playerIndex: number;
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
	rotated: boolean;
	houseNumber: number;
}
