import { toast } from "sonner";
import { customerAddProductToCart } from "../requests/cartRequests";

export const handleAddProductToCartHelper = async (_id: any, navigate: any) => {
    try {
        const response = await customerAddProductToCart({ product: _id });

        if (response.status === 201) {
            toast.success('Product added to cart successfully');
            return navigate("/my-cart");
        } else {
            return navigate("/");
        }
    } catch (error) {
        console.error('Failed to add product to cart');
        return navigate("/");
    }
};
