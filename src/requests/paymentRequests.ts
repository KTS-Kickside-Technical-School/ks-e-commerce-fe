import { axiosInstance } from "../utils/axios";
import { handleError } from "./authRequests";

export const userPayCartWithStripe = async () => {
    try {
        const response = await axiosInstance.post("/api/payment/user-pay-with-stripe");
        return response.data
    } catch (error) {
        return handleError(error);
    }
}

export const userPaySIngleProductCartWithStripe = async (data: any) => {
    try {
        console.log("data to send", data);
        const response = await axiosInstance.post("/api/payment/user-pay-single-product-with-stripe", data);
        return response.data
    } catch (error) {
        return handleError(error);
    }
}