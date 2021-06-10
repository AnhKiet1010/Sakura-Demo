import React, { useEffect } from 'react';
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { useHistory } from 'react-router-dom';
import AUTH from '../api/AUTH';
import 'react-toastify/dist/ReactToastify.css';
import { onLogin } from '../helpers/auth';

const schema = yup.object().shape({
    email: yup.string().email().required("Email is empty"),
    password: yup.string().min(1).required("Password is empty"),
});

function Login() {
    const { register, setError, formState: { errors, isSubmitting }, handleSubmit } = useForm({
        resolver: yupResolver(schema)
    });

    const history = useHistory();

    const onSubmit = data => {
        AUTH.login(data)
            .then(res => {
                let { status, message, errors, data } = res.data;
                console.log(res.data);
                if (status !== 200) {
                    errors.map(err => {
                        return setError(err.field, {
                            type: 'manual',
                            message: message
                        });
                    })
                } else {
                    onLogin(data.accessToken, data.userInfo);
                    history.push('/chat');
                }
            }).catch(err => {
                console.log(err);
            })
    };

    useEffect(() => {
        document.title = "Login";
    }, []);

    return <div className="font-sans w-full min-h-screen flex justify-center items-center overflow-hidden">
        <div className="relative w-full min-h-screen flex justify-center items-center bg-gray-200 ">
            <div className="relative max-w-sm">
                <div className="card bg-blue-400 shadow-lg  w-full h-full rounded-3xl absolute  transform -rotate-6" />
                <div className="card bg-red-400 shadow-lg  w-full h-full rounded-3xl absolute  transform rotate-6" />
                <div className="relative w-full rounded-3xl  px-6 py-4 bg-gray-100 shadow-md">
                    <label className="block mt-3 text-lg text-gray-700 text-center font-semibold">
                        LOGIN
                    </label>
                    <form onSubmit={handleSubmit(onSubmit)} className="mt-10">
                        <div className="my-6 flex flex-col">
                            <input
                                {...register("email")}
                                type="email"
                                placeholder="Email..."
                                className={`px-4 py-2 block w-full h-11 rounded-xl shadow-lg hover:bg-blue-100 focus:bg-blue-100 focus:ring-0 focus:outline-none ${errors.email ? "border border-red-300" : "border-none"}`} />
                            <p className="my-1 text-xs text-red-400">{errors.email?.message}</p>
                        </div>
                        <div className="my-6 flex flex-col">
                            <input
                                {...register("password")}
                                type="password"
                                placeholder="Password..."
                                className={`px-4 py-2 block w-full h-11 rounded-xl shadow-lg hover:bg-blue-100 focus:bg-blue-100 focus:ring-0 focus:outline-none ${errors.password ? "border border-red-300" : "border-none"}`} />
                            <p className="my-1 text-xs text-red-400">{errors.password?.message}</p>
                        </div>
                        <div className="my-6 flex">
                            <label htmlFor="remember_me" className="inline-flex items-center w-full cursor-pointer">
                                <input id="remember_me" type="checkbox" className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" name="remember" />
                                <span className="ml-2 text-sm text-gray-600">
                                    Remember me
                                </span>
                            </label>
                            <div className="w-full text-right">
                                <a className="underline text-sm text-gray-600 hover:text-gray-900" href="/https://a.com">
                                    Forgot password?
                                </a>
                            </div>
                        </div>
                        <div className="my-6 flex">
                            <button disabled={isSubmitting} className=" flex justify-center items-center bg-blue-500 w-full py-3 rounded-xl text-white shadow-xl hover:shadow-inner focus:outline-none transition duration-500 ease-in-out  transform hover:-translate-x hover:scale-105">
                                {
                                    isSubmitting &&
                                    <span className="text-primary block relative text-center mr-3">
                                        <i className="fas fa-circle-notch fa-spin fa-1x text-white" />
                                    </span>
                                }
                                Login
                            </button>
                        </div>
                        <div className="flex my-6 items-center text-center">
                            <hr className="border-gray-300 border-1 w-full rounded-md" />
                            <label className="block font-medium text-sm text-gray-600 w-full">
                                Socials Login
            </label>
                            <hr className="border-gray-300 border-1 w-full rounded-md" />
                        </div>
                        <div className="flex my-6 justify-center w-full">
                            <button className="mr-5 bg-blue-500 border-none px-4 py-2 rounded-xl cursor-pointer text-white shadow-xl hover:shadow-inner transition duration-500 ease-in-out  transform hover:-translate-x hover:scale-105">
                                Facebook
            </button>
                            <button className="mr-5 bg-red-500 border-none px-4 py-2 rounded-xl cursor-pointer text-white shadow-xl hover:shadow-inner transition duration-500 ease-in-out  transform hover:-translate-x hover:scale-105">
                                Google
            </button>
                            <a href={`https://access.line.me/oauth2/v2.1/authorize?response_type=code&client_id=1655969543&redirect_uri=${process.env.REACT_APP_CALLBACK_URL}&state=success&scope=profile%20openid%20email&nonce=09876xyz&bot_prompt=aggressive`} className="mr-5 bg-green-500 border-none px-4 py-2 rounded-xl cursor-pointer text-white shadow-xl hover:shadow-inner transition duration-500 ease-in-out  transform hover:-translate-x hover:scale-105">
                                LINE
            </a>
                        </div>
                        <div className="my-6">
                            <div className="flex justify-center items-center">
                                <label className="mr-2 text-gray-600 hover:text-gray-900">Not Have a already Account?</label>
                                <a href="/register" className=" text-blue-500 transition duration-500 ease-in-out  transform hover:-translate-x hover:scale-105">
                                    Sign Up
              </a>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>

}

export default Login;