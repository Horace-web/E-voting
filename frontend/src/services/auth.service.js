import api from '../api/axios';

export const testApi = async () => {
    try {
        console.log('🔗 Testing connection to Laravel API...');
        const response = await api.get('/test');
        return response.data;
    } catch (error) {
        console.error('🔥 API Connection Error:', {
            message: error.message,
            status: error.response?.status,
            data: error.response?.data
        });
        throw error;
    }
};