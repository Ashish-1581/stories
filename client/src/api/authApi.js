import axios from 'axios';
const baseUrl = import.meta.env.VITE_BACKEND_URL;

export const login = async (user) => {
    try {
        const response = await axios.post(`${baseUrl}/auth/login`, user);
        return response;
    } catch (error) {
        return { error: error.response.data.message };
    }
}

export const signup = async (user) => {
    try {
        console.log(user)
        const response = await axios.post(`${baseUrl}/auth/signup`, user);
        return response;
    } catch (error) {
        return { error: error.response.data.message };
    }
}