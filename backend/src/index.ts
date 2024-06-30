// src/index.ts
import express from "express";

import cors from "cors";
import "dotenv/config";
import expressWs from "express-ws";

import prisma from "./datasource";
import InitialiseRoutes from "./routes";

// Express app with websockets
const app = expressWs(express()).app;

const port = process.env.PORT || 3000;

app.use(express.json());

app.use(cors());

(async () => {
	InitialiseRoutes(express, app);

	// Need this here so that the connection is established before the app starts
	prisma;

	app.listen(port, () => {
		console.log(
			`Server is running on http://localhost:${port}`
		);
	});
})();
