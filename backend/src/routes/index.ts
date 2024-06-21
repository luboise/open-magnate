import { Request, Response } from "express";
import { RouteHandler } from "../types";

import * as fs from "fs";
import { Logger } from "../utils";

const InitialiseRoutes: RouteHandler = (express, app) => {
	// import the routes and then run them

	// Get every route file
	const ROUTE_FILES = fs.readdirSync(__dirname);

	ROUTE_FILES.forEach((file: string) => {
		if (file !== "index.ts") {
			require(`./${file}`)(express, app);
			Logger.Server(`Loaded routes from ${file}`);
		}
	});

	// 404 for bad page requests
	// This must happen after all other routes are loaded
	app.get("*", (req: Request, res: Response) => {
		res.status(404).send(`Route not found: ${req.url}`);
	});
};

export default InitialiseRoutes;
