import axios from "axios";

const baseUrl = `${process.env.NEXT_PUBLIC_SPRING_API_URL}/api/v1`;

const setUpAxios = () => {
    axios.interceptors.request.use(
        (config) => {
            config.baseURL = baseUrl;
            return config;
        },
        (err) => {
            return Promise.reject(err);
        }
    );
    axios.interceptors.response.use(
        (res) => {
            return res;
        },
        (err) => {
            return Promise.reject(err);
        }
    );
};
export { setUpAxios };
