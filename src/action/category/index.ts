import { Category } from "@/@types";
import createAxiosInstance from "@/utils/axiosInstance";

const API_BASE_URL = 'category';
const axiosInstance = createAxiosInstance();

export const fetchCategories = async (): Promise<Category[]> => {
  try {
    const response = await axiosInstance.get(API_BASE_URL);

    const categories = response.data.map((category: any) => ({
      _id: category._id,
      name: category.name,
      description: category.description || "", 
    }));

    return categories;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};
