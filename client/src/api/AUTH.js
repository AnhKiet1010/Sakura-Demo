import {
    URL_API_CALLBACK,
    URL_API_LOGIN,
    URL_API_REGISTER
} from "./URL";

import API from "./API";

const Auth = {
    callback: (body) => {
        return API.instance.post(URL_API_CALLBACK, body);
    },
    login: (body) => {
        return API.instance.post(URL_API_LOGIN, body);
    },
    register: (body) => {
        return API.instance.post(URL_API_REGISTER, body);
    }
}

export default Auth;