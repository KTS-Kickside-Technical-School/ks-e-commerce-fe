import { OrderFormData } from "../types/store";
import { axiosInstance } from "../utils/axios";
import { handleError } from "./authRequests"

export const saveOrder = async (data: OrderFormData | any) => {
    try {
        const response = await axiosInstance.post("/api/order/save-order",
            data
        );
        return response.data
    } catch (error) {
        return handleError(error)
    }
}

export const getSingleOrderDetails = async (id: any) => {
    try {
        const response = await axiosInstance.get(`/api/order/customer-get-single-order/${id}`);
        return response.data
    } catch (error) {
        return handleError(error);
    }
}

export const customerUpdateOrder = async (id: any, data: any) => {
    try {
        const response = await axiosInstance.put(`/api/order/customer-update-order/${id}`, data);
        return response.data
    } catch (error) {
        return handleError(error);
    }
}

export const getCustomerOrders = async () => {
    try {
        const response = await axiosInstance.get("/api/order/customer-get-orders");
        return response.data

    } catch (error) {
        return handleError(error);
    }
}

export const adminCustomerOrders = async () => {
    try {
        const response = await axiosInstance.get("/api/order/admin-get-all-orders");
        return response.data

    } catch (error) {
        return handleError(error);
    }
}

export const adminGetSingleOrder = async (id: any) => {
    try {
        const response = await axiosInstance.get(`/api/order/admin-get-single-order/${id}`);
        return response.data
    } catch (error) {
        return handleError(error);
    }
}

export const adminUpdateOrder = async (id: any, data: any) => {
    try {
        const response = await axiosInstance.put(`/api/order/admin-update-order/${id}`, data);
        return response.data
    } catch (error) {
        return handleError(error);
    }
}
