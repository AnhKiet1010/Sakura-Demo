const axios = require("axios");
// const queryString = require("query-string");
const { AccessTokenInterceptor, UnauthorizeInterceptor } = require("./Interceptors");
const {
    URL_API_PUSH_MESSAGE,
    URL_API_GET_MESSAGE_CONTENT
} = require('./URL');

const getInstance = () => {
    const instance = axios.create({
        timeout: 120000,
        // paramsSerializer: params => queryString.stringify(params),
        headers: {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'}
    });
    instance.interceptors.response.use(UnauthorizeInterceptor.onFullfilled, UnauthorizeInterceptor.onRejected);
    instance.interceptors.request.use(AccessTokenInterceptor.addAccessToken, AccessTokenInterceptor.onRejected);
    return instance;
};

const API = { instance: getInstance() };

API.switchServer = () => {
    API.instance = getInstance();
};

API.pushMessage = (body) => {
    return API.instance.post(URL_API_PUSH_MESSAGE, body);
};

API.getContent = (id) => {
    let url = URL_API_GET_MESSAGE_CONTENT.replace(":messId", id);
    return API.instance.get(url);
}

module.exports = API;