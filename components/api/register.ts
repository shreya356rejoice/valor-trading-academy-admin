import axios from 'axios';

const BaseUrl = process.env.NEXT_PUBLIC_BASE_URL;

// Helper function to get token safely
export const getAuthToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};

export const getAllRegisteredUsers = async (type: "live" | "physical" = "live", courseId?: string) => {
    try {
        const token = getAuthToken();
        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
        };
        
        if (token) {
            headers['x-auth-token'] = token;
        }

        let url = `${BaseUrl}/registration/getAllRegistration?courseType=${type}`;
        if (courseId && courseId !== 'all') {
            url += `&courseId=${courseId}`;
        }

        const res = await axios.get(url, { headers });
        return res.data;
    } catch (error) {
        console.error("Error on Contact Fetch", error);
        throw error;
    }
};

export const getCourseDropdown = async () => {
    try {
        const token = getAuthToken();
        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
        };
        
        if (token) {
            headers['x-auth-token'] = token;
        }

        const res = await axios.get(`${BaseUrl}/registration/getCourseDropDown`, { headers });
        return res.data;
    } catch (error) {
        console.error("Error fetching course dropdown", error);
        throw error;
    }
};