export interface Position {
	x: number;
	y: number;
}

export const Position = {
	create(x: number, y: number): Position {
		return { x, y };
	},

	add(p1: Position, p2: Position): Position {
		return { x: p1.x + p2.x, y: p1.y + p2.y };
	},

	areOnSameBlock(
		pos1: Position,
		pos2: Position,
		blockSize: number = 5
	): boolean {
		return (
			Math.floor(pos1.x / blockSize) ===
				Math.floor(pos2.x / blockSize) &&
			Math.floor(pos1.y / blockSize) ===
				Math.floor(pos2.y / blockSize)
		);
	}
};

export type Rotation = 0 | 90 | 180 | 270;

export interface AreaData {
	pos: Position;
	width: number;
	height: number;
}

export interface Measurable {
	pos: Position;
	width: number;
	height: number;
	rotation?: Rotation;
}

export const Measurable = {
	getRealArea(tile: Measurable): AreaData {
		const rotated =
			tile.rotation !== undefined
				? tile.rotation % 90 === 90
				: false;

		return {
			pos: { ...tile.pos },
			width: rotated ? tile.width : tile.height,
			height: rotated ? tile.height : tile.width
		};
	},

	areAdjacent(m1: Measurable, m2: Measurable): boolean {
		const m1Bottom = m1.pos.y + m1.height;
		const m1Right = m1.pos.x + m1.width;

		const m2Bottom = m2.pos.y + m2.height;
		const m2Right = m2.pos.x + m2.width;

		const m1xInBounds =
			(m1.pos.x >= m2.pos.x && m1.pos.x < m2Right) ||
			(m1Right - 1 >= m2.pos.x &&
				m1Right - 1 < m2Right);
		const m1yInBounds =
			(m1.pos.y >= m2.pos.y && m1.pos.y < m2Bottom) ||
			(m1Bottom - 1 >= m2.pos.y &&
				m1Bottom - 1 < m2Bottom);

		// Bottom touching
		if (m1Bottom === m2.pos.y && m1xInBounds)
			return true;
		// Top touching
		if (m2Bottom === m1.pos.y && m1xInBounds)
			return true;
		// Left touching
		if (m2Right === m1.pos.x && m1yInBounds)
			return true;
		// Right touching
		if (m1Right === m2.pos.x && m1yInBounds)
			return true;

		// All cases fail
		return false;
	}
};

export interface DirectionSet {
	north: boolean;
	south: boolean;
	east: boolean;
	west: boolean;
}

export const DirectionSet = {
	create(): DirectionSet {
		return {
			north: true,
			south: true,
			east: true,
			west: true
		};
	}
};

export type ReachType = "ROAD" | "AIR";

export interface Reach {
	distance: number;
	reach_type: ReachType;
}

export type ENTRANCE_CORNER =
	| "TOPLEFT"
	| "TOPRIGHT"
	| "BOTTOMLEFT"
	| "BOTTOMRIGHT";

export * as Pathfinding from "./pathfinding";
