import { IProductCategory } from "../types/store";
import { axiosInstance } from "../utils/axios";
import { handleError } from "./authRequests"

export const adminSaveCategory = async (data: IProductCategory) => {
    try {
        const response = await axiosInstance.post("/api/category/create-category", data);
        return response.data
    } catch (error: any) {
        return handleError(error);
    }
}

export const adminViewCategories = async () => {
    try {
        const response = await axiosInstance.get("/api/category/get-all-categories");
        return response.data
    } catch (error) {
        return handleError(error);
    }
}

export const adminEditCategory = async (data: IProductCategory) => {
    try {
        const id = data._id
        delete data._id
        const response = await axiosInstance.put(`/api/category/update-category/${id}`, data)
        return response.data
    } catch (error) {
        return handleError(error);
    }
}

export const adminDeleteCategory = async (id: string) => {
    try {
        const response = await axiosInstance.delete(`/api/category/delete-category/${id}`)
        return response.data
    } catch (error: any) {
        return handleError(error);
    }
}