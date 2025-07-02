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

export const adminDisableUser = async (
    userId: string,
    isDisabled: boolean,
    disableReason = ''
) => {
    try {
        let response;
        if (isDisabled) {
            response = await axiosInstance.put('/api/user/disable-user', {
                _id: userId,
                disableReason,
            });
        } else {
            response = await axiosInstance.put(`/api/user/enable-user/${userId}`);
        }

        return response.data;
    } catch (error) {
        console.error('Error toggling user status:', error);
        return handleError(error);
    }
};

export const adminChangeUserRole = async (userId: string, newRole: string) => {
    try {
        const response = await axiosInstance.put(`/api/user/change-role`, {
            _id: userId,
            role: newRole
        });
        return response.data;
    } catch (error) {
        console.error('Error changing user role:', error);
        return handleError(error);
    }
};