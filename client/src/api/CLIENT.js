import {
    URL_API_USER_UPDATE
} from "./URL";

import API from "./API";

const Client = {
    update: (body) => {
        return API.instance.post(URL_API_USER_UPDATE, body);
    }
}

export default Client;