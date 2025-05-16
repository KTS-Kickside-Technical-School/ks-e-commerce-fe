import { axiosInstance } from "../utils/axios";
import { handleError } from "./authRequests"

export const customerAddProductToCart = async (data: any) => {
    try {
        const response = await axiosInstance.post("/api/cart/add-product-to-cart", data);
        return response.data
    } catch (error) {
        return handleError(error);
    }
}

export const customerViewCartProducts = async () => {
    try {
        const response = await axiosInstance.get("/api/cart/get-cart-products");
        return response.data
    } catch (error) {
        return handleError(error);
    }
}

export const customerUpdateCart = async (data: any) => {
    try {
        const response = await axiosInstance.put("/api/cart/update-cart", data);
        return response.data;
    } catch (error) {
        return handleError(error);
    }
}

export const customerRemoveProductFromCart = async (product: any) => {
    try {
        const response = await axiosInstance.delete(`/api/cart/remove-product-from-cart/${product}`);
        return response.data
    } catch (error) {
        return handleError(error);
    }
}

export const customerClearCart = async () => {
    try {
        const response = await axiosInstance.delete("/api/cart/clear-cart");
        return response.data
    } catch (error) {
        return handleError(error);
    }
}