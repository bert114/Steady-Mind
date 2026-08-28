import axios from "axios";

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

let getClerkToken = null;

const injectAuthTokenProvider = (tokenProviderFn) => {
  getClerkToken = tokenProviderFn;
};

apiClient.interceptors.request.use(
  async (config) => {
    try {
      if (getClerkToken) {
        const token = await getClerkToken();

        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
    } catch (error) {
      console.error("Failed to fetch dynamic Clerk token:", error);
    }
    return config;
  },
  (error) => Promise.reject(error),
);

export default injectAuthTokenProvider;
