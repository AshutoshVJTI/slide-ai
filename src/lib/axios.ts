import axios from "axios";

export const lemonSqueezyClient = (lemonSqueezyApiKey: string) => {
  // Log configuration details without exposing full API key
  const apiKeyPrefix = lemonSqueezyApiKey ? lemonSqueezyApiKey.substring(0, 10) + "..." : "undefined";
  console.log(`LemonSqueezy config - API URL: ${process.env.NEXT_PUBLIC_LEMON_SQUEEZY_API}, Store ID: ${process.env.LEMON_SQUEEZY_STORE_ID}, Variant ID: ${process.env.LEMON_SQUEEZY_VARIANT_ID}, API Key prefix: ${apiKeyPrefix}`);
  
  const instance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_LEMON_SQUEEZY_API,
    headers: {
      Accept: "application/vnd.api+json",
      "Content-Type": "application/vnd.api+json",
      Authorization: `Bearer ${
        lemonSqueezyApiKey
          ? lemonSqueezyApiKey
          : process.env.LEMON_SQUEEZY_API_KEY
      }`,
    },
  });

  // Add response interceptor for better error handling
  instance.interceptors.response.use(
    response => response,
    error => {
      console.error("LemonSqueezy API Error:", error.response ? {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers
      } : error.message);
      return Promise.reject(error);
    }
  );

  return instance;
};