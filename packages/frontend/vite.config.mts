import react from "@vitejs/plugin-react";
import "dotenv/config";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	resolve: {
		// alias: [
		// 	{
		// 		find: "magnate-core",
		// 		replacement: path.resolve(
		// 			__dirname,
		// 			"../shared"
		// 		)
		// 	}
		// ]
	}
});

