import axios from 'axios';

const API_URL = 'http://localhost:3001';

export const api = {
    registerProduct: async (productId: string, batchId: string, metaHash: string) => {
        const res = await axios.post(`${API_URL}/register`, { productId, batchId, metaHash });
        return res.data;
    },
    updateCheckpoint: async (productId: string, location: string, status: number) => {
        const res = await axios.post(`${API_URL}/checkpoint`, { productId, location, status });
        return res.data;
    },
    getProduct: async (productId: string) => {
        const res = await axios.get(`${API_URL}/product/${productId}`);
        return res.data;
    }
};
