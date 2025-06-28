import { axiosInstance } from "../utils/axios"
import { handleError } from "./authRequests";

export const getAllLocations = async () => {
    try {
        const response = await axiosInstance("/api/location/get-all-locations");
        return response.data;
    } catch (error) {
        console.error("Error fetching locations:", error);
        return handleError(error);
    }
}

export const saveLocation = async (data: any) => {
    try {
        const response = await axiosInstance.post("/api/location/add-location", data);
        return response.data;
    } catch (error) {
        console.error("Error saving location:", error);
        return handleError(error);
    }
}

export const updateLocation = async (id: string, data: any) => {
    try {
        const response = await axiosInstance.put(`/api/location/update-location/${id}`, data);
        return response.data;
    }
    catch (error) {
        return handleError(error);
    }
}