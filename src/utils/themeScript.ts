"use client";

import { useEffect } from "react";

export function ThemeScript() {
	useEffect(() => {
		const savedTheme = localStorage.getItem("theme");
		const prefersDark = window.matchMedia(
			"(prefers-color-scheme: dark)",
		).matches;
		const isDark = savedTheme === "dark" || (!savedTheme && prefersDark);

		document.documentElement.classList.toggle("dark", isDark);
	}, []);

	return null;
}
