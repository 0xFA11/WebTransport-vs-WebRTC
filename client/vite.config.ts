import { defineConfig } from "vite";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import babel from "@rolldown/plugin-babel";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
	plugins: [react(), babel({ presets: [reactCompilerPreset()] }), tailwindcss()],
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
	server: {
		proxy: {
			"/webrtc": {
				target: "https://localhost:8443",
				changeOrigin: true,
				secure: false,
			},
			"/webtransport": {
				target: "https://localhost:8443",
				changeOrigin: true,
				secure: false,
			},
		},
	},
});
