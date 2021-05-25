

exports.AccessTokenInterceptor = {
    addAccessToken: (config) => {
        const headers = {
            ...config.headers,
            Accept: "application/json",
            "Content-Type": "application/json"
        };
        const accessToken = process.env.CHANNEL_ACCESS_TOKEN;
        if (accessToken) {
            headers.Authorization = `Bearer ${accessToken}`;
        }
        return { ...config, headers };
    },
    onRejected: (error) => {
        return Promise.reject(error);
    },
};

exports.LanguageInterceptor = {
    addLanguage: (config) => {
        return { ...config };
    },
};

exports.UnauthorizeInterceptor = {
    onFullfilled: (response) => {
        return Promise.resolve(response);
    },

    onRejected: (error) => {
        return Promise.resolve();
    },
};