import { DemandType } from "@/game/demand";
import { Position } from "@/game/map/area";

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
