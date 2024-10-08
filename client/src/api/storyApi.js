import axios from 'axios';
const baseUrl = import.meta.env.VITE_BACKEND_URL;

export const create_Story = async (slides, category, token) => {
    try {
        const response = await axios.post(`${baseUrl}/story/create`, { slides, category }, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response;
    } catch (error) {
        return { error: error.response.data.message };
    }
}

export const update_Story = async (storyId, slides, category) => {
    try {
        const response = await axios.patch(`${baseUrl}/story/update/${storyId}`, { slides,category });
        return response;
    }
    catch (error) {
        return { error: error.response.data.message };
    }
}



export const get_Story = async (storyId) => {
    try {
        const response = await axios.get(`${baseUrl}/story/get/${storyId}`);
        return response;
    } catch (error) {
        return { error: error.response.data.message };
    }
}



export const get_Stories = async (cat) => {
    try {
       
        const response = await axios.get(`${baseUrl}/story/get`,{params:{cat}});
        return response;
    } catch (error) {
        return { error: error.response.data.message };
    }
}

export const get_UserStories = async (token) => {
    try {
        const response = await axios.get(`${baseUrl}/story/getUserStories`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response;
    } catch (error) {
        return { error: error.response.data.message };
    }
}