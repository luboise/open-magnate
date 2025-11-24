import {
	PLAYER_DEFAULTS,
	PlayerCount
} from "@/game/defaults";

import { Position, Rotation } from "@/game/map/area";

import { DrinkTile } from "../demand/DrinkTile";
import { MarketingTile } from "../marketing";

export * from "./parsing/MapParsing";

export type MapTileType =
	| "HOUSE"
	| "MARKETING"
	| "ROAD"
	| "RESTAURANT";

export interface BaseMapTile {
	readonly tileType: MapTileType;
	readonly width: number;
	readonly height: number;
	position: Position;
	rotation: Rotation;
}

export type MapTile = MarketingTile | DrinkTile;

export interface GameMap {
	width: number;
	height: number;
	tiles: MapTile[];
}

export const GameMap = {
	create(playerCount, _seed = 0) {
		// TODO: Implement map generation again
		return {
			width:
				PLAYER_DEFAULTS[playerCount].mapWidth * 5,
			height:
				PLAYER_DEFAULTS[playerCount].mapHeight * 5,
			tiles: []
		};
	},
	posInBounds(map, pos) {
		return (
			pos.x >= 0 &&
			pos.x < map.width &&
			pos.y >= 0 &&
			pos.y < map.height
		);
	},
	moveCrossesTileBorder(m1, m2) {
		return (
			m1.x % 5 === 0 ||
			m2.x % 5 === 0 ||
			m1.y % 5 === 0 ||
			m2.y % 5 === 0
		);
	}
} satisfies {
	create(
		playerCount: PlayerCount,
		_seed: number
	): GameMap;

	posInBounds(map: GameMap, pos: Position): boolean;

	moveCrossesTileBorder(
		m1: Position,
		m2: Position
	): boolean;
};
