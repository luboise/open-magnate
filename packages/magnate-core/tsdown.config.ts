import { defineConfig } from "tsdown";

export default defineConfig({
	entry: [
		"src/index.ts",
		"src/networking/index.ts",
		"src/game/index.ts",
		"src/game/Employee/index.ts"
	],
	format: ["esm"],
	outDir: "./dist",
	dts: true,
	clean: true
});
