import { axiosInstance } from "../utils/axios";
import { handleError } from "./authRequests";


export const sellerGetShopDetails = async () => {
    try {
        const response = await axiosInstance.get("/api/shop/seller-view-shop-details");
        return response.data;
    } catch (error: any) {
        return handleError(error
        );
    }
}

export const sellerCreateShop = async (data: any) => {
    try {
        console.log("DD", data);
        const response = await axiosInstance.post("api/shop/seller-create-shop", data);
        return response.data
    } catch (error) {
        return handleError(error);
    }
}

export const adminViewSellers = async () => {
    try {
        const response = await axiosInstance.get("/api/shop/admin-view-sellers");
        return response.data;
    } catch (error) {
        return handleError(error);
    }
}

export const adminGetShopBySellerId = async (sellerId: string) => {
    try {
        const response = await axiosInstance.get(`/api/shop/admin-view-single-shop-by-seller/${sellerId}`);
        return response.data;
    } catch (error: any) {
        return handleError(error)
    }
}