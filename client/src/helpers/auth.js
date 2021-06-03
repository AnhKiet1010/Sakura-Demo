import cookie from 'react-cookies';


export const onLogin = (token, userInfo) => {
    cookie.save('accessToken', token, { path: '/' });
    localStorage.setItem('user', JSON.stringify(userInfo));
}

export const onLogout = () => {
    cookie.remove('accessToken', { path: '/' });
    localStorage.clear();
}