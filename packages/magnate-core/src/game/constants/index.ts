export const BASE_SALARY = 5;

export const MAP_PIECE_WIDTH: number = 5;

export const MAP_PIECE_HEIGHT: number = 5;

export const MAP_PIECE_SIZE: number =
	MAP_PIECE_WIDTH * MAP_PIECE_HEIGHT;

export const RESTAURANT_NAMES: string[] = [
	"Xango Blues Bar",
	"Santa Maria Pizza",
	"Fried Geese and Donkey",
	"Gluttony Inc. Burgers",
	"Golden Duck Diner",
	"Siap Faji Bar"
];

export type RESTAURANT_NAME =
	(typeof RESTAURANT_NAMES)[number];
