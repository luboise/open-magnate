import {
	AbstractMapTileInterface,
	MapOverlayTileType,
	RotationAmount
} from "../types";
import { HouseTile } from "./HouseTiles";
import { MarketingTile } from "./MarketingTiles";
import { RestaurantTile } from "./RestaurantTiles";

export type MapOverlayTile =
	| HouseTile
	| MarketingTile
	| RestaurantTile;

export interface MapOverlayTileInterface
	extends AbstractMapTileInterface {
	level: "OVERLAY";
	tileType: MapOverlayTileType;

	rotation: RotationAmount;
	rotationModulo?: 90 | 180 | 270 | 360;

	width: number;
	height: number;
}
