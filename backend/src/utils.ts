import { Response } from "express";

export * from "../../shared";

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
