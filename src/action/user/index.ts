import createAxiosInstance from "@/utils/axiosInstance";
import { User } from "@/@types";
import { getCurrentUser } from "@/app/lib/get-session";

const API_BASE_URL = "users";
const axiosInstance = createAxiosInstance();

export const getUserProfile = async (): Promise<User> => {
  try {
    const session = await getCurrentUser();
    const response = await axiosInstance.get(
      `${API_BASE_URL}/${session?.user?.id}`
    );
    const data = response.data;
    return {
      id: data._id,
      name: data.name,
      email: data.email,
      image: data.image,
      location: data.location,
      phoneNumber: data.phoneNumber,
    } as User;
  } catch (error) {
    console.error("Error fetching menu items:", error);
    throw error;
  }
};
export const updateUserProfile = async (
  updatedData: Partial<User>,
  file?: File
): Promise<User> => {
  try {
    const session = await getCurrentUser();
    if (!session?.user?.id) {
      throw new Error("User not authenticated");
    }

    const formData = new FormData();

    Object.entries(updatedData).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value as string);
      }
    });

    if (file) {
      formData.append("file", file);
    }

    const response = await axiosInstance.put(
      `${API_BASE_URL}/${session.user.id}`,
      formData,
      
    );

    const data = response.data;

    return {
      id: data.data._id,
      name: data.data.name,
      email: data.data.email,
      image: data.data.image,
      location: data.data.location,
      phoneNumber: data.data.phoneNumber,
    } as User;
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};
