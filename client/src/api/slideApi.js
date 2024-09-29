import axios from 'axios';
const baseUrl = import.meta.env.VITE_BACKEND_URL;

export const createLike = async (storyId, slideId) => {

 try {
    
  
        const response = await axios.post(`${baseUrl}/slide/createLike`, { storyId, slideId });
        return response;
    } catch (error) {
        return { error: error.response.data.message };
    }
}

export const createBookmark = async (heading, description, mediaUrl, mediaType,token) => {
    try {
        const response = await axios.post(`${baseUrl}/slide/createBookmark`, { heading, description, mediaUrl, mediaType },{
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response;
    } catch (error) {
        return { error: error.response.data.message };
    }


}

export const getBookmarks = async (token) => {
    try {
        const response = await axios.get(`${baseUrl}/slide/getBookmarks`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response;
    } catch (error) {
        return { error: error.response.data.message };
    }
}

