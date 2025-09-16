
import { privateApi as axiosPrivateApi } from "./base.api";

const privateApi = {
    // Menu management (Admin only)
    createMenu(data: FormData) {
        return axiosPrivateApi.post("/menu", data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },
    
    // Order management (Admin only)
    getAllOrders() {
        return axiosPrivateApi.get("/order");
    },
    
    updateOrder(orderId: string, data: any) {
        return axiosPrivateApi.patch(`/order/${orderId}`, data);
    },
    
    updateOrderStatus(orderId: string, status: string) {
        return axiosPrivateApi.patch(`/order/${orderId}/status`, { status });
    }
};

export default privateApi;
