export type ORIENTATION = "HORIZONTAL" | "VERTICAL";

export interface Position {
	x: number;
	y: number;
	orientation?: ORIENTATION;
}

export type ENTRANCE_CORNER =
	| "TOPLEFT"
	| "TOPRIGHT"
	| "BOTTOMLEFT"
	| "BOTTOMRIGHT";
