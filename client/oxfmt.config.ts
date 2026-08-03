import { defineConfig } from "oxfmt";

export default defineConfig({
	printWidth: 120,
	semi: true,
	tabWidth: 4,
	useTabs: true,
	endOfLine: "lf",
	singleQuote: false,
	jsxSingleQuote: false,
	quoteProps: "consistent",
	trailingComma: "all",
	arrowParens: "always",
	bracketSpacing: true,
	bracketSameLine: true,
	insertFinalNewline: true,
	singleAttributePerLine: false,
	sortImports: false,
	sortPackageJson: false,
	sortTailwindcss: {
		functions: ["tw", "cn", "cx", "cva", "clsx"],
		attributes: ["class", "className"],
	},
});
