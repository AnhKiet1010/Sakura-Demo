import cookie from 'react-cookies';


export const onLogin = (token, lineId) => {
    cookie.save('accessToken', token, { path: '/' });
    cookie.save('lineId', lineId, { path: '/' });
}

export const onLogout = () => {
    cookie.remove('accessToken', { path: '/' });
    cookie.remove('lineId', { path: '/' });
}