import { getCurrentUser } from "@/app/lib/get-session";
import axios, { AxiosInstance, AxiosResponse, AxiosError } from "axios";
import {  signOut } from "next-auth/react";

export const API_URL = process.env.NEXT_PUBLIC_SERVER_URL;

const createAxiosInstance = (): AxiosInstance => {
  const axiosInstance = axios.create({
    baseURL: API_URL,
  });

  axiosInstance.interceptors.request.use(
    async (config) => {
      const session: any = await getCurrentUser();
     
      console.log("Request Details:");
      console.log(`URL: ${config.baseURL}${config.url}`);
      console.log("Method:", config.method);
      console.log("Headers:", config.headers);
      console.log("Data:", config.data);

      if (!config?.url?.endsWith("/login") && !config?.url?.endsWith("/signup")) {
        if (session?.user?.token)
          config.headers["Authorization"] = `Bearer ${session?.user.token}`;
      }

      return config;
    },
    (error: AxiosError) => {
      console.error("Request Error:", error);
      return Promise.reject(error);
    }
  );

  axiosInstance.interceptors.response.use(
    (response: AxiosResponse) => {
      console.log("Response Details:");
      console.log(`URL: ${response.config.baseURL}${response.config.url}`);
      console.log("Status Code:", response.status);
      console.log("Headers:", response.headers);
      console.log("Data:", response.data);

      return response;
    },
    async (error: AxiosError) => {
      if (error.response) {
        console.error("Response Error Details:");
        console.log(`URL: ${error.response.config.baseURL}${error.response.config.url}`);
        console.log("Status Code:", error.response.status);
        console.log("Headers:", error.response.headers);
        console.log("Data:", error.response.data);

        if (error.response.status === 401) {
          alert("Please log in again");
          signOut();
        }
      } else if (error.request) {
        console.error("Request was made but no response was received:");
        console.log("Request:", error.request);
      } else {
        console.error("Error setting up request:", error.message);
      }

      return Promise.reject(error);
    }
  );

  return axiosInstance;
};

export default createAxiosInstance;
