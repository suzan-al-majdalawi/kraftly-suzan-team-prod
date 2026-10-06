import { ref } from "vue";
import { defineStore } from "pinia";
import { fetchUser, saveUser } from "../services/api";
import { firstName } from "../utils/user";

export const useUserStore = defineStore("user", () => {
  const user = ref(null);
  const loading = ref(false);
  const firstNameValue = ref("");

  const load = async () => {
    loading.value = true;

    try {
      user.value = await fetchUser();

      if (user.value?.name) {
        firstNameValue.value = firstName(user.value.name);
      }
    } finally {
      loading.value = false;
    }
  };

  const save = async (data) => {
    user.value = await saveUser(data);

    if (user.value?.name) {
      firstNameValue.value = firstName(user.value.name);
    }

    alert("Sparat!");
  };

  return {
    user,
    loading,
    firstNameValue,
    load,
    save,
  };
});