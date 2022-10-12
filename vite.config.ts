import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		react(), VitePWA({
			registerType: 'autoUpdate',
			includeAssets: ["audio/*.mp3", "logo.svg", "logo_192x.png", "logo_512x.png"],
		})
	]
});
