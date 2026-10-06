import { defineStore } from "pinia";
import { fetchUser } from "../api";

export const useUserStore = defineStore("user", {
  state: () => ({
    user: null,
    loading: false,
  }),

  actions: {
    async load() {
      this.loading = true;

      try {
        this.user = await fetchUser();
      } finally {
        this.loading = false;
      }
    },
  },
});