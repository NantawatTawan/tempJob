import axios from "axios";

const backendClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  validateStatus: () => true,
});

backendClient.interceptors.request.use((config) => {
  const token = JSON.parse(
    localStorage.getItem(
      `sb-${process.env.NEXT_PUBLIC_SUPABASE_PROJECT_ID}-auth-token`
    ) ?? "{}"
  );

  const accessToken = token.access_token;

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

export default backendClient;
