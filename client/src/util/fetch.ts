import axios from "axios";

const instance = axios.create({
    baseURL: '/'
});

instance.interceptors.response.use(res => {
    return res.data;
});

export default instance;