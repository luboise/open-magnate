import { RotationAmount } from "../map/tiles/types";
import { Position } from "./Units";

export interface AreaData {
	pos: Position;
	width: number;
	height: number;
}

export interface Measurable {
	pos: Position;
	width: number;
	height: number;
	rotation?: RotationAmount;
}
