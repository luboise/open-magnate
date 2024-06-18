import LobbyController from "../database/controller/lobby.controller";
import { RouteHandler } from "../types";

import { Request, Response } from "express";
import { HandleRequest } from "../utils";

const routeHandler: RouteHandler = (express, app) => {
	const router = express.Router();

	router.post(
		"/new",
		async (req: Request, res: Response) => {
			const data = req.body;

			if (!data.name) {
				// Invalid request
				res.status(400).send(
					"Unable to create a lobby with an empty name."
				);
				return;
			}

			const newLobby =
				await LobbyController.NewLobby(data);

			if (!newLobby) {
				HandleRequest.InternalServerError(res);
				return;
			}

			res.json(newLobby);

			console.log(
				`Created new lobby #${newLobby.lobbyId}`
			);
		}
	);

	// Add routes to server.
	app.use("/lobby", router);
};

module.exports = routeHandler;
