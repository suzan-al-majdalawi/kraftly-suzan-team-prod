// API client for Kraftly "Mina sidor"
//
// Ingen nyckel här. Allt i frontendkoden hamnar i JavaScript-filen som browsern laddar
// ner – en nyckel här är publik för alla som trycker F12. Appen anropar /api relativt.
// Servern framför appen (Vite lokalt, nginx i containern) lägger på nyckeln.

import { getAccessToken, setAccessToken } from "./token";

const BASE_URL = "";

const request = async (path, options = {}, retry = true) => {
  const token = getAccessToken();

  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  // Login och refresh behöver inte en access token.
  // Övriga anrop skickar Bearer-token.
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(BASE_URL + path, {
    ...options,
    headers,
  });

  // Access token har gått ut.
  // Försök hämta en ny token och gör sedan originalanropet en gång till.
  if (res.status === 401 && retry && path !== "/api/v2/auth/refresh") {
    try {
      const refreshRes = await fetch(
        BASE_URL + "/api/v2/auth/refresh",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!refreshRes.ok) {
        setAccessToken(null);
        throw new Error("Refresh failed");
      }

      const refreshData = await refreshRes.json();

      setAccessToken(refreshData.accessToken);

      // Gör originalanropet exakt en gång till.
      return request(path, options, false);
    } catch (error) {
      setAccessToken(null);
      throw error;
    }
  }

  if (!res.ok) {
    console.log("API error", res.status);
    throw new Error("API error " + res.status);
  }

  return res.json();
};

export const login = (email, password) =>
  request("/api/v2/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  
export const refresh = async () => {
  const res = await fetch(
    BASE_URL + "/api/v2/auth/refresh",
    {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!res.ok) {
    setAccessToken(null);
    throw new Error("Refresh failed");
  }

  const data = await res.json();

  setAccessToken(data.accessToken);

  return data;
};

export const fetchUser = () => request("/api/v2/user");

export const fetchConsumption = () =>
  request("/api/v2/consumption");

export const fetchInvoices = () =>
  request("/api/v2/invoices");

export const submitMove = (data) =>
  request("/api/v2/move", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const saveUser = (data) =>
  request("/api/v2/user", {
    method: "PUT",
    body: JSON.stringify(data),
  });