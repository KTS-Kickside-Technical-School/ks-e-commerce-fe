export interface ISellerShop {
  _id?: any;
  name: string;
  description?: string;
  logo?: string;
  images?: any;
  phone?: string;
  address?: any;
  seller?: ISeller;
  tin?: string;
  rdbDocument?: string;
  payment?: {
    mobilePayment?: string;
    bankName?: string;
    accountNumber?: string;
  }
  status?: string;
  isWaitingForApproval?: boolean;
  isApproved?: boolean;
  rejectReason?: string;
}

export interface IProductCategory {
  _id?: any;
  name: string;
}

export interface ISeller {
  _id: any;
  email: string;
  profile: string;
  fullNames: string;
  phone: string;
  idDocument?: string;
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
  shop?: ISellerShop;
  shippingOptions: {
    fee: number;
    note: string;
    duration: string;
  }
  createdAt?: Date;
  updatedAt?: Date;
  productId?: string;
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

export interface iLocation {
  _id?: any;
  code: string;
  name: string;
  country: string;
  city?: string;
  region?: string;
  street?: string;
  postalCode?: string;
  createdAt?: Date;
}

export interface OrderTrackingHistoryItem {
  status: string;
  note?: string | null;
  timestamp: Date;
}

export interface ShippingOptions {
  fee: number;
  note?: string | null;
  duration?: string | null;
}

export interface ShippingAddress {
  street: string;
  city: string;
  region: string;
  postalCode: string;
  country: string;
}

export interface ContactInfo {
  phone: string;
  email?: string | null;
}

export interface OrderFormData {
  product: string;
  productName: string;
  productImages: string[];
  quantity: number;
  originalPrice: number;
  finalUnitPrice: number;
  discount: number;
  finalTotalPrice: number;

  shippingOptions: ShippingOptions;
  shippingAddress: ShippingAddress;
  contactInfo: ContactInfo;

  paymentMethod: 'momo' | 'visa' | 'stripe' | 'cash' | 'paypal';
  paymentStatus: 'pending' | 'confirmed' | 'failed' | 'refunded';

  paymentProof?: string | null;
  orderStatus: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

  isPaid: boolean;
  paidAt?: Date | null;
  deliveredAt?: Date | null;

  orderTrackingHistory?: OrderTrackingHistoryItem[];
}





interface IShippingOptions {
  fee: number;
  note: string;
  duration: string;
}

interface IShippingAddress {
  street: string;
  city: string;
  region: string;
  postalCode: string;
  country: string;
}

interface IContactInfo {
  phone: string;
  email: string;
}

interface IOrderTrackingEntry {
  status: string;
  note: string;
  timestamp: Date;
}

interface IOrder {
  _id: string;
  user: {
    _id: string;
    fullNames: string;
    email: string;
    phone: string;
  };
  product: string;
  productName: string;
  productImages: string[];
  quantity: number;
  originalPrice: number;
  finalUnitPrice: number;
  discount: number;
  finalTotalPrice: number;
  shippingOptions: IShippingOptions;
  shippingAddress: IShippingAddress;
  contactInfo: IContactInfo;
  paymentMethod: 'momo' | 'visa' | 'stripe' | 'cash' | 'paypal';
  paymentStatus: 'pending' | 'confirmed' | 'failed' | 'refunded';
  paymentProof?: string;
  orderStatus: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  isPaid: boolean;
  paidAt?: Date;
  deliveredAt?: Date;
  trackingCode: string;
  orderTrackingHistory: IOrderTrackingEntry[];
  createdAt: Date;
}


export interface IUpdateShop {
  _id: string,
  name: string,
  description: string,
  logo: string,
  images: String[],
  phone: string,
  createdAt: Date,
  updatedAt: Date,
  address: any;
  __v: string,
  seller: string,
}