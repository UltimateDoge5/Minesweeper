import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		react(),
		VitePWA({
			registerType: "autoUpdate",
			injectRegister: "auto",
			includeAssets: ["audio/*.mp3", "logo.svg", "logo_192x.png", "logo_512x.png"],
			manifest: {
				name: "Piotr Kozak | Minesweeper",
				short_name: "Minesweeper",
				description: "Minesweeper game clone",
				start_url: "https://mines.pkozak.org",
				display: "standalone",
				background_color: "#242424",
				theme_color: "#90ee90",
				icons: [
					{
						src: "logo.svg",
						sizes: "512x512",
						type: "image/svg",
						purpose: "any"
					},
					{
						src: "logo_512x.png",
						sizes: "512x512",
						type: "image/png",
						purpose: "any"
					},
					{
						src: "logo_192x.png",
						sizes: "192x192",
						type: "image/png",
						purpose: "any"
					},
					{
						src: "logo_512x.png",
						sizes: "512x512",
						type: "image/png",
						purpose: "maskable"
					}
				]
			}
		})
	]
});
