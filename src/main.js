import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import "./assets/styles.css";
import { refreshAccessToken } from './services/api'

const startApp = async () => {
  await refreshAccessToken()

const app = createApp(App);
    app.use(createPinia());
    app.use(router);
    await router.isReady()
    app.mount("#app");
    }
    
startApp()