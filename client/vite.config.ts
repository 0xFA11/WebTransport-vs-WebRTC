import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
	plugins: [react(), tailwindcss()],
	build: {
		outDir: "dist",
		emptyOutDir: true,
		modulePreload: false,
		rolldownOptions: {
			platform: "browser",
			output: {
				format: "esm",
				entryFileNames: "[name].js",
				assetFileNames: "[name].[ext]",
				codeSplitting: false,
				minify: { mangle: false },
				keepNames: true,
			},
		},
		chunkSizeWarningLimit: 2048,
	},
});
