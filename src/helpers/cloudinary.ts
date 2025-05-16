import axios from "axios";

const uploadToCloudinary = async (file: any) => {
    const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
    const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

    try {
        const response = await axios.post(CLOUDINARY_URL, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data.secure_url;
    } catch (error) {
        console.error('Cloudinary upload failed:', error);

        if (axios.isAxiosError(error) && error.response) {
            console.error('Error response data:', error.response.data);
        }

        return null;
    }
};

export default uploadToCloudinary;