import axios from 'axios';

const API_URL = 'http://localhost:5001';

export const fetchProducts = async () => {
    try {
        const response = await axios.get(`${API_URL}/productos`);
        return response.data;
    } catch (error) {
        console.error('Error fetching products:', error);
        throw error;
    }
};

