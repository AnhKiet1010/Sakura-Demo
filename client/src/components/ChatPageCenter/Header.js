import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import { SearchIcon, MenuIcon, DonotIcon, PhoneIcon, FacetimeIcon } from '../../icons';
import socket from '../../helpers/socketConnect';
import handleInfoClickOutside from '../../helpers/handleInfoClickOutside';

function Header({ handleSearchPress }) {
    const currentUser = useSelector(state => state.currentUser);
    const user = useSelector(state => state.user);
    const [showSearchInput, setShowSearchInput] = useState(false);
    const keyword = useSelector(state => state.keyword);
    const [word, setWord] = useState(keyword);
    const { infoRef, showInfo, setShowInfo } = handleInfoClickOutside(false);

    function handleWordChange(e) {
        setWord(e.target.value);
    }

    function handleUnfriend() {
        socket.emit("UserUnfriend", { fromId: user.id, toId: currentUser._id });
    }

    return (
        <div className="w-full border-b-2 dark:border-gray-500 bg-primary text-primary flex px-5 items-center flex-none h-24 z-10">
            <div className={`flex absolute items-center`}>
                <div className="mr-2 w-16 h-16 relative flex justify-center items-center rounded-full text-xl">
                    <img src={currentUser.avatar} className={`rounded-full ${currentUser.online && "p-0.5 bg-green-500"} w-full h-full object-cover`} alt="avatar" />
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
                <div className="relative z-10 block focus:outline-none">
                    <SearchIcon className={`fill-current text-secondary h-5 w-5 block ${showSearchInput && "hidden"} cursor-pointer`} onClick={() => setShowSearchInput(true)} />
                </div>
            </div>
            <div className={`relative text-xl ml-4 text-primary focus:outline-none hover:opacity-100`} ref={infoRef}>
                <div className={`relative z-10 block focus:outline-none hover:opacity-50 focus:opacity-50 cursor-pointer rounded-lg p-2 ${showInfo && "bg-secondary"}`} onClick={() => setShowInfo(true)}>
                    <MenuIcon className="h-5 w-5 text-primary fill-current" />
                </div>

                <div className={`absolute right-0 mt-2 py-2 w-48 bg-secondary rounded-md shadow-xl z-20 header ${!showInfo && "hidden"}`}>
                    <div className="flex items-center px-4 py-2 text-sm capitalize text-primary border-b hover:bg-primary hover:text-secondary cursor-pointer">
                        <span className="mr-2"><PhoneIcon className="w-4 h-4 fill-current" /></span>Call
                    </div>
                    <div className="flex items-center px-4 py-2 text-sm capitalize text-primary border-b hover:bg-primary hover:text-secondary cursor-pointer">
                        <span className="mr-2"><FacetimeIcon className="w-4 h-4 fill-current" /></span>Call video
                    </div>
                    <div className="flex items-center px-4 py-2 text-sm capitalize text-red-600 hover:bg-primary hover:text-secondary cursor-pointer" onClick={handleUnfriend}>
                        <span className="text-red-600 mr-2"><DonotIcon className="w-4 h-4 fill-current" /></span>Unfriend
                    </div>
                </div>

            </div>
        </div >
    )
}

export default Header;