import React, { useEffect } from 'react';
import { useHistory, useLocation } from 'react-router';
import AUTH from '../api/AUTH';
import { onLogin } from '../helpers/auth';

function useQuery() {
    return new URLSearchParams(useLocation().search);
}


function Callback() {
    const history = useHistory();
    const queryParams = useQuery();
    useEffect(() => {
        document.title = "CALLBACK";
        const code = queryParams.get('code');
        const state = queryParams.get('state');
        console.log(code, state);
        const body = { code, state };
        if (state === 'success') {
            AUTH.callback(body)
                .then((res) => {
                    let { status, data } = res.data;
                    console.log(res.data);
                    if (status === 200) {
                        onLogin(data.accessToken, data.userInfo);
                        history.push('/chat');
                    }
                }).catch(err => {
                    console.log('error', err);
                })
        }
    }, []);

    return (
        <div className="w-full h-full fixed block top-0 left-0 bg-white opacity-75 z-50 flex items-center justify-center">
            <span className="text-green-500 opacity-75 mx-auto block relative">
                <i className="fas fa-circle-notch fa-spin fa-5x" />
            </span>
        </div>

    );
}

export default Callback;