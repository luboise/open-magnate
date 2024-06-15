// src/index.ts
import express from "express";

import "dotenv/config";
import InitialiseRoutes from "./routes";

const app = express();
const port = process.env.PORT || 3000;

(async () => {
	InitialiseRoutes(express, app);
})();

app.get("/", (req, res) => {
	res.send("Hello, TypeScript with Express!");
});

app.listen(port, () => {
	console.log(
		`Server is running on http://localhost:${port}`
	);
});
