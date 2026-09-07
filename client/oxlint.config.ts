import { defineConfig } from "oxlint";

export default defineConfig({
	options: {
		typeAware: true,
		typeCheck: true,
	},
	plugins: ["oxc", "eslint", "typescript", "promise", "react", "unicorn"],
	rules: {
		"eqeqeq": "error",
		"curly": ["error", "all"],
		"react/rules-of-hooks": "error",
		"react/exhaustive-deps": "error",
		"react/react-compiler": "error",
	},
});
