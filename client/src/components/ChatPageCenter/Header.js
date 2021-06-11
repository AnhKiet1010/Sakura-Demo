import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import { SearchIcon, MenuIcon } from '../../icons';

function Header({ handleSearchPress }) {
    const currentUser = useSelector(state => state.currentUser);
    const [showSearchInput, setShowSearchInput] = useState(false);
    const keyword = useSelector(state => state.keyword);
    const [word, setWord] = useState(keyword);

    function handleWordChange(e) {
        setWord(e.target.value);
    }

    return (
        <div className="w-full border-b-2 dark:border-gray-500 bg-primary text-primary flex px-5 items-center flex-none h-24 z-10">
            <div className={`flex absolute items-center`}>
                <div className="mr-2 w-16 h-16 relative flex justify-center items-center rounded-full bg-gray-500 text-xl">
                    <img src={currentUser.avatar} className={`rounded-full ${currentUser.online && "border border-green-500"} w-full h-full object-cover`} alt="avatar" />
                    {currentUser.online && <div className="absolute right-1 top-1 w-3 h-3 rounded-full bg-green-500 border" />}
                </div>
                <div className="flex flex-col">
                    <span className=" text-lg font-bold mb-1">{currentUser.name}</span>
                    <span className="text-xs  opacity-60 truncate">{currentUser.email}</span>
                </div>
            </div>
            <div className="ml-auto">
                <div className={`relative appearance-none ${!showSearchInput && "hidden"} animate__animated animate__fadeInRight`}>
                    <input
                        type="text"
                        placeholder="Search..."
                        className="dark:text-gray-800 appearance-none border border-grey text-primary rounded-lg pl-8 pr-4 py-2 focus:outline-none"
                        onKeyDown={(e) => handleSearchPress(e)}
                        onChange={handleWordChange}
                        value={word} />
                    <div className="absolute top-3 right-3 pl-3 flex items-center justify-center">
                        <SearchIcon className="fill-current text-gray-500 h-4 w-4" />
                    </div>
                </div>
                <SearchIcon className={`fill-current text-secondary h-5 w-5 block ${showSearchInput && "hidden"} cursor-pointer`} onClick={() => setShowSearchInput(true)} />
            </div>
            <div className={`relative text-xl ml-4 text-primary focus:outline-none hover:opacity-100`}>
                <div className="relative z-10 block rounded-md bg-secondary p-2 focus:outline-none">
                    <svg className="h-5 w-5 text-primary" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                </div>

                <div className="absolute right-0 mt-2 py-2 w-48 bg-secondary rounded-md shadow-xl z-20">
                    <a href="#" className="block px-4 py-2 text-sm border-b capitalize text-primary hover:bg-primary hover:text-secondary">
                        your profile
                    </a>
                    <a href="#" className="block px-4 py-2 text-sm border-b capitalize text-primary hover:bg-primary hover:text-secondary">
                        Your projects
                    </a>
                    <a href="#" className="block px-4 py-2 text-sm border-b capitalize text-primary hover:bg-primary hover:text-secondary">
                        Help
                    </a>
                    <a href="#" className="block px-4 py-2 text-sm border-b capitalize text-primary hover:bg-primary hover:text-secondary">
                        Settings
                    </a>
                    <a href="#" className="block px-4 py-2 text-sm capitalize text-primary hover:bg-primary hover:text-secondary">
                        Sign Out
                    </a>
                </div>

            </div>
        </div >
    )
}

export default Header;