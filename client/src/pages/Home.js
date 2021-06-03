import React from 'react';
import { useHistory } from 'react-router-dom';
import { onLogout } from '../helpers/auth';



function Home() {
    const history = useHistory();

    const handleLogout = () => {
        onLogout();
        history.push('/login');
    }
    
    return (
        <div className="bg-red-500 w-full" id="top">
            <header>
                <div className="flex justify-between items-center py-4 px-6">
                    <div>
                        <h1 className="font-bold text-white text-3xl">SA<span className="text-blue-400">KURA</span></h1>
                    </div>
                    <div className="flex justify-center space-x-10 hidden sm:block">
                        <a href="/" className="text-white font-semibold text-lg hover:text-yellow-400">Home</a>
                        <a href="/chat" className="text-white font-semibold text-lg hover:text-yellow-400">Chat</a>
                        <a href="/contact" className="text-white font-semibold text-lg hover:text-yellow-400">Contact</a>
                    </div>
                    <div className="flex space-x-2 space-x-10 hidden sm:block">
                        <button onClick={handleLogout} className="bg-gradient-to-b from-yellow-400 to-yellow-500  text-white font-bold py-2 px-4 rounded-lg uppercase text-sm  shadow-xl">
                            Logout
                        </button>
                    </div>
                    <div className="flex space-x-2 space-x-10 block sm:hidden">
                        <a href="https://a.com" className="flex items-center bg-gradient-to-b from-yellow-400 to-yellow-500  text-white font-bold py-2 px-4 rounded-full uppercase text-sm  shadow-xl">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h8m-8 6h16" />
                            </svg>
                        </a>
                    </div>
                </div>
            </header>
            {/* Title */}
            <section className="h-screen px-12 sm:px-24 flex items-center relative">
                <div className="grid grid-cols-12 gap-6 ">
                    <div className="col-span-12 sm:col-span-12 md:col-span-12 lg:col-span-8 xxl:col-span-12">
                        <div className="w-full">
                            <h1 className="text-7xl sm:text-8xl lg:text-8xl xl:text-9xl text-white font-bold my-8">Bring Your<br />
                                Ideas to <span className="text-blue-400">Life</span></h1>
                        </div>
                    </div>
                    <div className="absolute bottom-0 left-0 py-6 px-6">
                        <div className="flex space-x-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p className="text-white font-semibold">Explore</p>
                        </div>
                    </div>
                    <div className="absolute bottom-0 py-6 px-6 right-0">
                        <div className="flex space-x-6">
                            <i className="fa fa-dribbble text-white fa-lg" />
                            <i className="fa fa-twitter text-white fa-lg" />
                            <i className="fa fa-facebook text-white fa-lg" />
                            <i className="fa fa-instagram text-white fa-lg" />
                        </div>
                    </div>
                </div>
            </section>
            {/* footer */}
            <section className="h-full bg-gray-800">
                <div className="py-6 px-16 flex justify-between">
                    <div>
                        <h1 className="font-bold text-white text-xl">SA<span className="text-blue-400">KURA</span></h1>
                    </div>
                    <div className="flex space-x-6 mt-2">
                        <i className="fa fa-dribbble text-white fa-lg" />
                        <i className="fa fa-twitter text-white fa-lg" />
                        <i className="fa fa-facebook text-white fa-lg" />
                        <i className="fa fa-instagram text-white fa-lg" />
                    </div>
                </div>
                <div className="border-t-2 mx-10 border-gray-500" />
                <div className="py-4 py-6 px-16 flex justify-between">
                    <div>
                        <h1 className="font-semibold text-white text-sm">Copyrigth @ 2021</h1>
                    </div>
                    <div>
                        <a href="/#top" className="flex space-x-2 text-white hover:text-yellow-400">
                            <p className="font-semibold  text-sm">GO TOP</p>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6  -mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7l4-4m0 0l4 4m-4-4v18" />
                            </svg>
                        </a>
                    </div>
                </div>
            </section>
        </div>

    );
}

export default Home;