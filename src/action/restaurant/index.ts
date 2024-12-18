import createAxiosInstance from "@/utils/axiosInstance";
import {
  PaginationType,
  Restaurant,
  RestaurantDetailResponse,
} from "@/@types";

const API_BASE_URL = "users";
const axiosInstance = createAxiosInstance();

export const fetchAllRestaurants = async (
    params: { search?: string; page?: number; limit?: number } = {}
  ): Promise<{
    restaurants: Restaurant[];
    pagination: PaginationType;
  }> => {
    try {
      const response = await axiosInstance.get(`${API_BASE_URL}`, {
        params: {
          search: params.search,
          page: params.page || 1,
          limit: params.limit || 10,
        },
      });
  
      if (!response.data) {
        throw new Error('No data received from the API');
      }
  
      const data = response.data;
      const restaurantsData = Array.isArray(data) ? data : (data.data || []);
  
      const restaurants: Restaurant[] = restaurantsData.map((item: any) => {
  
        return {
          id: item._id?.toString() || '',
          name: item.name || 'Unnamed Restaurant',
          email: item.email || '',
          phoneNumber: item.phoneNumber || '',
          location: item.location || 'No location',
          image: item.image || '/placeholder.svg?height=100&width=200',
          createdAt: item.createdAt || '',
          updatedAt: item.updatedAt || '',
          todayWorkingHours: item.todayWorkingHours 
            ? { 
                openTime: item.todayWorkingHours.openTime, 
                closeTime: item.todayWorkingHours.closeTime 
              } 
            : null,
          isOpen: checkIsOpen(item.todayWorkingHours)
        };
      });
  
      return {
        restaurants: restaurants,
        pagination: data.pagination || {
          currentPage: 1,
          totalPages: 1,
          totalItems: restaurants.length,
          itemsPerPage: restaurants.length,
          hasNextPage: false,
          hasPreviousPage: false
        },
      };
    } catch (error) {
      console.error("Error fetching all restaurants:", error);
      return {
        restaurants: [],
        pagination: {
          currentPage: 1,
          totalPages: 1,
          totalItems: 0,
          itemsPerPage: 0,
          hasNextPage: false,
          hasPreviousPage: false
        }
      };
    }
  };
export const getRestaurant = async (
  name: string
): Promise<RestaurantDetailResponse> => {
  try {
    const response = await axiosInstance.get(`${API_BASE_URL}/name/${name}`);
    const data = response.data;
    const user = data.user;
    return {
      user: {
        id: user._id,
        email: user.email,
        image: user.image,
        name: user.name,
        location: user.location,
        createdAt: user.createdAt,
        phoneNumber: user.phoneNumber,
        updatedAt: user.updatedAt,
        todayWorkingHours: {
          closeTime: data.todayWorkingHour.closeTime,
          openTime: data.todayWorkingHour.openTime,
        },
      },
      menus: data.menus,

    } as RestaurantDetailResponse;
  } catch (error) {
    console.error("Error fetching restaurant by name:", error);
    throw error;
  }
};
const checkIsOpen = (workingHours?: { openTime: string; closeTime: string }) => {
    if (!workingHours) return false;
  
    const now = new Date();
    
    const parseTime = (timeString: string) => {
      const [time, period] = timeString.split(' ');
      let [hours, minutes] = time.split(':').map(Number);
      
      if (period === 'PM' && hours !== 12) hours += 12;
      if (period === 'AM' && hours === 12) hours = 0;
  
      return { hours, minutes };
    };
  
    const createTimeDate = (timeObj: { hours: number, minutes: number }) => {
      const timeDate = new Date(now);
      timeDate.setHours(timeObj.hours, timeObj.minutes, 0, 0);
      return timeDate;
    };
  
    const openTimeObj = parseTime(workingHours.openTime);
    const closeTimeObj = parseTime(workingHours.closeTime);
  
    const openTime = createTimeDate(openTimeObj);
    const closeTime = createTimeDate(closeTimeObj);
  
    if (closeTime < openTime) {
      closeTime.setDate(closeTime.getDate() + 1);
    }
  
    return now >= openTime && now <= closeTime;
  };