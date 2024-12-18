export type User = {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  location: string;
  image: string;
};
export type Menu = {
  _id: string;
  name: string;
  price: number;
  image: string;
  measure: string;
  available: boolean;
  category: {
    _id: string;
    name: string;
  };
  createdBy: string;
  __v: number;
};

export type PaginationType = {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};


export type MenuResponse = {
  data: Menu[];
  pagination: PaginationType;
};
export type Category = {
  _id: string;
  name: string;
  description?: string;
};

export type SignUpDTO = {
  name: string;
  email: string;
  password: string;
  phoneNumber: string;
  location: string;
  file: File;
};

export type Hours = {
  day: string;
  openTime: string;
  closeTime: string;
  id: string;
};
export type Stats = {
  user: {
    name: string;
    email: string;
  }
  totalMenuItems: number;
  recentMenus: {
    id: string;
    name: string;
    price: number;
    image: string;
    available: boolean;
    category: string;
  }[];
};
export type RestaurantsResponse ={
  data: Restaurant[];
  pagination: PaginationType;
}

export type RestaurantDetailResponse= {
  user: Restaurant;

  menus: Menu[];
}
export type Restaurant= {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  location: string;
  image: string;
  createdAt: string;
  updatedAt: string;
  todayWorkingHours?: {
    openTime: string;
    closeTime: string;
  } | null;
  isOpen: boolean;
}

