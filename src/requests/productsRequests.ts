import { axiosInstance } from "../utils/axios";
import { handleError } from "./authRequests";

export const createProduct = async (productData: any) => {
    try {
        const response = await axiosInstance.post('/api/product/create-product', productData);
        return response.data;
    } catch (error) {
        return handleError(error);
    }
}

export const userViewProducts = async () => {
    try {

        const response = await axiosInstance.get("/api/product/customer-gel-all-products");
        return response.data
    } catch (error: any) {
        return handleError(error);
    }
}

export const sellerViewProducts = async () => {
    try {
        const response = await axiosInstance.get("/api/product/seller-get-products");
        console.log("ee", response)
        return response.data
    } catch (error) {
        return handleError(error);
    }
}

export const customerViewSingleProduct = async (slug: any) => {
    try {
        const response = await axiosInstance.get(`/api/product/customer-get-product-details/${slug}`);
        return response.data
    } catch (error: any) {
        return handleError(error);
    }
}