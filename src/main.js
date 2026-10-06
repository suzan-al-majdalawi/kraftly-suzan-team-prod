import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import "./assets/styles.css";
import { refreshAccessToken } from "./services/api";

const startApp = async () => {
  try {
    await refreshAccessToken();
  } catch {
    // Ingen aktiv session – användaren får logga in.
  }

  const app = createApp(App);
  app.use(createPinia());
  app.use(router);
  await router.isReady();
  app.mount("#app");
};

startApp();