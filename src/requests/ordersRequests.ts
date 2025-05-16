import { axiosInstance } from "../utils/axios";
import { handleError } from "./authRequests"

export const updateOrderStatus = async (data: {
    _id: string,
    orderStatus: string
}) => {
    try {
        const response = await axiosInstance.put("/api/order/update-order-status", data);
        return response.data
    } catch (error) {
        handleError(error);
    }
}

export const sellerViewOrders = async () => {
    try {
        const response = await axiosInstance.get("/api/order/seller-view-orders");
        return response.data
    } catch (error) {
        handleError(error);
    }
}

export const addSingleProductOrderProcess = async (data: any) => {
    try {
        const response = await axiosInstance.put("/api/order/add-single-product-order-process", data);
        return response.data
    } catch (error) {
        handleError(error);
    }
}

export const sellerGetSingleOrderDetails = async (_id: any) => {
    try {
        const response = await axiosInstance.get(`/api/order/view-single-product-order-details/${_id}`);
        return response.data
    } catch (error) {
        handleError(error);
    }
}