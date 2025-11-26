import * as esbuild from "esbuild";

esbuild
	.build({
		entryPoints: ["src/index.ts"],
		platform: "node",
		target: "node20",
		format: "esm",
		bundle: true,
		outfile: "dist/index.js",
		resolveExtensions: [".ts", ".js"],
		external: [
			"dotenv",
			"mariadb",
			"express",
			"prisma",
			"express-ws",
			"body-parser",
			"depd",
			"path",
			"fs",
			"url",
			"http"
		]
	})
	.catch(() => process.exit(1));
