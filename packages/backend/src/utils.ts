import { Prisma } from "@prisma/client";

import { Response } from "express";

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

// Reads a JSON number array. Can't have NaN in the array
export function readJsonNumberArray(
	array: Prisma.JsonValue
) {
	const asArray = array as Prisma.JsonArray | null;
	if (asArray === null) return [];

	const vals: number[] = Array.isArray(array)
		? array.map((value) =>
				typeof value === "number" ? value : NaN
			) // Convert each element to number, defaulting to NaN if not a number
		: [];

	// Return the list of numbers with the NaNs filtered out
	return vals.filter((val) => !Number.isNaN(val));
}

export function parseJsonArray(array: Prisma.JsonValue) {
	const asArray = array as Prisma.JsonArray | null;
	if (asArray === null) return [];

	const vals: string[] = Array.isArray(array)
		? array.map((value) => String(value)) // Convert each element to number, defaulting to NaN if not a number
		: [];

	return vals;
}

export * from "magnate-core";
