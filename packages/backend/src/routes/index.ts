import { Request, Response } from "express";

import { RouteHandler } from "../types";
import { Logger } from "../utils";
import { routeHandler as GameRouteHandler } from "./game.routes";
import { routeHandler as LobbyRouteHandler } from "./lobby.routes";
import { routeHandler as OtherRouteHandler } from "./other.routes";

const InitialiseRoutes: RouteHandler = (express, app) => {
	// import the routes and then run them

	GameRouteHandler(express, app);
	Logger.Server(`Loaded game routes.`);

	LobbyRouteHandler(express, app);
	Logger.Server(`Loaded lobby routes.`);

	OtherRouteHandler(express, app);
	Logger.Server(`Loaded other routes.`);

	// 404 for bad page requests
	// This must happen after all other routes are loaded
	app.get("", (req: Request, res: Response) => {
		res.status(404).send(`Route not found: ${req.url}`);
	});
};

export default InitialiseRoutes;
