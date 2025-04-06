import axios from "axios";

export const lemonSqueezyClient = (lemonSqueezyApiKey: string) => {
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
      return Promise.reject(error);
    }
  );

  return instance;
};