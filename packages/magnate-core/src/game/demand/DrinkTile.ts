import { BaseMapTile } from "@/game/map";
import { DrinkType } from ".";

export interface DrinkTile extends BaseMapTile {
	drinkType: DrinkType,
	width: 1;
	height: 1;
	rotation: 0;
}
