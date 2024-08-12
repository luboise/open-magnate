import { Position } from "../../backend/src/dataViews";
import { RotationAmount } from "../MapTiles";

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
