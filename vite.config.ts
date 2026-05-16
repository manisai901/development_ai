import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig, loadEnv } from "vite"
import sourceIdentifierPlugin from 'vite-plugin-source-identifier'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const isProd = process.env.BUILD_MODE === 'prod'
  
  return {
    define: {
      // Safely expose the non-VITE_ prefixed API key to the frontend
      'import.meta.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY || ''),
    },
    plugins: [
      react(),
      sourceIdentifierPlugin({
        enabled: !isProd,
        attributePrefix: 'data-matrix',
        includeProps: true,
      })
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  }
})
