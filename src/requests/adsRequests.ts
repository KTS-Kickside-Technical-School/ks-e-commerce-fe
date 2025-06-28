import { axiosInstance } from "../utils/axios";
import { handleError } from "./authRequests"

export const getAllFeaturedShops = async () => {
    try {
        const response = await axiosInstance.get("/api/ads/get-all-featured-shops");
        return response.data;
    } catch (error) {
        return handleError(error);
    }
}

export const saveFeaturedShop = async (data: any) => {
    try {

        const response = await axiosInstance.post("/api/ads/save-featured-shop", data);
        return response.data
    } catch (error) {
        return handleError(error);
    }
}

export const updateFeaturedShopStatus = async (id: any, status: string) => {
    try {
        const response = await axiosInstance.put(`/api/ads/update-featured-shop/${id}`, { status });
        return response.data
    } catch (error) {
        return handleError(error);
    }
}