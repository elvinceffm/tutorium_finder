import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  // Ensure correct base when deployed to GitHub Pages or other static hosts.
  // For a repository published as a user site (repo name = username.github.io) the base should be '/'.
  // For project sites you would use '/your-repo-name/'. Adjust if you host at a subpath.
  base: '/',
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  // Place build output into `docs/` so GitHub Pages can serve it from the main branch's "docs" folder.
  // If you prefer `dist/`, remove or change `outDir`.
  build: {
    outDir: 'docs',
  },

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
