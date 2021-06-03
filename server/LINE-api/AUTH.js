import {
    URL_API_CALLBACK
    } from "./URL";
    
import API from "./API";

const Auth = {
    callback: (body) => {
        return API.instance.post(URL_API_CALLBACK, body);
    }
}

export default Auth;