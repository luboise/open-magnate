import esbuild from "esbuild";

const shim = `
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
`;

esbuild
	.build({
		entryPoints: ["src/index.ts"],
		platform: "node",
		target: "node20",
		format: "esm",
		bundle: true,
		outfile: "dist/index.js",
		// sourcemap: "both",
		banner: { js: shim }
	})
	.catch(() => process.exit(1));

/*
		external: [
			"./node_modules/*",
			"esbuild",
			"express",
			"dotenv",
			"express-ws",
			"@prisma*"
		]
		*/
