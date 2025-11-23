import { Map2D } from "../map";
import { new2DArray } from "../utils";
import { AreaData, Measurable } from "./Area";
import { Position } from "./Units";

export function GetRealArea(tile: Measurable): AreaData {
	const rotated =
		tile.rotation !== undefined
			? tile.rotation % 90 === 90
			: false;

	return {
		pos: { ...tile.pos },
		width: rotated ? tile.width : tile.height,
		height: rotated ? tile.height : tile.width
	};
}

export function IsAdjacent(
	m1: Measurable,
	m2: Measurable
): boolean {
	const m1Bottom = m1.pos.y + m1.height;
	const m1Right = m1.pos.x + m1.width;

	const m2Bottom = m2.pos.y + m2.height;
	const m2Right = m2.pos.x + m2.width;

	const m1xInBounds =
		(m1.pos.x >= m2.pos.x && m1.pos.x < m2Right) ||
		(m1Right - 1 >= m2.pos.x && m1Right - 1 < m2Right);
	const m1yInBounds =
		(m1.pos.y >= m2.pos.y && m1.pos.y < m2Bottom) ||
		(m1Bottom - 1 >= m2.pos.y &&
			m1Bottom - 1 < m2Bottom);

	// Bottom touching
	if (m1Bottom === m2.pos.y && m1xInBounds) return true;
	// Top touching
	if (m2Bottom === m1.pos.y && m1xInBounds) return true;
	// Left touching
	if (m2Right === m1.pos.x && m1yInBounds) return true;
	// Right touching
	if (m1Right === m2.pos.x && m1yInBounds) return true;

	// All cases fail
	return false;
}

export function IsInBounds(
	map: Map2D,
	pos: Position
): boolean {
	return (
		pos.x >= 0 &&
		pos.x < map.length &&
		pos.y >= 0 &&
		pos.y < map[0].length
	);
}

export function CrossedTileBorder(
	m1: Position,
	m2: Position
): boolean {
	return (
		m1.x % 5 === 0 ||
		m2.x % 5 === 0 ||
		m1.y % 5 === 0 ||
		m2.y % 5 === 0
	);
}

export function GetTransposed<T>(array: T[][]) {
	// Create an empty array to transpose into
	const transposed = new2DArray<T>(
		array[0].length,
		array.length
	);

	for (let i = 0; i < array.length; i++) {
		for (let j = 0; j < array[i].length; j++) {
			transposed[j][i] = array[i][j];
		}
	}

	return transposed;
}
