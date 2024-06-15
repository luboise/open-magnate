import { RouteHandler } from "../types";

import { Request, Response } from "express";

const routeHandler: RouteHandler = (express, app) => {
	const router = express.Router();

	app.get("/", (req: Request, res: Response) => {
		res.send("Express + TypeScript Server");
	});

	// Add routes to server.
	app.use("/", router);
};

module.exports = routeHandler;
