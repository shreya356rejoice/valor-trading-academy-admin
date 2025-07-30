import axios from 'axios';

const BaseUrl = process.env.NEXT_PUBLIC_BASE_URL;

// Helper function to get token safely
export const getAuthToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};

export const getTotalRevenueData = async () => {
    try {
        const response = await axios.get(`${BaseUrl}/payment/getTotalRevenue`, {
            headers: {
                'x-auth-token': getAuthToken(),
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching revenue data:', error);
        return null;
    }
};