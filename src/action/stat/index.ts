import createAxiosInstance from "@/utils/axiosInstance";
import { Stats } from "@/@types";

const API_BASE_URL = "stats";
const axiosInstance = createAxiosInstance();

export const getUserStats = async (): Promise<Stats> => {
  try {
    const response = await axiosInstance.get(
      `${API_BASE_URL}`
    );
    const data = response.data;
    return {
     recentMenus: data.data.recentMenus,
     totalMenuItems: data.data.totalMenuItems,
     user: {
        email: data.user.email,
        name: data.user.name,
     }
    } as Stats;
  } catch (error) {
    console.error("Error fetching menu items:", error);
    throw error;
  }
};