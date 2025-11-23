import react from "@vitejs/plugin-react";
import "dotenv/config";
import { defineConfig } from "vite";

import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	resolve: {
		alias: [
			{
				find: "@shared",
				replacement: path.resolve(
					__dirname,
					"../shared"
				)
			}
		]
	}
});
