import {  SignUpDTO } from "@/@types";
import createAxiosInstance from "@/utils/axiosInstance";

const API_BASE_URL = '/auth/signup';
const axiosInstance = createAxiosInstance();

export const signup = async (data: SignUpDTO) => {
  try {
    if (!data.name) throw new Error("Name is required");
    if (!data.location) throw new Error("Location is required");
    if (!data.email) throw new Error("Email is required");
    if (!data.phoneNumber) throw new Error("Phone Number is required");
    if (!data.password) throw new Error("Password is required");
    if (!data.file) throw new Error("Profile Image is required");

    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('location', data.location);
    formData.append('email', data.email);
    formData.append('phoneNumber', data.phoneNumber);
    formData.append('password', data.password);
    formData.append('file', data.file);

    const response = await axiosInstance.post(API_BASE_URL, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    return response.data;
  } catch (error) {
    console.error("Error Creating account:", error);
    throw error;
  }
};