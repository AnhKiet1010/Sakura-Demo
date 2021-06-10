import cookie from 'react-cookies';
import socket from './socketConnect';


export const onLogin = (token, userInfo) => {
    cookie.save('accessToken', token, { path: '/' });
    localStorage.setItem('user', JSON.stringify(userInfo));
}

export const onLogout = (userId) => {
    cookie.remove('accessToken', { path: '/' });
    socket.emit("UserLogout", {userId}); 
    localStorage.clear();
}