import axios, {AxiosError} from "axios";


export default axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
});

export {AxiosError, axios}
