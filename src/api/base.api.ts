import axios from "axios";
import useAdminStore from "../stores/admin.store";

const baseConfig = {
  baseURL: 'http://localhost:7777/api/',
  timeout:  10000,
  withCredentials: true,
}

const publicApi = axios.create(baseConfig);
const privateApi = axios.create(baseConfig);

privateApi.interceptors.request.use((config) => {
  let accessToken = useAdminStore.getState().accessToken;
  if (!accessToken) {
    accessToken = useAdminStore.getState().getAccessTokenFromStorage();
  }
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});



export { publicApi, privateApi };