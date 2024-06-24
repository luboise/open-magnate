import { RouteHandler } from "../types";

const routeHandler: RouteHandler = (express, app) => {
	const router = express.Router();

	// router.post(
	// 	"/new",
	// 	async (req: Request, res: Response) => {
	// 		const data = req.body;

	// 		if (!data.name) {
	// 			// Invalid request
	// 			res.status(400).send(
	// 				"Unable to create a lobby with an empty name."
	// 			);
	// 			return;
	// 		}

	// 		const newLobby =
	// 			await LobbyController.NewLobby(params.data);

	// 		if (!newLobby) {
	// 			HandleRequest.InternalServerError(res);
	// 			return;
	// 		}

	// 		res.json(newLobby);

	// 		console.log(
	// 			`Created new lobby #${newlobby.id}`
	// 		);
	// 	}
	// );

	// Add routes to server.
	app.use("/lobby", router);
};

module.exports = routeHandler;
