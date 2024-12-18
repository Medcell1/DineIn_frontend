import { Hours } from "@/@types";
import createAxiosInstance from "@/utils/axiosInstance";
import { getCurrentUser } from "@/app/lib/get-session";

const API_BASE_URL = 'working-hours';

const axiosInstance = createAxiosInstance();

/**
 * Fetch working hours for a specific user.
 * @param userId - The ID of the user whose working hours are to be fetched.
 * @returns The working hours of the user.
 */
export const getWorkingHours = async (): Promise<Hours[]> => {
  try {
      const session = await getCurrentUser(); 

    const response = await axiosInstance.get(`${API_BASE_URL}/${session?.user?.id}`);
    console.log(`ressss==>${response.data}`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching working hours:", error);
    throw error;
  }
};

/**
 * Update working hours for a specific user.
 * @param userId - The ID of the user whose working hours are to be updated.
 * @param workingHours - The updated working hours to be saved.
 * @returns A success message and the updated user data.
 */
export const updateWorkingHours = async ( workingHours: Hours[]) => {
  try {
    const session = await getCurrentUser(); 
    if (!workingHours || workingHours.length === 0) {
      throw new Error("Working hours are required");
    }

    const response = await axiosInstance.put(`${API_BASE_URL}/${session?.user?.id}`, {
      workingHours,
    });
    return response.data;
  } catch (error) {
    console.error("Error updating working hours:", error);
    throw error;
  }
};
