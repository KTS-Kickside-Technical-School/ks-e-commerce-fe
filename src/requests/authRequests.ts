import { axiosInstance } from "../utils/axios.ts";
import {
    CreateUserTypes,
    UserLoginTypes
} from "../types/user.ts";
export const handleError = (error: any) => {
    if (error.response) {
        return {
            status: error.response.status,
            message:
                error.response.data.message ||
                "Something went wrong. Please try again.",
        };
    }
    return {
        status: 500,
        message: error.message || "Unexpected error occurred. Please try again.",
    };
};

const userCreateAccount = async (data: CreateUserTypes) => {
    try {
        const response = await axiosInstance.post("/api/auth/new-user-account", data);
        return response.data
    } catch (error: any) {
        return handleError(error);
    }
}

const userLogin = async (data: UserLoginTypes) => {
    try {
        const response = await axiosInstance.post("/api/auth/login", data);
        return response.data;
    } catch (error: any) {
        return handleError(error);
    }
}

const authRequests = {
    userCreateAccount,
    userLogin
}

export default authRequests