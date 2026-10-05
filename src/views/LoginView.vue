<template>
  <div class="login-wrap">
    <div class="card login-card">
      <img src="../assets/logo-dark.svg" class="login-logo" />
      <h1>Logga in på Mina sidor</h1>

      <form @submit.prevent="handleLogin">
        <input
          v-model="email"
          type="email"
          placeholder="E-postadress"
          autocomplete="email"
          required
        />

        <input
          v-model="password"
          type="password"
          placeholder="Lösenord"
          autocomplete="current-password"
          required
        />

        <p v-if="errorMessage" class="error" role="alert">
          {{ errorMessage }}
        </p>

        <button
          class="btn"
          style="width: 100%"
          type="submit"
          :disabled="loading"
        >
          {{ loading ? "Loggar in..." : "Logga in" }}
        </button>
      </form>

      <p class="hint" style="margin-top: 10px">
        Problem att logga in? Ring kundservice 020-123 456
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { login } from "../services/api";
import { setAccessToken } from "../services/token";

const email = ref("");
const password = ref("");
const errorMessage = ref("");
const loading = ref(false);

const router = useRouter();

const handleLogin = async () => {
  errorMessage.value = "";
  loading.value = true;

  try {
    const data = await login(email.value, password.value);

    setAccessToken(data.accessToken);

    await router.push("/");
  } catch {
    errorMessage.value = "Fel e-postadress eller lösenord.";
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.login-wrap {
  display: flex;
  justify-content: center;
  padding-top: 60px;
  background: linear-gradient(180deg, #f5f7fa 0%, #e4e9f2 100%);
  padding-bottom: 60px;
  border-top: 1px solid #e4e9f2;
}

.login-card {
  width: 380px;
}

.login-logo {
  height: 34px;
  margin-bottom: 18px;
}

.error {
  margin: 10px 0;
  color: #b00020;
}
</style>
