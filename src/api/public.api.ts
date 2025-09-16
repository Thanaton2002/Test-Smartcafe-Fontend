
import { publicApi as axiosPublicApi } from "./base.api";

interface LoginData {
    username: string;
    password: string;
}

interface RegisterData {
    username: string;
    password: string;
    role?: string;
}

interface OrderData {
    items: Array<{
        menuid: number;
        qty: number;
    }>;
    totalPrice: number;
}

const publicApi = {
    // Authentication
    login(data: LoginData) {
        return axiosPublicApi.post("/authen/login", data);
    },
    
    register(data: RegisterData) {
        return axiosPublicApi.post("/authen/register", data);
    },

    // Menu
    getMenus() {
        return axiosPublicApi.get("/menu");
    },
    
    getMenuById(menuId: number) {
        return axiosPublicApi.get(`/menu/${menuId}`);
    },

    // Orders
    createOrder(data: OrderData) {
        return axiosPublicApi.post("/order", data);
    },
    
    getOrder(orderId: string) {
        return axiosPublicApi.get(`/order/${orderId}`);
    },
    
    updateOrderStatus(orderId: string, status: string) {
        return axiosPublicApi.patch(`/order/${orderId}`, { status });
    }
};

export default publicApi;
