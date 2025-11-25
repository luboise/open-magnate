export * as Area from "./AreaUtils";

export * from "./Units";

export interface Position {
	x: number;
	y: number;
}

export function Position(x: number, y: number): Position {
	return {x, y};
}

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

export interface DirectionSet {
	north: boolean;
	south: boolean;
	east: boolean;
	west: boolean;
}

export type ReachType = "ROAD" | "AIR";

export interface Reach {
	distance: number;
	reach_type: ReachType;
}

export * as Pathfinding from "./pathfinding";
