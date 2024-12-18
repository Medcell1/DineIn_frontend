import createAxiosInstance from "@/utils/axiosInstance";
import { Menu, MenuResponse, PaginationType,  } from "@/@types";
import { getCurrentUser } from "@/app/lib/get-session";

const API_BASE_URL = 'menu';
const axiosInstance = createAxiosInstance();

export const fetchMenuItems = async (search?: string): Promise<Menu[]> => {
  try {
    const response = await axiosInstance.get(API_BASE_URL, {
      params: { search }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching menu items:', error);
    throw error;
  }
};

// Fetch menu item by ID
export const fetchMenuItemById = async (id: string): Promise<Menu> => {
  try {
    const response = await axiosInstance.get(`${API_BASE_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching menu item by ID:', error);
    throw error;
  }
};

export const fetchMenuItemsByUser = async (
    params: { search?: string; page?: number; limit?: number } = {}
  ): Promise<{
    menuItems: Menu[];
    pagination: PaginationType;
  }> => {
    try {
      const session = await getCurrentUser(); 
      console.log(`uid===>${session?.user?.id}`);
      const response = await axiosInstance.get<MenuResponse>(`${API_BASE_URL}/user/${session?.user?.id}`, {
        params: {
          search: params.search,
          page: params.page || 1,
          limit: params.limit || 10,
        },
      });
  
      return {
        menuItems: response.data.data,
        pagination: response.data.pagination,
      };
    } catch (error) {
      console.error('Error fetching menu items by user:', error);
      throw error;
    }
  };

// Create a new menu item
export const createMenuItem = async (
  menuData: { name: string; price: number; category:string; measure: string; image: File }
) => {
  try {
    const formData = new FormData();
    formData.append('name', menuData.name);
    formData.append('price', menuData.price.toString());
    formData.append('measure', menuData.measure);
    formData.append('file', menuData.image);
    formData.append('category', menuData.category);

    const response = await axiosInstance.post(API_BASE_URL, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.data;
  } catch (error) {
    console.error('Error creating menu item:', error);
    throw error;
  }
};

// Update a menu item
export const updateMenuItem = async (
  id: string,
  menuData: { name?: string; price?: number; description?: string; measure?: string; image?: File }
) => {
  try {
    const formData = new FormData();
    if (menuData.name) formData.append('name', menuData.name);
    if (menuData.price !== undefined) formData.append('price', menuData.price.toString());
    if (menuData.description) formData.append('description', menuData.description);
    if (menuData.measure) formData.append('measure', menuData.measure);
    if (menuData.image) formData.append('file', menuData.image);

    const response = await axiosInstance.put(`${API_BASE_URL}/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.data;
  } catch (error) {
    console.error('Error updating menu item:', error);
    throw error;
  }
};

// Delete a menu item
export const deleteMenuItem = async (id: string): Promise<void> => {
  try {
    await axiosInstance.delete(`${API_BASE_URL}/${id}`);
  } catch (error) {
    console.error('Error deleting menu item:', error);
    throw error;
  }
};

// Toggle menu item availability
export const toggleMenuItemAvailability = async (id: string, available: boolean): Promise<Menu> => {
  try {
    const response = await axiosInstance.patch(
      `${API_BASE_URL}/${id}/availability`,
      { available:  available}
    );
    return response.data.menuItem;
  } catch (error) {
    console.error('Error toggling menu item availability:', error);
    throw error;
  }
};
