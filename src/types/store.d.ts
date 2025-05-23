export interface ISellerShop {
  name: string;
  description?: string;
  logo?: string;
  images?: [];
}

export interface IProductCategory {
  _id?: any;
  name: string;
}

export interface ISeller {
  _id: any;
  email: string;
  profilePicture: string;
  fullNames: string;
  phone: string;
}

export interface iProduct {
  _id: any;
  productName: string;
  images: string[];
  price: number;
  discount: number;
  stock: number;
  slug: string;
  description: string;
  category: string;
  status?: string;
}

export interface Address {
  _id?: any;
  country: string;
  region: string;
  city: string;
  street: string;
  postalCode: string;
  isPrimary: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface iUserProfile {
  _id: any;
  fullNames?: string;
  email: string;
  phone?: string;
  bio?: string;
  addresses?: Address[];
  createdAt?: Date;
  updatedAt?: Date;
  __v?: number;
  role?: string;
  password?: string;
  addresses?: Address[];
}

interface IUserProfileUpdate {
  fullNames?: string;
  email?: string;
  profile?: string;
  phone?: string;
  bio?: string;
  addresses?: Address[];
  isDisabled?: boolean;
  isEmailVerified?: boolean;
  isUserVerified?: boolean;
}