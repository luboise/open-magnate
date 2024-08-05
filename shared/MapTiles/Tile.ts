import { Position } from "../../backend/src/dataViews";

export type RotationAmount = 0 | 90 | 180 | 270;

export interface BaseTile {
	tileType: string;
	pos: Position;
	width: number;
	height: number;
	rotation: RotationAmount;
}

