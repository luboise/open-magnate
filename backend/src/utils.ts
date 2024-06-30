import { House } from "@prisma/client";
import { Response } from "express";
import { LobbyPlayerView } from "./utils";

export type GameStateView = {
	players: LobbyPlayerView[];
	// turnProgress: TurnProgress;
	currentTurn: number;
	currentPlayer: number;
	map: string;
	houses: House[];
	turnOrder: Array<number> | null;
};

export function new2DArray<T>(
	rows: number,
	cols: number
): T[][] {
	const ret = [];
	for (let i = 0; i < rows; i++) {
		ret.push(new Array(cols));
	}

	return ret;
}

export function getRandomInt(
	max: number,
	min: number = 0
): number {
	const range = max - min;
	const val = Math.random() * range;
	return min + Math.floor(val);
}

export const Logger = {
	Server: (toPrint: any) => {
		Logger.Custom("Server", toPrint);
	},
	Error: (toPrint: any) => {
		Logger.Custom("Error", toPrint);
	},
	Trace: (toPrint: any) => {
		Logger.Custom("Trace", toPrint);
	},
	Custom: (customType: string, toPrint: any) => {
		console.log(`[${customType}]: ${toPrint}`);
	}
};

export const HandleRequest = {
	NotAuthorised: (res: Response) => {
		HandleRequest.Custom(
			res,
			401,
			"You are not authorised to make this request."
		);
	},
	InvalidRequest: (res: Response) => {
		HandleRequest.Custom(res, 400, "Invalid request.");
	},
	NotLoggedIn: (res: Response) => {
		HandleRequest.Custom(
			res,
			401,
			"You must be logged in to make this request."
		);
	},
	NotFound: (res: Response) => {
		HandleRequest.Custom(
			res,
			404,
			"Unable to find the resource."
		);
	},
	InternalServerError: (res: Response) => {
		HandleRequest.Custom(
			res,
			500,
			"Internal server error."
		);
	},
	ExpiredToken: (res: Response) => {
		HandleRequest.Custom(
			res,
			401,
			"Authentication token has expired."
		);
	},
	Custom: (
		res: Response,
		statusCode: number,
		message?: any
	) => {
		res.status(statusCode);
		if (message !== undefined) {
			res.send(message);
		}
	}
};

// Override prototype of array

interface Array<T> {
	clone(): T[];
}

export function CloneArray<T>(array: T[]): T[] {
	const newArray = array.map((val) => {
		if (Array.isArray(val)) return CloneArray(val) as T;
		else if (typeof val === "object") {
			return { ...val } as T;
		} else return val;
	});

	return newArray;
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

export * from "../../shared";
