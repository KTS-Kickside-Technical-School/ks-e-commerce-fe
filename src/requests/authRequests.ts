import { axiosInstance } from "../utils/axios.ts";
import {
    CreateUserTypes,
    iResetPasswordTypes,
    iUserForgotPasswordTypes,
    iValidateResetTokenTypes,
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

const userForgetPassword = async (data: iUserForgotPasswordTypes) => {
    try {
        const response = await axiosInstance.post("/api/auth/forgot-password", data);
        return response.data
    } catch (error) {
        return handleError(error);
    }
}

const validateResetToken = async (data: iValidateResetTokenTypes) => {
    try {
        const response = await axiosInstance.post("/api/auth/validate-reset-token", data)
        return response.data
    } catch (error) {
        return handleError(error)
    }
}

const resetPassword = async (data: iResetPasswordTypes) => {
    try {
        const response = await axiosInstance.post("/api/auth/reset-password", data)
        return response.data

    } catch (error) {
        return handleError(error)
    }
}
const authRequests = {
    userCreateAccount,
    userLogin,
    userForgetPassword,
    validateResetToken,
    resetPassword
}

export default authRequests