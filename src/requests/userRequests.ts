import { iUserProfile, IUserProfileUpdate } from "../types/store";
import { axiosInstance } from "../utils/axios";
import { handleError } from "./authRequests";

export const updateProfile = async (data: Partial<iUserProfile>) => {
    try {
        const { role, __v, createdAt, updatedAt, password, ...cleanData } = data;

        const sanitizedData: IUserProfileUpdate = {
            ...cleanData,
            addresses: cleanData.addresses?.map(({ createdAt, updatedAt, _id, ...address }) => ({
                ...address,
                ...(_id ? { _id } : {})
            }))
        };

        const response = await axiosInstance.put(
            '/api/user/user-update-profile',
            sanitizedData
        );
        return response.data;
    } catch (error) {
        console.error("Error updating profile:", error);
        return handleError(error);
    }
}