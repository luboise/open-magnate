import { IsInRange } from "../utils";
import { AreaData, Measurable } from "./Area";

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
	const m1XInBounds =
		IsInRange(
			m1.pos.x,
			m2.pos.x,
			m2.pos.x + m2.width - 1
		) ||
		IsInRange(
			m1.pos.x + m1.width - 1,
			m2.pos.x,
			m2.pos.x + m2.width - 1
		);
	const m1YInBounds =
		IsInRange(
			m1.pos.y,
			m2.pos.y,
			m2.pos.y + m2.height - 1
		) ||
		IsInRange(
			m1.pos.y + m1.height - 1,
			m2.pos.y,
			m2.pos.y + m2.height - 1
		);

	const topAligned = m2.pos.y === m1.pos.y + m1.height;
	const bottomAligned = m2.pos.y === m1.pos.y - m2.height;
	const leftAligned = m2.pos.x === m1.pos.x + m1.width;
	const rightAligned = m2.pos.x === m1.pos.x - m2.width;

	return (
		(m1XInBounds && (topAligned || bottomAligned)) ||
		(m1YInBounds && (rightAligned || leftAligned))
	);
}
