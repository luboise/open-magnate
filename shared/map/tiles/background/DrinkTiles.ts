import { MapBackgroundTileInterface } from "./types";

export type DrinkTile = ColaTile | LemonadeTile | BeerTile;

export interface LemonadeTile
	extends MapBackgroundTileInterface {
	tileType: "LEMONADE";
}

export interface BeerTile
	extends MapBackgroundTileInterface {
	tileType: "BEER";
}
export interface ColaTile
	extends MapBackgroundTileInterface {
	tileType: "COLA";
}
