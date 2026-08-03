import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App.tsx";

document.addEventListener("DOMContentLoaded", () => {
	const root = document.getElementById("root");
	if (!root) {
		console.error("cannot find root element");
		return;
	}
	createRoot(root).render(
		<StrictMode>
			<App />
		</StrictMode>,
	);
});
