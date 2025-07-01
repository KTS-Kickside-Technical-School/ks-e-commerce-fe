import { axiosInstance } from "../utils/axios";
import { handleError } from "./authRequests";

export const saveTermsANdConditions = async (data: any) => {
    try {
        const response = await axiosInstance.post('/api/terms-and-conditions/new-terms', data);
        return response.data;
    } catch (error) {
        return handleError(error);
    }
}

export const adminFetchTermsAndConditions = async () => {
    try {
        const response = await axiosInstance.get('/api/terms-and-conditions/admin-view-terms');
        return response.data;
    } catch (error) {
        return handleError(error);
    }
}

export const adminFetchSingleTermsAndConditions = async (slug: string) => {
    try {
        const response = await axiosInstance.get(`/api/terms-and-conditions/admin-view-single-terms/${slug}`);
        return response.data;
    } catch (error) {
        return handleError(error);
    }
}

export const updateTermsAndConditions = async (slug: string, data: any) => {
    try {
        const response = await axiosInstance.put(`/api/terms-and-conditions/admin-update-terms/${slug}`, data);
        return response.data;
    } catch (error) {
        return handleError(error);
    }
}