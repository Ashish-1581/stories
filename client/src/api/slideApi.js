import axios from 'axios';
const baseUrl = import.meta.env.VITE_BACKEND_URL;

export const createLike = async (storyId, slideId) => {

 try {
    const token=localStorage.getItem("token");
    
  
        const response = await axios.post(`${baseUrl}/slide/createLike`, { storyId, slideId },{
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response;
    } catch (error) {
        return { error: error.response.data.message };
    }
}

export const createBookmark = async (storyId, slideId) => {
    try {
        const token=localStorage.getItem("token");
        const response = await axios.post(`${baseUrl}/slide/createBookmark`, { storyId, slideId, },{
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response;
    } catch (error) {
        return { error: error.response.data.message };
    }


}

export const getBookmarks = async () => {
    try {
        const token=localStorage.getItem("token");
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

