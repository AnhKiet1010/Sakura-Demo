import React, { useEffect } from 'react';
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { useHistory } from 'react-router-dom';
import AUTH from '../api/AUTH';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const schema = yup.object().shape({
    email: yup.string().email().required("Email is empty"),
    password: yup.string().min(1).required("Password is empty"),
    cfPassword: yup.string()
        .oneOf([yup.ref('password'), null], 'Passwords must match')
});

function Register() {
    const { register, setError, formState: { errors, isSubmitting }, handleSubmit } = useForm({
        resolver: yupResolver(schema)
    });

    const history = useHistory();

    const onSubmit = data => {
        AUTH.register(data)
            .then(res => {
                let { status, message, errors } = res.data;
                if(status !== 200) {
                    errors.map(err => {
                        return setError(err.field, {
                            type: 'manual',
                            message: message
                        });
                    })
                } else {
                    toast.success(res.data.message);
                    setTimeout(() => {
                        history.push('/login');
                    },1000);
                }
            }).catch(err => {
                console.log(err);
            })
    };


    useEffect(() => {
        document.title = "Register";
    }, []);

    return <div className="font-sans w-full min-h-screen flex justify-center items-center overflow-hidden">
        <ToastContainer />
        <div className="relative w-full min-h-screen flex justify-center items-center bg-gray-200 ">
            <div className="relative w-96">
                <div className="card bg-blue-400 shadow-lg  w-full h-full rounded-3xl absolute  transform -rotate-6" />
                <div className="card bg-red-400 shadow-lg  w-full h-full rounded-3xl absolute  transform rotate-6" />
                <div className="relative w-full rounded-3xl  px-6 py-4 bg-gray-100 shadow-md">
                    <label className="block mt-3 text-lg text-gray-700 text-center font-semibold">
                        REGISTER
                    </label>
                    <form className="mt-10 w-md" onSubmit={handleSubmit(onSubmit)}>
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
                        <div className="my-6 flex flex-col">
                            <input
                                {...register("cfPassword")}
                                type="password"
                                placeholder="Confirm password..."
                                className={`px-4 py-2 block w-full h-11 rounded-xl shadow-lg hover:bg-blue-100 focus:bg-blue-100 focus:ring-0 focus:outline-none ${errors.cfPassword ? "border border-red-300" : "border-none"}`} />
                            <p className="my-1 text-xs text-red-400">{errors.cfPassword?.message}</p>
                        </div>
                        <div className="my-6">
                            <button disabled={isSubmitting} className=" flex justify-center items-center bg-blue-500 w-full py-3 rounded-xl text-white shadow-xl hover:shadow-inner focus:outline-none transition duration-500 ease-in-out  transform hover:-translate-x hover:scale-105">
                                {
                                    isSubmitting &&
                                    <span className="text-primary block relative text-center mr-3">
                                        <i className="fas fa-circle-notch fa-spin fa-1x text-white" />
                                    </span>
                                }
                                Register
                            </button>
                        </div>
                        <div className="my-6">
                            <div className="flex justify-center items-center">
                                <label className="mr-2 text-gray-600 hover:text-gray-900">Have a already Account?</label>
                                <a href="/login" className=" text-blue-500 transition duration-500 ease-in-out  transform hover:-translate-x hover:scale-105">
                                    Login
              </a>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>

}

export default Register;