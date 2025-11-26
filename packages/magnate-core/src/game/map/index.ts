import {
	PLAYER_DEFAULTS,
	PlayerCount
} from "@/game/defaults";

import { Position, Rotation } from "@/game/map/area";

import { DrinkTile } from "../demand/DrinkTile";
import { MarketingTile } from "../marketing";
import { RoadTile } from "./tiles";
import { HouseTile } from "./tiles/HouseTile";
import { RestaurantTile } from "./tiles/RestaurantTiles";

export * from "./parsing/MapParsing";

export type MapTileType =
	| "DRINK"
	| "HOUSE"
	| "MARKETING"
	| "ROAD"
	| "RESTAURANT";

export interface BaseMapTile {
	readonly tileType: MapTileType;
	width: number;
	height: number;
	position: Position;
	rotation: Rotation;
}

export type MapTile =
	| MarketingTile
	| DrinkTile
	| HouseTile
	| RoadTile
	| RestaurantTile;

export const MapTile = {
	areColliding(tile1: MapTile, tile2: MapTile): boolean {
		return MapTile.collidesWithArea(
			tile1,
			MapTile.topLeft(tile2),
			MapTile.bottomRight(tile2)
		);
	},

	collidesWithArea(
		tile: MapTile,
		topLeft: Position,
		bottomRight: Position
	): boolean {
		const { x: xMin, y: yMin } = MapTile.topLeft(tile);
		const { x: xMax, y: yMax } =
			MapTile.bottomRight(tile);

		// All bounds checks fail
		const notColliding =
			bottomRight.x < xMin ||
			bottomRight.y < yMin ||
			topLeft.x > xMax ||
			topLeft.y > yMax;

		return !notColliding;
	},

	topLeft(tile: MapTile): Position {
		switch (tile.rotation) {
			case 90:
				return Position(
					tile.position.x - tile.height + 1,
					tile.position.y
				);
			case 180:
				return Position(
					tile.position.x - tile.width + 1,
					tile.position.y - tile.height + 1
				);
			case 270:
				return Position(
					tile.position.x,
					tile.position.y - tile.width + 1
				);
		}

		// 0 case and fallback
		return { ...tile.position };
	},

	bottomRight(tile: MapTile): Position {
		switch (tile.rotation) {
			case 0:
				return Position(
					tile.position.x + tile.width - 1,
					tile.position.y + tile.height - 1
				);
			case 90:
				return Position(
					tile.position.x,
					tile.position.y + tile.width - 1
				);
			case 270:
				return Position(
					tile.position.x + tile.height - 1,
					tile.position.y - tile.width + 1
				);
		}

		// 180 case and fallback
		return { ...tile.position };
	},

	normalise(tile: MapTile): void {
		tile.position = MapTile.topLeft(tile);

		// Swap extents if at a 90 degree angle
		if (tile.rotation === 90 || tile.rotation === 270) {
			const temp = tile.height;
			tile.height = tile.width;
			tile.width = temp;
		}

		tile.rotation = 0;
	}
};

export interface GameMap {
	width: number;
	height: number;
	tiles: MapTile[];
}

export type MapPiece = {
	tiles: MapTile[];
};

export const MapPiece = {
	rotate(piece: MapPiece, amount: Rotation) {
		for (let tile of piece.tiles) {
			for (let i = 0; i < amount / 90; i++) {
				tile.position = Position(
					5 - tile.position.y - 1,
					tile.position.x
				);
			}

			tile.rotation += amount;

			MapTile.normalise(tile);
		}
	}
};

export const GameMap = {
	create(playerCount, pieces, _seed = 0) {
		/// Make copy so that the original pieces aren't touched, in a random order
		const piecesCopy: MapPiece[] = (
			JSON.parse(JSON.stringify(pieces)) as MapPiece[]
		).sort((_a, _b) => {
			return Math.random() - 0.5;
		});

		let pieceIndex = 0;

		const tiles: MapTile[] = [];

		for (
			let row = 0;
			row < PLAYER_DEFAULTS[playerCount].mapHeight;
			row++
		) {
			for (
				let col = 0;
				col < PLAYER_DEFAULTS[playerCount].mapWidth;
				col++
			) {
				const piece: MapPiece =
					piecesCopy[pieceIndex++];

				let rotation: Rotation = 0;

				const rand = Math.random();
				if (rand < 0.25) {
					rotation = 0;
				} else if (rand < 0.5) {
					rotation = 90;
				} else if (rand < 0.75) {
					rotation = 180;
				} else if (rand < 0.5) {
					rotation = 270;
				}

				MapPiece.rotate(piece, rotation);

				for (const tile of piece.tiles) {
					tile.position = Position(
						tile.position.x + col * 5,
						tile.position.y + row * 5
					);

					tiles.push(tile);
				}
			}
		}

		// TODO: Implement map generation again
		return {
			width:
				PLAYER_DEFAULTS[playerCount].mapWidth * 5,
			height:
				PLAYER_DEFAULTS[playerCount].mapHeight * 5,
			tiles
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
		mapPieces: MapPiece[],
		_seed: number
	): GameMap;

	posInBounds(map: GameMap, pos: Position): boolean;

	moveCrossesTileBorder(
		m1: Position,
		m2: Position
	): boolean;
};
