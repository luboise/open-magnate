import { RouteHandler } from "../types";

import { Request, Response } from "express";

const routeHandler: RouteHandler = (express, app) => {
	const router = express.Router();

	app.get("/new", (req: Request, res: Response) => {
		// const game = NewGame();
		res.send("New game!");
		console.log("Created new game.");
	});

	// Add routes to server.
	app.use("/game", router);
};

module.exports = routeHandler;
