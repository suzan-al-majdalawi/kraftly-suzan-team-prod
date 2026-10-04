import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [vue()],

    test: {
      globals: true,
      environment: "jsdom",
      setupFiles: ["./tests/setup.js"],
    },

    server: {
      proxy: {
        "/api": {
          target: env.API_URL || "http://localhost:4000",
          changeOrigin: true,
          configure: (proxy) => {
            proxy.on("proxyReq", (proxyReq) => {
              if (env.API_KEY) {
                proxyReq.setHeader("X-Api-Key", env.API_KEY);
              }
            });
          },
        },
      },
    },

    preview: {
      proxy: {
        "/api": {
          target: env.API_URL || "http://localhost:4000",
          changeOrigin: true,
          configure: (proxy) => {
            proxy.on("proxyReq", (proxyReq) => {
              if (env.API_KEY) {
                proxyReq.setHeader("X-Api-Key", env.API_KEY);
              }
            });
          },
        },
      },
    },
  };
});
