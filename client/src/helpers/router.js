import React from 'react';
import { Redirect, Route } from "react-router-dom";
import cookie from 'react-cookies'


export const PrivateRoute = ({ component: Component, ...rest }) => {
    const accessToken = cookie.load('accessToken');
    const user = localStorage.getItem('user');
    return (
        <Route
            {...rest}
            render={(props) => {
                if (accessToken && user) {
                    return <Component {...props} />;
                } else {
                    return <Redirect to={{ pathname: "/login" }} />;
                }
            }}
        />
    );
};

export const PublicRoute = ({ component: Component, ...rest }) => {
    const accessToken = cookie.load('accessToken');
    const user = localStorage.getItem('user');
    return (
        <Route
            {...rest}
            render={(props) => {
                if (accessToken && user) {
                    return <Redirect to={{ pathname: "/" }} />;
                } else {
                    return <Component {...props} />;
                }
            }}
        />
    );
};