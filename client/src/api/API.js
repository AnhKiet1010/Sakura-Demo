import axios from "axios";
import queryString from "query-string";
import { AccessTokenInterceptor, UnauthorizeInterceptor } from "./Interceptors";
import {
    URL_API_FRIENDS_LIST,
    URL_API_LIST_MESSAGES,
    URL_API_SEND_MESSAGE,
    URL_API_GET_IMAGES,
    URL_API_GET_MESSAGES_DETAIL,
    URL_API_GET_LIST_NOTI
} from './URL';

const getInstance = () => {
    const instance = axios.create({
        baseURL: `${process.env.REACT_APP_SERVER_URL}`,
        timeout: 120000,
        paramsSerializer: params => queryString.stringify(params),
        headers: {'Access-Control-Allow-Origin': '*', 'Content-Type': 'multipart/form-data'}
    });
    instance.interceptors.response.use(UnauthorizeInterceptor.onFullfilled, UnauthorizeInterceptor.onRejected);
    instance.interceptors.request.use(AccessTokenInterceptor.addAccessToken, AccessTokenInterceptor.onRejected);
    return instance;
};

const API = { instance: getInstance() };

API.switchServer = () => {
    API.instance = getInstance();
};

API.getListFriend = (body) => {
    return API.instance.post(URL_API_FRIENDS_LIST, body);
};

API.getListMessages = (body) => {
    return API.instance.post(URL_API_LIST_MESSAGES, body);
};

API.sendMessage = (body) => {
    return API.instance.post(URL_API_SEND_MESSAGE, body);
};

API.getImages = (body) => {
    return API.instance.post(URL_API_GET_IMAGES, body);
};

API.getNoti = (body) => {
    return API.instance.post(URL_API_GET_LIST_NOTI, body);
};

API.messagesDetail = (body) => {
    return API.instance.post(URL_API_GET_MESSAGES_DETAIL, body);
};

export default API;