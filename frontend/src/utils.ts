type RGB = `rgb(${number}, ${number}, ${number})`;
type RGBA =
	`rgba(${number}, ${number}, ${number}, ${number})`;
type HEX = `#${string}`;

export type Colour = RGB | RGBA | HEX;

export function Clamp(
	val: number,
	min: number,
	max: number
) {
	return Math.floor(Math.min(Math.max(val, min), max));
}

export * from "../../shared";
