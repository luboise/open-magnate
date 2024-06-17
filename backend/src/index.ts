// src/index.ts
import express from "express";

import "dotenv/config";
import InitialiseRoutes from "./routes";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

const cors = require("cors");
app.use(cors());

(async () => {
	InitialiseRoutes(express, app);

	app.listen(port, () => {
		console.log(
			`Server is running on http://localhost:${port}`
		);
	});
})();
